import { clone } from '../../clone'
import { type ApiRoute } from '../../ApiRoute'
import URLs from '../../../../src/useCases/lehrendenEintragung/models/api/URLs'
import lehrendenEintragungJsonData from './lehrendenEintragungJsonData'
import { Eintragungshindernisse } from '../../../../src/useCases/lehrendenEintragung/models/Eintragungshindernis/Eintragungshindernisse'
import { TerminDTO } from '../../../../src/models/Termin'
import getPathParametersByTheirNames from '../../../apiMockingHelpers/lehrendenEintragung/getPathParametersByTheirNames'
import { LehrtaetigkeitApiDTO, type TerminLehrtaetigkeitenApiDTO } from '../../../../src/models/Lehrtaetigkeit'
import createNewLehrTaetigkeit from '../../../apiMockingHelpers/lehrendenEintragung/createNewLehrTaetigkeit'
import computeTerminFields from '../../../data/lehrendenEintragung/helpers/computeTerminFields'

let sampleEintragungshindernisse: Array<Eintragungshindernisse> | null = null
let noEintragungshindernisse: Eintragungshindernisse | null = null
let termine: Array<TerminDTO & TerminLehrtaetigkeitenApiDTO> = []
let studienstruktur: Array<unknown> = null
let selectedZeitsemesterId: string
let selectedEinrichtungsId: string | null = ''

export function resetLehrendeneintragungRoutesData(): void {
    termine = []
    studienstruktur = null
    sampleEintragungshindernisse = null
    noEintragungshindernisse = null
}

const zeitsemesterRoute: ApiRoute = {
    path: URLs.zeitsemester,
    method: 'get',
    getResult: () => lehrendenEintragungJsonData.zeitsemester,
}

const meineEinrichtungstermineRoute: ApiRoute = {
    path: URLs.meineEinrichtungstermine,
    method: 'get',
    getResult: (path) => getMeineEinrichtungstermine(path),
}

const studienstrukturFuerMeineEinrichtungstermineRoute: ApiRoute = {
    path: URLs.studienstrukturFuerMeineEinrichtungstermine,
    method: 'get',
    getResult: () => getStudienstrukturFuerMeineEinrichtungstermine(),
}

const eintragungshindernisseRoute: ApiRoute = {
    path: URLs.lehrTaetigkeitEintragungshindernisse,
    method: 'post',
    getResult: (path, method, parameters) => {
        const lehrendenIds = parameters['lehrendenIds']
        const terminIds = parameters['terminIds']
        const foundHindernisse: Array<Eintragungshindernisse> = []
        lehrendenIds.forEach((lehrendenId) => {
            terminIds.forEach((terminId) => {
                const foundHindernis = Object.values(getSampleEintragungshindernisse()).find(
                    (jsonEntry) => jsonEntry.lehrendenId == lehrendenId && jsonEntry['terminId'] == terminId,
                )
                if (foundHindernis) {
                    foundHindernisse.push(foundHindernis)
                } else {
                    noEintragungshindernisse = clone(getNoEintragungshindernisse()) as Eintragungshindernisse
                    noEintragungshindernisse['lehrendenId'] = lehrendenId
                    noEintragungshindernisse['terminId'] = terminId
                    foundHindernisse.push(noEintragungshindernisse)
                }
            })
        })
        return foundHindernisse
    },
}

const addLehrtaetigkeitRoute: ApiRoute = {
    path: URLs.lehrTaetigkeit,
    method: 'post',
    getResult: (path) => {
        const { termin, neueLehrTaetigkeit } = createLehrtaetigkeit(path)

        termin.lehrTaetigkeiten ??= []
        termin.lehrTaetigkeiten.push(neueLehrTaetigkeit)
        return { lehrTaetigkeitsId: neueLehrTaetigkeit.id }
    },
}

const addVertretungRoute: ApiRoute = {
    path: URLs.vertretung,
    method: 'post',
    getResult: (path) => {
        const { termin, neueLehrTaetigkeit } = createLehrtaetigkeit(path)

        termin.vertretungen ??= []
        termin.vertretungen.push(neueLehrTaetigkeit)
        return { lehrTaetigkeitsId: neueLehrTaetigkeit.id }
    },
}

