import 'isomorphic-fetch' // is needed for Response to be defined in Pipeline
import type { JSONValue } from '../../../src/common/api/JSON'
import noEintragungshindernisseJSON from './noEintragungshindernisse.json'
import sampleEintragungshindernisseJSON from './sampleEintragungshindernisse.json'
import lehrendenEintragungDatenForApiAdapter from '../../fakeApi/routes/useCases/lehrendenEintragungJsonData'
import { TerminDTO } from '../../../src/models/Termin'
import { type LehrtaetigkeitApiDTO, type TerminLehrtaetigkeitenApiDTO } from '../../../src/models/Lehrtaetigkeit'
import type Mutable from './helpers/Mutable'
import computeTerminFields from './helpers/computeTerminFields'
import getPathParametersByTheirNames from '../../apiMockingHelpers/lehrendenEintragung/getPathParametersByTheirNames'
import createNewLehrTaetigkeit from '../../apiMockingHelpers/lehrendenEintragung/createNewLehrTaetigkeit'
import URLs from '../../../src/useCases/lehrendenEintragung/models/api/URLs'

class TestAdapterLehrendeneintragung {
    private jsons = lehrendenEintragungDatenForApiAdapter
    private alleTermine: Partial<Mutable<TerminDTO & TerminLehrtaetigkeitenApiDTO>>[] =
        this.jsons.termineInModulen15100Und15200Und15800

