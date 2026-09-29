package ge.ecomax.line

import android.Manifest
import android.content.Intent
import android.content.pm.PackageManager
import android.net.Uri
import android.os.Bundle
import android.widget.FrameLayout
import android.widget.LinearLayout
import android.widget.TextView
import android.widget.EditText
import android.widget.Button
import android.view.Gravity
import android.location.Location
import com.google.android.gms.location.LocationRequest
import com.google.android.gms.location.LocationCallback
import com.google.android.gms.location.LocationResult
import com.google.android.gms.location.LocationServices
import com.google.android.gms.location.Priority
import org.json.JSONArray
import org.json.JSONObject
import java.net.HttpURLConnection
import java.net.URL
import java.net.URLEncoder
import java.util.concurrent.Executors
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
    private val io = Executors.newSingleThreadExecutor()
    private val SUPABASE = "https://mkxkqdvtmfbxmldnvsef.supabase.co"
    private val SUPABASE_KEY = "sb_publishable_K5orPxr9E0q9-K0dKYdt-g_0GTFvWtd"
    private var accessToken: String? = null
    private var userId: String? = null
    private lateinit var root: LinearLayout
    private val locationRequest = 7001

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        locationClient = LocationServices.getFusedLocationProviderClient(this)
        locationClient = LocationServices.getFusedLocationProviderClient(this)
        showLogin()
        ensureLocationPermission()
    }

    override fun onNewIntent(intent: Intent) {
        super.onNewIntent(intent)
        setIntent(intent)
        handleNavigationIntent(intent)
    }


    private fun request(method: String, url: String, body: String? = null, bearer: String? = null): String {
        val c = URL(url).openConnection() as HttpURLConnection
        c.requestMethod = method
        c.setRequestProperty("apikey", SUPABASE_KEY)
        c.setRequestProperty("Content-Type", "application/json")
        bearer?.let { c.setRequestProperty("Authorization", "Bearer " + it) }
        if (body != null) {
            c.doOutput = true
            c.outputStream.use { it.write(body.toByteArray(Charsets.UTF_8)) }
        }
        val code = c.responseCode
        val stream = if (code in 200..299) c.inputStream else c.errorStream
        val text = stream?.bufferedReader()?.use { it.readText() } ?: ""
        if (code !in 200..299) throw Exception("HTTP " + code + ": " + text)
        return text
    }

    private fun showLogin() {
        root = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            setPadding(36, 60, 36, 36)
            gravity = Gravity.CENTER_HORIZONTAL
        }
        val title = TextView(this).apply { text = "ECOMAX LINE"; textSize = 30f; gravity = Gravity.CENTER }
        val email = EditText(this).apply { hint = "კურიერის ელფოსტა"; inputType = 33 }
        val password = EditText(this).apply { hint = "პაროლი"; inputType = 129 }
        val login = Button(this).apply { text = "კურიერის შესვლა" }
        val status = TextView(this)
        root.addView(title); root.addView(email); root.addView(password); root.addView(login); root.addView(status)
        setContentView(root)
        login.setOnClickListener {
            val e = email.text.toString().trim()
            val p = password.text.toString()
            if (e.isBlank() || p.isBlank()) { status.text = "შეავსე ელფოსტა და პაროლი"; return@setOnClickListener }
            login.isEnabled = false
            status.text = "მოწმდება..."
            io.execute {
                try {
                    val json = JSONObject(request("POST", SUPABASE + "/auth/v1/token?grant_type=password",
                        JSONObject().put("email", e).put("password", p).toString()))
                    val token = json.getString("access_token")
                    val uid = json.getJSONObject("user").getString("id")
                    val profileUrl = SUPABASE + "/rest/v1/profiles?id=eq." + URLEncoder.encode(uid, "UTF-8") + "&select=role"
                    val prof = JSONArray(request("GET", profileUrl, bearer = token))
                    val role = if (prof.length() > 0) prof.getJSONObject(0).optString("role") else ""
                    if (role != "courier" && role != "admin") throw Exception("ამ ანგარიშს კურიერის წვდომა არ აქვს")
                    accessToken = token
                    userId = uid
                    runOnUiThread { showOrders() }
                } catch (x: Exception) {
                    runOnUiThread { status.text = x.message ?: "შესვლა ვერ მოხერხდა"; login.isEnabled = true }
                }
            }
        }
    }

    private fun showOrders() {
        root.removeAllViews()
        root.addView(TextView(this).apply { text = "ECOMAX LINE — შეკვეთები"; textSize = 24f })
        val list = LinearLayout(this).apply { orientation = LinearLayout.VERTICAL }
        root.addView(list, LinearLayout.LayoutParams(-1, 0, 1f))
        io.execute {
            try {
                val uid = userId ?: throw Exception("სესია არ არის")
                val url = SUPABASE + "/rest/v1/orders?courier_id=eq." + URLEncoder.encode(uid, "UTF-8") +
                    "&status=not.in.(completed,cancelled)&select=id,order_number,customer_name,phone,address,city,status,total"
                val arr = JSONArray(request("GET", url, bearer = accessToken))
                runOnUiThread {
                    if (arr.length() == 0) list.addView(TextView(this).apply { text = "აქტიური შეკვეთები არ არის" })
                    for (i in 0 until arr.length()) {
                        val o = arr.getJSONObject(i)
                        val id = o.getString("id")
                        val number = o.optString("order_number").ifBlank { id.take(8) }
                        val address = o.optString("address")
                        val city = o.optString("city")
                        val card = LinearLayout(this).apply { orientation = LinearLayout.VERTICAL; setPadding(0, 18, 0, 18) }
                        card.addView(TextView(this).apply {
                            text = "შეკვეთა #" + number + "
" + o.optString("customer_name") + " — " + city + ", " + address + "
სტატუსი: " + o.optString("status")
                            textSize = 17f
                        })
                        card.addView(Button(this).apply { text = "ნავიგაციის დაწყება"; setOnClickListener { openOrderNavigation(id, address, city, number) } })
                        list.addView(card)
                    }
                }
            } catch (x: Exception) {
                runOnUiThread { list.addView(TextView(this).apply { text = "შეკვეთების ჩატვირთვა ვერ მოხერხდა: " + (x.message ?: "") }) }
            }
        }
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
                val conn = URL("https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&countrycodes=ge&q=" + q).openConnection() as HttpURLConnection
                conn.setRequestProperty("User-Agent", "ECOMAX-LINE/1.0")
                val arr = JSONArray(conn.inputStream.bufferedReader().use { it.readText() })
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
