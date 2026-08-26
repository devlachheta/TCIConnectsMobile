package expo.modules.directdownload

import android.app.DownloadManager
import android.content.Context
import android.net.Uri
import android.os.Environment
import java.io.File
import java.io.FileOutputStream
import java.io.FileInputStream
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class DirectDownloadModule : Module() {

    override fun definition() = ModuleDefinition {

        Name("DirectDownload")

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

            val safeFileName =
                fileName
                    .replace("/", "_")
                    .replace("\\", "_")
                    .replace("..", "_")

            val downloadManager =
                context.getSystemService(
                    Context.DOWNLOAD_SERVICE
                ) as DownloadManager

            val request =
                DownloadManager.Request(
                    Uri.parse(url)
                )

            request.addRequestHeader(
                "Authorization",
                "Bearer $accessToken"
            )

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

            request.setAllowedOverMetered(
                true
            )

            request.setAllowedOverRoaming(
                false
            )

            request.setDestinationInExternalPublicDir(
                Environment.DIRECTORY_DOWNLOADS,
                safeFileName
            )

            request.setNotificationVisibility(
                DownloadManager.Request
                    .VISIBILITY_VISIBLE_NOTIFY_COMPLETED
            )

            val downloadId =
                downloadManager.enqueue(
                    request
                )

            return@AsyncFunction downloadId
        }

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

                if (!it.moveToFirst()) {

                    return@AsyncFunction mapOf(
                        "status" to "NOT_FOUND",
                        "statusCode" to -1,
                        "reason" to -1,
                        "localUri" to "",
                        "title" to ""
                    )
                }

                val status =
                    it.getInt(
                        it.getColumnIndexOrThrow(
                            DownloadManager.COLUMN_STATUS
                        )
                    )

                val reason =
                    it.getInt(
                        it.getColumnIndexOrThrow(
                            DownloadManager.COLUMN_REASON
                        )
                    )

                val localUri =
                    it.getString(
                        it.getColumnIndexOrThrow(
                            DownloadManager.COLUMN_LOCAL_URI
                        )
                    )

                val title =
                    it.getString(
                        it.getColumnIndexOrThrow(
                            DownloadManager.COLUMN_TITLE
                        )
                    )

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

                return@AsyncFunction mapOf(
                    "status" to statusText,
                    "statusCode" to status,
                    "reason" to reason,
                    "localUri" to (localUri ?: ""),
                    "title" to (title ?: "")
                )
            }
        }

        AsyncFunction("readChunk") {
            uriString: String,
            start: Long,
            length: Int,
            chunkName: String ->

            val context =
                appContext.reactContext
                    ?: throw Exception(
                        "React context is unavailable"
                    )

            if (uriString.isBlank()) {
                throw Exception(
                    "File URI is empty"
                )
            }

            if (start < 0) {
                throw Exception(
                    "Invalid chunk start position"
                )
            }

            if (length <= 0) {
                throw Exception(
                    "Invalid chunk length"
                )
            }

            val safeChunkName =
                chunkName
                    .replace("/", "_")
                    .replace("\\", "_")
                    .replace("..", "_")

            val outputFile =
                File(
                    context.cacheDir,
                    safeChunkName
                )

            val uri =
                Uri.parse(uriString)

            val parcelFileDescriptor =
                context.contentResolver
                    .openFileDescriptor(
                        uri,
                        "r"
                    )
                    ?: throw Exception(
                        "Unable to open content URI"
                    )

            try {

                FileInputStream(
                    parcelFileDescriptor.fileDescriptor
                ).use { inputStream ->

                    val channel =
                        inputStream.channel

                    try {
                        channel.position(
                            start
                        )
                    } catch (
                        positionError: Exception
                    ) {

                        inputStream.skip(
                            start
                        )
                    }

                    FileOutputStream(
                        outputFile,
                        false
                    ).use { outputStream ->

                        val buffer =
                            ByteArray(
                                1024 * 1024
                            )

                        var remaining =
                            length.toLong()

                        while (
                            remaining > 0
                        ) {

                            val bytesToRead =
                                minOf(
                                    buffer.size.toLong(),
                                    remaining
                                ).toInt()

                            val bytesRead =
                                inputStream.read(
                                    buffer,
                                    0,
                                    bytesToRead
                                )

                            if (
                                bytesRead <= 0
                            ) {
                                break
                            }

                            outputStream.write(
                                buffer,
                                0,
                                bytesRead
                            )

                            remaining -=
                                bytesRead
                        }

                        outputStream.flush()
                    }
                }

            } finally {

                try {
                    parcelFileDescriptor.close()
                } catch (
                    _: Exception
                ) {
                }
            }

            return@AsyncFunction Uri.fromFile(outputFile).toString()
        }

        AsyncFunction("deleteChunk") {
            path: String ->

            if (path.isBlank()) {
                return@AsyncFunction false
            }

            val file =
                File(path)

            if (file.exists()) {
                return@AsyncFunction file.delete()
            }

            return@AsyncFunction true
        }
    }
}