export type ResponseSender = (response: any) => void;
export type TaskHandler = (request: any, sendResponse: ResponseSender) => void; 