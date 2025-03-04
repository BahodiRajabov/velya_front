declare global {
  interface Window {
    chrome?: {
      runtime?: {
        sendMessage: (
          extensionId: string,
          message: any,
          callback: (response: any) => void
        ) => void;
        lastError?: chrome.runtime.LastError;
      };
    };
  }
}
