package ge.ecomax.line

import android.Manifest
import android.content.Intent
import android.content.pm.PackageManager
import android.net.Uri
import android.os.Bundle
import android.widget.FrameLayout
import android.widget.Toast
import androidx.activity.ComponentActivity
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import com.google.android.gms.maps.model.LatLng
import com.google.android.gms.location.*
import com.google.android.libraries.navigation.AudioGuidanceSettings
import com.google.android.libraries.navigation.NavigationApi
import com.google.android.libraries.navigation.NavigationView
import com.google.android.libraries.navigation.Navigator
import com.google.android.libraries.navigation.RoutingOptions
import com.google.android.libraries.navigation.Waypoint

class MainActivity : ComponentActivity() {
    private lateinit var navigationView: NavigationView
    private var navigator: Navigator? = null
    private var selectedOrderId: String? = null
    private var locationClient: FusedLocationProviderClient? = null
    private var locationCallback: LocationCallback? = null
    private val locationRequest = 7001

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        locationClient = LocationServices.getFusedLocationProviderClient(this)
        navigationView = NavigationView(this)
        setContentView(FrameLayout(this).apply { addView(navigationView) })
        ensureLocationPermission()
    }

    override fun onNewIntent(intent: Intent) {
        super.onNewIntent(intent)
        setIntent(intent)
        handleNavigationIntent(intent)
    }


    private fun sendLiveGps(location: Location) {
        val orderId = selectedOrderId ?: return
        io.execute {
            try {
                val body = JSONObject().apply {
                    put("p_latitude", location.latitude)
                    put("p_longitude", location.longitude)
                    put("p_accuracy", location.accuracy.toDouble())
                    put("p_heading", if (location.hasBearing()) location.bearing.toDouble() else JSONObject.NULL)
                    put("p_speed", if (location.hasSpeed()) location.speed.toDouble() else JSONObject.NULL)
                    put("p_order_id", orderId)
                }.toString()
                request("POST", "$SUPABASE/rest/v1/rpc/ecomax_line_update_location", body, accessToken)
            } catch (_: Exception) {}
        }
    }

    private fun startLiveGps() {
        if (locationCallback != null) return
        if (ContextCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED) return
        val req = LocationRequest.Builder(Priority.PRIORITY_HIGH_ACCURACY, 5000)
            .setMinUpdateIntervalMillis(3000).setMinUpdateDistanceMeters(10f).build()
        locationCallback = object : LocationCallback() {
            override fun onLocationResult(result: LocationResult) {
                result.lastLocation?.let { sendLiveGps(it) }
            }
        }
        locationClient?.requestLocationUpdates(req, locationCallback!!, mainLooper)
    }

    private fun stopLiveGps() {
        locationCallback?.let { locationClient?.removeLocationUpdates(it) }
        locationCallback = null
    }

    private fun openOrderNavigation(orderId: String, address: String, city: String, number: String) {
        selectedOrderId = orderId
        val q = URLEncoder.encode("$address, $city, Georgia", "UTF-8")
        io.execute {
            try {
                val arr = JSONArray(URL("https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&countrycodes=ge&q=$q").readText())
                if (arr.length() == 0) throw Exception("მისამართი GPS-ზე ვერ მოიძებნა")
                val x = arr.getJSONObject(0)
                val lat = x.getDouble("lat"); val lng = x.getDouble("lon")
                runOnUiThread { startNavigation(LatLng(lat, lng), number); startLiveGps() }
            } catch (e: Exception) {
                runOnUiThread { Toast.makeText(this, e.message ?: "GPS შეცდომა", Toast.LENGTH_LONG).show() }
            }
        }
    }

    private fun ensureLocationPermission() {
        if (ContextCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
            ActivityCompat.requestPermissions(this, arrayOf(Manifest.permission.ACCESS_FINE_LOCATION, Manifest.permission.ACCESS_COARSE_LOCATION), locationRequest)
        } else initializeNavigation()
    }

    override fun onRequestPermissionsResult(requestCode: Int, permissions: Array<out String>, grantResults: IntArray) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults)
        if (requestCode == locationRequest && grantResults.any { it == PackageManager.PERMISSION_GRANTED }) initializeNavigation()
    }

    private fun initializeNavigation() {
        NavigationApi.getNavigator(this, object : NavigationApi.NavigatorListener {
            override fun onNavigatorReady(ready: Navigator) {
                navigator = ready
                navigator?.setAudioGuidanceSettings(AudioGuidanceSettings.builder().setGuidanceMode(AudioGuidanceSettings.GuidanceMode.VOICE_ALERTS_AND_GUIDANCE).setVolumeLevel(AudioGuidanceSettings.VolumeLevel.NORMAL).setVibrationEnabled(true).setBluetoothAudioEnabled(true).build())
                handleNavigationIntent(intent)
            }
            override fun onError(errorCode: Int) {
                Toast.makeText(this@MainActivity, "ECOMAX GPS ვერ ჩაიტვირთა: $errorCode", Toast.LENGTH_LONG).show()
            }
        })
    }

    private fun handleNavigationIntent(intent: Intent?) {
        val uri: Uri = intent?.data ?: return
        if (uri.scheme != "ecomaxline" || uri.host != "navigate") return
        val lat = uri.getQueryParameter("lat")?.toDoubleOrNull()
        val lng = uri.getQueryParameter("lng")?.toDoubleOrNull()
        val order = uri.getQueryParameter("order") ?: "ECOMAX შეკვეთა"
        if (lat == null || lng == null) return
        startNavigation(LatLng(lat, lng), order)
    }

    private fun startNavigation(destination: LatLng, order: String) {
        val nav = navigator ?: return
        val waypoint = Waypoint.builder().setLatLng(destination.latitude, destination.longitude).setTitle(order).build()
        val options = RoutingOptions().apply { travelMode = RoutingOptions.TravelMode.DRIVING }
        nav.setDestination(waypoint, options).setOnResultListener { status ->
            if (status == Navigator.RouteStatus.OK) {
                nav.startGuidance()
            } else {
                Toast.makeText(this, "მარშრუტი ვერ დაიწყო: ${status.name}", Toast.LENGTH_LONG).show()
            }
        }
    }
}
