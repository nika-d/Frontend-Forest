import { Terminkonflikt } from './Terminkonflikt'
import uiTexts from '../../../../common/uiTexts/lehrendenEintragung.json'
import { Eintragungshindernis } from './Eintragungshindernis'
import ErrorAlert from '../../../../common/alerts/ErrorAlert'
import WarningAlert from '../../../../common/alerts/WarningAlert'

export abstract class EintragungshindernisLehrtaetigkeit implements Eintragungshindernis {
    abstract readonly terminKonflikte: Terminkonflikt[]
    abstract readonly ungeplanteEinrichtung: boolean
    abstract readonly lehrberechtigungFehlt: boolean
    abstract readonly qualifikationFehlt: string | null
    abstract readonly abweichenderLehrender: boolean

    abstract blocksSaving(): boolean
    toAlert() {
        if (this.lehrberechtigungFehlt) {
            return new ErrorAlert(uiTexts.ERROR_KEINE_LEHRBERECHTIGUNG)
        }

        if (this.qualifikationFehlt) {
            return new ErrorAlert(uiTexts.ERROR_KEINE_QUALIFIKATION + this.qualifikationFehlt + '.')
        }

        if (this?.terminKonflikte.length > 0) {
            let messageText = ''
            if (this.terminKonflikte.length >= 2) {
                messageText = this.terminKonflikte.length + uiTexts.ERROR_MANY_TERMINKONFLIKTE
                let counter = 1
                this.terminKonflikte.forEach(
                    (terminKonflikt) => (messageText += ' (' + counter++ + ') ' + terminKonflikt.terminBeschreibung),
                )
            } else {
                messageText = uiTexts.ERROR_ONE_TERMINKONFLIKT + this.terminKonflikte[0].terminBeschreibung
            }
            return new ErrorAlert(messageText, undefined, undefined, 'event_busy')
        }

        if (this.abweichenderLehrender) {
            return new WarningAlert(uiTexts.WARNING_ABWEICHENDER_LEHRENDER_TERMINREIHE)
        }

        if (this.ungeplanteEinrichtung) {
            return new WarningAlert(uiTexts.WARNING_FALSCHE_EINRICHTUNG_KONKRET)
        }

        throw new Error('Ungültiges Eintragungshindernis. ' + JSON.stringify(this))
    }
}
