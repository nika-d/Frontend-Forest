import { mount } from '@vue/test-utils'
import PersonForm from '../../../../../../../src/useCases/lehrendenEintragung/components/LehrtaetigkeitForm/PersonForm/PersonForm.vue'
import { describe, expect } from 'vitest'
import { QSelect } from 'quasar'
import { Person } from '../../../../../../../src/models/Person'
import { Option } from '../../../../../../../src/useCases/lehrendenEintragung/components/LehrtaetigkeitForm/PersonForm/Option'
import { EintragungshindernisLehrender } from '../../../../../../../src/useCases/lehrendenEintragung/models/Eintragungshindernis/EintragungshindernisLehrender'
import { EintragungshindernisVertretung } from '../../../../../../../src/useCases/lehrendenEintragung/models/Eintragungshindernis/EintragungshindernisVertretung'
import { nextTick, ref } from 'vue'
import { Repository } from '../../../../../../../src/models/repository/common/Repository'

describe('PersonForm.vue', () => {
    const option1 = new Option(new Person({ id: 'id1', vorname: 'ab', nachname: 'cd', email: 'test@test.com' }))
    option1.eintragungshindernisse = {
        alsLehrender: new EintragungshindernisLehrender({}),
        alsVertretung: new EintragungshindernisLehrender({}),
    }
    const option2 = new Option(new Person({ id: 'id2', vorname: 'ef', nachname: 'gh', email: 'test@test.com' }))
    option2.eintragungshindernisse = {
        alsLehrender: new EintragungshindernisLehrender({}),
        alsVertretung: new EintragungshindernisVertretung({}),
    }
    const terminId = 'something'

    for (const isVertretung of [true, false])
        describe('when Vertretung is ' + isVertretung, () => {
            it('sets person and eintragungshindernis when user changes person and no model is given', () => {
                const wrapper = mount(PersonForm, {
                    props: {
                        terminId,
                        isVertretung,
                    },
                })

                wrapper.getComponent(QSelect).vm.$emit('update:modelValue', option1)

                expect(wrapper.vm.person).toEqual(option1.person)
                expect(wrapper.vm.eintragungshindernis).toEqual(option1.getEintragungshindernis(isVertretung))

                // Frage zu jeder Zeile hier: warum geht das nicht?
                //expect(wrapper.vm.$props.person).toEqual(option.person)
                //expect(wrapper.vm.key['person']).toEqual(option.person)
                //expect(wrapper.person).toEqual(option.person)
                //expect(wrapper.props().person).toEqual(option.person)
                //expect(wrapper.props['person']).toEqual(option.person)
                //expect(wrapper.attributes()['person']).toEqual(option.person)
            })
            it('updates person and eintragungshindernis when user changes person', () => {
                const wrapper = mount(PersonForm, {
                    props: {
                        terminId,
                        person: option1.person,
                        eintragungshindernis: option1.getEintragungshindernis(isVertretung),
                        isVertretung,
                    },
                })

                wrapper.getComponent(QSelect).vm.$emit('update:modelValue', option2)

                expect(wrapper.vm.person).toEqual(option2.person)
                expect(wrapper.vm.eintragungshindernis === option2.getEintragungshindernis(isVertretung)).toBeTruthy()
            })
        })

    for (const vertretungStatus of [
        [true, false],
        [false, true],
    ])
        describe('when Vertretung changes from ' + vertretungStatus[0] + ' to ' + vertretungStatus[1], () => {
            it('changes eintragungshindernis accordingly', async () => {
                const wrapper = mount(PersonForm, {
                    props: {
                        terminId,
                        eintragungshindernis: option1.getEintragungshindernis(vertretungStatus[0]),
                        isVertretung: vertretungStatus[0],
                    },
                })

                const x = wrapper.vm as { isVertretung: boolean }
                x.isVertretung = vertretungStatus[1]
                // warum geht das hier nicht???
                //await wrapper.setProps({ isVertretung: vertretungStatus[1] })

                expect(wrapper.vm.eintragungshindernis).toEqual(option1.getEintragungshindernis(vertretungStatus[1]))
            })
        })

    describe('Options', () => {
        it('adapt to personenInAllenLehrtaetigkeitenDesTermins', async () => {
            const personenInAllenLehrtaetigkeitenDesTermins = ref(new Set([option1.person]))
            const wrapper = mount(PersonForm, {
                provide: {
                    personenInAllenLehrtaetigkeitenDesTermins,
                    personRepoStore: ref(new Repository<Person>().addValues([option1.person, option2.person])),
                },
            })

            await nextTick()
            await nextTick()
            // expect(wrapper.getComponent('.q-select').vm.options).toEqual([option2])
            // expect(wrapper.getComponent('.q-select').$props.options).toEqual([option2])
            // expect(wrapper.getComponent('.q-select').vm.$props.options).toEqual([option2])
            // expect(wrapper.getComponent(QSelect).vm.options).toEqual([option2])
            // expect(wrapper.getComponent(QSelect).$props.options).toEqual([option2])
            // expect(wrapper.getComponent(QSelect).vm.$props.options).toEqual([option2])
            // expect(wrapper.getComponent(QSelect).props().options).toEqual([option2])
            //expect(wrapper.getComponent(QSelect).props.options).toEqual([option2])
            wrapper.getComponent('.q-select').vm.filter()
            wrapper.getComponent('.q-select').vm.showPopup()
            wrapper.getComponent('.q-select').vm.$forceUpdate()
            await nextTick()
            expect(wrapper.getComponent(QSelect).props('options')).toEqual([option2])

            // Geht alles nicht. 3 Fehlermöglichkeiten:
            // 1. der getter ist immernoch falsch
            // 2. die QSelect Komponente wird zwar erzeugt, aber weil nichts in ihr gemacht wird, werden keine
            // reaktiven bindings ausgeführt, und die options werden nicht gesetzt.
            // 3. Es fehlt noch irgendein tooling extra für Quasar oder das tooling ist nicht richtig konfiguriert.

            personenInAllenLehrtaetigkeitenDesTermins.value = new Set([option2.person])

            expect(wrapper.getComponent(QSelect).vm.options).toEqual([option1])
        })

        describe('are filtered by user input ', () => {
            for (const input of ['vorname', 'nachname', 'email'])
                it(input, () => {
                    const wrapper = mount(PersonForm, {
                        provide: {
                            personRepoStore: ref(new Repository<Person>().addValues([option1.person, option2.person])),
                        },
                        props: {
                            terminId,
                            isVertretung: false,
                        },
                    })

                    // Hier geht auch alles nicht wie im vorigen Test.

                    wrapper.getComponent(QSelect).vm.$emit('filter', option2.person[input], () => {})
                    expect(wrapper.getComponent(QSelect).vm.options).toEqual(option2)
                })
        })
    })
})
