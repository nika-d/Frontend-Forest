import Alert from '../../../../common/alerts/Alert'

export interface Eintragungshindernis {
    blocksSaving: () => boolean
    toAlert: () => Alert
}
