import { ApiStatusConstants } from './ApiConstants'

export class ApiStatusType {
    public readonly statusCode: string
    public readonly errorMessage: string

    constructor(statusCode: ApiStatusConstants = ApiStatusConstants.PENDING, errorMessage = '') {
        this.statusCode = statusCode
        this.errorMessage = errorMessage
    }

    get isPending(): boolean {
        return this.statusCode == ApiStatusConstants.PENDING
    }
    get isError(): boolean {
        return this.statusCode == ApiStatusConstants.ERROR
    }
    get isOk(): boolean {
        return this.statusCode == ApiStatusConstants.OK
    }
    get isInitial(): boolean {
        return this.statusCode == ApiStatusConstants.INITIAL
    }
}
