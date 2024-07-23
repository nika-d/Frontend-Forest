import apiContainer from '../../../../common/api/ApiContainer'
import { type domainId } from '../../../../models/common/domainId'
import URLs from './URLs'

export class TreffpunktEditAPI {
    protected endpoint = URLs.termineTreffpunkt + '/'

    public executeUpdate(terminId: domainId, treffpunkt: string | null): Promise<void> {
        return apiContainer.put(this.endpoint + terminId, null, { treffpunkt: treffpunkt ?? '' })
    }
}
