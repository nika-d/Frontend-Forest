import { WritableStore } from '$src/common/stores/WritableStore'
import { ApiStatusType } from './ApiStatusType'
import { ApiStatusConstants } from './ApiConstants'

export class ApiStatusViewModel extends WritableStore<ApiStatusType> {
    constructor(statusCode: ApiStatusConstants = ApiStatusConstants.PENDING, errorMessage = '') {
        super(new ApiStatusType(statusCode, errorMessage))
    }
    public reinitialize() {
        this.setTo(ApiStatusConstants.INITIAL)
    }

    public setTo(newStatus: ApiStatusConstants, message = '') {
        this.set(new ApiStatusType(newStatus, message))
    }
}
