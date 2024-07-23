import { type JSONValue } from '../../src/common/api/JSON'
import { type ResponseType } from '../data/ResponseType'

export type ApiRoute = {
    path: RegExp | string // string is exact match, RegExp is pattern match
    method: string
    getResult: (path: string, method: string, requestBody: JSONValue) => ResponseType
}
