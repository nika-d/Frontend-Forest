import texts from '../uiTexts/texts.json'
import { type JSONValue } from './JSON'
import { UserDisplayableError } from '../alerts/error/UserDisplayableError'

export class RequestNotSuccessfulError extends UserDisplayableError {
    constructor(
        response: Response,
        public readonly responseJson: JSONValue | null = null,
    ) {
        let message = ''
        if (responseJson && responseJson['errorCode' as keyof JSONValue]) {
            message += responseJson['errorCode' as keyof JSONValue]
        }
        if (responseJson && responseJson['errorMessage' as keyof JSONValue]) {
            message = message ? message + ': ' : ''
            message += responseJson['errorMessage' as keyof JSONValue]
        }
        if (!message) {
            message = response.statusText
        }

        super(message, texts.ERROR_HEADING_GENERAL, message, null, response.status)
    }
}
