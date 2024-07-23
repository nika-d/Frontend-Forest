import texts from '../../uiTexts/texts.json'
import { UserDisplayableError } from './UserDisplayableError'
import { showNotification } from '../showNotification'
import { QNotifyAction } from 'quasar/dist/types/api'
import ErrorAlert from '../ErrorAlert'

let lastError: Error | null = null
export default (error: Error) => {
    // Vue throws the same error multiple times, so we need to filter them
    if (error == lastError) {
        return
    }
    lastError = error

    let encounter = new ErrorAlert(texts.ERROR_NOTIFICATION_DEFAULT_TEXT, error.message)

    const actions: QNotifyAction[] = []

    if (error instanceof UserDisplayableError) {
        encounter = new ErrorAlert(error.messageHeader, error.messageBody)
        if (error.link) {
            actions.push({
                label: error.link,
                icon: 'open_in_new',
                href: error.link,
                target: '_blank',
                align: 'center',
                size: '0.8rem',
            })
        }
    }

    showNotification(encounter, actions)
}
