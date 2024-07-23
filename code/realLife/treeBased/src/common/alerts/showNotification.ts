import { Notify } from 'quasar'
import { QNotifyAction } from 'quasar/dist/types/api'
import Alert from './Alert'

export function showNotification(encounter: Alert, actions: QNotifyAction[] = []) {
    actions.push({
        icon: 'close',
        color: encounter.iconColor,
        size: '0.7rem',
        round: true,
        style: 'position: absolute; top: 0rem; right: -2.0rem; padding: 1rem',
    })

    Notify.create({
        message: encounter.messageMain,
        caption: encounter.messageDetail,
        textColor: encounter.textColor,
        color: encounter.bgColor,
        icon: encounter.iconName,
        iconColor: encounter.iconColor,
        position: 'top-right',
        actions,
        attrs: {
            style: 'width: 30rem; padding-right: 2rem',
            'data-testid': encounter.dataTestId,
        },
    })
}
