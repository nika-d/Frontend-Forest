import { Repository } from '../../../../models/repository/common/Repository'
import { Termin } from '../../../../models/Termin'
import { Veranstaltung } from '../../../../models/Studienstruktur/Veranstaltung'
import { Modul } from '../../../../models/Studienstruktur/Modul'
import { Studiengang } from '../../../../models/Studienstruktur/Studiengang'
import { Raum } from '../../../../models/Raum'
import { Einrichtung } from '../../../../models/Einrichtung'
import { UnterLehrformat } from '../../../../models/Studienstruktur/UnterLehrformat'
import { loadMeineEinrichtungsTermine } from './loadMeineEinrichtungsTermine'
import { loadOtherModels } from './loadOtherModels'
import { Person } from '../../../../models/Person'
import { loadPersonen } from './loadPersonen'
import { loadMeineEinrichtungsTermineStudienstruktur } from './loadMeineEinrichtungsTermineStudienstruktur'
import { LehrtaetigkeitRepository } from '../../../../models/repository/custom/LehrtaetigkeitRepository'
import { LoginInfoAPI } from '../../../../models/api/LoginInfoAPI'
import { EinrichtungAPI } from '../../../../models/api/EinrichtungAPI'
import { getArrayUnique } from '../../../../common/utils/arrayFunctions'
import { domainId } from '../../../../models/common/domainId'
import { AbstractAPI } from '../../../../models/api/AbstractAPI'
import { AllAndDefaultZeitsemester } from '../../../../models/Studienstruktur/AllAndDefaultZeitsemester'
import { LEZeitsemesterAPI } from '../../models/api/LEZeitsemesterAPI'

/**
 * @param zeitsemesterId : if not given, default zeitsemester from API Call is used
 * @param einrichtungsId : if not given, no specific einrichtung is used
 */
export function loadAll(
    zeitsemesterId: domainId | null = null,
    einrichtungsId: domainId | null = null,
): [
    Promise<Repository<Termin>>,
    Promise<LehrtaetigkeitRepository>,
    Promise<Repository<Person>>,
    Promise<Repository<Einrichtung>>,
    Promise<Repository<Veranstaltung>>,
    Promise<Repository<Modul>>,
    Promise<Repository<Studiengang>>,
    Promise<Repository<Raum>>,
    Promise<Repository<UnterLehrformat>>,
    Promise<AllAndDefaultZeitsemester>,
    Promise<Einrichtung[]>,
] {
    const zeitsemesterPromise = new LEZeitsemesterAPI().fetchAllAndDefault()

    const loadEinrTerminePromise = loadMeineEinrichtungsTermine(zeitsemesterId, zeitsemesterPromise, einrichtungsId)
    const terminPromise = loadEinrTerminePromise.then(([terminRepo]) => terminRepo)
    const lehrtaetigkeitPromise = loadEinrTerminePromise.then(([, lehrtaetigkeitRepo]) => lehrtaetigkeitRepo)

    const strukturPromise = loadMeineEinrichtungsTermineStudienstruktur(
        zeitsemesterId,
        zeitsemesterPromise,
        einrichtungsId,
    )
    const veranstaltungPromise = strukturPromise.then(([veranstaltungRepo]) => veranstaltungRepo)
    const modulPromise = strukturPromise.then(([, modulRepo]) => modulRepo)
    const studiengangPromise = strukturPromise.then(([, , studiengangRepo]) => studiengangRepo)

    const personPromise = loadPersonen(lehrtaetigkeitPromise)
    const einrichtungenPromise = new EinrichtungAPI().fetchAll()

    const loginInfoPromise = new LoginInfoAPI().getLoggedInPersonId()
    const loggedInPersonEinrichtungenPromise = Promise.all([
        personPromise,
        einrichtungenPromise,
        loginInfoPromise,
    ]).then(([personRepo, einrichtungRepo, loggedInPersonId]): Einrichtung[] => {
        let person = personRepo.get(loggedInPersonId) as Person
        if (!person && AbstractAPI.stagingDynamicUserId) {
            person = personRepo.get(AbstractAPI.stagingDynamicUserId) as Person
        }
        return getArrayUnique(
            person.einrichtungsFunktionen
                .map((einrFkt) => einrichtungRepo.get(einrFkt.einrichtungsId))
                .flat() as Einrichtung[],
        )
    })

    return [
        terminPromise,
        lehrtaetigkeitPromise,
        personPromise,
        einrichtungenPromise,
        veranstaltungPromise,
        modulPromise,
        studiengangPromise,
        ...loadOtherModels(),
        zeitsemesterPromise,
        loggedInPersonEinrichtungenPromise,
    ]
}
