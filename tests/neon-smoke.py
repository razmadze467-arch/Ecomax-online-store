#!/usr/bin/env python3
"""Exercise the local storefront without signing in or submitting an order.

Run a static server from the checkout, then:
    python3 tests/neon-smoke.py [--base-url http://127.0.0.1:8000]
Requires Python Playwright and Chromium. Screenshots/results go outside the repo.
"""

import argparse
import json
import re
import sys
from pathlib import Path
from urllib.parse import urlsplit

from playwright.sync_api import sync_playwright


ROOT = Path(__file__).resolve().parents[1]
PRODUCTS = ".product-card"
SNAPSHOT_JS = """() => [...document.querySelectorAll('.product-card')].map(c => {
  const b = c.querySelector('.add-cart');
  return {
    name:b?.dataset.name || '', category:c.dataset.category || '',
    search:c.dataset.search || '', unitPrice:c.dataset.unitPrice || '',
    price:b?.dataset.price || '', volume:b?.dataset.volume || '',
    title:(c.querySelector('h3')?.textContent || '').trim().replace(/\\s+/g,' '),
    description:(c.querySelector('.product-description')?.textContent || '').trim().replace(/\\s+/g,' '),
    options:[...c.querySelectorAll('.volume-select option')].map(o => ({
      value:o.value, text:o.textContent.trim(), price:o.dataset.price || ''
    }))
  };
})"""


def canonical_product(product):
    """Accept fixture aliases while comparing only fields recorded by the fixture."""
    aliases = {
        "unit_price": "unitPrice", "unit-price": "unitPrice",
        "data-unit-price": "unitPrice", "data-category": "category",
        "data-search": "search", "data-name": "name", "data-price": "price",
        "data-volume": "volume", "button_name": "name", "button_price": "price",
        "button_volume": "volume",
    }
    result = {}
    for key, value in product.items():
        key = aliases.get(key, key)
        if key == "options":
            result[key] = []
            for option in value:
                if isinstance(option, dict):
                    result[key].append({k: "" if v is None else str(v) for k, v in option.items()})
                else:
                    result[key].append({"value": str(option)})
        elif key in ("name", "category", "search", "unitPrice", "price", "volume", "title", "description"):
            result[key] = str(value)
    return result


