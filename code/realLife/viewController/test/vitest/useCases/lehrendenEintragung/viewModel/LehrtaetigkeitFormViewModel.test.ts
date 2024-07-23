import { LehrtaetigkeitViewModel } from '../../../../../src/useCases/lehrendenEintragung/viewModel/LehrtaetigkeitViewModel'
import { Person } from '../../../../../src/models/Person'
import { Einrichtung } from '../../../../../src/models/Einrichtung'
import { LehrtaetigkeitFormViewModel } from '../../../../../src/useCases/lehrendenEintragung/viewModel/LehrtaetigkeitFormViewModel'
import { describe, expect } from 'vitest'
import { EintragungshindernisLehrender } from '../../../../../src/useCases/lehrendenEintragung/models/Eintragungshindernis/EintragungshindernisLehrender'
import { EintragungshindernisUngeplanteEinrichtung } from '../../../../../src/useCases/lehrendenEintragung/models/Eintragungshindernis/EintragungshindernisUngeplanteEinrichtung'
import { EintragungshindernisseAPI } from '../../../../../src/useCases/lehrendenEintragung/models/api/EintragungshindernisseAPI'
import { createMockedResultPromise, createMockedVoidPromise } from '../../../utilsForVitestTests/resolvePromises'
import { Eintragungshindernisse } from '../../../../../src/useCases/lehrendenEintragung/models/Eintragungshindernis/Eintragungshindernisse'
import { EintragungshindernisVertretung } from '../../../../../src/useCases/lehrendenEintragung/models/Eintragungshindernis/EintragungshindernisVertretung'
import { delay } from '../../../utilsForVitestTests/delay'
import { domainId } from '../../../../../src/models/common/domainId'
import { Repository } from '../../../../../src/models/repository/common/Repository'

