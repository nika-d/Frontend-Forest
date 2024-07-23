import { AbstractAPI } from './AbstractAPI'
import { Repository } from '../repository/common/Repository'
import { Einrichtung } from '../Einrichtung'
import URLsOfBaseData from './URLsOfBaseData'

export class EinrichtungAPI extends AbstractAPI<Einrichtung> {
    protected endpoint = URLsOfBaseData.einrichtungen
    async fetchAll(): Promise<Repository<Einrichtung>> {
        return this.abstractFetchALl(Einrichtung as unknown as Einrichtung)
    }
}
