import android.util.Log
import okhttp3.MediaType.Companion.toMediaTypeOrNull
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody.Companion.toRequestBody
import okhttp3.Response
import java.io.IOException

class SimpleHttpClient(private val url: String) {

    private val client = OkHttpClient()

    fun sendJson(json: String): String {
        val requestBody = json.toRequestBody("application/json".toMediaTypeOrNull())

        val finalUrl = "Http://$url:8080/graphql"
        Log.d("Loquesta", requestBody.toString())
        val request = Request.Builder()
            .url(finalUrl)
            .post(requestBody)
            .build()

        var response: Response? = null

        try {
            response = client.newCall(request).execute()
        } catch (e: IOException) {
            e.printStackTrace()
        }
        catch (e: Exception) {

            e.printStackTrace()
        }

        if (response != null) {
            return response.body?.string() ?: "Error con el Query"
        }

        return "Response sis null"
    }
}