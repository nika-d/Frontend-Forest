import Alert from './Alert'

export default class SuccessAlert extends Alert {
    constructor(messageMain?: string, messageDetail?: string, dataTestId?: string, iconName?: string) {
        super(messageMain, messageDetail, dataTestId, iconName ?? 'task_alt', 'positive', 'green-2')
    }
}
