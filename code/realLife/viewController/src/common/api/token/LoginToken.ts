export abstract class LoginToken {
    constructor(public readonly token: string) {
        this.checkToken()
    }
    public toString(): string {
        return this.token
    }
    protected checkToken(): void {
        if (this.token.length < 5) {
            throw new Error('Token is too short')
        }
    }
}
