"use strict";

/* ==========================================
   ECOMAX MAIN SCRIPT
   ========================================== */


/* ================= CART ================= */

let cart = [];

try {
    cart = JSON.parse(localStorage.getItem("ecomax_cart")) || [];
} catch (error) {
    cart = [];
}


const cartButton = document.getElementById("cartButton");
const cartOverlay = document.getElementById("cartOverlay");
const closeCart = document.getElementById("closeCart");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");
const checkoutButton = document.getElementById("checkoutButton");


function saveCart() {
    localStorage.setItem(
        "ecomax_cart",
        JSON.stringify(cart)
    );
}


function updateCart() {

    const totalItems = cart.reduce(
        (sum, item) => sum + item.quantity,
        0
    );

    const totalPrice = cart.reduce(
        (sum, item) => sum + (item.price * item.quantity),
        0
    );

    cartCount.textContent = totalItems;
    cartTotal.textContent = `${totalPrice} ₾`;

    renderCart();

    saveCart();
}


function renderCart() {

    if (!cartItems) return;

    if (cart.length === 0) {

        cartItems.innerHTML = `
            <div class="empty-cart">
                <div>🛒</div>
                <h3>კალათა ცარიელია</h3>
                <p>დაამატე პროდუქტი კალათაში.</p>
            </div>
        `;

        return;
    }


    cartItems.innerHTML = cart.map((item, index) => {

        return `
            <div class="cart-item">

                <div class="cart-item-info">

                    <strong>
                        ${escapeHTML(item.name)}
                    </strong>

                    <span>
                        ${escapeHTML(item.volume)}
                        × ${item.quantity}
                    </span>

                </div>

                <div class="cart-item-price">
                    ${item.price * item.quantity} ₾
                </div>

                <button
                    class="remove-item"
                    data-index="${index}"
                    aria-label="პროდუქტის წაშლა">
                    ×
                </button>

            </div>
        `;

    }).join("");
}


function addToCart(name, price, volume) {

    const existing = cart.find(
        item =>
            item.name === name &&
            item.volume === volume
    );


    if (existing) {

        existing.quantity += 1;

    } else {

        cart.push({
            name: name,
            price: Number(price),
            volume: volume,
            quantity: 1
        });

    }

    updateCart();

    showNotification(
        `${name} დაემატა კალათაში`
    );
}


function removeFromCart(index) {

    if (
        index < 0 ||
        index >= cart.length
    ) {
        return;
    }

    cart.splice(index, 1);

    updateCart();
}


function openCart() {

    cartOverlay.classList.add("active");
    document.body.style.overflow = "hidden";

}


function closeCartPanel() {

    cartOverlay.classList.remove("active");
    document.body.style.overflow = "";

}


if (cartButton) {
    cartButton.addEventListener(
        "click",
        openCart
    );
}


if (closeCart) {
    closeCart.addEventListener(
        "click",
        closeCartPanel
    );
}


if (cartOverlay) {

    cartOverlay.addEventListener(
        "click",
        function(event) {

            if (
                event.target === cartOverlay
            ) {
                closeCartPanel();
            }

        }
    );

}


if (cartItems) {

    cartItems.addEventListener(
        "click",
        function(event) {

            const button =
                event.target.closest(
                    ".remove-item"
                );

            if (!button) return;

            const index =
                Number(
                    button.dataset.index
                );

            removeFromCart(index);

        }
    );

}


/* ================= VOLUME SELECTION + ADD TO CART ================= */

function normalizeVolume(value) {
    const n = Number(value);
    if (!Number.isFinite(n)) return 0.5;
    return Math.min(20, Math.max(0.5, n));
}

function updateProductVolume(card) {
    const select = card.querySelector(".volume-select");
    const priceEl = card.querySelector(".selected-price");
    const volumeEl = card.querySelector(".selected-volume");
    const button = card.querySelector(".add-cart");

    if (!select || !priceEl || !volumeEl || !button) return;

    const volume = normalizeVolume(select.value);
    const price = volume * Number(card.dataset.unitPrice || 10);
    const label = volume === 0.5 ? "500 მლ" : `${volume} ლიტრი`;

    priceEl.textContent = `${price} ₾`;
    volumeEl.textContent = label;
    button.dataset.price = String(price);
    button.dataset.volume = label;
}

