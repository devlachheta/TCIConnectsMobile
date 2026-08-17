import { NativeModule, requireNativeModule } from "expo";

declare class TciFileDownloaderModule extends NativeModule {
    download: (
        url: string,
        fileName: string,
        mimeType: string,
        token: string
    ) => Promise<string>;
}

export default requireNativeModule<TciFileDownloaderModule>(
    "TciFileDownloader"
);  
