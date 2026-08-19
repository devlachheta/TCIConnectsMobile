import {
    Directory,
    File,
    Paths,
} from "expo-file-system";

import * as SecureStore from "expo-secure-store";
import * as Sharing from "expo-sharing";

import DirectDownload from "@/modules/direct-download";

const API_URL = "https://tcidentallab.com/api";

/**
 * Get MIME type from file extension
 */
const getMimeType = (fileName: string): string => {
    const extension = fileName
        .split(".")
        .pop()
        ?.toLowerCase();

    switch (extension) {
        case "pdf":
            return "application/pdf";

        case "png":
            return "image/png";

        case "jpg":
        case "jpeg":
            return "image/jpeg";

        case "mp4":
            return "video/mp4";

        case "zip":
            return "application/zip";

        case "txt":
            return "text/plain";

        case "doc":
            return "application/msword";

        case "docx":
            return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

        case "stl":
            return "application/octet-stream";

        default:
            return "application/octet-stream";
    }
};


/**
 * Get JWT token
 */
const getAccessToken = async (): Promise<string> => {
    const token =
        await SecureStore.getItemAsync(
            "access_token"
        );

    if (!token) {
        throw new Error(
            "Authentication token not found"
        );
    }

    return token;
};


/**
 * --------------------------------------------------
 * DIRECT ANDROID DOWNLOAD
 * --------------------------------------------------
 *
 * This is used for:
 *
 * - Case PDF
 * - Digital files
 * - Preview files
 *
 * Flow:
 *
 * React Native
 *      ↓
 * Android DownloadManager
 *      ↓
 * GET /mobile-download/{file_id}
 *      ↓
 * FastAPI
 *      ↓
 * Downloads folder
 *
 * Android shows the system download notification.
 */
// export const downloadCaseFile = async (
//     fileId: number,
//     fileName: string
// ): Promise<number> => {

//     try {

//         console.log(
//             "Starting direct download:",
//             fileName
//         );

//         console.log(
//             "File ID:",
//             fileId
//         );

//         /**
//          * Get JWT
//          */
//         const token =
//             await getAccessToken();

//         /**
//          * New mobile download API
//          */
//         const downloadUrl =
//             `${API_URL}/mobile-download/${fileId}`;

//         console.log(
//             "Download URL:",
//             downloadUrl
//         );

//         /**
//          * Get MIME type
//          */
//         const mimeType =
//             getMimeType(fileName);

//         /**
//          * Start Android DownloadManager
//          */
//         const downloadId =
//             await DirectDownload.download(
//                 downloadUrl,
//                 fileName,
//                 mimeType,
//                 token
//             );

//         console.log(
//             "Android DownloadManager ID:",
//             downloadId
//         );

//         return downloadId;

//     } catch (error) {

//         console.error(
//             "Direct download error:",
//             error
//         );

//         throw error;
//     }
// };

export const downloadCaseFile = async (
    fileId: number,
    fileName: string
): Promise<number> => {

    try {

        console.log(
            "Starting direct download:",
            fileName
        );

        console.log(
            "File ID:",
            fileId
        );

        const token =
            await getAccessToken();

        const downloadUrl =
            `${API_URL}/mobile-download/${fileId}`;

        console.log(
            "Download URL:",
            downloadUrl
        );

        const mimeType =
            getMimeType(fileName);

        const downloadId =
            await DirectDownload.download(
                downloadUrl,
                fileName,
                mimeType,
                token
            );

        console.log(
            "Android DownloadManager ID:",
            downloadId
        );

        // Wait a little before checking status
        setTimeout(async () => {

            try {

                const status =
                    await DirectDownload.getStatus(
                        downloadId
                    );

                console.log(
                    "DOWNLOAD STATUS:",
                    status
                );

            } catch (error) {

                console.error(
                    "DOWNLOAD STATUS ERROR:",
                    error
                );
            }

        }, 3000);

        return downloadId;

    } catch (error) {

        console.error(
            "Direct download error:",
            error
        );

        throw error;
    }
};
/**
 * --------------------------------------------------
 * TEMPORARY DOWNLOAD
 * --------------------------------------------------
 *
 * Used only for:
 *
 * - Open
 * - Share
 *
 * It does NOT download to Android Downloads.
 */
export const downloadTemporaryFile = async (
    filePath: string,
    fileName: string
): Promise<string> => {

    try {

        const token =
            await getAccessToken();

        /**
         * This is your OLD API.
         *
         * Keep this because open/share still
         * use file_path.
         */
        const downloadUrl =
            `${API_URL}/download-file?file_path=` +
            encodeURIComponent(filePath);

        console.log(
            "Downloading temporary file:",
            downloadUrl
        );

        /**
         * Cache directory
         */
        const directory =
            new Directory(
                Paths.cache,
                "case-files"
            );

        if (!directory.exists) {
            directory.create({
                intermediates: true,
            });
        }

        /**
         * Temporary destination
         */
        const destinationFile =
            new File(
                directory,
                fileName
            );

        /**
         * Download to cache
         */
        const downloadedFile =
            await File.downloadFileAsync(
                downloadUrl,
                destinationFile,
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`,
                    },

                    idempotent: true,
                }
            );

        console.log(
            "Temporary download completed:",
            downloadedFile.uri
        );

        return downloadedFile.uri;

    } catch (error) {

        console.error(
            "Temporary download error:",
            error
        );

        throw error;
    }
};


/**
 * --------------------------------------------------
 * OPEN FILE
 * --------------------------------------------------
 *
 * Downloads temporarily and opens the
 * Android share/open dialog.
 */
export const openCaseFile = async (
    filePath: string,
    fileName: string
): Promise<void> => {

    try {

        console.log(
            "Opening file:",
            fileName
        );

        const uri =
            await downloadTemporaryFile(
                filePath,
                fileName
            );

        const sharingAvailable =
            await Sharing.isAvailableAsync();

        if (!sharingAvailable) {
            throw new Error(
                "File sharing is not available on this device"
            );
        }

        await Sharing.shareAsync(
            uri,
            {
                mimeType:
                    getMimeType(fileName),

                dialogTitle:
                    `Open ${fileName}`,
            }
        );

    } catch (error) {

        console.error(
            "Open file error:",
            error
        );
    }
};


/**
 * --------------------------------------------------
 * SHARE FILE
 * --------------------------------------------------
 *
 * Downloads temporarily and opens
 * the Android share dialog.
 */
export const shareCaseFile = async (
    filePath: string,
    fileName: string
): Promise<void> => {

    try {

        const uri =
            await downloadTemporaryFile(
                filePath,
                fileName
            );

        const sharingAvailable =
            await Sharing.isAvailableAsync();

        if (!sharingAvailable) {
            throw new Error(
                "File sharing is not available on this device"
            );
        }

        await Sharing.shareAsync(
            uri,
            {
                mimeType:
                    getMimeType(fileName),

                dialogTitle:
                    `Share ${fileName}`,
            }
        );

    } catch (error) {

        console.error(
            "Share file error:",
            error
        );
    }
};