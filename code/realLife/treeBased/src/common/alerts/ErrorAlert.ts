import Alert from './Alert'

export default class ErrorAlert extends Alert {
    constructor(messageMain?: string, messageDetail?: string, dataTestId?: string, iconName?: string) {
        super(messageMain, messageDetail, dataTestId, iconName ?? 'warning_amber', 'negative', 'red-2')
    }
}
