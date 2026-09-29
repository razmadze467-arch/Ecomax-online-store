package ge.ecomax.line

import android.app.Application
import com.google.android.libraries.navigation.NavigationApi

class EcomaxLineApp : Application() {
    override fun onCreate() {
        super.onCreate()
        NavigationApi.setApiKey(BuildConfig.MAPS_API_KEY)
    }
}
