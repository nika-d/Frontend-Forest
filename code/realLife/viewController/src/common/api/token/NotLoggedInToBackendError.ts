import texts from '../../uiTexts/texts.json'
import { UserDisplayableError } from '../../alerts/error/UserDisplayableError'

export class NotLoggedInToBackendError extends UserDisplayableError {
    constructor(public readonly loginLink = null) {
        super('NotLoggedInToBackend', texts.ERROR_HEADING_NOT_LOGGED_IN, texts.ERROR_NOT_LOGGED_IN, loginLink)
    }
}
