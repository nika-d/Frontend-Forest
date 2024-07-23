import { Eintragungshindernis } from './Eintragungshindernis'
import uiTextsLE from '../../../../common/uiTexts/lehrendenEintragung.json'
import { TerminViewModel } from '../../viewModel/TerminViewModel'
import { domainId } from '../../../../models/common/domainId'
import ErrorAlert from '../../../../common/alerts/ErrorAlert'

export class EintragungshindernisTreffpunkt implements Eintragungshindernis {
    blocksSaving() {
        return true
    }
    toAlert() {
        return new ErrorAlert(uiTextsLE.ERROR_TERMIN_HAT_EIN_RAUM)
    }
    static createFromTermine(...terminVMs: Array<TerminViewModel>) {
        const eintragungshindernisse = new Map<domainId, EintragungshindernisTreffpunkt>()
        terminVMs.forEach((termin) => {
            if (termin.raumText) {
                eintragungshindernisse.set(termin.id, new EintragungshindernisTreffpunkt())
            }
        })
        return eintragungshindernisse
    }
}
