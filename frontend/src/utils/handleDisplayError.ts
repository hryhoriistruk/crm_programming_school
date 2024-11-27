import { IError } from '../interfaces';

export const handleDisplayError = (error: IError): string => {
    const { message, statusCode } = error;

    let errorMsg: string;

    switch (statusCode) {
        case 400:
            errorMsg = message;
            break;
        case 401:
            errorMsg = 'Unauthorized Access';
            break;
        default:
            errorMsg = 'Something went wrong. Please try again later.';
            break;
    }

    return errorMsg;
};
