import { LehrtaetigkeitViewModel } from '../../../../../src/useCases/lehrendenEintragung/viewModel/LehrtaetigkeitViewModel'
import { Person } from '../../../../../src/models/Person'
import { Einrichtung } from '../../../../../src/models/Einrichtung'
import { LehrtaetigkeitFormModel } from '../../../../../src/useCases/lehrendenEintragung/viewModel/LehrtaetigkeitFormModel'
import { describe } from 'vitest'

const terminId = 'someId'
const person = new Person({ id: 'id', vorname: 'vorname', nachname: 'nachname', email: 'email@email.com' })
const einrichtung = new Einrichtung({ id: 12345, bezeichnungLang: 'bezeichnungLang' })
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
function createformModelWithExistingLehrtaetigkeit() {
    const formModel = new LehrtaetigkeitFormModel(terminId, createNewLehrtaetigkeitViewModel())
    expect(formModel.isReadyToBeSubmitted).toBeFalsy()
    return formModel
}
describe('LehrtaetigkeitformModel', function () {
    describe('isNew', () => {
        it('should be new when no lehrtaetigkeitViewModel is provided', () => {
            const formModel = new LehrtaetigkeitFormModel(terminId)
            expect(formModel.isNew).toBeTruthy()
        })

        it('should not be new when lehrtaetigkeitViewModel is provided', () => {
            const formModel = createformModelWithExistingLehrtaetigkeit()
            expect(formModel.isNew).toBeFalsy()
        })
    })

    describe('isChanged', () => {
        it('should be changed when anything changed', () => {
            const newformModel = [
                new LehrtaetigkeitFormModel(terminId),
                new LehrtaetigkeitFormModel(terminId),
                new LehrtaetigkeitFormModel(terminId),
                new LehrtaetigkeitFormModel(terminId),
                new LehrtaetigkeitFormModel(terminId),
            ]

            expect(newformModel[0].isChanged).toBeTruthy()

            newformModel[1].isMarkedToBeDeleted = true
            expect(newformModel[1].isChanged).toBeTruthy()

            newformModel[2].person = person
            expect(newformModel[2].isChanged).toBeTruthy()

            newformModel[3].einrichtung = einrichtung
            expect(newformModel[3].isChanged).toBeTruthy()

            newformModel[4].isVertretung = true
            expect(newformModel[4].isChanged).toBeTruthy()

            const formModelWithLehrtaetigkeit = [
                createformModelWithExistingLehrtaetigkeit(),
                createformModelWithExistingLehrtaetigkeit(),
                createformModelWithExistingLehrtaetigkeit(),
                createformModelWithExistingLehrtaetigkeit(),
            ]

            formModelWithLehrtaetigkeit[0].isVertretung = true
            expect(formModelWithLehrtaetigkeit[0].isChanged).toBeTruthy()

            formModelWithLehrtaetigkeit[1].isMarkedToBeDeleted = true
            expect(formModelWithLehrtaetigkeit[1].isChanged).toBeTruthy()

            formModelWithLehrtaetigkeit[2].person = newPerson
            expect(formModelWithLehrtaetigkeit[2].isChanged).toBeTruthy()

            formModelWithLehrtaetigkeit[3].einrichtung = newEinrichtung
            expect(formModelWithLehrtaetigkeit[3].isChanged).toBeTruthy()
        })

        it('should not be changed when nothing changed', () => {
            const formModel = createformModelWithExistingLehrtaetigkeit()
            expect(formModel.isChanged).toBeFalsy
        })
    })

    describe('isEditMode', () => {
        it('should be false when constructed', () => {
            const formModel = new LehrtaetigkeitFormModel(terminId)
            expect(formModel.isEditMode).toBeFalsy()
        })
        it('should be false when not in edit mode', () => {
            const formModel = createformModelWithExistingLehrtaetigkeit()
            expect(formModel.isEditMode).toBeFalsy()
        })
        it('should not change person, einrichtung, isVertretung when is being set to true', () => {
            const lehrtaetigkeit = createNewLehrtaetigkeitViewModel()
            const formModel = new LehrtaetigkeitFormModel(terminId, lehrtaetigkeit)
            formModel.isEditMode = true
            expect(formModel.person).toBe(lehrtaetigkeit.person)
            expect(formModel.einrichtung).toBe(lehrtaetigkeit.einrichtung)
            expect(formModel.isVertretung).toBe(lehrtaetigkeit.isVertretung)
        })

        it('should keep person, einrichtung, isVertretung of a new Lehrtaetigkeit when editMode is being set to false', () => {
            const formModel = new LehrtaetigkeitFormModel(terminId)
            formModel.person = person
            formModel.einrichtung = einrichtung
            formModel.isVertretung = false
            formModel.isEditMode = false
            expect(formModel.person).toEqual(person)
            expect(formModel.einrichtung).toEqual(einrichtung)
            expect(formModel.isVertretung).toBeFalsy()
        })

        it('should reset person, einrichtung, isVertretung to initial values of the existing Lehrtaetigkeit when editMode is being set to false', () => {
            const lehrtaetigkeit = createNewLehrtaetigkeitViewModel()
            const formModel = new LehrtaetigkeitFormModel(terminId, lehrtaetigkeit)
            formModel.person = newPerson
            formModel.einrichtung = newEinrichtung
            formModel.isVertretung = true
            formModel.isEditMode = false
            expect(formModel.person).toBe(lehrtaetigkeit.person)
            expect(formModel.einrichtung).toBe(lehrtaetigkeit.einrichtung)
            expect(formModel.isVertretung).toBe(lehrtaetigkeit.isVertretung)
        })
    })

    describe('isReadyToBeSubmitted', () => {
        it('should be ready to be submitted when new and complete', () => {
            const formModel = new LehrtaetigkeitFormModel(terminId)
            formModel.person = person
            formModel.einrichtung = einrichtung
            formModel.isVertretung = false
            formModel.isMarkedToBeDeleted = false
            expect(formModel.isReadyToBeSubmitted).toBeTruthy()
        })

        it('should be ready to be submitted when old and person changed and complete', () => {
            const formModel = createformModelWithExistingLehrtaetigkeit()
            formModel.person = new Person({
                id: 'id2',
                vorname: 'vorname2',
                nachname: 'nachname2',
                email: 'email2@email.com',
            })
            expect(formModel.isReadyToBeSubmitted).toBeTruthy()
        })

        it('should be ready to be submitted when old and einrichtung changed and complete', () => {
            const formModel = createformModelWithExistingLehrtaetigkeit()
            formModel.einrichtung = new Einrichtung({ id: 123456, bezeichnungLang: 'bezeichnungLang2' })
            expect(formModel.isReadyToBeSubmitted).toBeTruthy()
        })

        it('should be ready to be submitted when vertretungsStatus changed and complete', () => {
            const formModel = createformModelWithExistingLehrtaetigkeit()
            formModel.isVertretung = true
            expect(formModel.isReadyToBeSubmitted).toBeTruthy()
        })

        it('should be ready to be submitted when markedForDeletion', () => {
            const formModel = createformModelWithExistingLehrtaetigkeit()
            formModel.isMarkedToBeDeleted = true
            expect(formModel.isReadyToBeSubmitted).toBeTruthy()
        })

        it('should not be ready to be submitted when new and not complete', () => {
            const formModel = new LehrtaetigkeitFormModel(terminId)
            formModel.person = person
            expect(formModel.isReadyToBeSubmitted).toBeFalsy()
        })

        it('should not be ready to be submitted when old and not complete', () => {
            const formModel = createformModelWithExistingLehrtaetigkeit()
            formModel.person = undefined
            expect(formModel.isReadyToBeSubmitted).toBeFalsy()
            formModel.person = person
            formModel.einrichtung = undefined
            expect(formModel.isReadyToBeSubmitted).toBeFalsy()
        })

        it('should not be ready to be submitted when nothing changed in old version', () => {
            const formModel = createformModelWithExistingLehrtaetigkeit()
            expect(formModel.isReadyToBeSubmitted).toBeFalsy()
        })
    })
})
