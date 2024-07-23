import { AbstractAPI } from '../../../../models/api/AbstractAPI'
import { Repository } from '../../../../models/repository/common/Repository'
import { type TerminLehrtaetigkeitenApiDTO, Lehrtaetigkeit } from '../../../../models/Lehrtaetigkeit'
import { Termin } from '../../../../models/Termin'
import { LehrtaetigkeitRepository } from '../../../../models/repository/custom/LehrtaetigkeitRepository'
import { type JSONValue } from '../../../../common/api/JSON'

// eslint-disable-next-line  @typescript-eslint/no-explicit-any
export abstract class AbstractTermineAPI extends AbstractAPI<any> {
    protected allTermineUndLehrtaetigkeitenByResponse(
        response: Promise<JSONValue>,
    ): [Promise<Repository<Termin>>, Promise<LehrtaetigkeitRepository>] {
        const terminRepoPromise = this.createCommonRepositoryFromApiResponse(response, Termin) as Promise<
            Repository<Termin>
        >
        const lehrtaetigkeitRepoPromise = response.then(
            (jsonArray: JSONValue) =>
                new LehrtaetigkeitRepository(
                    (jsonArray as JSONValue[])
                        .map((json) => Lehrtaetigkeit.fromTerminJson(json as unknown as TerminLehrtaetigkeitenApiDTO))
                        .flat(),
                ),
        )

        return [terminRepoPromise, lehrtaetigkeitRepoPromise]
    }
}
