import { LoginToken } from './LoginToken'

export class JwtToken extends LoginToken {
    protected checkToken(): void {
        if (!this.token || this.token.length < 100) {
            throw new Error('Token is too short to be a Json Web Token!')
        }
    }
}
