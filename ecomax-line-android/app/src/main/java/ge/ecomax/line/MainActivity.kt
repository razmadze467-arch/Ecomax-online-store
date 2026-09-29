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
import com.google.android.libraries.navigation.NavigationApi
import com.google.android.libraries.navigation.NavigationView
import com.google.android.libraries.navigation.Navigator
import com.google.android.libraries.navigation.RoutingOptions
import com.google.android.libraries.navigation.Waypoint

class MainActivity : ComponentActivity() {
    private lateinit var navigationView: NavigationView
    private var navigator: Navigator? = null
    private val locationRequest = 7001

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        navigationView = NavigationView(this)
        setContentView(FrameLayout(this).apply { addView(navigationView) })
        ensureLocationPermission()
    }

    override fun onNewIntent(intent: Intent) {
        super.onNewIntent(intent)
        setIntent(intent)
        handleNavigationIntent(intent)
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
