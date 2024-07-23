import { domainId } from '../../../models/common/domainId'
import { Einrichtung } from '../../../models/Einrichtung'
import { Person } from '../../../models/Person'
import { LehrtaetigkeitViewModel } from './LehrtaetigkeitViewModel'

export interface LehrtaetigkeitFormData {
    terminId: domainId
    person: Person | undefined
    isVertretung: boolean
    einrichtung: Einrichtung | undefined

    isMarkedToBeDeleted: boolean
    isEditMode: boolean
    isNew: boolean
    lehrtaetigkeitViewModel: LehrtaetigkeitViewModel | null
}
