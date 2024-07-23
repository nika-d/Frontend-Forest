import { AbstractTermineAPI } from './AbstractTermineAPI'
import { Repository } from '../../../../models/repository/common/Repository'
import { Termin } from '../../../../models/Termin'
import { LehrtaetigkeitRepository } from '../../../../models/repository/custom/LehrtaetigkeitRepository'
import apiContainer from '../../../../common/api/ApiContainer'
import { type domainId } from '../../../../models/common/domainId'
import URLs from './URLs'

export class MeineEinrichtungstermineAPI extends AbstractTermineAPI {
    protected endpoint = URLs.meineEinrichtungstermine

    allTermineUndLehrtaetigkeiten(): [Promise<Repository<Termin>>, Promise<LehrtaetigkeitRepository>] {
        const response = apiContainer.get(this.endpoint, this.getQueryParamsWithStagingUserId())
        return this.allTermineUndLehrtaetigkeitenByResponse(response)
    }
    constructor(zeitsemester: domainId, einrichtungsId: domainId | null = null) {
        super()
        this.endpoint += '/' + zeitsemester
        if (einrichtungsId) {
            this.endpoint += '/' + einrichtungsId
        }
    }
}
