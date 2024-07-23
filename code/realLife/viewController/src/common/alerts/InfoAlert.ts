import Alert from './Alert'

export default class InfoAlert extends Alert {
    constructor(messageMain?: string, messageDetail?: string, dataTestId?: string, iconName?: string) {
        super(messageMain, messageDetail, dataTestId, iconName ?? 'info_outline', 'primary', 'secondary')
    }
}
