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

    readChunk(
        uri: string,
        start: number,
        length: number,
        chunkName: string
    ): Promise<string>;

    deleteChunk(
        path: string
    ): Promise<boolean>;
}

const DirectDownload =
    requireNativeModule<DirectDownloadModule>(
        "DirectDownload"
    );

export default DirectDownload;