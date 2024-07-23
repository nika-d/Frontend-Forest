import { einrichtungRepo, lehrtaetigkeitenRepo, personRepo } from './terminViewModelTestData'
import {
    LehrtaetigkeitViewModel,
    LehrtaetigkeitVmDTO,
} from '../../../../../src/useCases/lehrendenEintragung/viewModel/LehrtaetigkeitViewModel'
import { Repository } from '../../../../../src/models/repository/common/Repository'
import { Person } from '../../../../../src/models/Person'
import { Einrichtung } from '../../../../../src/models/Einrichtung'

describe('Lehrtaetigkeit View Model', () => {
    describe('constructor', () => {
        it('should create a ViewModel', async () => {
            const dto: LehrtaetigkeitVmDTO = {
                id: 123,
                terminId: 'Termin1',
                einrichtung: new Einrichtung({ id: 1, bezeichnungLang: 'Einrichtung 1' }),
                person: new Person({
                    id: 'Person-1',
                    nachname: 'Meier',
                    vorname: 'Petra',
                    email: 'a@b.de',
                }),
                isVertretung: true,
                ungeplanteEinrichtung: true,
            }
            const lehrtaetigkeitVM = new LehrtaetigkeitViewModel(dto)
            expect(lehrtaetigkeitVM).instanceOf(LehrtaetigkeitViewModel)
            Object.keys(dto).forEach((key) => {
                expect(lehrtaetigkeitVM[key]).toEqual(dto[key])
            })
        })

        it('should be able to create a ViewModel without optional fields', async () => {
            const dto: Partial<LehrtaetigkeitVmDTO> = {
                id: 123,
                terminId: 'Termin1',
                einrichtung: new Einrichtung({ id: 1, bezeichnungLang: 'Einrichtung 1' }),
                person: new Person({
                    id: 'Person-1',
                    nachname: 'Meier',
                    vorname: 'Petra',
                    email: 'a@b.de',
                }),
            }
            const lehrtaetigkeitVM = new LehrtaetigkeitViewModel(dto)
            expect(lehrtaetigkeitVM).instanceOf(LehrtaetigkeitViewModel)
            Object.keys(dto).forEach((key) => {
                expect(lehrtaetigkeitVM[key]).toEqual(dto[key])
            })
            expect(lehrtaetigkeitVM.isVertretung).toBeFalsy()
            expect(lehrtaetigkeitVM.ungeplanteEinrichtung).toBeFalsy()
        })
    })
    describe('fromRepos', () => {
        it('should create an array of viewModels by the repos given, fetching all data matching by id ', () => {
            const lehrtaetigkeitVMs = LehrtaetigkeitViewModel.fromRepos({
                lehrtaetigkeiten: lehrtaetigkeitenRepo.allByTerminId('Termin1'),
                einrichtungen: einrichtungRepo,
                personen: personRepo,
            })
            expect(lehrtaetigkeitVMs).toHaveLength(2)
            expect(lehrtaetigkeitVMs[0]).toBeInstanceOf(LehrtaetigkeitViewModel)

            expect(lehrtaetigkeitVMs[0]).toEqual(
                new LehrtaetigkeitViewModel({
                    id: 1000,
                    terminId: 'Termin1',
                    einrichtung: new Einrichtung({ id: 3, bezeichnungLang: 'CC04 Einrichtung 1 CCM/CVK' }),
                    person: new Person({
                        id: 'Person-1',
                        nachname: 'Meier',
                        vorname: 'Petra',
                        email: 'petra.meier@charite.de',
                        einrichtungsIds: [3, 4],
                    }),
                }),
            )
        })

        it('should throw an error if person is not found in repo', () => {
            expect(() =>
                LehrtaetigkeitViewModel.fromRepos({
                    lehrtaetigkeiten: lehrtaetigkeitenRepo.allByTerminId('Termin1'),
                    einrichtungen: einrichtungRepo,
                    personen: new Repository<Person>(),
                }),
            ).toThrow('Person not found: Person-1')
        })

        it('should throw an error if einrichtung is not found in repo', () => {
            expect(() =>
                LehrtaetigkeitViewModel.fromRepos({
                    lehrtaetigkeiten: lehrtaetigkeitenRepo.allByTerminId('Termin1'),
                    einrichtungen: new Repository<Einrichtung>(),
                    personen: personRepo,
                }),
            ).toThrow('Einrichtung not found: 3')
        })
    })
})
