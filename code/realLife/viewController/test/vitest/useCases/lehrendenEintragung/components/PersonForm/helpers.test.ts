import { describe, expect } from 'vitest'

import { Person } from '../../../../../../src/models/Person'
import { Eintragungshindernisse } from '../../../../../../src/useCases/lehrendenEintragung/models/Eintragungshindernis/Eintragungshindernisse'
import { EintragungshindernisseAPI } from '../../../../../../src/useCases/lehrendenEintragung/models/api/EintragungshindernisseAPI'
import { createMockedResultPromise } from '../../../../utilsForVitestTests/resolvePromises'
import { Option } from '../../../../../../src/useCases/lehrendenEintragung/components/LehrtaetigkeitForm/PersonForm/Option'
import {
    computeOptionsByInput,
    createAllOptionsByNameAndMail,
    fetchEintragungshindernisseForOptions,
} from '../../../../../../src/useCases/lehrendenEintragung/components/LehrtaetigkeitForm/PersonForm/helpers'

const allPersonen: Person[] = [
    new Person({
        id: '1',
        nachname: 'Mustermann',
        vorname: 'Hansi',
        email: 'max.mustermann@charite.de',
    }),
    new Person({
        id: '2',
        nachname: 'Musterfrau',
        vorname: 'Hanna',
        email: 'hanna@charite.de',
    }),
    new Person({
        id: '3',
        nachname: 'Musterkind',
        vorname: 'Klaus',
        email: 'klaus@charite.de',
    }),
    new Person({
        id: '4',
        nachname: 'Muster',
        vorname: 'Petra',
        email: 'petra@charite.de',
    }),
]