def project(actual, expected):
    if isinstance(expected, dict):
        return {key: project(actual.get(key), value) for key, value in expected.items()}
    if isinstance(expected, list):
        if not isinstance(actual, list) or len(actual) != len(expected):
            return actual
        return [project(a, e) for a, e in zip(actual, expected)]
    return actual


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--base-url", default="http://127.0.0.1:8000")
    parser.add_argument("--chromium", default="/usr/bin/chromium")
    parser.add_argument("--output", type=Path, default=Path("/tmp/ecomax-preview"))
    args = parser.parse_args()
    args.output.mkdir(parents=True, exist_ok=True)
    baseline_path = ROOT / "tests/product-baseline.json"
    baseline = json.loads(baseline_path.read_text())
    if isinstance(baseline, dict):
        baseline = baseline["products"]
    baseline = [canonical_product(p) for p in baseline]
    if not baseline or any(not p.get("name") for p in baseline):
        raise ValueError("Baseline must contain products with names")
    results = []
    js_errors = []
    network_failures = set()

    def check(name, action):
        try:
            detail = action()
            result = {"check": name, "status": "PASS", "detail": detail}
        except Exception as exc:
            result = {"check": name, "status": "FAIL", "detail": str(exc)}
        results.append(result)
        print(f"{result['status']}: {name}: {result['detail']}", flush=True)
        return result["status"] == "PASS"

    def require(condition, message):
        if not condition:
            raise AssertionError(message)

    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(
            executable_path=args.chromium, headless=True,
            args=["--no-sandbox", "--disable-dev-shm-usage"],
        )
        context = browser.new_context(viewport={"width": 1440, "height": 1000})
        page = context.new_page()
        page.set_default_timeout(7000)
        page.on("pageerror", lambda error: js_errors.append(str(error)))

        def failed_request(request):
            host = urlsplit(request.url).hostname or "unknown"
            network_failures.add(f"{host}: {request.failure}")

        page.on("requestfailed", failed_request)

        def goto(path="/"):
            response = page.goto(args.base_url.rstrip("/") + path, wait_until="domcontentloaded", timeout=30000)
            require(response is not None and response.ok, f"HTTP response failed for {path}")
            page.wait_for_timeout(350)
            return f"HTTP {response.status}"

        check("homepage responds", goto)

        def fixture_matches():
            actual = page.evaluate(SNAPSHOT_JS)
            require(len(actual) == len(baseline), f"Expected {len(baseline)} cards, got {len(actual)}")
            for index, (observed, expected) in enumerate(zip(actual, baseline)):
                comparable = project(observed, expected)
                # Liquid buttons are updated from the selected option during startup.
                # Compare their untouched HTML attributes separately below.
                comparable.pop("price", None)
                comparable.pop("volume", None)
                immutable = {k: v for k, v in expected.items() if k not in ("price", "volume")}
                require(comparable == immutable,
                        f"Card {index + 1} data changed: expected {immutable!r}; got {comparable!r}")
            raw = page.request.get(args.base_url.rstrip("/") + "/index.html")
            from html.parser import HTMLParser

            class Buttons(HTMLParser):
                def __init__(self):
                    super().__init__()
                    self.values = []

                def handle_starttag(self, tag, attrs):
                    values = dict(attrs)
                    if "add-cart" in values.get("class", "").split():
                        self.values.append(values)

            buttons = Buttons()
            buttons.feed(raw.text())
            require(len(buttons.values) == len(baseline), "Source product button count changed")
            for button, expected in zip(buttons.values, baseline):
                for field in ("name", "price", "volume"):
                    if field in expected:
                        require(button.get("data-" + field) == expected[field],
                                f"Original {field} changed for {expected['name']}")
            return f"All {len(baseline)} product identities, categories, search data, prices and options preserved"

        check("original product data", fixture_matches)

        def responsive(width):
            page.set_viewport_size({"width": width, "height": 900})
            page.evaluate("window.scrollTo(0,0)")
            page.wait_for_timeout(200)
            metrics = page.evaluate("""() => ({
              viewport:innerWidth, width:document.documentElement.scrollWidth,
              visible:[...document.querySelectorAll('.product-card')].filter(c=>c.getClientRects().length).length,
              outside:[...document.querySelectorAll('header, main, #productsGrid, .product-card')]
                .filter(e=>e.getClientRects().length && (e.getBoundingClientRect().left < -1 || e.getBoundingClientRect().right > innerWidth+1))
                .map(e=>e.id || e.className)
            })""")
            page.screenshot(path=str(args.output / f"home-{width}.png"), full_page=True)
            require(metrics["width"] <= width + 1, f"Horizontal overflow: {metrics}")
            require(not metrics["outside"], f"Elements outside viewport: {metrics['outside']}")
            require(metrics["visible"] == len(baseline), f"Hidden product cards: {metrics}")
            return f"{width}px; all {metrics['visible']} products visible; no horizontal overflow"

        for width in (1440, 390, 768, 320):
            check(f"responsive layout {width}px", lambda width=width: responsive(width))

        page.set_viewport_size({"width": 1440, "height": 1000})

        def search_and_filter():
            search = page.locator("#searchInput")
            search.fill(baseline[0]["name"])
            visible = page.locator(PRODUCTS + ":visible")
            require(visible.count() > 0, "Search hides the matching product")
            require(not page.locator(".promo-grid").is_visible(), "Promotions obstruct active search results")
            found_names = visible.locator(".add-cart").evaluate_all("buttons=>buttons.map(b=>b.dataset.name)")
            require(baseline[0]["name"] in found_names, f"Matching product absent from search: {found_names}")
            search.fill("does-not-exist-ecomax-987654321")
            require(visible.count() == 0, "Unknown search returns products")
            status = page.locator("#searchStatus")
            require(status.is_visible() and "ვერ მოიძებნა" in status.inner_text(),
                    "No-results message missing")
            require(status.get_attribute("aria-live") == "polite", "Search status is not announced")
            search.fill("")
            require(page.locator(".promo-grid").is_visible(), "Clearing search did not restore promotions")
            category = page.locator("#categoryFilter")
            categories = sorted({p["category"] for p in baseline})
            for value in categories:
                category.select_option(value)
                require(not page.locator(".promo-grid").is_visible(), f"Promotions obstruct category {value}")
                found = page.locator(PRODUCTS + ":visible").evaluate_all("cards=>cards.map(c=>c.dataset.category)")
                expected_count = sum(p["category"] == value for p in baseline)
                require(len(found) == expected_count and all(c == value for c in found),
                        f"Filter {value} returned {found}; expected {expected_count} products")
            category.select_option("")
            require(visible.count() == len(baseline), "Clearing filters did not restore products")
            require(page.locator(".promo-grid").is_visible(), "Clearing category did not restore promotions")
            return f"Search, empty results and all {len(categories)} categories including home work; active filters hide promotions and clearing restores them"

        check("search and categories", search_and_filter)
        # Recover filters even after a failed category assertion.
        page.locator("#searchInput").fill("")
        page.locator("#categoryFilter").select_option("")

        def navigation_search_and_tiles():
            target = baseline[0]["name"]
            page.locator("#navSearch").fill(target)
            page.locator(".nav-search button[type=submit]").click()
            require(page.locator("#searchInput").input_value() == target,
                    "Header search did not synchronize catalogue search")
            found = page.locator(PRODUCTS + ":visible .add-cart").evaluate_all("bs=>bs.map(b=>b.dataset.name)")
            require(target in found, f"Header search omitted matching product: {found}")
            page.locator("[data-reset-products]").click()
            require(page.locator(PRODUCTS + ":visible").count() == len(baseline),
                    "All-products link failed to reset search")
            tiles = page.locator(".category-card[data-neon-category]")
            require(tiles.count() >= 6, "Expected six category tiles")
            for index in range(tiles.count()):
                tile = tiles.nth(index)
                value = tile.get_attribute("data-neon-category")
                tile.click()
                visible = page.locator(PRODUCTS + ":visible")
                require(visible.count() > 0, f"Tile {value} returned no products")
                if value != "glass":
                    found = visible.evaluate_all("cards=>cards.map(c=>c.dataset.category)")
                    expected_categories = {"wheel", "tire"} if value == "wheels" else {value}
                    expected_count = sum(p["category"] in expected_categories for p in baseline)
                    require(len(found) == expected_count and all(c in expected_categories for c in found),
                            f"Tile {value} returned incorrect products: {found}")
                else:
                    require(page.locator("#searchInput").input_value() != "", "Glass tile did not search")
                    found = visible.evaluate_all("cards=>cards.map(c=>c.textContent.toLocaleLowerCase('ka-GE'))")
                    query = page.locator("#searchInput").input_value().lower()
                    require(all(query in text for text in found), "Glass tile returns unrelated products")
            page.locator("[data-reset-products]").click()
            require(page.locator(PRODUCTS + ":visible").count() == len(baseline), "Reset left products hidden")
            return f"Header search, all-products reset and {tiles.count()} category tiles verified"

        check("navigation search and category tiles", navigation_search_and_tiles)
        page.locator("[data-reset-products]").click()

        def combined_wheels_category():
            expected_names = sorted(p["name"] for p in baseline if p["category"] in {"wheel", "tire"})
            require(len(expected_names) == 2, f"Expected two baseline wheel/tire products, found {expected_names}")
            page.locator('.category-card[data-neon-category="wheels"]').click()
            require(page.locator("#categoryFilter").input_value() == "wheels", "Combined tile did not select wheels")
            found_names = sorted(page.locator(PRODUCTS + ":visible .add-cart").evaluate_all(
                "buttons=>buttons.map(button=>button.dataset.name)"))
            require(found_names == expected_names, f"Combined tile returned {found_names}; expected {expected_names}")
            page.locator("[data-reset-products]").click()
            page.locator("#categoryFilter").select_option("wheels")
            found_names = sorted(page.locator(PRODUCTS + ":visible .add-cart").evaluate_all(
                "buttons=>buttons.map(button=>button.dataset.name)"))
            require(found_names == expected_names, f"Combined dropdown returned {found_names}; expected {expected_names}")
            page.locator("[data-reset-products]").click()
            return "Combined tile and dropdown each return exactly the original wheel and tire products (2)"

        check("combined wheels and tires", combined_wheels_category)
        page.locator("[data-reset-products]").click()

        def cart_read():
            return page.evaluate("JSON.parse(localStorage.getItem('ecomax_cart') || '[]')")

        def cart_total(expected):
            text = page.locator("#cartTotal").inner_text()
            amount = float(re.sub(r"[^\d.]", "", text) or 0)
            require(amount == expected, f"Expected total {expected}, got {text}")

        def cart_workflow():
            page.evaluate("localStorage.removeItem('ecomax_cart')")
            goto()
            first = page.locator(PRODUCTS).first
            select = first.locator(".volume-select")
            select.select_option("2")
            button = first.locator(".add-cart")
            expected_price = 2 * float(baseline[0]["unitPrice"])
            require(float(button.get_attribute("data-price")) == expected_price, "Volume change failed to update price")
            button.click()
            items = cart_read()
            require(len(items) == 1 and items[0]["quantity"] == 1,
                    f"One click did not add exactly one item: {items}")
            require(items[0]["name"] == baseline[0]["name"] and float(items[0]["price"]) == expected_price,
                    f"Wrong product/price added: {items}")
            require(items[0]["volume"] == "2 ლიტრი", f"Wrong volume added: {items}")
            page.locator("#cartButton").click()
            require(page.locator("#cartOverlay").is_visible(), "Cart overlay did not open")
            cart_total(expected_price)
            page.wait_for_selector("[data-mx-cart-plus]")
            page.locator("[data-mx-cart-plus]").first.click()
            require(cart_read()[0]["quantity"] == 2, "Plus did not increment quantity once")
            cart_total(expected_price * 2)
            page.locator("[data-mx-cart-minus]").first.click()
            require(cart_read()[0]["quantity"] == 1, "Minus did not decrement quantity once")
            cart_total(expected_price)
            page.screenshot(path=str(args.output / "cart-desktop.png"), full_page=True)
            saved = cart_read()
            page.reload(wait_until="domcontentloaded")
            require(cart_read() == saved, "Reload lost cart contents")
            page.locator("#cartButton").click()
            cart_total(expected_price)
            page.locator("#cartOverlay .remove-item").first.click()
            require(cart_read() == [], "Remove did not empty cart")
            cart_total(0)
            page.locator("#closeCart, #cartClose").first.click()
            require(not page.locator("#cartOverlay").is_visible(), "Cart did not close")
            return "Volume price, exactly one add, total, +/−, persistence, remove and close verified"

        check("cart workflow", cart_workflow)

        def keyboard_cart():
            goto()
            trigger = page.locator("#cartButton")
            trigger.focus()
            page.keyboard.press("Enter")
            require(page.locator("#cartOverlay").is_visible(), "Keyboard activation did not open cart")
            page.wait_for_function("document.activeElement?.id === 'closeCart'")
            controls = page.locator("#cartModal").evaluate("""panel => [...panel.querySelectorAll(
                'button:not([disabled]),a[href],input,select,[tabindex="0"]')].filter(e=>e.getClientRects().length)
                .map(e=>e.id)""")
            require(len(controls) >= 2 and all(controls), f"Cannot exercise focus boundary: {controls}")
            page.locator("#" + controls[-1]).focus()
            page.keyboard.press("Tab")
            require(page.evaluate("document.activeElement.id") == controls[0], "Tab escaped cart end")
            page.keyboard.press("Shift+Tab")
            require(page.evaluate("document.activeElement.id") == controls[-1], "Shift+Tab escaped cart start")
            page.keyboard.press("Escape")
            require(not page.locator("#cartOverlay").is_visible(), "Escape did not close cart")
            page.wait_for_function("document.activeElement?.id === 'cartButton'")
            return "Enter opens; Tab/Shift+Tab stay inside; Escape closes and restores trigger focus"

        check("keyboard cart focus and Escape", keyboard_cart)

        def checkout_navigation():
            goto()
            page.locator(PRODUCTS).first.locator(".add-cart").click()
            page.locator("#cartButton").click()
            page.locator("#checkoutButton").click()
            page.wait_for_url(re.compile(r"/(checkout|login)\.html(?:\?.*)?$"), timeout=10000)
            if urlsplit(page.url).path.endswith("/checkout.html"):
                require(page.locator("#orderForm").is_visible(), "Checkout form missing")
                require(page.locator("#items .item").count() == 1, "Checkout did not receive cart item")
                page.wait_for_function("document.querySelector('#submitBtn').disabled", timeout=12000)
                require(page.locator("#authGate").is_visible(), "Anonymous checkout auth gate missing")
                outcome = "Checkout receives cart and requires authentication"
            else:
                require(page.locator("#loginForm").is_visible(), "Redirected login form missing")
                outcome = "Anonymous checkout redirects to login"
            page.screenshot(path=str(args.output / "checkout-anonymous.png"), full_page=True)
            return outcome + "; no order submitted"

        check("checkout navigation and auth guard", checkout_navigation)

        def mobile_menu():
            page.set_viewport_size({"width": 390, "height": 844})
            goto()
            button = page.locator("#menuButton")
            require(button.is_visible(), "Mobile menu button hidden")
            button.click()
            require(button.get_attribute("aria-expanded") == "true", "Menu aria-expanded not true")
            nav = page.locator("#mobileNav")
            require(nav.is_visible(), "Mobile menu hidden after click")
            for href in ("login.html", "register.html"):
                require(nav.locator(f'a[href="{href}"]').is_visible(), f"Anonymous {href} link hidden")
            require(not nav.locator('a[href="account.html"]').is_visible(), "Anonymous account link visible")
            page.screenshot(path=str(args.output / "menu-mobile.png"), full_page=True)
            button.click()
            require(button.get_attribute("aria-expanded") == "false", "Menu did not close")
            button.click()
            page.keyboard.press("Escape")
            require(button.get_attribute("aria-expanded") == "false" and not nav.is_visible(),
                    "Escape did not close mobile menu")
            return "Menu opens/closes with click/Escape; anonymous login/register visible; account hidden"

        check("mobile menu and auth links", mobile_menu)

        for path, selector in (("/login.html", "#loginForm"), ("/register.html", "#registerForm"),
                               ("/checkout.html", "#orderForm")):
            def local_page(path=path, selector=selector):
                status = goto(path)
                require(page.locator(selector).is_visible(), f"Expected {selector} not visible")
                page.screenshot(path=str(args.output / (Path(path).stem + "-mobile.png")), full_page=True)
                return status + "; local form renders; no form submitted"
            check(f"local page {path}", local_page)

        # Errors are surfaced separately from unavailable external services; neither is
        # silently converted into successful authentication/backend verification.
        check("JavaScript runtime errors", lambda: require(not js_errors, repr(js_errors)) or "No uncaught page errors")
        browser.close()

    report = {"checks": results, "network_failures": sorted(network_failures),
              "limitations": ["Authentication, live backend writes, native Android and order submission were not tested."]}
    (args.output / "smoke-results.json").write_text(json.dumps(report, ensure_ascii=False, indent=2))
    for failure in sorted(network_failures):
        print("NETWORK OBSERVATION:", failure)
    failed = sum(r["status"] == "FAIL" for r in results)
    print(f"RESULT: {len(results) - failed}/{len(results)} checks passed; {failed} failed")
    print(f"ARTIFACTS: {args.output}")
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())
