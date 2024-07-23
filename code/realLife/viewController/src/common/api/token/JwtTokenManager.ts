import apiContainer from '../ApiContainer'
import { NotLoggedInToBackendError } from './NotLoggedInToBackendError'
import { RequestNotSuccessfulError } from '../RequestNotSuccessfulError'
import { JwtToken } from './JwtToken'
import { LoginToken } from './LoginToken'
import { JSONValue } from '../JSON'
export class JwtTokenManager {
    public static currentToken: LoginToken | null = null
    private static currentRetrievalPromise: Promise<void> | null = null

    public static async getToken(): Promise<LoginToken> {
        if (this.currentToken === null) {
            if (this.currentRetrievalPromise !== null) {
                // another http call is already retrieving the token
                await this.currentRetrievalPromise
            } else {
                this.currentRetrievalPromise = this.retrieveLoginTokenFromBackend()
                await this.currentRetrievalPromise.finally(() => {
                    this.currentRetrievalPromise = null
                })
            }
        }
        return this.currentToken as LoginToken
    }

    public static async refreshLoginToken(): Promise<void> {
        await this.retrieveLoginTokenFromBackend()
    }

    private static async retrieveLoginTokenFromBackend(): Promise<void> {
        await apiContainer
            .simpleGetWithCookie('token/create')
            .then((response) => {
                this.currentToken = new JwtToken(response['value' as keyof JSONValue])
            })
            .catch((e) => {
                if (e instanceof RequestNotSuccessfulError) {
                    if (
                        e.statusCode == 403 &&
                        (e.responseJson ? (e.responseJson['errorCode' as keyof JSONValue] as string) : '') ==
                            'notLoggedInWithCookie'
                    ) {
                        throw new NotLoggedInToBackendError(
                            e.responseJson ? e.responseJson['loginLink' as keyof JSONValue] : null,
                        )
                    }
                }
                throw e
            })
    }
}
