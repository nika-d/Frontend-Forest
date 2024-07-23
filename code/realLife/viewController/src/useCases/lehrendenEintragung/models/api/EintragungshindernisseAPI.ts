import apiContainer from '../../../../common/api/ApiContainer'
import { type JSONValue } from '../../../../common/api/JSON'
import {
    Eintragungshindernisse,
    EintragungshindernisseDTO,
} from '../Eintragungshindernis/Eintragungshindernisse'
import { type domainId } from '../../../../models/common/domainId'
import URLs from './URLs'

export class EintragungshindernisseAPI {
    protected endpoint = URLs.lehrTaetigkeitEintragungshindernisse

    public async fetchEintragungshindernisseForLehrtaetigkeit(
        terminId: domainId,
        personId: domainId,
    ): Promise<Eintragungshindernisse> {
        return this.fetchEintragungshindernisseForOnePerson([terminId], personId).then(
            (eintragungshindernisseArray: Eintragungshindernisse[]) => eintragungshindernisseArray[0],
        )
    }
    public async fetchEintragungshindernisseForOnePerson(
        terminIds: domainId[],
        personId: domainId,
    ): Promise<Eintragungshindernisse[]> {
        return this.fetchAll(terminIds, [personId])
    }

    public async fetchAll(terminIds: domainId[], personIds: domainId[]): Promise<Eintragungshindernisse[]> {
        const data = { lehrendenIds: personIds, terminIds }
        return apiContainer.postAndGetJsonResult(this.endpoint, data).then((answer: JSONValue) => {
            return (answer as JSONValue[]).map(
                (value) => new Eintragungshindernisse(value as Partial<EintragungshindernisseDTO>),
            )
        })
    }
}