describe('LehrtaetigkeitForm.vue', () => {
    describe('Option class', () => {
        test('method setEintragungshindernisse sets hindernisse info and the relevant hindernis', () => {
            const option = new Option(allPersonen[0])
            expect(option.eintragungshindernis).toBeUndefined()

            const eintragungshindernisse = new Eintragungshindernisse({
                lehrendenId: '1',
                terminId: '10',
                alsLehrender: {
                    ungeplanteEinrichtung: true,
                    lehrberechtigungFehlt: true,
                },
                alsVertretung: {
                    terminKonflikte: [{ terminId: '10', terminBeschreibung: 'termin10' }],
                },
            })

            option.setEintragungshindernisse(eintragungshindernisse, false)
            expect(option.eintragungshindernis).toEqual(eintragungshindernisse.alsLehrender)

            option.setEintragungshindernisse(eintragungshindernisse, true)
            expect(option.eintragungshindernis).toEqual(eintragungshindernisse.alsVertretung)

            option.setEintragungshindernisse(undefined, false)
            expect(option.eintragungshindernis).toEqual(undefined)
        })
    })

    describe('createPersonMapForSelect', () => {
        test('should return a map of all people with name and email as search values', () => {
            const searchMap = createAllOptionsByNameAndMail(allPersonen, new Set())
            expect(searchMap).toHaveLength(4)
            const allSearchMapEntries = Array.from(searchMap.values())

            const allSearchStrings = Array.from(searchMap.keys())
            expect(allSearchStrings).toEqual([
                'mustermann, hansimax.mustermann@charite.de',
                'musterfrau, hannahanna@charite.de',
                'musterkind, klausklaus@charite.de',
                'muster, petrapetra@charite.de',
            ])

            expect(allSearchMapEntries[0]).toBeInstanceOf(Option)
            expect(allSearchMapEntries[0]).toEqual({
                eintragungshindernisse: undefined,
                person: {
                    aktiv: true,
                    einrichtungsFunktionen: [],
                    einrichtungsIds: [],
                    email: 'max.mustermann@charite.de',
                    id: '1',
                    nachname: 'Mustermann',
                    qualifikationen: [],
                    titel: null,
                    vorname: 'Hansi',
                },
                relevantEintragungshindernis: undefined,
            })
        })

        test('should exclude people given in personenInAllenLehrtaetigkeitenDesTermins', () => {
            const searchMap = createAllOptionsByNameAndMail(allPersonen, new Set([allPersonen[0], allPersonen[2]]))
            expect(searchMap).toHaveLength(2)

            const allSearchStrings = Array.from(searchMap.keys())
            expect(allSearchStrings).toEqual(['musterfrau, hannahanna@charite.de', 'muster, petrapetra@charite.de'])
        })

        test('should include initialPerson, even it is part of personenInAllenLehrtaetigkeitenDesTermins', () => {
            const searchMap = createAllOptionsByNameAndMail(
                allPersonen,
                new Set([allPersonen[0], allPersonen[2]]),
                allPersonen[0],
            )
            expect(searchMap).toHaveLength(3)

            const allSearchStrings = Array.from(searchMap.keys())
            expect(allSearchStrings).toEqual([
                'musterfrau, hannahanna@charite.de',
                'muster, petrapetra@charite.de',
                'mustermann, hansimax.mustermann@charite.de',
            ])
        })
    })
    describe('computeOptionsByInput', () => {
        const personMapForSelect = createAllOptionsByNameAndMail(allPersonen, new Set())
        test('should return an empty array if no search string is given or a person is already selected', () => {
            expect(computeOptionsByInput('Test', personMapForSelect, allPersonen[0])).toEqual([])
            expect(computeOptionsByInput('', personMapForSelect)).toEqual([])
        })
        test('should find all people when a substring matches', () => {
            const result = computeOptionsByInput('Muster', personMapForSelect)
            expect(result).toHaveLength(4)
            expect(result[0].person).toEqual(allPersonen[0])
        })

        test('should find only matching person if search is more specific', () => {
            const result1 = computeOptionsByInput('Mustermann', personMapForSelect)
            expect(result1).toHaveLength(1)
            expect(result1[0].person).toEqual(allPersonen[0])

            const result2 = computeOptionsByInput('Musterfrau', personMapForSelect)
            expect(result2).toHaveLength(1)
            expect(result2[0].person).toEqual(allPersonen[1])
        })

        test('should find any matching part of string of options, including email', () => {
            const result = computeOptionsByInput('petra@charite', personMapForSelect)
            expect(result).toHaveLength(1)
            expect(result[0].person).toEqual(allPersonen[3])
        })

        test('should return an empty array if nothing matches', () => {
            const result = computeOptionsByInput('hnjio', personMapForSelect)
            expect(result).toHaveLength(0)
        })
    })

    describe('fetchEintragungshindernisse', () => {
        const eintragungshindernisse = [
            {
                lehrendenId: '1',
                alsLehrender: { qualifikationFehlt: 'KIT' },
                alsVertretung: { terminKonflikte: ['12', 'Termin12'] },
                terminId: '10',
            },
            {
                lehrendenId: '2',
                alsLehrender: {},
                alsVertretung: { ungeplanteEinrichtung: true },
                terminId: '10',
            },
        ]

        test('should not start an API call if there are no options', async () => {
            const api = new EintragungshindernisseAPI()
            api.fetchAll = createMockedResultPromise(eintragungshindernisse)

            await fetchEintragungshindernisseForOptions([], '10', false, api)
            expect(api.fetchAll).toHaveBeenCalledTimes(0)
        })

        test('should start a correct API call', async () => {
            const personMapForSelect = createAllOptionsByNameAndMail(allPersonen, new Set())
            const options = computeOptionsByInput('Han', personMapForSelect)
            expect(options).toHaveLength(2)

            const api = new EintragungshindernisseAPI()
            api.fetchAll = createMockedResultPromise(eintragungshindernisse)

            await fetchEintragungshindernisseForOptions(options, '10', false, api)

            expect(api.fetchAll).toHaveBeenCalledOnce()
            expect(api.fetchAll).toHaveBeenCalledWith(['10'], ['1', '2'])
        })

        test('should set the right relevant eintragungshindernis', async () => {
            const personMapForSelect = createAllOptionsByNameAndMail(allPersonen, new Set())
            const options = computeOptionsByInput('Han', personMapForSelect)
            expect(options).toHaveLength(2)

            const api = new EintragungshindernisseAPI()
            api.fetchAll = createMockedResultPromise(eintragungshindernisse)

            await fetchEintragungshindernisseForOptions(options, '10', false, api)
            expect(options[0].eintragungshindernis.qualifikationFehlt).toEqual('KIT')
            expect(options[0].eintragungshindernis.terminKonflikte).toEqual(undefined)
            expect(options[1].eintragungshindernis.ungeplanteEinrichtung).toEqual(undefined)

            await fetchEintragungshindernisseForOptions(options, '10', true, api)
            expect(options[0].eintragungshindernis.qualifikationFehlt).toEqual(undefined)
            expect(options[0].eintragungshindernis.terminKonflikte).toEqual(['12', 'Termin12'])
            expect(options[1].eintragungshindernis.ungeplanteEinrichtung).toEqual(true)
        })
    })
})