const terminId: domainId = 'someId'
const person = new Person({ id: 'id', vorname: 'vorname', nachname: 'nachname', email: 'email@email.com' })
const einrichtung = new Einrichtung({ id: 12345, bezeichnungLang: 'bezeichnungLang' })
const einrichtung2 = new Einrichtung({ id: 55, bezeichnungLang: 'andereEinrichtung' })
const einrichtungsRepo = new Repository<Einrichtung>().addValues([einrichtung, einrichtung2])
const newPerson = new Person({
    id: 'id2',
    vorname: 'vorname2',
    nachname: 'nachname2',
    email: 'email2@email.com',
})
const newEinrichtung = new Einrichtung({ id: 123456, bezeichnungLang: 'bezeichnungLang2' })
function createNewLehrtaetigkeitViewModel() {
    return new LehrtaetigkeitViewModel({
        id: 99999,
        terminId,
        person,
        einrichtung,
        isVertretung: false,
    })
}
function createformVMWithExistingLehrtaetigkeit() {
    const formVM = new LehrtaetigkeitFormViewModel(
        terminId,
        [einrichtung],
        createNewLehrtaetigkeitViewModel(),
        einrichtungsRepo,
    )

    expect(formVM.isReadyToBeSubmitted).toBeFalsy()
    return formVM
}
describe('LehrtaetigkeitformVM', function () {
    describe('isNew', () => {
        it('should be new when no lehrtaetigkeitViewModel is provided', () => {
            const formVM = new LehrtaetigkeitFormViewModel(terminId, [])
            expect(formVM.isNew).toBeTruthy()
        })

        it('should not be new when lehrtaetigkeitViewModel is provided', () => {
            const formVM = createformVMWithExistingLehrtaetigkeit()
            expect(formVM.isNew).toBeFalsy()
        })
    })
    describe('isChanged', () => {
        it('should be changed when anything changed', () => {
            const newFormVM = [
                new LehrtaetigkeitFormViewModel(terminId, []),
                new LehrtaetigkeitFormViewModel(terminId, []),
                new LehrtaetigkeitFormViewModel(terminId, []),
                new LehrtaetigkeitFormViewModel(terminId, []),
                new LehrtaetigkeitFormViewModel(terminId, []),
            ]

            expect(newFormVM[0].isChanged).toBeTruthy()

            newFormVM[1].isMarkedToBeDeleted = true
            expect(newFormVM[1].isChanged).toBeTruthy()

            newFormVM[2].person = person
            expect(newFormVM[2].isChanged).toBeTruthy()

            newFormVM[3].einrichtung = einrichtung
            expect(newFormVM[3].isChanged).toBeTruthy()

            newFormVM[4].isVertretung = true
            expect(newFormVM[4].isChanged).toBeTruthy()

            const formVMWithLehrtaetigkeit = [
                createformVMWithExistingLehrtaetigkeit(),
                createformVMWithExistingLehrtaetigkeit(),
                createformVMWithExistingLehrtaetigkeit(),
                createformVMWithExistingLehrtaetigkeit(),
            ]

            formVMWithLehrtaetigkeit[0].isVertretung = true
            expect(formVMWithLehrtaetigkeit[0].isChanged).toBeTruthy()

            formVMWithLehrtaetigkeit[1].isMarkedToBeDeleted = true
            expect(formVMWithLehrtaetigkeit[1].isChanged).toBeTruthy()

            formVMWithLehrtaetigkeit[2].person = newPerson
            expect(formVMWithLehrtaetigkeit[2].isChanged).toBeTruthy()

            formVMWithLehrtaetigkeit[3].einrichtung = newEinrichtung
            expect(formVMWithLehrtaetigkeit[3].isChanged).toBeTruthy()
        })

        it('should not be changed when nothing changed', () => {
            const formVM = createformVMWithExistingLehrtaetigkeit()
            expect(formVM.isChanged).toBeFalsy
        })
    })

    describe('isEditMode', () => {
        it('should be false when constructed', () => {
            const formVM = new LehrtaetigkeitFormViewModel(terminId, [])
            expect(formVM.isEditMode).toBeFalsy()
        })
        it('should be false when not in edit mode', () => {
            const formVM = createformVMWithExistingLehrtaetigkeit()
            expect(formVM.isEditMode).toBeFalsy()
        })
        it('should not change person, einrichtung, isVertretung when is being set to true', () => {
            const lehrtaetigkeit = createNewLehrtaetigkeitViewModel()
            const formVM = new LehrtaetigkeitFormViewModel(terminId, [], lehrtaetigkeit)
            formVM.isEditMode = true
            expect(formVM.person).toBe(lehrtaetigkeit.person)
            expect(formVM.einrichtung).toBe(lehrtaetigkeit.einrichtung)
            expect(formVM.isVertretung).toBe(lehrtaetigkeit.isVertretung)
        })

        it('should keep person, einrichtung, isVertretung of a new Lehrtaetigkeit when editMode is being set to false', () => {
            const formVM = new LehrtaetigkeitFormViewModel(terminId, [])
            formVM.person = person
            formVM.einrichtung = einrichtung
            formVM.isVertretung = false
            formVM.isEditMode = false
            expect(formVM.person).toEqual(person)
            expect(formVM.einrichtung).toEqual(einrichtung)
            expect(formVM.isVertretung).toBeFalsy()
        })

        it('should reset person, einrichtung, isVertretung to initial values of the existing Lehrtaetigkeit when editMode is being set to false', () => {
            const lehrtaetigkeit = createNewLehrtaetigkeitViewModel()
            const formVM = new LehrtaetigkeitFormViewModel(terminId, [], lehrtaetigkeit)
            formVM.person = newPerson
            formVM.einrichtung = newEinrichtung
            formVM.isVertretung = true
            formVM.isEditMode = false
            expect(formVM.person).toBe(lehrtaetigkeit.person)
            expect(formVM.einrichtung).toBe(lehrtaetigkeit.einrichtung)
            expect(formVM.isVertretung).toBe(lehrtaetigkeit.isVertretung)
        })
    })

    describe('isReadyToBeSubmitted', () => {
        it('should be ready to be submitted when new and complete', () => {
            const formVM = new LehrtaetigkeitFormViewModel(terminId, [])
            formVM.person = person
            formVM.einrichtung = einrichtung
            formVM.isVertretung = false
            formVM.isMarkedToBeDeleted = false
            expect(formVM.isReadyToBeSubmitted).toBeTruthy()
        })

        it('should be ready to be submitted when old and person changed and complete', () => {
            const formVM = createformVMWithExistingLehrtaetigkeit()
            formVM.person = new Person({
                id: 'id2',
                vorname: 'vorname2',
                nachname: 'nachname2',
                email: 'email2@email.com',
                einrichtungsIds: [12345],
            })
            expect(formVM.isReadyToBeSubmitted).toBeTruthy()
        })

        it('should be ready to be submitted when old and einrichtung changed and complete', () => {
            const formVM = createformVMWithExistingLehrtaetigkeit()
            formVM.einrichtung = new Einrichtung({ id: 123456, bezeichnungLang: 'bezeichnungLang2' })
            expect(formVM.isReadyToBeSubmitted).toBeTruthy()
        })

        it('should be ready to be submitted when vertretungsStatus changed and complete', () => {
            const formVM = createformVMWithExistingLehrtaetigkeit()
            formVM.isVertretung = true
            expect(formVM.isReadyToBeSubmitted).toBeTruthy()
        })

        it('should be ready to be submitted when markedForDeletion', () => {
            const formVM = createformVMWithExistingLehrtaetigkeit()
            formVM.isMarkedToBeDeleted = true
            expect(formVM.isReadyToBeSubmitted).toBeTruthy()
        })

        it('should not be ready to be submitted when new and not complete', () => {
            const formVM = new LehrtaetigkeitFormViewModel(terminId, [])
            formVM.person = person
            expect(formVM.isReadyToBeSubmitted).toBeFalsy()
        })

        it('should not be ready to be submitted when old and not complete', () => {
            const formVM = createformVMWithExistingLehrtaetigkeit()
            formVM.person = undefined
            expect(formVM.isReadyToBeSubmitted).toBeFalsy()
            formVM.person = person
            formVM.einrichtung = undefined
            expect(formVM.isReadyToBeSubmitted).toBeFalsy()
        })

        it('should not be ready to be submitted when nothing changed in old version', () => {
            const formVM = createformVMWithExistingLehrtaetigkeit()
            expect(formVM.isReadyToBeSubmitted).toBeFalsy()
        })
    })

    describe('setPerson', () => {
        it('should autoselect einrichtung if person has only one einrichtung', async () => {
            const formVM = new LehrtaetigkeitFormViewModel(terminId, [], null, einrichtungsRepo)
            expect(formVM.einrichtung).toBeNull()
            const person = new Person({
                id: 'id',
                vorname: 'vv',
                nachname: 'nn',
                email: 'e@mail.com',
                einrichtungsIds: [12345],
            })
            formVM.person = person
            expect(formVM.einrichtung).toEqual(einrichtung)
        })

        it('should not autoselect einrichtung if person has >1 einrichtungen and no geplante einrichtungen given', async () => {
            const formVM = new LehrtaetigkeitFormViewModel(terminId, [], null, einrichtungsRepo)
            expect(formVM.einrichtung).toBeNull()
            const person = new Person({
                id: 'id',
                vorname: 'vv',
                nachname: 'nn',
                email: 'e@mail.com',
                einrichtungsIds: [12345, 55],
            })
            formVM.person = person
            expect(formVM.einrichtung).toEqual(null)
        })

        it('should autoselect einrichtung if person has >1 einrichtungen and intersection with geplante einrichtungen is one einrichtung', async () => {
            const formVM = new LehrtaetigkeitFormViewModel(terminId, [einrichtung2], null, einrichtungsRepo)
            expect(formVM.einrichtung).toBeNull()
            const person = new Person({
                id: 'id',
                vorname: 'vv',
                nachname: 'nn',
                email: 'e@mail.com',
                einrichtungsIds: [12345, 55],
            })
            formVM.person = person
            expect(formVM.einrichtung).toEqual(einrichtung2)
        })

        it('should not autoselect einrichtung if person has >1 einrichtungen and intersection with geplante einrichtungen is >1', async () => {
            const formVM = new LehrtaetigkeitFormViewModel(
                terminId,
                [einrichtung, einrichtung2],
                null,
                einrichtungsRepo,
            )
            expect(formVM.einrichtung).toBeNull()
            const person = new Person({
                id: 'id',
                vorname: 'vv',
                nachname: 'nn',
                email: 'e@mail.com',
                einrichtungsIds: [12345, 55],
            })
            formVM.person = person
            expect(formVM.einrichtung).toEqual(null)
        })
    })

    describe('setVertretung', () => {
        it('should load Eintragungshindernis when original person is set', async () => {
            const eintragungshindernisseAPI = new EintragungshindernisseAPI()
            const eintragungshindernisse: Eintragungshindernisse = new Eintragungshindernisse({
                terminId,
                lehrendenId: person.id,
                alsLehrender: { qualifikationFehlt: 'POL' },
                alsVertretung: { ungeplanteEinrichtung: true },
            })

            eintragungshindernisseAPI.fetchEintragungshindernisseForLehrtaetigkeit =
                createMockedResultPromise(eintragungshindernisse)
            const formVM = new LehrtaetigkeitFormViewModel(
                terminId,
                [einrichtung],
                createNewLehrtaetigkeitViewModel(),
                null,
                eintragungshindernisseAPI,
            )
            formVM.isVertretung = true
            await delay(5)
            expect(eintragungshindernisseAPI.fetchEintragungshindernisseForLehrtaetigkeit).toHaveBeenCalledOnce()
            expect(formVM.eintragungshindernis).toEqual(
                new EintragungshindernisVertretung({ ungeplanteEinrichtung: true }),
            )
            formVM.isVertretung = false
            await delay(5)
            expect(formVM.eintragungshindernis).toEqual(
                new EintragungshindernisLehrender({ qualifikationFehlt: 'POL' }),
            )
        })

        it('should not load eintragungshindernissse when no person or new person is set (which is done by components) ', async () => {
            const eintragungshindernisseAPI = new EintragungshindernisseAPI()

            eintragungshindernisseAPI.fetchEintragungshindernisseForLehrtaetigkeit = createMockedVoidPromise()
            const formVM = new LehrtaetigkeitFormViewModel(
                terminId,
                [einrichtung],
                null,
                null,
                eintragungshindernisseAPI,
            )
            formVM.isVertretung = true
            await delay(5)
            expect(eintragungshindernisseAPI.fetchEintragungshindernisseForLehrtaetigkeit).not.toHaveBeenCalled()
            formVM.isVertretung = false
            await delay(5)
            expect(eintragungshindernisseAPI.fetchEintragungshindernisseForLehrtaetigkeit).not.toHaveBeenCalled()
        })
    })

    describe('eintragungshindernisseByEinrichtung', () => {
        it('setting "eintragungshindernisByApi" should pass value on to eintragungshindernis when geplante einrichtung is OK', () => {
            const formVM = createformVMWithExistingLehrtaetigkeit()
            expect(formVM.eintragungshindernis).toBeNull()

            const eintragungshindernis = new EintragungshindernisLehrender({ qualifikationFehlt: 'POL' })
            formVM.eintragungshindernisFromApi = eintragungshindernis
            expect(formVM.eintragungshindernis).toEqual(eintragungshindernis)
        })

        it('setting "einrichtung" should create artificial hindernis "ungeplante Einrichtung" when einrichtung is ungeplant', () => {
            const formVM = createformVMWithExistingLehrtaetigkeit()
            expect(formVM.eintragungshindernis).toBeNull()

            formVM.einrichtung = einrichtung2
            expect(formVM.eintragungshindernis).toEqual(new EintragungshindernisUngeplanteEinrichtung())
        })

        it('setting "eintragungshindernisByApi" should be overriden with "ungeplante Einrichtung" when eintragungshindernis is non-blocking', () => {
            const formVM = createformVMWithExistingLehrtaetigkeit()
            formVM.einrichtung = einrichtung2

            formVM.eintragungshindernisFromApi = new EintragungshindernisLehrender({
                abweichenderLehrender: ['Person X'],
            })
            expect(formVM.eintragungshindernis).toEqual(new EintragungshindernisUngeplanteEinrichtung())
        })

        it('setting "eintragungshindernisByApi" should not be overriden that with "ungeplante Einrichtung" when eintragungshindernis is blocking', () => {
            const formVM = createformVMWithExistingLehrtaetigkeit()
            formVM.einrichtung = einrichtung2

            const eintragungshindernis = new EintragungshindernisLehrender({ qualifikationFehlt: 'POL' })
            formVM.eintragungshindernisFromApi = eintragungshindernis
            expect(formVM.eintragungshindernis).toEqual(eintragungshindernis)
        })

        it('switching einrichtung and eintragungshindernisByApi should result in most important hindernis, (blocking, ungeplante Einrichtung, non-blocking other)', () => {
            const formVM = createformVMWithExistingLehrtaetigkeit()
            const eintragungshindernisBlocking = new EintragungshindernisLehrender({ qualifikationFehlt: 'POL' })
            const eintragungshindernisNonBlocking = new EintragungshindernisLehrender({
                abweichenderLehrender: ['Person 1'],
            })

            formVM.einrichtung = einrichtung2
            formVM.eintragungshindernisFromApi = eintragungshindernisNonBlocking
            expect(formVM.eintragungshindernis).toEqual(new EintragungshindernisUngeplanteEinrichtung())

            formVM.einrichtung = einrichtung
            expect(formVM.eintragungshindernis).toEqual(eintragungshindernisNonBlocking)

            formVM.eintragungshindernisFromApi = eintragungshindernisBlocking
            expect(formVM.eintragungshindernis).toEqual(eintragungshindernisBlocking)

            formVM.einrichtung = einrichtung2
            expect(formVM.eintragungshindernis).toEqual(eintragungshindernisBlocking)

            formVM.eintragungshindernisFromApi = eintragungshindernisNonBlocking
            expect(formVM.eintragungshindernis).toEqual(new EintragungshindernisUngeplanteEinrichtung())
        })
    })
})
