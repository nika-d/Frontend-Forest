import { AbstractApiAdapter } from './AbstractApiAdapter'
import { env_variables } from '../../../env-variables'
import { type JSONValue } from './JSON'

const BASE_URL = env_variables.LLP_API_URL

class HttpAdapter implements AbstractApiAdapter {
    /** @throw Error */
    public httpCall(
        path: string,
        method: string,
        parameters: JSONValue,
        headers?: Record<string, string>,
        withCookie: boolean = false,
    ): Promise<Response> {
        const requestObj: RequestInit = {
            method: method,
            headers: headers,
            body: parameters ? JSON.stringify(parameters) : null,
        }
        if (withCookie) {
            requestObj['credentials'] = 'include'
        }

        if (method === 'get') {
            delete requestObj['body']
        }

        return fetch(BASE_URL + path, requestObj)
    }
}

const httpAdapter = new HttpAdapter()

export default httpAdapter
