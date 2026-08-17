package expo.modules.tcifiledownloader

import android.content.ContentValues
import android.os.Build
import android.provider.MediaStore
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import java.io.BufferedInputStream
import java.io.IOException
import java.net.HttpURLConnection
import java.net.URL

class TciFileDownloaderModule : Module() {

    override fun definition() = ModuleDefinition {
        Name("TciFileDownloader")

        AsyncFunction("download") {
            url: String,
            fileName: String,
            mimeType: String,
            token: String ->

            downloadFile(
                url,
                fileName,
                mimeType,
                token
            )
        }
    }

    private fun downloadFile(
        urlString: String,
        fileName: String,
        mimeType: String,
        token: String
    ): String {

        // Android 10+ supports MediaStore Downloads
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.Q) {
            throw IOException(
                "Android 10 or newer is required."
            )
        }

        val context =
            requireNotNull(appContext.reactContext) {
                "React context is not available"
            }

        val resolver = context.contentResolver

        var connection: HttpURLConnection? = null
        var fileUri: android.net.Uri? = null

        try {

            // ------------------------------------
            // 1. Create file in:
            //
            // Downloads/TCI Connect
            // ------------------------------------

            val values = ContentValues().apply {

                put(
                    MediaStore.Downloads.DISPLAY_NAME,
                    fileName
                )

                put(
                    MediaStore.Downloads.MIME_TYPE,
                    mimeType
                )

                put(
                    MediaStore.Downloads.RELATIVE_PATH,
                    "Download/TCI Connect"
                )

                // Keep hidden while downloading
                put(
                    MediaStore.Downloads.IS_PENDING,
                    1
                )
            }

            fileUri =
                resolver.insert(
                    MediaStore.Downloads.EXTERNAL_CONTENT_URI,
                    values
                )
                    ?: throw IOException(
                        "Could not create file in Downloads."
                    )

            // ------------------------------------
            // 2. Connect to FastAPI
            // ------------------------------------

            val url = URL(urlString)

            connection =
                url.openConnection() as HttpURLConnection

            connection.requestMethod = "GET"

            connection.connectTimeout = 30_000
            connection.readTimeout = 60_000

            connection.setRequestProperty(
                "Authorization",
                "Bearer $token"
            )

            connection.setRequestProperty(
                "Accept",
                "*/*"
            )

            connection.connect()

            // ------------------------------------
            // 3. Check response
            // ------------------------------------

            val responseCode =
                connection.responseCode

            if (
                responseCode < 200 ||
                responseCode >= 300
            ) {
                throw IOException(
                    "Download failed. HTTP status: $responseCode"
                )
            }

            // ------------------------------------
            // 4. Stream file
            // ------------------------------------

            val input =
                BufferedInputStream(
                    connection.inputStream
                )

            val output =
                resolver.openOutputStream(
                    fileUri
                )
                    ?: throw IOException(
                        "Could not open output file."
                    )

            input.use { inputStream ->

                output.use { outputStream ->

                    val buffer =
                        ByteArray(64 * 1024)

                    var bytesRead: Int

                    while (
                        inputStream.read(buffer)
                            .also {
                                bytesRead = it
                            } != -1
                    ) {

                        outputStream.write(
                            buffer,
                            0,
                            bytesRead
                        )
                    }

                    outputStream.flush()
                }
            }

            // ------------------------------------
            // 5. Make file visible
            // ------------------------------------

            val completedValues =
                ContentValues().apply {

                    put(
                        MediaStore.Downloads.IS_PENDING,
                        0
                    )
                }

            resolver.update(
                fileUri,
                completedValues,
                null,
                null
            )

            // ------------------------------------
            // 6. Return URI to React Native
            // ------------------------------------

            return fileUri.toString()

        } catch (error: Exception) {

            // Delete incomplete file
            fileUri?.let { uri ->
                try {
                    resolver.delete(
                        uri,
                        null,
                        null
                    )
                } catch (_: Exception) {
                    // Ignore cleanup error
                }
            }

            throw error

        } finally {
            connection?.disconnect()
        }
    }
}