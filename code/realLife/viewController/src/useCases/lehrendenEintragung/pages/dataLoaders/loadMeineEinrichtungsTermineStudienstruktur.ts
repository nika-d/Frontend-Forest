import { Repository } from '../../../../models/repository/common/Repository'
import { StudienstrukturFuerMeineEinrichtungstermineAPI } from '../../models/api/StudienstrukturFuerMeineEinrichtungstermineAPI'
import { Veranstaltung } from '../../../../models/Studienstruktur/Veranstaltung'
import { Modul } from '../../../../models/Studienstruktur/Modul'
import { Studiengang } from '../../../../models/Studienstruktur/Studiengang'
import { domainId } from '../../../../models/common/domainId'
import { AllAndDefaultZeitsemester } from '../../../../models/Studienstruktur/AllAndDefaultZeitsemester'

export function loadMeineEinrichtungsTermineStudienstruktur(
    zeitsemester: domainId | null,
    zeitsemesterPromise: Promise<AllAndDefaultZeitsemester>,
    einrichtungsId: domainId | null = null,
): Promise<[Promise<Repository<Veranstaltung>>, Promise<Repository<Modul>>, Promise<Repository<Studiengang>>]> {
    return zeitsemesterPromise.then((allAndDefaultZeitsemester) => {
        const strukturApi = new StudienstrukturFuerMeineEinrichtungstermineAPI(
            zeitsemester || allAndDefaultZeitsemester.defaultZeitsemester.id,
            einrichtungsId,
        )
        return strukturApi.allStrukturModels()
    })
}
