import apiContainer from '../../common/api/ApiContainer'
import { type domainId } from '../common/domainId'
import URLs from './URLsOfBaseData'
import { AbstractAPI } from './AbstractAPI'

type loginInfoDTO = {
    type: string
    identifier: domainId
}
export class LoginInfoAPI {
    protected endpoint = URLs.loginInfo

    public async getLoggedInPersonId(): Promise<domainId> {
        return apiContainer.get(this.endpoint).then((response) => {
            const typedResponse = response as loginInfoDTO
            if (!AbstractAPI.stagingDynamicUserId && typedResponse['type'] !== 'DynamicApiUser') {
                throw new Error('No User logged in - static tokens cannot identify user. ' + typedResponse['type'])
            }
            return typedResponse['identifier']
        })
    }
}
