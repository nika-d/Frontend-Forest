import { AbstractAPI } from './AbstractAPI'
import { Repository } from '../repository/common/Repository'
import { UnterLehrformat } from '../Studienstruktur/UnterLehrformat'
import URLsOfBaseData from './URLsOfBaseData'

export class UnterLehrformatAPI extends AbstractAPI<UnterLehrformat> {
    protected endpoint = URLsOfBaseData.unterLehrformate
    async fetchAll(): Promise<Repository<UnterLehrformat>> {
        return this.abstractFetchALl(UnterLehrformat as unknown as UnterLehrformat)
    }
}
