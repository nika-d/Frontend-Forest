import tags from '../../../test/data-testid-COMPONENTS'

export default abstract class Alert {
    constructor(
        readonly messageMain: string = 'Not defined',
        readonly messageDetail: string = '',
        readonly dataTestId: string = tags.NOTIFICATION,
        readonly iconName: string = 'help_outline',
        readonly iconColor: string = '',
        readonly bgColor: string = '',
        readonly textColor: string = 'black',
    ) {}
}
