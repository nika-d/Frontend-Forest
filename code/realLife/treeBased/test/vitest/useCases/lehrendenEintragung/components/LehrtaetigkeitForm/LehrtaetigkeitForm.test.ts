import { mount } from '@vue/test-utils'
import { Einrichtung } from '../../../../../../src/models/Einrichtung'
import LehrtaetigkeitForm from '../../../../../../src/useCases/lehrendenEintragung/components/LehrtaetigkeitForm/LehrtaetigkeitForm.vue'
import EinrichtungForm from '../../../../../../src/useCases/lehrendenEintragung/components/LehrtaetigkeitForm/EinrichtungForm.vue'
import { LehrtaetigkeitFormModel } from '../../../../../../src/useCases/lehrendenEintragung/viewModel/LehrtaetigkeitFormModel'
import { expect } from 'vitest'
import { EintragungshindernisLehrender } from '../../../../../../src/useCases/lehrendenEintragung/models/Eintragungshindernis/EintragungshindernisLehrender'
import { EintragungshindernisUngeplanteEinrichtung } from '../../../../../../src/useCases/lehrendenEintragung/models/Eintragungshindernis/EintragungshindernisUngeplanteEinrichtung'
import PersonForm from '../../../../../../src/useCases/lehrendenEintragung/components/LehrtaetigkeitForm/PersonForm/PersonForm.vue'
import { Eintragungshindernis } from '../../../../../../src/useCases/lehrendenEintragung/models/Eintragungshindernis/Eintragungshindernis'
import { nextTick } from 'vue'
import { Person } from '../../../../../../src/models/Person'

const eintragungshindernisBlocking = new EintragungshindernisLehrender({ qualifikationFehlt: 'POL' })
expect(eintragungshindernisBlocking.blocksSaving()).toBeTruthy()
const eintragungshindernisUngeplanteEinrichtung = new EintragungshindernisUngeplanteEinrichtung()
const eintragungshindernisNonBlocking = new EintragungshindernisLehrender({
    abweichenderLehrender: ['Person 1'],
})
expect(eintragungshindernisNonBlocking.blocksSaving()).toBeFalsy()

function createProps(eintragungshindernis?: Eintragungshindernis) {
    const model = new LehrtaetigkeitFormModel('someTerminId')
    model.eintragungshindernis = eintragungshindernis
    return { props: { model } }

    // Nach reiner Lehre müsste hier beim initialen Model kein fertiges LehrtaetigkeitFormModel-Objekt übergeben werden.
    // Es würde reichen { props: { model: { eintragungshindernis } } } zurückzugeben.
    // Dazu müsste aber TerminDetails refactored werden, und so weit möchte ich dann doch nicht in den Kaninchenbau rein.
    // Zumindest jetzt gerade.🐣
}

describe('LehrtaetigkeitForm', () => {
    it('sets person, when provided by sub-component', async () => {
        //arrange
        const person = new Person({ id: 'id1', vorname: 'ab', nachname: 'cd', email: 'test@test.com' })
        const wrapper = mount(LehrtaetigkeitForm, createProps())

        //act
        wrapper
            .getComponent(PersonForm) // infrastructure wrapper
            .vm.$emit('update:person', person) // configurable responses

        //assert
        expect(
            wrapper.vm.model.person, // output tracking
        ).toEqual(person)
    })

    it('sets einrichtung, when provided by sub-component', async () => {
        const einrichtung = new Einrichtung({ id: 11, bezeichnungLang: 'bla45678910' })
        const wrapper = mount(LehrtaetigkeitForm, createProps())

        wrapper.getComponent(EinrichtungForm).vm.$emit('update:einrichtung', einrichtung)

        expect(wrapper.vm.model.einrichtung).toEqual(einrichtung)
    })

    //it('setting "eintragungshindernisByApi" should pass value on to eintragungshindernis when geplante einrichtung is OK', () => {
    it('prefers hindernis from Person when geplante einrichtung is OK', async () => {
        const wrapper = mount(LehrtaetigkeitForm, createProps())
        expect(wrapper.vm.model.eintragungshindernis).toBeUndefined()

        wrapper.getComponent(PersonForm).vm.$emit('update:eintragungshindernis', eintragungshindernisNonBlocking)

        await nextTick() // nötig wegen watcher..???
        expect(wrapper.vm.model.eintragungshindernis).toEqual(eintragungshindernisNonBlocking)
    })

    //it('setting "eintragungshindernisByApi" should be overriden with "ungeplante Einrichtung" when eintragungshindernis is non-blocking', () => {
    it('prefers "ungeplante Einrichtung" over non-blocking hindernis from Person', async () => {
        const wrapper = mount(LehrtaetigkeitForm, createProps(eintragungshindernisNonBlocking))

        wrapper
            .getComponent(EinrichtungForm)
            .vm.$emit('update:eintragungshindernis', eintragungshindernisUngeplanteEinrichtung)

        await nextTick()

        expect(wrapper.vm.model.eintragungshindernis).toEqual(eintragungshindernisUngeplanteEinrichtung)
    })

    //it('setting "eintragungshindernisByApi" should not be overriden that with "ungeplante Einrichtung" when eintragungshindernis is blocking', () => {
    it('prefers blocking hindernis from Person over "ungeplante Einrichtung"', async () => {
        const wrapper = mount(LehrtaetigkeitForm, createProps(eintragungshindernisUngeplanteEinrichtung))

        wrapper.getComponent(PersonForm).vm.$emit('update:eintragungshindernis', eintragungshindernisBlocking)

        await nextTick()
        expect(wrapper.vm.model.eintragungshindernis).toEqual(eintragungshindernisBlocking)
    })

    // it('switching einrichtung and eintragungshindernisByApi should result in most important hindernis, (blocking, ungeplante Einrichtung, non-blocking other)', () => {
    // die erzeugung von EintragungshindernisUngeplanteEinrichtung ist jetzt in EinrichtungForm und wird entsprechend in EinrichtungForm.test getestet.
    it('new eintragungshindernisse from person and from einrichtung should result in most important hindernis, (blocking, ungeplante Einrichtung, non-blocking other)', async () => {
        const wrapper = mount(LehrtaetigkeitForm, createProps(eintragungshindernisUngeplanteEinrichtung))
        const einrichtungForm = wrapper.getComponent(EinrichtungForm)
        const personForm = wrapper.getComponent(PersonForm)

        personForm.vm.$emit('update:eintragungshindernis', eintragungshindernisNonBlocking)
        await nextTick()
        expect(wrapper.vm.model.eintragungshindernis).toEqual(eintragungshindernisUngeplanteEinrichtung)

        einrichtungForm.vm.$emit('update:eintragungshindernis', undefined)
        await nextTick()
        expect(wrapper.vm.model.eintragungshindernis).toEqual(eintragungshindernisNonBlocking)

        personForm.vm.$emit('update:eintragungshindernis', eintragungshindernisBlocking)
        await nextTick()
        expect(wrapper.vm.model.eintragungshindernis).toEqual(eintragungshindernisBlocking)

        einrichtungForm.vm.$emit('update:eintragungshindernis', eintragungshindernisUngeplanteEinrichtung)
        await nextTick()
        expect(wrapper.vm.model.eintragungshindernis).toEqual(eintragungshindernisBlocking)

        personForm.vm.$emit('update:eintragungshindernis', eintragungshindernisNonBlocking)
        await nextTick()
        expect(wrapper.vm.model.eintragungshindernis).toEqual(eintragungshindernisUngeplanteEinrichtung)
    })
})