document.querySelectorAll(".product-card").forEach(card => {
    const select = card.querySelector(".volume-select");

    select?.addEventListener("change", () => {
        updateProductVolume(card);
    });

    updateProductVolume(card);
});

document.querySelectorAll(".add-cart").forEach(button => {
    button.addEventListener("click", function() {
        addToCart(this.dataset.name, this.dataset.price, this.dataset.volume);
    });
});


/* ================= CHECKOUT ================= */

if (checkoutButton) {

    checkoutButton.addEventListener(
        "click",
        function() {

            if (cart.length === 0) {

                showNotification(
                    "კალათა ცარიელია"
                );

                return;
            }


            /*
             * აქ შეგვიძლია შემდეგ ეტაპზე
             * დავაკავშიროთ შენი რეალური
             * Supabase შეკვეთის სისტემა.
             *
             * ამ ეტაპზე Login/Register-ს
             * არ ვეხებით.
             */

            showNotification(
                "შეკვეთის სისტემა მზად არის დასაკავშირებლად"
            );

        }
    );

}


/* ================= MOBILE MENU ================= */

const menuButton =
    document.getElementById("menuButton");

const mobileNav =
    document.getElementById("mobileNav");


if (menuButton && mobileNav) {

    menuButton.addEventListener(
        "click",
        function() {

            mobileNav.classList.toggle(
                "active"
            );

        }
    );


    mobileNav
        .querySelectorAll("a")
        .forEach(link => {

            link.addEventListener(
                "click",
                function() {

                    mobileNav.classList.remove(
                        "active"
                    );

                }
            );

        });

}


/* ================= NOTIFICATION ================= */

function showNotification(message) {

    const old =
        document.querySelector(
            ".ecomax-notification"
        );

    if (old) {
        old.remove();
    }


    const notification =
        document.createElement("div");

    notification.className =
        "ecomax-notification";


    notification.innerHTML = `
        <span>✓</span>
        <div>
            ${escapeHTML(message)}
        </div>
    `;


    Object.assign(
        notification.style,
        {
            position: "fixed",
            right: "25px",
            bottom: "25px",
            zIndex: "5000",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "15px 20px",
            border: "1px solid rgba(0,234,255,.35)",
            borderRadius: "12px",
            background: "rgba(3,16,28,.95)",
            color: "#dffaff",
            boxShadow: "0 0 30px rgba(0,234,255,.18)",
            backdropFilter: "blur(15px)",
            fontSize: "13px",
            transform: "translateY(20px)",
            opacity: "0",
            transition: ".3s"
        }
    );


    document.body.appendChild(
        notification
    );


    requestAnimationFrame(() => {

        notification.style.opacity = "1";
        notification.style.transform =
            "translateY(0)";

    });


    setTimeout(() => {

        notification.style.opacity = "0";
        notification.style.transform =
            "translateY(20px)";

        setTimeout(() => {

            notification.remove();

        }, 300);

    }, 2500);

}


/* ================= SECURITY ================= */

function escapeHTML(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}


/* ================= INITIALIZE ================= */

updateCart();


/* ================= ACTIVE HEADER ================= */

const sections =
    document.querySelectorAll("section[id]");

const navLinks =
    document.querySelectorAll(
        ".nav a[href^='#']"
    );


window.addEventListener(
    "scroll",
    function() {

        let current = "";

        sections.forEach(section => {

            const sectionTop =
                section.offsetTop - 150;

            if (
                window.scrollY >=
                sectionTop
            ) {
                current =
                    section.getAttribute("id");
            }

        });


        navLinks.forEach(link => {

            link.style.color = "";

            if (
                link.getAttribute("href") ===
                `#${current}`
            ) {

                link.style.color =
                    "#00eaff";

            }

        });

    },
    { passive: true }
);