const terminReloadRoute: ApiRoute = {
    path: URLs.meineEinrichtungstermineReloadTermine,
    method: 'post',
    getResult: (path, method, parameters) => {
        const testDatenGefiltertNachIdsInCallParameters = getMeineEinrichtungstermine().filter((termin) =>
            (parameters as string[]).includes(termin.id as string),
        )

        return testDatenGefiltertNachIdsInCallParameters.map((termin) =>
            computeTerminFields(termin as TerminDTO & TerminLehrtaetigkeitenApiDTO),
        )
    },
}

const deleteLehrtaetigkeitRoute: ApiRoute = {
    path: URLs.lehrTaetigkeit,
    method: 'delete',
    getResult: (path) => {
        const id = +path.substring(path.lastIndexOf('/') + 1)
        getMeineEinrichtungstermine().forEach((termin) => {
            termin.lehrTaetigkeiten.forEach((lehrTaetigkeit, index) => {
                if (lehrTaetigkeit.id == id) {
                    termin.lehrTaetigkeiten.splice(index, 1)
                }
            })
        })
        return {}
    },
}

const deleteVertretungRoute: ApiRoute = {
    path: URLs.vertretung,
    method: 'delete',
    getResult: (path) => {
        const id = +path.substring(path.lastIndexOf('/') + 1)
        getMeineEinrichtungstermine().forEach((termin) => {
            termin.vertretungen.forEach((lehrTaetigkeit, index) => {
                if (lehrTaetigkeit.id == id) {
                    termin.vertretungen.splice(index, 1)
                }
            })
        })
        return {}
    },
}

const changeLehrtaetigkeitEinrichtungRoute: ApiRoute = {
    path: URLs.lehrTaetigkeit,
    method: 'put',
    getResult: (path) => {
        const lehrtaetigkeitId = +path.split('/').at(-2)
        const einrichtungsId = +path.split('/').at(-1)
        getMeineEinrichtungstermine().forEach((termin) => {
            termin.lehrTaetigkeiten.forEach((lehrTaetigkeit) => {
                if (lehrTaetigkeit.id == lehrtaetigkeitId) {
                    lehrTaetigkeit.einrichtungsId = +einrichtungsId
                }
            })
        })
        return {}
    },
}

const changeVertretungEinrichtungRoute: ApiRoute = {
    path: URLs.vertretung,
    method: 'put',
    getResult: (path) => {
        const vertretungsId = +path.split('/').at(-2)
        const einrichtungsId = +path.split('/').at(-1)
        getMeineEinrichtungstermine().forEach((termin) => {
            termin.vertretungen.forEach((vertretung) => {
                if (vertretung.id == vertretungsId) {
                    vertretung.einrichtungsId = +einrichtungsId
                }
            })
        })
        return {}
    },
}

const changeTreffpunktRoute: ApiRoute = {
    path: URLs.termineTreffpunkt,
    method: 'put',
    getResult: (path) => {
        const pathParts = path.split('?treffpunkt=')
        const id = pathParts[0].split('/').at(-1)
        let treffpunkt = decodeURIComponent(pathParts[1]).replace(/\+/g, ' ')
        if (treffpunkt == '') treffpunkt = null
        const termin = getMeineEinrichtungstermine().find((termin) => termin.id == id)
        termin['treffpunkt'] = treffpunkt
        return {}
    },
}

const macheZuVertretungRoute: ApiRoute = {
    path: URLs.lehrTaetigkeitMacheZuVertretung,
    method: 'patch',
    getResult: (path) => {
        const lehrtaetigkeitId = +path.split('/').at(-1)
        getMeineEinrichtungstermine().forEach((termin) => {
            termin.lehrTaetigkeiten.forEach((lehrTaetigkeit, index) => {
                if (lehrTaetigkeit.id == lehrtaetigkeitId) {
                    termin.vertretungen.push(lehrTaetigkeit)
                    termin.lehrTaetigkeiten.splice(index, 1)
                }
            })
        })
        return {}
    },
}

