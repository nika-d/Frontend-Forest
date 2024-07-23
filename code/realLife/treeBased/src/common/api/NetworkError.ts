import texts from '../uiTexts/texts.json'
import { UserDisplayableError } from '../alerts/error/UserDisplayableError'

export class NetworkError extends UserDisplayableError {
    constructor(public originalError: Error) {
        super(originalError.message, texts.ERROR_HEADING_NETWORK, originalError.message)
    }
}
