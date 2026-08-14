import * as SecureStore from "expo-secure-store";
import * as Sharing from "expo-sharing";
import * as IntentLauncher from "expo-intent-launcher";
import * as FileSystemLegacy from "expo-file-system/legacy";

import {
    Directory,
    File,
    Paths,
} from "expo-file-system";

// IMPORTANT:
// Change this import if your native module file is located somewhere else.
import {
    downloadFile as nativeDownloadFile,
} from "@/modules/tci-file-downloader/src";

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
    const token = await SecureStore.getItemAsync(
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
 * Build download URL
 */
const getDownloadUrl = (
    filePath: string
): string => {
    return (
        `${API_URL}/download-file?file_path=` +
        encodeURIComponent(filePath)
    );
};


/**
 * =====================================================
 * DOWNLOAD FILE DIRECTLY TO ANDROID DOWNLOADS
 * =====================================================
 *
 * This uses the custom Kotlin native module.
 *
 * Result:
 *
 * Android
 *   ↓
 * Download
 *   ↓
 * TCI Connect
 *   ↓
 * filename.ext
 *
 * NO folder picker.
 */
export const downloadCaseFile = async (
    filePath: string,
    fileName: string
): Promise<string> => {
    try {
        console.log(
            "Starting native download:",
            fileName
        );

        const token = await getAccessToken();

        const downloadUrl =
            getDownloadUrl(filePath);

        const mimeType =
            getMimeType(fileName);

        console.log("Download URL:", downloadUrl);
        console.log("MIME type:", mimeType);

        const uri =
            await nativeDownloadFile(
                downloadUrl,
                fileName,
                mimeType,
                token
            );

        console.log(
            "File downloaded successfully:",
            uri
        );

        return uri;

    } catch (error) {
        console.error(
            "Native download error:",
            error
        );

        throw error;
    }
};
/**
 * =====================================================
 * DOWNLOAD TEMPORARY FILE
 * =====================================================
 *
 * Used only for:
 *
 * - Open
 * - Share
 *
 * This does NOT save to Downloads.
 */
export const downloadTemporaryFile = async (
    filePath: string,
    fileName: string
): Promise<string> => {

    try {

        const token =
            await getAccessToken();

        const downloadUrl =
            getDownloadUrl(filePath);

        console.log(
            "Downloading temporary file:",
            downloadUrl
        );

        /**
         * Create:
         *
         * cache/
         *    case-files/
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
         * Destination:
         *
         * cache/case-files/file.ext
         */
        const destinationFile =
            new File(
                directory,
                fileName
            );

        console.log(
            "Temporary destination:",
            destinationFile.uri
        );

        /**
         * Download to app cache.
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
 * =====================================================
 * OPEN CASE FILE
 * =====================================================
 *
 * This does NOT save to Downloads.
 *
 * It downloads the file to temporary storage
 * and opens the Android sharing/open dialog.
 */
export const openCaseFile = async (
    filePath: string,
    fileName: string
): Promise<void> => {
    try {
        console.log("Opening file:", fileName);

        // 1. Download to app cache
        const fileUri = await downloadTemporaryFile(
            filePath,
            fileName
        );

        console.log("Temporary file:", fileUri);

        // 2. Convert file:// URI to content:// URI
        const contentUri =
            await FileSystemLegacy.getContentUriAsync(
                fileUri
            );

        console.log("Content URI:", contentUri);

        // 3. Get MIME type
        const mimeType = getMimeType(fileName);

        console.log("MIME type:", mimeType);

        // 4. Open directly using Android VIEW intent
        await IntentLauncher.startActivityAsync(
            "android.intent.action.VIEW",
            {
                data: contentUri,
                type: mimeType,

                // FLAG_GRANT_READ_URI_PERMISSION
                flags: 1,
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
 * =====================================================
 * SHARE CASE FILE
 * =====================================================
 *
 * Downloads temporarily and opens
 * Android share dialog.
 */
export const shareCaseFile = async (
    filePath: string,
    fileName: string
): Promise<void> => {

    try {

        console.log(
            "Sharing file:",
            fileName
        );

        /**
         * Download temporarily
         */
        const uri =
            await downloadTemporaryFile(
                filePath,
                fileName
            );

        /**
         * Check sharing availability
         */
        const sharingAvailable =
            await Sharing.isAvailableAsync();

        if (!sharingAvailable) {
            throw new Error(
                "File sharing is not available on this device"
            );
        }

        /**
         * Open Android share dialog
         */
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