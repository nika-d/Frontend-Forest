import apiContainer from '../../common/api/ApiContainer'
import { type JSONValue } from '../../common/api/JSON'
import { Repository } from '../repository/common/Repository'
import { ClassWithId } from '../common/ClassWithId'
import { domainId } from '../common/domainId'
import { env_variables } from '../../../env-variables'

export abstract class AbstractAPI<T extends ClassWithId> {
    public static readonly stagingDynamicUserId: domainId | null = env_variables?.LLP_STAGING_DYNAMIC_USER_ID ?? null
    protected abstract endpoint: string

    /** For simple use cases: Fetches all models from the API */
    protected async abstractFetchALl(modelClass: T): Promise<Repository<T>> {
        const response = apiContainer.get(this.endpoint)
        return this.createCommonRepositoryFromApiResponse(response, modelClass)
    }
    protected async createCommonRepositoryFromApiResponse(
        response: Promise<JSONValue>,
        modelClass: T,
    ): Promise<Repository<T>> {
        return this.createCommonRepositoryFromResponseByFactoryMethod(
            response,
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            (data) => new modelClass(data),
        )
    }

    private async createCommonRepositoryFromResponseByFactoryMethod(
        response: Promise<JSONValue>,
        factoryMethod: (json: object) => T,
    ): Promise<Repository<T>> {
        return response.then((jsonArray: JSONValue) => {
            const models = (jsonArray as JSONValue[]).map((json) => factoryMethod(json as object)).flat() as T[]
            const repository = new Repository<T>()
            repository.addValues(models)
            return repository
        })
    }

    protected getQueryParamsWithStagingUserId(): Record<string, string> | null {
        return AbstractAPI.stagingDynamicUserId ? { dynamicUser: '' + AbstractAPI.stagingDynamicUserId } : null
    }
}
