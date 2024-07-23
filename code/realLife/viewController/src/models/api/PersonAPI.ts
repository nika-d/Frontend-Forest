import apiContainer from '../../common/api/ApiContainer'
import { Person } from '../Person'
import { AbstractAPI } from './AbstractAPI'
import { Repository } from '../repository/common/Repository'
import { getArrayUnique } from '../../common/utils/arrayFunctions'
import { type domainId } from '../common/domainId'
import URLsOfBaseData from './URLsOfBaseData'

export class PersonAPI extends AbstractAPI<Person> {
    protected endpoint = URLsOfBaseData.personen

    async fetchAllActive(): Promise<Repository<Person>> {
        const response = apiContainer.get(this.endpoint)
        return this.createCommonRepositoryFromApiResponse(response, Person as unknown as Person)
    }

    async fetchAllByIds(personIds: domainId[]): Promise<Repository<Person>> {
        const response = apiContainer.postAndGetJsonResult(this.endpoint, getArrayUnique(personIds))
        return this.createCommonRepositoryFromApiResponse(response, Person as unknown as Person)
    }

    async mergeAllByActiveAndByIds(
        allActive: Promise<Repository<Person>>,
        allByIds: Promise<Repository<Person>>,
    ): Promise<Repository<Person>> {
        return Promise.all([allActive, allByIds]).then(([allActive, allByIds]) => {
            return allActive.addOrReplaceValuesOfRepo(allByIds)
        })
    }
}
