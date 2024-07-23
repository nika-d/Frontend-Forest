import jsonData from './jsonData'
import { clone } from '../clone'
import { type ApiRoute } from '../ApiRoute'
import URLsOfBaseData from '../../../src/models/api/URLsOfBaseData'
import type { JSONValue } from '../../../src/common/api/JSON'
import { EinrichtungDTO } from '../../../src/models/Einrichtung'
import { PersonDTO } from '../../../src/models/Person'
import { RaumDTO } from '../../../src/models/Raum'
import { UnterLehrformatDTO } from '../../../src/models/Studienstruktur/UnterLehrformat'
import { type domainId } from '../../../src/models/common/domainId'

let personen = null
let einrichtungen = null
let raeume = null
let unterLehrformate = null

export function resetCommonRoutesData(): void {
    personen = null
    einrichtungen = null
    raeume = null
    unterLehrformate = null
}

export const personAktivRoute: ApiRoute = {
    path: URLsOfBaseData.personen,
    method: 'get',
    getResult: () => getPersonen().filter((person) => person.aktiv),
}

export const personByIdRoute: ApiRoute = {
    path: URLsOfBaseData.personen,
    method: 'post',
    getResult: (path: string, method: string, requestBody: JSONValue) =>
        getPersonen().filter((person) => (requestBody as domainId[]).includes(person.id)),
}

const einrichtungenRoute: ApiRoute = {
    path: URLsOfBaseData.einrichtungen,
    method: 'get',
    getResult: () => getEinrichtungen(),
}

const raeumeRoute: ApiRoute = {
    path: URLsOfBaseData.raeume,
    method: 'get',
    getResult: () => getRaume(),
}

const unterLehrformateRoute: ApiRoute = {
    path: URLsOfBaseData.unterLehrformate,
    method: 'get',
    getResult: () => getUnterLehrformate(),
}

const loginInfoRoute: ApiRoute = {
    path: URLsOfBaseData.loginInfo,
    method: 'get',
    getResult: () => ({ type: 'DynamicApiUser', identifier: 'uZP+h5qES3kmCjvNcw4gHWNi+aU=' }),
}

function getPersonen(): PersonDTO[] {
    return personen ?? (personen = clone(jsonData.personen))
}
function getEinrichtungen(): EinrichtungDTO[] {
    return einrichtungen ?? (einrichtungen = clone(jsonData.einrichtungen))
}

function getRaume(): RaumDTO[] {
    return raeume ?? (raeume = clone(jsonData.raeume))
}

function getUnterLehrformate(): UnterLehrformatDTO[] {
    return unterLehrformate ?? (unterLehrformate = clone(jsonData.unterLehrformate))
}

export const allCommonRoutes = [
    personAktivRoute,
    personByIdRoute,
    einrichtungenRoute,
    raeumeRoute,
    unterLehrformateRoute,
    loginInfoRoute,
]
