import { describe, expect } from 'vitest'
import { EintragungshindernisUngeplanteEinrichtung } from '../../../../../../src/useCases/lehrendenEintragung/models/Eintragungshindernis/EintragungshindernisUngeplanteEinrichtung'
import { Einrichtung } from '../../../../../../src/models/Einrichtung'
import { mount } from '@vue/test-utils'
import EinrichtungForm from '../../../../../../src/useCases/lehrendenEintragung/components/LehrtaetigkeitForm/EinrichtungForm.vue'
import { QSelect } from 'quasar'

describe('EinrichtungForm', () => {
    it('setting "einrichtung" should create artificial hindernis "ungeplante Einrichtung" when einrichtung is ungeplant', async () => {
        const geplanteEinrichtung = new Einrichtung({ id: 11, bezeichnungLang: 'bla45678911' })
        const einrichtung = new Einrichtung({ id: 12, bezeichnungLang: 'bla45678912' })
        const wrapper = mount(EinrichtungForm, {
            global: { provide: { geplanteEinrichtungenDesTermins: [geplanteEinrichtung] } },
        })

        wrapper.getComponent(QSelect).vm.$emit('update:modelValue', einrichtung)

        expect(wrapper.vm.eintragungshindernis).toBeInstanceOf(EintragungshindernisUngeplanteEinrichtung)
        expect(wrapper.vm.eintragungshindernis.ungeplanteEinrichtung).toBeTruthy()
    })
})
