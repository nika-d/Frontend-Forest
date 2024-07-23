import { AbstractAPI } from './AbstractAPI'
import { Repository } from '../repository/common/Repository'
import { Raum } from '../Raum'
import URLsOfBaseData from './URLsOfBaseData'

export class RaumAPI extends AbstractAPI<Raum> {
    protected endpoint = URLsOfBaseData.raeume
    async fetchAll(): Promise<Repository<Raum>> {
        return this.abstractFetchALl(Raum as unknown as Raum)
    }
}
