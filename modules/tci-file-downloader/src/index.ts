import TciFileDownloaderModule from "./TciFileDownloaderModule";

export const downloadFile = async (
    url: string,
    fileName: string,
    mimeType: string,
    token: string
): Promise<string> => {
    return TciFileDownloaderModule.download(
        url,
        fileName,
        mimeType,
        token
    );
};

export default TciFileDownloaderModule;