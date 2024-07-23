import texts from '../uiTexts/lehrendenEintragung.json'
import { UserDisplayableError } from '../alerts/error/UserDisplayableError'

export class LehrenderSchonEingetragenError extends UserDisplayableError {
    constructor() {
        super(
            'LEHRENDER_SCHON_EINGETRAGEN',
            texts.ERROR_LEHRENDER_SCHON_EINGETRAGEN,
            texts.ERROR_LEHRENDER_SCHON_EINGETRAGEN_BODY,
        )
    }
}
