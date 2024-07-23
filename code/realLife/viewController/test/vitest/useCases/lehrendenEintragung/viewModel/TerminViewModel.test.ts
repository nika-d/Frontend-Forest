import { TerminViewModel, TerminVmDTO } from '../../../../../src/useCases/lehrendenEintragung/viewModel/TerminViewModel'
import Timespan from '../../../../../src/models/common/Timespan'
import {
    einrichtungRepo,
    lehrtaetigkeitenRepo,
    modulRepo,
    personRepo,
    raeumeRepo,
    studiengangRepo,
    terminRepo,
    unterLehrformatRepo,
    veranstaltungRepo,
} from './terminViewModelTestData'
import { LehrtaetigkeitViewModel } from '../../../../../src/useCases/lehrendenEintragung/viewModel/LehrtaetigkeitViewModel'
import { Veranstaltung } from '../../../../../src/models/Studienstruktur/Veranstaltung'
import { Repository } from '../../../../../src/models/repository/common/Repository'
import { UnterLehrformat } from '../../../../../src/models/Studienstruktur/UnterLehrformat'
import { Studiengang } from '../../../../../src/models/Studienstruktur/Studiengang'
import { Raum } from '../../../../../src/models/Raum'
import { Person } from '../../../../../src/models/Person'
import { Einrichtung } from '../../../../../src/models/Einrichtung'
import { Modul } from '../../../../../src/models/Studienstruktur/Modul'