    public httpCall(path: string, method: string, parameters: JSONValue): null | JSONValue {
        let response: JSONValue = null

        if (method === 'get') {
            if (path.includes(URLs.studienstrukturFuerMeineEinrichtungstermine)) {
                response = this.jsons.studienStrukturInModulen15100Und15200Und15800
            } else if (path.includes(URLs.meineEinrichtungstermine)) {
                response = this.jsons.termineInModulen15100Und15200Und15800
            }
        } //else throw new Error('TestAdapterLehrendeneintragung ' + path + method + parameters)

        if (method === 'post') {
            if (path.includes(URLs.lehrTaetigkeitEintragungshindernisse)) {
                const lehrendenIds = parameters['lehrendenIds']
                const terminIds = parameters['terminIds']
                const foundHinderrnisse = []
                lehrendenIds.forEach((lehrendenId) => {
                    terminIds.forEach((terminId) => {
                        const foundHindernis = Object.values(sampleEintragungshindernisseJSON).find(
                            (jsonEntry) => jsonEntry.lehrendenId == lehrendenId && jsonEntry['terminId'] == terminId,
                        )
                        if (foundHindernis) {
                            foundHinderrnisse.push(foundHindernis)
                        } else {
                            noEintragungshindernisseJSON['lehrendenId'] = lehrendenId
                            noEintragungshindernisseJSON['terminId'] = terminId
                            foundHinderrnisse.push(noEintragungshindernisseJSON)
                        }
                    })
                })
                response = foundHinderrnisse
            } else if (path.includes(URLs.lehrTaetigkeit) || path.includes(URLs.vertretung)) {
                const pathParameters = getPathParametersByTheirNames(path, ['terminId', 'personId', 'einrichtungsId'])

                const termin = this.alleTermine.find((termin) => termin.id == pathParameters.get('terminId'))

                const neueLehrTaetigkeit: LehrtaetigkeitApiDTO = createNewLehrTaetigkeit(
                    pathParameters.get('personId'),
                    pathParameters.get('einrichtungsId'),
                )

                if (path.includes(URLs.lehrTaetigkeit)) {
                    termin.lehrTaetigkeiten ??= []
                    termin.lehrTaetigkeiten.push(neueLehrTaetigkeit)
                    response = { lehrTaetigkeitsId: neueLehrTaetigkeit.id }
                } else {
                    termin.vertretungen ??= []
                    termin.vertretungen.push(neueLehrTaetigkeit)
                    response = { vertretungsId: neueLehrTaetigkeit.id }
                }
            } else if (path.includes(URLs.meineEinrichtungstermineReloadTermine)) {
                const testDatenGefiltertNachIdsInCallParameters = this.alleTermine.filter((termin) =>
                    (parameters as string[]).includes(termin.id),
                )

                response = testDatenGefiltertNachIdsInCallParameters.map((termin) =>
                    computeTerminFields(termin as TerminDTO & TerminLehrtaetigkeitenApiDTO),
                )
            }
        }

        if (method === 'delete') {
            if (path.includes(URLs.lehrTaetigkeit)) {
                const id = +path.substring(path.lastIndexOf('/') + 1)
                this.alleTermine.forEach((termin) => {
                    termin.lehrTaetigkeiten.forEach((lehrTaetigkeit, index) => {
                        if (lehrTaetigkeit.id == id) {
                            termin.lehrTaetigkeiten.splice(index, 1)
                        }
                    })
                })
                response = {}
            } else if (path.includes(URLs.vertretung)) {
                const id = +path.substring(path.lastIndexOf('/') + 1)
                this.alleTermine.forEach((termin) => {
                    termin.vertretungen.forEach((lehrTaetigkeit, index) => {
                        if (lehrTaetigkeit.id == id) {
                            termin.vertretungen.splice(index, 1)
                        }
                    })
                })
                response = {}
            }
        }

        if (method === 'put') {
            if (path.includes(URLs.lehrTaetigkeit + '/')) {
                const lehrtaetigkeitId = +path.split('/').at(-2)
                const einrichtungsId = +path.split('/').at(-1)
                this.alleTermine.forEach((termin) => {
                    termin.lehrTaetigkeiten.forEach((lehrTaetigkeit) => {
                        if (lehrTaetigkeit.id == lehrtaetigkeitId) {
                            lehrTaetigkeit.einrichtungsId = +einrichtungsId
                        }
                    })
                })
                response = {}
            } else if (path.includes(URLs.vertretung + '/')) {
                const lehrtaetigkeitId = +path.split('/').at(-2)
                const einrichtungsId = +path.split('/').at(-1)
                this.alleTermine.forEach((termin) => {
                    termin.vertretungen.forEach((lehrTaetigkeit) => {
                        if (lehrTaetigkeit.id == lehrtaetigkeitId) {
                            lehrTaetigkeit.einrichtungsId = +einrichtungsId
                        }
                    })
                })
                response = {}
            } else if (path.includes(URLs.termineTreffpunkt)) {
                const pathParts = path.split('?treffpunkt=')
                const id = pathParts[0].split('/').at(-1)
                let treffpunkt = decodeURIComponent(pathParts[1]).replace(/\+/g, ' ')
                if (treffpunkt == '') treffpunkt = null
                const termin = this.alleTermine.find((termin) => termin.id == id)
                termin.treffpunkt = treffpunkt
                response = {}
            }
        }

        if (method === 'patch') {
            if (path.includes(URLs.lehrTaetigkeitMacheZuVertretung)) {
                const lehrtaetigkeitId = +path.split('/').at(-1)
                this.alleTermine.forEach((termin) => {
                    termin.lehrTaetigkeiten.forEach((lehrTaetigkeit, index) => {
                        if (lehrTaetigkeit.id == lehrtaetigkeitId) {
                            termin.vertretungen.push(lehrTaetigkeit)
                            termin.lehrTaetigkeiten.splice(index, 1)
                        }
                    })
                })
                response = {}
            } else if (path.includes(URLs.vertretungMacheZuLehrTaetigkeit)) {
                const lehrtaetigkeitId = +path.split('/').at(-1)
                this.alleTermine.forEach((termin) => {
                    termin.vertretungen.forEach((lehrTaetigkeit, index) => {
                        if (lehrTaetigkeit.id == lehrtaetigkeitId) {
                            termin.lehrTaetigkeiten.push(lehrTaetigkeit)
                            termin.vertretungen.splice(index, 1)
                        }
                    })
                })
                response = {}
            }
        }

        return response
    }
}

const testAdapterLehrendeneintragung = new TestAdapterLehrendeneintragung()

export default testAdapterLehrendeneintragung
