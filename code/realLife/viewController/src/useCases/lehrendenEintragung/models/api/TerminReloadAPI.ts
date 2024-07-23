import apiContainer from '../../../../common/api/ApiContainer'
import { Repository } from '../../../../models/repository/common/Repository'
import { Termin } from '../../../../models/Termin'
import { AbstractTermineAPI } from './AbstractTermineAPI'
import { LehrtaetigkeitRepository } from '../../../../models/repository/custom/LehrtaetigkeitRepository'
import { type domainId } from '../../../../models/common/domainId'
import URLs from './URLs'

export class TerminReloadAPI extends AbstractTermineAPI {
    protected endpoint = URLs.meineEinrichtungstermineReloadTermine

    constructor(einrichtungsId: domainId | null = null) {
        super()
        if (einrichtungsId) {
            this.endpoint += '/' + einrichtungsId
        }
    }

    public allTermineUndLehrtaetigkeiten(
        terminIds: domainId[],
    ): [Promise<Repository<Termin>>, Promise<LehrtaetigkeitRepository>] {
        const response = apiContainer.postAndGetJsonResult(
            this.endpoint,
            terminIds,
            this.getQueryParamsWithStagingUserId(),
        )
        return this.allTermineUndLehrtaetigkeitenByResponse(response)
    }
}
