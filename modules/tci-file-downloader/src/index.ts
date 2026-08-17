import TciFileDownloaderModule from "./TciFileDownloaderModule";

export const downloadFile = async (
    url: string,
    fileName: string,
    mimeType: string,
    token: string
): Promise<string> => {
    return await TciFileDownloaderModule.download(
        url,
        fileName,
        mimeType,
        token
    );
};
