package expo.modules.directdownload

import android.app.DownloadManager
import android.content.Context
import android.net.Uri
import android.os.Environment

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition


class DirectDownloadModule : Module() {

    override fun definition() = ModuleDefinition {

        Name("DirectDownload")


        // =========================================================
        // START DOWNLOAD
        // =========================================================

        AsyncFunction("download") {
            url: String,
            fileName: String,
            mimeType: String,
            accessToken: String ->

            val context =
                appContext.reactContext
                    ?: throw Exception(
                        "React context is unavailable"
                    )

            if (url.isBlank()) {
                throw Exception(
                    "Download URL is empty"
                )
            }

            if (fileName.isBlank()) {
                throw Exception(
                    "File name is empty"
                )
            }

            if (accessToken.isBlank()) {
                throw Exception(
                    "Access token is empty"
                )
            }

            // -----------------------------------------------------
            // Sanitize filename
            // -----------------------------------------------------

            val safeFileName =
                fileName
                    .replace("/", "_")
                    .replace("\\", "_")
                    .replace("..", "_")


            // -----------------------------------------------------
            // Android DownloadManager
            // -----------------------------------------------------

            val downloadManager =
                context.getSystemService(
                    Context.DOWNLOAD_SERVICE
                ) as DownloadManager


            // -----------------------------------------------------
            // Request
            // -----------------------------------------------------

            val request =
                DownloadManager.Request(
                    Uri.parse(url)
                )


            // -----------------------------------------------------
            // JWT authentication
            // -----------------------------------------------------

            request.addRequestHeader(
                "Authorization",
                "Bearer $accessToken"
            )


            // -----------------------------------------------------
            // File information
            // -----------------------------------------------------

            request.setTitle(
                safeFileName
            )

            request.setDescription(
                "Downloading from TCI Connect"
            )

            request.setMimeType(
                if (mimeType.isBlank()) {
                    "application/octet-stream"
                } else {
                    mimeType
                }
            )


            // -----------------------------------------------------
            // Network settings
            // -----------------------------------------------------

            request.setAllowedOverMetered(
                true
            )

            request.setAllowedOverRoaming(
                false
            )


            // -----------------------------------------------------
            // Save to Downloads
            // -----------------------------------------------------

            request.setDestinationInExternalPublicDir(
                Environment.DIRECTORY_DOWNLOADS,
                safeFileName
            )


            // -----------------------------------------------------
            // Notification
            // -----------------------------------------------------

            request.setNotificationVisibility(
                DownloadManager.Request
                    .VISIBILITY_VISIBLE_NOTIFY_COMPLETED
            )


            // -----------------------------------------------------
            // Start download
            // -----------------------------------------------------

            val downloadId =
                downloadManager.enqueue(
                    request
                )


            return@AsyncFunction downloadId
        }


        // =========================================================
        // GET DOWNLOAD STATUS
        // =========================================================

        AsyncFunction("getStatus") {
            downloadId: Long ->

            val context =
                appContext.reactContext
                    ?: throw Exception(
                        "React context is unavailable"
                    )


            val downloadManager =
                context.getSystemService(
                    Context.DOWNLOAD_SERVICE
                ) as DownloadManager


            val query =
                DownloadManager.Query()

            query.setFilterById(
                downloadId
            )


            val cursor =
                downloadManager.query(
                    query
                )


            cursor.use {

                // -------------------------------------------------
                // Download not found
                // -------------------------------------------------

                if (!it.moveToFirst()) {

                    return@AsyncFunction mapOf(
                        "status" to "NOT_FOUND",
                        "statusCode" to -1,
                        "reason" to -1,
                        "localUri" to "",
                        "title" to ""
                    )
                }


                // -------------------------------------------------
                // Status
                // -------------------------------------------------

                val status =
                    it.getInt(
                        it.getColumnIndexOrThrow(
                            DownloadManager.COLUMN_STATUS
                        )
                    )


                // -------------------------------------------------
                // Reason
                // -------------------------------------------------

                val reason =
                    it.getInt(
                        it.getColumnIndexOrThrow(
                            DownloadManager.COLUMN_REASON
                        )
                    )


                // -------------------------------------------------
                // Local URI
                // -------------------------------------------------

                val localUri =
                    it.getString(
                        it.getColumnIndexOrThrow(
                            DownloadManager.COLUMN_LOCAL_URI
                        )
                    )


                // -------------------------------------------------
                // Title
                // -------------------------------------------------

                val title =
                    it.getString(
                        it.getColumnIndexOrThrow(
                            DownloadManager.COLUMN_TITLE
                        )
                    )


                // -------------------------------------------------
                // Convert status to readable text
                // -------------------------------------------------

                val statusText =
                    when (status) {

                        DownloadManager.STATUS_PENDING ->
                            "PENDING"

                        DownloadManager.STATUS_RUNNING ->
                            "RUNNING"

                        DownloadManager.STATUS_PAUSED ->
                            "PAUSED"

                        DownloadManager.STATUS_SUCCESSFUL ->
                            "SUCCESSFUL"

                        DownloadManager.STATUS_FAILED ->
                            "FAILED"

                        else ->
                            "UNKNOWN"
                    }


                // -------------------------------------------------
                // Return result
                // -------------------------------------------------

                return@AsyncFunction mapOf(
                    "status" to statusText,
                    "statusCode" to status,
                    "reason" to reason,
                    "localUri" to (localUri ?: ""),
                    "title" to (title ?: "")
                )
            }
        }
    }
}