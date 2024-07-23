import { Repository } from '../../../../models/repository/common/Repository'
import { Raum } from '../../../../models/Raum'
import { RaumAPI } from '../../../../models/api/RaumAPI'
import { UnterLehrformat } from '../../../../models/Studienstruktur/UnterLehrformat'
import { UnterLehrformatAPI } from '../../../../models/api/UnterLehrformatAPI'

export function loadOtherModels(): [Promise<Repository<Raum>>, Promise<Repository<UnterLehrformat>>] {
    return [new RaumAPI().fetchAll(), new UnterLehrformatAPI().fetchAll()]
}
