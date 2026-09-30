package ge.ecomax.line;

import android.Manifest;
import android.app.Activity;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.graphics.Color;
import android.net.Uri;
import android.os.Bundle;
import android.view.View;
import android.webkit.GeolocationPermissions;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

public class MainActivity extends Activity {
    private static final String HOME = "https://ecomax.com.ge/";
    private static final int LOCATION_REQUEST = 4101;
    private WebView webView;
    private GeolocationPermissions.Callback pendingGeoCallback;
    private String pendingGeoOrigin;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(null);

        getWindow().setStatusBarColor(Color.rgb(2, 8, 18));
        getWindow().setNavigationBarColor(Color.rgb(2, 8, 18));

        webView = new WebView(this);
        webView.setLayerType(View.LAYER_TYPE_HARDWARE, null);
        setContentView(webView);

        WebSettings s = webView.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);
        s.setDatabaseEnabled(true);
        s.setGeolocationEnabled(true);
        s.setSupportMultipleWindows(false);
        s.setJavaScriptCanOpenWindowsAutomatically(false);
        s.setBuiltInZoomControls(false);
        s.setDisplayZoomControls(false);
        s.setMediaPlaybackRequiresUserGesture(true);
        s.setLoadsImagesAutomatically(true);
        s.setCacheMode(WebSettings.LOAD_NO_CACHE);
        s.setAllowFileAccess(false);
        s.setAllowContentAccess(false);
        s.setUserAgentString(s.getUserAgentString() + " ECOMAXLINE-Android/2.0.2");

        webView.setBackgroundColor(Color.rgb(2, 8, 18));

        webView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                return handleUrl(request.getUrl());
            }

            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                return handleUrl(Uri.parse(url));
            }

            @Override
            public void onPageFinished(WebView view, String url) {
                super.onPageFinished(view, url);
                if (isEcomaxUrl(Uri.parse(url))) {
                    stabilizeEcomaxPage(view);
                }
            }

            @Override
            public void onReceivedError(WebView view, WebResourceRequest request, WebResourceError error) {
                super.onReceivedError(view, request, error);
            }
        });

        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public void onGeolocationPermissionsShowPrompt(String origin, GeolocationPermissions.Callback callback) {
                if (checkSelfPermission(Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED
                        || checkSelfPermission(Manifest.permission.ACCESS_COARSE_LOCATION) == PackageManager.PERMISSION_GRANTED) {
                    callback.invoke(origin, true, false);
                    return;
                }
                pendingGeoOrigin = origin;
                pendingGeoCallback = callback;
                requestPermissions(new String[]{
                        Manifest.permission.ACCESS_FINE_LOCATION,
                        Manifest.permission.ACCESS_COARSE_LOCATION
                }, LOCATION_REQUEST);
            }
        });

        // Always start at the real ECOMAX home page.
        // Do not restore an old WebView scroll position or stale page snapshot.
        webView.clearCache(true);
        webView.clearHistory();
        webView.loadUrl(HOME);
    }

    private boolean isEcomaxUrl(Uri uri) {
        if (uri == null) return false;
        String host = uri.getHost();
        return host != null && (host.equals("ecomax.com.ge") || host.endsWith(".ecomax.com.ge"));
    }

    private boolean handleUrl(Uri uri) {
        if (uri == null) return true;
        if (isEcomaxUrl(uri)) return false;

        try {
            Intent intent = new Intent(Intent.ACTION_VIEW, uri);
            startActivity(intent);
        } catch (Exception ignored) { }
        return true;
    }

    private void stabilizeEcomaxPage(WebView view) {
        String js =
            "(function(){" +
            "try{" +
            "window.scrollTo(0,0);" +
            "document.documentElement.scrollTop=0;" +
            "document.body.scrollTop=0;" +
            "var s=document.getElementById('ecomaxAndroidStableStyle');" +
            "if(!s){" +
            "s=document.createElement('style');s.id='ecomaxAndroidStableStyle';" +
            "s.textContent='" +
            "html,body{width:100%!important;max-width:100%!important;overflow-x:hidden!important;}" +
            ".header,main,footer{visibility:visible!important;opacity:1!important;}" +
            ".hero,.section,.info-grid,.grid,.product-card{visibility:visible!important;}" +
            ".product-card::after{animation:none!important;}" +
            ".product-card::before,.info-card::before{animation:none!important;}" +
            ".ecomax-mx-progress{display:none!important;}" +
            ".ecomax-mx-dock,.ecomax-mx-status{display:none!important;}" +
            ".ecomax-home-live .ring,.ecomax-home-live .ring.r2,.ecomax-home-live .ring.r3{animation:none!important;}" +
            ".ecomax-home-live .stars,.ecomax-home-live .aurora,.ecomax-home-live .beam,.ecomax-home-live .beam.b2{animation:none!important;}" +
            ".ecomax-home-live .ecomax-home-car{animation:none!important;}" +
            ".ecomaxMovingCars .ecomax-car{animation:none!important;}" +
            ".product-bottle{transform:none!important;}" +
            ".product-card:hover,.info-card:hover{transform:none!important;}" +
            "';" +
            "document.head.appendChild(s);" +
            "}" +
            "}catch(e){}}" +
            ")();";
        view.evaluateJavascript(js, null);
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if (requestCode != LOCATION_REQUEST || pendingGeoCallback == null) return;

        boolean granted = false;
        for (int result : grantResults) {
            if (result == PackageManager.PERMISSION_GRANTED) {
                granted = true;
                break;
            }
        }

        pendingGeoCallback.invoke(pendingGeoOrigin, granted, false);
        pendingGeoCallback = null;
        pendingGeoOrigin = null;
    }

    @Override
    public void onBackPressed() {
        if (webView != null && webView.canGoBack()) {
            webView.goBack();
        } else {
            super.onBackPressed();
        }
    }

    @Override
    protected void onDestroy() {
        if (webView != null) {
            webView.stopLoading();
            webView.setWebChromeClient(null);
            webView.setWebViewClient(null);
            webView.destroy();
            webView = null;
        }
        super.onDestroy();
    }
}
