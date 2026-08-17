import {
    Directory,
    File,
    Paths,
} from "expo-file-system";

import * as SecureStore from "expo-secure-store";
import * as Sharing from "expo-sharing";

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
 * Download file to temporary app storage.
 *
 * This is used by:
 * - Open
 * - Share
 * - Download before copying to Downloads
 *
 * The important part is that this destination is
 * a normal local file, NOT a content:// URI.
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
         * file:///.../cache/case-files/file.mp4
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
         * Download directly to local file.
         *
         * No Blob.
         * No Base64.
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

        console.log(
            "File exists:",
            downloadedFile.exists
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
 * Download file to user's selected directory.
 *
 * Flow:
 *
 * Server
 *   ↓
 * Temporary local file
 *   ↓
 * Android Downloads folder
 */
export const downloadCaseFile = async (
    filePath: string,
    fileName: string
): Promise<string> => {
    try {
        console.log(
            "Starting file download:",
            fileName
        );

        /**
         * 1. Download to normal local storage first.
         *
         * This avoids the content:// problem.
         */
        const temporaryUri =
            await downloadTemporaryFile(
                filePath,
                fileName
            );

        console.log(
            "Temporary file ready:",
            temporaryUri
        );


        /**
         * 2. Ask user to choose a directory.
         *
         * On Android, this will normally be:
         *
         * Downloads
         *
         * Then:
         *
         * "Use this folder"
         */
        const directory =
            await Directory.pickDirectoryAsync();

        console.log(
            "Selected directory:",
            directory.uri
        );


        /**
         * 3. Create destination file
         * inside the selected directory.
         */
        const destinationFile =
            directory.createFile(
                fileName,
                getMimeType(fileName)
            );

        console.log(
            "Downloads destination:",
            destinationFile.uri
        );


        /**
         * 4. Copy the local file into
         * the user-selected directory.
         *
         * IMPORTANT:
         *
         * We DON'T call downloadFileAsync()
         * directly on the content:// URI.
         */
        const sourceFile =
            new File(temporaryUri);

        sourceFile.copy(
            destinationFile
        );

        console.log(
            "File copied successfully:"
        );

        console.log(
            destinationFile.uri
        );


        /**
         * 5. Return the destination URI.
         */
        return destinationFile.uri;

    } catch (error) {
        console.error(
            "File download error:",
            error
        );

        throw error;
    }
};


/**
 * Open / share a case file.
 *
 * This does NOT save to Downloads.
 *
 * It downloads temporarily and then
 * opens the Android share/open dialog.
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

        /**
         * Download to normal local storage.
         */
        const uri =
            await downloadTemporaryFile(
                filePath,
                fileName
            );

        console.log(
            "Opening local file:",
            uri
        );


        /**
         * Check whether sharing is available.
         */
        const sharingAvailable =
            await Sharing.isAvailableAsync();

        if (!sharingAvailable) {
            throw new Error(
                "File sharing is not available on this device"
            );
        }


        /**
         * Open Android share/open dialog.
         */
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
 * Share a case file.
 *
 * This is intentionally separate from
 * the Download button.
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