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
<<<<<<< HEAD

=======
>>>>>>> file-service
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

<<<<<<< HEAD
        // Android 10+ is required for MediaStore Downloads
=======
        // Android 10+ supports MediaStore Downloads
>>>>>>> file-service
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

<<<<<<< HEAD
            // -----------------------------------------
            // 1. Create file in Downloads/TCI Connect
            // -----------------------------------------
=======
            // ------------------------------------
            // 1. Create file in:
            //
            // Downloads/TCI Connect
            // ------------------------------------
>>>>>>> file-service

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

<<<<<<< HEAD
                // Hide file while downloading
=======
                // Keep hidden while downloading
>>>>>>> file-service
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

<<<<<<< HEAD
            // -----------------------------------------
            // 2. Connect to FastAPI
            // -----------------------------------------
=======
            // ------------------------------------
            // 2. Connect to FastAPI
            // ------------------------------------
>>>>>>> file-service

            val url = URL(urlString)

            connection =
                url.openConnection() as HttpURLConnection

            connection.requestMethod = "GET"

            connection.connectTimeout = 30_000
<<<<<<< HEAD

            // 2 minutes
            connection.readTimeout = 120_000
=======
            connection.readTimeout = 60_000
>>>>>>> file-service

            connection.setRequestProperty(
                "Authorization",
                "Bearer $token"
            )

            connection.setRequestProperty(
                "Accept",
                "*/*"
            )

            connection.connect()

<<<<<<< HEAD
            // -----------------------------------------
            // 3. Check HTTP response
            // -----------------------------------------
=======
            // ------------------------------------
            // 3. Check response
            // ------------------------------------
>>>>>>> file-service

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

<<<<<<< HEAD
            // -----------------------------------------
            // 4. Stream server response directly
            //    into Downloads
            // -----------------------------------------
=======
            // ------------------------------------
            // 4. Stream file
            // ------------------------------------
>>>>>>> file-service

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

<<<<<<< HEAD
            // -----------------------------------------
            // 5. Make file visible
            // -----------------------------------------
=======
            // ------------------------------------
            // 5. Make file visible
            // ------------------------------------
>>>>>>> file-service

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

<<<<<<< HEAD
            // -----------------------------------------
            // 6. Return Android content URI
            // -----------------------------------------
=======
            // ------------------------------------
            // 6. Return URI to React Native
            // ------------------------------------
>>>>>>> file-service

            return fileUri.toString()

        } catch (error: Exception) {

<<<<<<< HEAD
            // -----------------------------------------
            // Delete incomplete file
            // -----------------------------------------

            fileUri?.let { uri ->

                try {

=======
            // Delete incomplete file
            fileUri?.let { uri ->
                try {
>>>>>>> file-service
                    resolver.delete(
                        uri,
                        null,
                        null
                    )
<<<<<<< HEAD

=======
>>>>>>> file-service
                } catch (_: Exception) {
                    // Ignore cleanup error
                }
            }

            throw error

        } finally {
<<<<<<< HEAD

=======
>>>>>>> file-service
            connection?.disconnect()
        }
    }
}