const macheZuLehrtaetigkeitRoute: ApiRoute = {
    path: URLs.vertretungMacheZuLehrTaetigkeit,
    method: 'patch',
    getResult: (path) => {
        const lehrtaetigkeitId = +path.split('/').at(-1)
        getMeineEinrichtungstermine().forEach((termin) => {
            termin.vertretungen.forEach((lehrTaetigkeit, index) => {
                if (lehrTaetigkeit.id == lehrtaetigkeitId) {
                    termin.lehrTaetigkeiten.push(lehrTaetigkeit)
                    termin.vertretungen.splice(index, 1)
                }
            })
        })
        return {}
    },
}

export const allLehrendeneintragungRoutes = [
    zeitsemesterRoute,
    meineEinrichtungstermineRoute,
    studienstrukturFuerMeineEinrichtungstermineRoute,
    eintragungshindernisseRoute,
    addLehrtaetigkeitRoute,
    addVertretungRoute,
    terminReloadRoute,
    deleteLehrtaetigkeitRoute,
    deleteVertretungRoute,
    changeLehrtaetigkeitEinrichtungRoute,
    changeVertretungEinrichtungRoute,
    changeTreffpunktRoute,
    macheZuVertretungRoute,
    macheZuLehrtaetigkeitRoute,
]

function getSampleEintragungshindernisse(): Eintragungshindernisse[] {
    return (
        sampleEintragungshindernisse ??
        (sampleEintragungshindernisse = clone(lehrendenEintragungJsonData.sampleEintragungshindernisse))
    )
}

function getNoEintragungshindernisse(): Eintragungshindernisse {
    return (
        noEintragungshindernisse ??
        (noEintragungshindernisse = clone(lehrendenEintragungJsonData.noEintragungshindernisse))
    )
}
function getMeineEinrichtungstermine(path: string | null = null): Array<TerminDTO & TerminLehrtaetigkeitenApiDTO> {
    if (path) {
        const zeitsemesterId = path.split('/')[1].split('?')[0] ?? ''
        const einrichtungsId = path.split('/')[2]?.split('?')[0] ?? ''
        if (zeitsemesterId != selectedZeitsemesterId || einrichtungsId != selectedEinrichtungsId) {
            termine = []
        }
        selectedZeitsemesterId = zeitsemesterId
        selectedEinrichtungsId = einrichtungsId
    }
    if (termine.length) {
        return termine
    }

    let termineCloned: Array<TerminDTO & TerminLehrtaetigkeitenApiDTO> = clone(
        lehrendenEintragungJsonData.termineInModulen15100Und15200Und15800,
    )

    // Weniger Termine bei Nicht-Default-Zeitsemester ist genug zum Testen
    if (selectedZeitsemesterId && selectedZeitsemesterId != '20212') {
        termineCloned = [termineCloned[0], termineCloned[5], termineCloned[10], termineCloned[15]]
    }
    if (selectedEinrichtungsId) {
        termineCloned = termineCloned.filter(
            (termin) =>
                termin.lehrTaetigkeiten.some((lt) => lt.einrichtungsId == +selectedEinrichtungsId) ||
                termin.geplanteEinrichtungen.includes(+selectedEinrichtungsId),
        )
    }

    return (termine = termineCloned)
}

function getStudienstrukturFuerMeineEinrichtungstermine() {
    return (
        studienstruktur ??
        (studienstruktur = clone(lehrendenEintragungJsonData.studienStrukturInModulen15100Und15200Und15800))
    )
}

function createLehrtaetigkeit(path: string) {
    const pathParameters = getPathParametersByTheirNames(path, ['terminId', 'personId', 'einrichtungsId'])
    const termin = getMeineEinrichtungstermine().find((termin) => termin.id == pathParameters.get('terminId'))

    const neueLehrTaetigkeit: LehrtaetigkeitApiDTO = createNewLehrTaetigkeit(
        pathParameters.get('personId'),
        pathParameters.get('einrichtungsId'),
    )
    return { termin, neueLehrTaetigkeit }
}
