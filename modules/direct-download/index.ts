import { requireNativeModule } from "expo-modules-core";

interface DownloadStatus {
    status: string;
    statusCode?: number;
    reason?: number;
    localUri?: string;
    title?: string;
}

interface DirectDownloadModule {
    download(
        url: string,
        fileName: string,
        mimeType: string,
        accessToken: string
    ): Promise<number>;

    getStatus(
        downloadId: number
    ): Promise<DownloadStatus>;
}

const DirectDownload =
    requireNativeModule<DirectDownloadModule>(
        "DirectDownload"
    );

export default DirectDownload;