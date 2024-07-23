import { Repository } from '../../../../../src/models/repository/common/Repository'
import { Person } from '../../../../../src/models/Person'
import { Einrichtung } from '../../../../../src/models/Einrichtung'
import { UnterLehrformat } from '../../../../../src/models/Studienstruktur/UnterLehrformat'
import { Modul } from '../../../../../src/models/Studienstruktur/Modul'
import { Veranstaltung } from '../../../../../src/models/Studienstruktur/Veranstaltung'
import { Studiengang } from '../../../../../src/models/Studienstruktur/Studiengang'
import { Raum } from '../../../../../src/models/Raum'
import { Termin, TerminDTO } from '../../../../../src/models/Termin'
import { Lehrtaetigkeit } from '../../../../../src/models/Lehrtaetigkeit'
import { LehrtaetigkeitRepository } from '../../../../../src/models/repository/custom/LehrtaetigkeitRepository'
import { TerminViewModel } from '../../../../../src/useCases/lehrendenEintragung/viewModel/TerminViewModel'

export const personRepo = new Repository<Person>().addValues([
    new Person({
        id: 'Person-1',
        nachname: 'Meier',
        vorname: 'Petra',
        email: 'petra.meier@charite.de',
        einrichtungsIds: [3, 4],
    }),
    new Person({
        id: 'Person-2',
        nachname: 'Hinterseer',
        vorname: 'Hansi',
        email: 'hansi.hinterseer@charite.de',
        einrichtungsIds: [3, 5],
    }),
    new Person({
        id: 'Person-3',
        nachname: 'Berg',
        vorname: 'Andrea',
        email: 'andrea.berg@charite.de',
        einrichtungsIds: [3],
    }),
])

export const einrichtungRepo = new Repository<Einrichtung>().addValues([
    new Einrichtung({
        id: 3,
        bezeichnungLang: 'CC04 Einrichtung 1 CCM/CVK',
    }),
    new Einrichtung({
        id: 4,
        bezeichnungLang: 'PD - Prodekanat Lehre',
    }),
    new Einrichtung({
        id: 5,
        bezeichnungLang: 'GB IT - IT-Abteilung',
    }),
])

export const unterLehrformatRepo = new Repository<UnterLehrformat>().addValues([
    new UnterLehrformat({
        id: 7,
        titel: 'Fachvorlesung',
        oberLehrformat: 'Vorlesung',
    }),
    new UnterLehrformat({
        id: 8,
        titel: 'Integriertes Seminar',
        oberLehrformat: 'Seminar',
    }),
])

export const modulRepo = new Repository<Modul>().addValues([
    new Modul({
        id: 30,
        titel: 'Einführung',
        code: 'M01',
        fachsemester: 1,
        studiengangId: 10,
    }),
    new Modul({
        id: 31,
        titel: 'Atmung',
        code: 'M05',
        fachsemester: 2,
        studiengangId: 20,
    }),
])

export const veranstaltungRepo = new Repository<Veranstaltung>().addValues([
    new Veranstaltung({
        id: 50,
        modulId: 30,
        langTitel: 'Vorlesung Ströme',
        unterLehrformatId: 7,
    }),
    new Veranstaltung({
        id: 51,
        modulId: 31,
        langTitel: 'Seminar 5',
        unterLehrformatId: 8,
    }),
])

export const studiengangRepo = new Repository<Studiengang>().addValues([
    new Studiengang({
        id: 10,
        code: 'MSM',
    }),
    new Studiengang({
        id: 20,
        code: 'Heb',
    }),
])

export const raeumeRepo = new Repository<Raum>().addValues([
    new Raum({
        id: 80,
        titel: 'VW5, 03.004',
        adresse: 'Virchowweg 5, 10117 Berlin',
    }),
    new Raum({
        id: 81,
        titel: 'Charité Crossover',
        adresse: 'Virchowweg 3',
    }),
])

export const terminDTOs: Partial<TerminDTO>[] = [
    {
        id: 'Termin1',
        gruppenbezeichnung: '11a-12b',
        treffpunkt: 'hier',
        campus: 'CCM',
        raumId: 80,
        start: '2022-01-10T14:30:00+01:00',
        ende: '2022-01-10T16:00:00+01:00',
        veranstaltungsId: 50,
        geplanteEinrichtungen: [3, 4],
    },
    {
        id: 'Termin2',
        gruppenbezeichnung: '1a',
        campus: 'CVK',
        start: '2022-02-19T10:00:00+01:00',
        ende: '2022-02-19T12:00:00+01:00',
        veranstaltungsId: 51,
        geplanteEinrichtungen: [5],
    },
    {
        id: 'Termin3',
        gruppenbezeichnung: '5',
        campus: 'CBF',
        start: '2023-01-01T10:00:00+01:00',
        ende: '2022-01-01T12:00:00+01:00',
        veranstaltungsId: 51,
        geplanteEinrichtungen: [3],
        ohneLehrendeMitMeinerGeplantenEinrichtung: true,
    },
]

export const termine = terminDTOs.map((terminDTO) => new Termin(terminDTO))

export const terminRepo = new Repository<Termin>().addValues(termine)

export const lehrtaetigkeitDTOs: Partial<Lehrtaetigkeit>[] = [
    {
        id: 1000,
        terminId: 'Termin1',
        personId: 'Person-1',
        einrichtungsId: 3,
    },
    {
        id: 1001,
        terminId: 'Termin1',
        personId: 'Person-2',
        einrichtungsId: 3,
        isVertretung: true,
    },
    {
        id: 1002,
        terminId: 'Termin2',
        personId: 'Person-2',
        einrichtungsId: 4,
        ungeplanteEinrichtung: true,
        isVertretung: false,
    },
]

export const lehrtaetigkeitenRepo = new LehrtaetigkeitRepository(
    lehrtaetigkeitDTOs.map((dto) => new Lehrtaetigkeit(dto)),
)

export const allTestRepos = {
    termine: terminRepo,
    lehrtaetigkeiten: lehrtaetigkeitenRepo,
    module: modulRepo,
    einrichtungen: einrichtungRepo,
    personen: personRepo,
    raeume: raeumeRepo,
    studiengaenge: studiengangRepo,
    unterLehrformate: unterLehrformatRepo,
    veranstaltungen: veranstaltungRepo,
}

export function createTerminVMs(): TerminViewModel[] {
    return TerminViewModel.fromRepos({
        termine: terminRepo,
        lehrtaetigkeiten: lehrtaetigkeitenRepo,
        module: modulRepo,
        einrichtungen: einrichtungRepo,
        personen: personRepo,
        raeume: raeumeRepo,
        studiengaenge: studiengangRepo,
        unterLehrformate: unterLehrformatRepo,
        veranstaltungen: veranstaltungRepo,
    })
}
