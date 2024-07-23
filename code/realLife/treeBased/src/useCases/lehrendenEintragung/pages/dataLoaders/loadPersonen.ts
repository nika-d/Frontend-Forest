import { Repository } from '../../../../models/repository/common/Repository'
import { PersonAPI } from '../../../../models/api/PersonAPI'
import { LehrtaetigkeitRepository } from '../../../../models/repository/custom/LehrtaetigkeitRepository'
import { Person } from '../../../../models/Person'

export function loadPersonen(lehrtaetigkeitRepo: Promise<LehrtaetigkeitRepository>): Promise<Repository<Person>> {
    const api = new PersonAPI()
    const allActive = api.fetchAllActive()
    return lehrtaetigkeitRepo.then((lehrtaetigkeitRepo) => {
        const personIds = lehrtaetigkeitRepo.all().map((lehrtaetigkeit) => lehrtaetigkeit.personId)

        const allByIds = api.fetchAllByIds(personIds)
        return api.mergeAllByActiveAndByIds(allActive, allByIds)
    })
}
