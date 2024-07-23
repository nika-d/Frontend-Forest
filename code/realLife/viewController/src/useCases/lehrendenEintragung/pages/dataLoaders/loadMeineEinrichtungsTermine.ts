import { MeineEinrichtungstermineAPI } from '../../models/api/MeineEinrichtungstermineAPI'
import { Repository } from '../../../../models/repository/common/Repository'
import { Termin } from '../../../../models/Termin'
import { LehrtaetigkeitRepository } from '../../../../models/repository/custom/LehrtaetigkeitRepository'
import { domainId } from '../../../../models/common/domainId'
import { AllAndDefaultZeitsemester } from '../../../../models/Studienstruktur/AllAndDefaultZeitsemester'

export function loadMeineEinrichtungsTermine(
    zeitsemester: domainId | null,
    zeitsemesterPromise: Promise<AllAndDefaultZeitsemester>,
    einrichtungsId: domainId | null = null,
): Promise<[Promise<Repository<Termin>>, Promise<LehrtaetigkeitRepository>]> {
    return zeitsemesterPromise.then((allAndDefaultZeitsemester) => {
        const terminApi = new MeineEinrichtungstermineAPI(
            zeitsemester || allAndDefaultZeitsemester.defaultZeitsemester.id,
            einrichtungsId,
        )
        return terminApi.allTermineUndLehrtaetigkeiten()
    })
}
