import {
    NativeModule,
    requireNativeModule,
} from "expo";

export interface TciFileDownloaderModuleEvents {}

declare class TciFileDownloaderModule
    extends NativeModule<TciFileDownloaderModuleEvents> {

    download(
        url: string,
        fileName: string,
        mimeType: string,
        token: string
    ): Promise<string>;
}

export default requireNativeModule<TciFileDownloaderModule>(
    "TciFileDownloader"
);