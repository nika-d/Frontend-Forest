import { env_variables } from '../../../env-variables'
import type { JSONValue } from './JSON'
import httpAdapter from './HttpAdapter'
import testAdapter from '../../../test/data/TestAdapter'
import { AbstractApiAdapter } from './AbstractApiAdapter'
import { LoginToken } from './token/LoginToken'
import { JwtToken } from './token/JwtToken'
import { InvalidCredentialsError } from './token/InvalidCredentialsError'
import { JwtTokenManager } from './token/JwtTokenManager'
import { RequestNotSuccessfulError } from './RequestNotSuccessfulError'
import { StaticLoginToken } from './token/StaticLoginToken'
import { NetworkError } from './NetworkError'
import { UserDisplayableError } from '../alerts/error/UserDisplayableError'
import { LehrenderSchonEingetragenError } from './LehrenderSchonEingetragenError'

class ApiContainer {
    private apiAdapter: AbstractApiAdapter = env_variables.API_CONFIG == 'production' ? httpAdapter : testAdapter

    public get(path: string, queryParams: Record<string, string> | null = null): Promise<JSONValue> {
        path = this.processGetPrams(queryParams, path)
        return this.httpCallWithJsonResult(path, 'get', {})
    }

    /** directly executes a get sending a cookie and without caring for tokens like the other get */
    public simpleGetWithCookie(path: string, queryParams: Record<string, string> | null = null): Promise<JSONValue> {
        path = this.processGetPrams(queryParams, path)
        return this.simpleHttpCallWithCookie(path, 'get')
    }

    private processGetPrams(queryParams: Record<string, string> | null, path: string): string {
        if (queryParams) {
            path = path + '?' + new URLSearchParams(queryParams)
        }
        return path
    }

    public post(path: string, data = null, queryParams?: Record<string, string>): Promise<void> {
        if (queryParams) {
            path = path + '?' + new URLSearchParams(queryParams)
        }
        return this.httpCallWithoutResult(path, 'post', data)
    }

    public postAndGetJsonResult(
        path: string,
        parameters: JSONValue | null = null,
        queryParams?: Record<string, string> | null,
    ): Promise<JSONValue> {
        if (queryParams) {
            path = path + '?' + new URLSearchParams(queryParams)
        }
        return this.httpCallWithJsonResult(path, 'post', parameters)
    }

    public patch(path: string): Promise<void> {
        return this.httpCallWithoutResult(path, 'patch', {})
    }
    public patchAndGetJsonResult(path: string): Promise<JSONValue> {
        return this.httpCallWithJsonResult(path, 'patch', {})
    }

    public delete(path: string): Promise<void> {
        return this.httpCallWithoutResult(path, 'delete', {})
    }

    public put(path: string, parameters: JSONValue | null = {}, queryParams?: Record<string, string>): Promise<void> {
        if (queryParams) {
            path = path + '?' + new URLSearchParams(queryParams).toString()
        }
        return this.httpCallWithoutResult(path, 'put', parameters)
    }
    public putAndGetJsonResult(
        path: string,
        parameters: JSONValue = {},
        queryParams?: Record<string, string>,
    ): Promise<JSONValue> {
        if (queryParams) {
            path = path + '?' + new URLSearchParams(queryParams).toString()
        }
        return this.httpCallWithJsonResult(path, 'put', parameters)
    }

    private httpCallWithoutResult(path: string, method: string, parameters: JSONValue | null = null): Promise<void> {
        return this.httpCallWithTokenLogic(path, method, parameters).then(() => {
            return
        })
    }
    private httpCallWithJsonResult(
        path: string,
        method: string,
        parameters: JSONValue | null = null,
    ): Promise<JSONValue> {
        return this.httpCallWithTokenLogic(path, method, parameters).then((response) =>
            this.processHttpResult(response),
        )
    }

    private async httpCallWithTokenLogic(
        path: string,
        method: string,
        parameters: JSONValue | null = null,
    ): Promise<Response> {
        let loginToken: LoginToken | null = null
        try {
            if (this.getStaticToken() == 'NO_TOKEN') {
                return this.simpleHttpCall(path, method, parameters)
            }
            return await this.getToken().then((token) => {
                loginToken = token
                return this.simpleHttpCallWithToken(path, method, parameters, token as LoginToken)
            })
        } catch (e: unknown) {
            if (
                loginToken !== null &&
                (loginToken as JwtToken | LoginToken) instanceof JwtToken &&
                e instanceof InvalidCredentialsError
            ) {
                console.log('Refreshing invalid login token')
                await JwtTokenManager.refreshLoginToken()
                return this.simpleHttpCallWithToken(
                    path,
                    method,
                    parameters,
                    JwtTokenManager.currentToken as LoginToken,
                )
            }
            if (e instanceof UserDisplayableError) {
                if (e.statusCode === 409 && e.messageBody.includes('LEHRENDER_SCHON_EINGETRAGEN')) {
                    throw new LehrenderSchonEingetragenError()
                }
                throw e
            }
            throw new NetworkError(e as Error)
        }
    }

    private simpleHttpCallWithToken(
        path: string,
        method: string,
        parameters: JSONValue | null,
        token: LoginToken,
    ): Promise<Response> {
        const headers = { 'X-AUTH-TOKEN': token.toString() }
        return this.simpleHttpCall(path, method, parameters, headers)
    }

    private simpleHttpCallWithCookie(
        path: string,
        method: string,
        parameters: JSONValue | null = null,
    ): Promise<JSONValue> {
        return this.simpleHttpCall(path, method, parameters, {}, true).then((response) =>
            this.processHttpResult(response as Response),
        )
    }

    private simpleHttpCall(
        path: string,
        method: string,
        parameters: JSONValue | null = null,
        headers: Record<string, string> = {},
        withCookie: boolean = false,
    ): Promise<Response> {
        return this.apiAdapter.httpCall(path, method, parameters, headers, withCookie).then(async (response) => {
            // fetch treats failed network requests as normal cases, to get proper error handling, we have to generate it ourselves
            if (!response || !response.ok) {
                throw this.handleErrors(response, await response.json())
            }
            return response
        })
    }

    private handleErrors(response: Response, responseJson: JSONValue): Error {
        if (
            response.status == 401 &&
            responseJson !== null &&
            responseJson['errorCode' as keyof JSONValue] == 'Unauthorized' &&
            responseJson['errorMessage' as keyof JSONValue] == 'INVALID_JWT'
        ) {
            return new InvalidCredentialsError()
        }
        return new RequestNotSuccessfulError(response, responseJson)
    }

    private getToken(): Promise<LoginToken | null> {
        const staticToken = this.getStaticToken()
        if (staticToken) {
            return Promise.resolve(new StaticLoginToken(staticToken))
        } else {
            return JwtTokenManager.getToken().then((token) => {
                return token
            })
        }
    }

    private getStaticToken() {
        const staticTokenVar = env_variables.LLP_API_STATIC_TOKEN
        if (staticTokenVar == 'FROM_COOKIE') {
            return null
        }
        return env_variables.LLP_API_STATIC_TOKEN
    }

    private processHttpResult(response: Response): Promise<JSONValue> {
        return response.json().then((json) => {
            return json
        })
    }
}

const apiContainer = new ApiContainer()

export default apiContainer