describe('Termin View Model', () => {
    describe('constructor', () => {
        it('should create a ViewModel', async () => {
            const dto: TerminVmDTO = {
                id: 'Termin1',
                gruppenbezeichnung: 'Gruppe 1',
                treffpunkt: 'Treffpunkt 1',
                campus: 'Campus 1',
                ohneLehrendeMitMeinerGeplantenEinrichtung: true,
                timespan: new Timespan('2021-04-01T10:00:00.000Z', '2021-04-01T12:00:00.000Z'),
                veranstaltungLangTitel: 'Veranstaltung 1',
                unterLehrformat: 'Vorlesung',
                oberLehrformat: 'Vorlesung',
                fachsemester: 1,
                modulCode: 'Modul 1',
                modulTitel: 'Einführung',
                studiengangCode: 'Studiengang 1',
                raumText: 'Raum 1',
                geplanteEinrichtungen: [],
                lehrtaetigkeiten: [],
            }
            const terminVM = new TerminViewModel(dto)
            expect(terminVM).instanceOf(TerminViewModel)
            expect(terminVM.modulBezeichnung).toEqual('Modul 1 Einführung')
            Object.keys(dto).forEach((key) => {
                expect(terminVM[key]).toEqual(dto[key])
            })
        })

        it('should be able to create a ViewModel without optional fields', async () => {
            const dto: Partial<TerminVmDTO> = {
                id: 'Termin1',
                gruppenbezeichnung: 'Gruppe 1',
                timespan: new Timespan('2021-04-01T10:00:00.000Z', '2021-04-01T12:00:00.000Z'),
                veranstaltungLangTitel: 'Veranstaltung 1',
                unterLehrformat: 'Vorlesung',
                oberLehrformat: 'Vorlesung',
                fachsemester: 1,
                modulTitel: 'Modul 1',
                studiengangCode: 'Studiengang 1',
            }
            const terminVM = new TerminViewModel(dto)
            expect(terminVM).instanceOf(TerminViewModel)
            Object.keys(dto).forEach((key) => {
                expect(terminVM[key]).toEqual(dto[key])
            })
            expect(terminVM.treffpunkt).toBeNull()
            expect(terminVM.campus).toBeNull()
            expect(terminVM.modulCode).toBeNull()
            expect(terminVM.raumText).toBeNull()
            expect(terminVM.ohneLehrendeMitMeinerGeplantenEinrichtung).toBeFalsy()
            expect(terminVM.geplanteEinrichtungen).toEqual([])
            expect(terminVM.lehrtaetigkeiten).toEqual([])
        })

        it('computes "ungeplanteEinrichtung" dependent on lehrtaetigkeiten', async () => {
            const dto: Partial<TerminVmDTO> = {
                id: 'Termin1',
                gruppenbezeichnung: 'Gruppe 1',
                timespan: new Timespan('2021-04-01T10:00:00.000Z', '2021-04-01T12:00:00.000Z'),
                veranstaltungLangTitel: 'Veranstaltung 1',
                unterLehrformat: 'Vorlesung',
                oberLehrformat: 'Vorlesung',
                fachsemester: 1,
                modulTitel: 'Modul 1',
                studiengangCode: 'Studiengang 1',
            }
            const terminVM = new TerminViewModel(dto)

            expect(terminVM.ungeplanteEinrichtung).toBeFalsy()

            const lehrtaetigkeitDtoUngeplant = {
                id: 1,
                terminId: 'Termin1',
                person: new Person({
                    id: 'Person-3',
                    nachname: 'Berg',
                    vorname: 'Andrea',
                    email: 'andrea.berg@charite.de',
                }),
                einrichtung: new Einrichtung({ id: 5, bezeichnungLang: 'Einrichtung 5' }),
                ungeplanteEinrichtung: true,
            }
            const terminVM2 = new TerminViewModel({
                ...dto,
                lehrtaetigkeiten: [new LehrtaetigkeitViewModel(lehrtaetigkeitDtoUngeplant)],
            })

            expect(terminVM2.ungeplanteEinrichtung).toBeTruthy()

            const lehrtaetigkeitDtoGeplant = { ...lehrtaetigkeitDtoUngeplant }
            lehrtaetigkeitDtoGeplant.ungeplanteEinrichtung = false
            const terminVM3 = new TerminViewModel({
                ...dto,
                lehrtaetigkeiten: [
                    new LehrtaetigkeitViewModel(lehrtaetigkeitDtoUngeplant),
                    new LehrtaetigkeitViewModel(lehrtaetigkeitDtoGeplant),
                ],
            })

            expect(terminVM3.ungeplanteEinrichtung).toBeTruthy()

            const terminVM4 = new TerminViewModel({
                ...dto,
                lehrtaetigkeiten: [
                    new LehrtaetigkeitViewModel(lehrtaetigkeitDtoGeplant),
                    new LehrtaetigkeitViewModel(lehrtaetigkeitDtoGeplant),
                ],
            })

            expect(terminVM4.ungeplanteEinrichtung).toBeFalsy()
        })
    })

    describe('fromRepos', () => {
        it('should create an array of viewModels by the repos given, fetching all data matching by id ', () => {
            const terminVMs = TerminViewModel.fromRepos({
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
            expect(terminVMs).toHaveLength(3)
            expect(terminVMs[0]).toBeInstanceOf(TerminViewModel)

            const comparedTermin = new TerminViewModel({
                id: 'Termin1',
                gruppenbezeichnung: '11a-12b',
                treffpunkt: 'hier',
                campus: 'CCM',
                ohneLehrendeMitMeinerGeplantenEinrichtung: false,
                timespan: new Timespan('2022-01-10T14:30:00+01:00', '2022-01-10T16:00:00+01:00'),
                veranstaltungLangTitel: 'Vorlesung Ströme',
                unterLehrformat: 'Fachvorlesung',
                oberLehrformat: 'Vorlesung',
                fachsemester: 1,
                modulCode: 'M01',
                modulTitel: 'Einführung',
                studiengangCode: 'MSM',
                raumText: 'VW5, 03.004, Virchowweg 5, 10117 Berlin',
                geplanteEinrichtungen: [einrichtungRepo.get(3), einrichtungRepo.get(4)],
                lehrtaetigkeiten: LehrtaetigkeitViewModel.fromRepos({
                    lehrtaetigkeiten: lehrtaetigkeitenRepo.allByTerminId('Termin1'),
                    personen: personRepo,
                    einrichtungen: einrichtungRepo,
                }),
            })

            expect(terminVMs[0]).toEqual(comparedTermin)
        })

        it('should throw an error if veranstaltung is not found in repo', () => {
            expect(() =>
                TerminViewModel.fromRepos({
                    termine: terminRepo,
                    lehrtaetigkeiten: lehrtaetigkeitenRepo,
                    module: modulRepo,
                    einrichtungen: einrichtungRepo,
                    personen: personRepo,
                    raeume: raeumeRepo,
                    studiengaenge: studiengangRepo,
                    unterLehrformate: unterLehrformatRepo,
                    veranstaltungen: new Repository<Veranstaltung>(),
                }),
            ).toThrow('Veranstaltung not found: 50')
        })

        it('should throw an error if unterLehrformat is not found in repo', () => {
            expect(() =>
                TerminViewModel.fromRepos({
                    termine: terminRepo,
                    lehrtaetigkeiten: lehrtaetigkeitenRepo,
                    module: modulRepo,
                    einrichtungen: einrichtungRepo,
                    personen: personRepo,
                    raeume: raeumeRepo,
                    studiengaenge: studiengangRepo,
                    unterLehrformate: new Repository<UnterLehrformat>(),
                    veranstaltungen: veranstaltungRepo,
                }),
            ).toThrow('UnterLehrformat not found: 7')
        })

        it('should throw an error if studiengang is not found in repos ', () => {
            expect(() =>
                TerminViewModel.fromRepos({
                    termine: terminRepo,
                    lehrtaetigkeiten: lehrtaetigkeitenRepo,
                    module: modulRepo,
                    einrichtungen: einrichtungRepo,
                    personen: personRepo,
                    raeume: raeumeRepo,
                    studiengaenge: new Repository<Studiengang>(),
                    unterLehrformate: unterLehrformatRepo,
                    veranstaltungen: veranstaltungRepo,
                }),
            ).toThrow('Studiengang not found: 10')
        })

        it('should throw an error if raum is not found in repo', () => {
            expect(() =>
                TerminViewModel.fromRepos({
                    termine: terminRepo,
                    lehrtaetigkeiten: lehrtaetigkeitenRepo,
                    module: modulRepo,
                    einrichtungen: einrichtungRepo,
                    personen: personRepo,
                    raeume: new Repository<Raum>(),
                    studiengaenge: studiengangRepo,
                    unterLehrformate: unterLehrformatRepo,
                    veranstaltungen: veranstaltungRepo,
                }),
            ).toThrow('Raum not found: 80')
        })

        it('should throw an error if person is not found in repo', () => {
            expect(() =>
                TerminViewModel.fromRepos({
                    termine: terminRepo,
                    lehrtaetigkeiten: lehrtaetigkeitenRepo,
                    module: modulRepo,
                    einrichtungen: einrichtungRepo,
                    personen: new Repository<Person>(),
                    raeume: raeumeRepo,
                    studiengaenge: studiengangRepo,
                    unterLehrformate: unterLehrformatRepo,
                    veranstaltungen: veranstaltungRepo,
                }),
            ).toThrow('Person not found: Person-1')
        })

        it('should throw an error if einrichtung is not found in repo', () => {
            expect(() =>
                TerminViewModel.fromRepos({
                    termine: terminRepo,
                    lehrtaetigkeiten: lehrtaetigkeitenRepo,
                    module: modulRepo,
                    einrichtungen: new Repository<Einrichtung>(),
                    personen: personRepo,
                    raeume: raeumeRepo,
                    studiengaenge: studiengangRepo,
                    unterLehrformate: unterLehrformatRepo,
                    veranstaltungen: veranstaltungRepo,
                }),
            ).toThrow('Einrichtung not found: 3')
        })

        it('should throw an error if modul is not found in repo', () => {
            expect(() =>
                TerminViewModel.fromRepos({
                    termine: terminRepo,
                    lehrtaetigkeiten: lehrtaetigkeitenRepo,
                    module: new Repository<Modul>(),
                    einrichtungen: einrichtungRepo,
                    personen: personRepo,
                    raeume: raeumeRepo,
                    studiengaenge: studiengangRepo,
                    unterLehrformate: unterLehrformatRepo,
                    veranstaltungen: veranstaltungRepo,
                }),
            ).toThrow('Modul not found: 3')
        })
    })

    describe('reactivity', () => {
        let terminVM: TerminViewModel
        beforeEach(() => {
            const dto: Partial<TerminVmDTO> = {
                id: 'Termin1',
                gruppenbezeichnung: 'Gruppe 1',
                timespan: new Timespan('2021-04-01T10:00:00.000Z', '2021-04-01T12:00:00.000Z'),
                veranstaltungLangTitel: 'Veranstaltung 1',
                unterLehrformat: 'Vorlesung',
                oberLehrformat: 'Vorlesung',
                fachsemester: 1,
                modulTitel: 'Modul 1',
                studiengangCode: 'Studiengang 1',
                ohneLehrendeMitMeinerGeplantenEinrichtung: true,
            }
            terminVM = new TerminViewModel(dto)
        })

        it('can update treffpunkt', () => {
            expect(terminVM.treffpunkt).toEqual(null)
            terminVM.updateTreffpunkt('Treffpunkt 1')
            expect(terminVM.treffpunkt).toEqual('Treffpunkt 1')
        })

        it('can update "ohneLehrendeMitMeinerGeplantenEinrichtung"', () => {
            expect(terminVM.ohneLehrendeMitMeinerGeplantenEinrichtung).toBeTruthy()

            terminVM.updateOhneLehrendeMitMeinerGeplantenEinrichtung(false)
            expect(terminVM.ohneLehrendeMitMeinerGeplantenEinrichtung).toBeFalsy()
        })
        it('can update "lehrtaetigkeiten", re-computing "ungeplanteEinrichtung"', () => {
            expect(terminVM.ungeplanteEinrichtung).toBeFalsy()

            terminVM.updateLehrtaetigkeiten([
                new LehrtaetigkeitViewModel({
                    id: 1,
                    terminId: 'Termin1',
                    person: new Person({
                        id: 'Person-3',
                        nachname: 'Berg',
                        vorname: 'Andrea',
                        email: 'andrea.berg@charite.de',
                    }),
                    einrichtung: new Einrichtung({ id: 5, bezeichnungLang: 'Einrichtung 5' }),
                    ungeplanteEinrichtung: true,
                }),
            ])
            expect(terminVM.ungeplanteEinrichtung).toBeTruthy()
        })
    })
})
