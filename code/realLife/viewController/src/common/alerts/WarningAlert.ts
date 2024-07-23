import Alert from './Alert'

export default class WarningAlert extends Alert {
    constructor(messageMain?: string, messageDetail?: string, dataTestId?: string, iconName?: string) {
        super(messageMain, messageDetail, dataTestId, iconName ?? 'warning_amber', 'warning', 'orange-2')
    }
}
