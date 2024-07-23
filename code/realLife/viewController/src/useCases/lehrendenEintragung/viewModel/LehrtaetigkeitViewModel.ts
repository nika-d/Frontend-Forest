import { Repository } from '../../../models/repository/common/Repository'
import { Person } from '../../../models/Person'
import { Einrichtung } from '../../../models/Einrichtung'
import { Lehrtaetigkeit } from '../../../models/Lehrtaetigkeit'
import { initObjectFromDTO } from '../../../models/common/initObjectFromDTO'
import { type domainId } from '../../../models/common/domainId'
import { z } from 'zod'

export class LehrtaetigkeitVmDTO {
    readonly id!: domainId
    readonly terminId!: domainId
    readonly person!: Person
    readonly einrichtung!: Einrichtung
    readonly isVertretung: boolean = false
    readonly ungeplanteEinrichtung: boolean = false
}

export class LehrtaetigkeitViewModel extends LehrtaetigkeitVmDTO {
    constructor(dto: Partial<LehrtaetigkeitVmDTO>) {
        super()
        initObjectFromDTO(dto, this, schema)
    }

    static fromRepos(data: {
        lehrtaetigkeiten: Lehrtaetigkeit[]
        personen: Repository<Person>
        einrichtungen: Repository<Einrichtung>
    }): LehrtaetigkeitViewModel[] {
        return data.lehrtaetigkeiten.map((lehrtaetigkeit) => {
            if (!data.personen.get(lehrtaetigkeit.personId)) {
                throw new Error('Person not found: ' + lehrtaetigkeit.personId)
            }
            if (!data.einrichtungen.get(lehrtaetigkeit.einrichtungsId)) {
                throw new Error('Einrichtung not found: ' + lehrtaetigkeit.einrichtungsId)
            }
            return new LehrtaetigkeitViewModel({
                id: lehrtaetigkeit.id,
                terminId: lehrtaetigkeit.terminId,
                person: data.personen.get(lehrtaetigkeit.personId) as Person,
                einrichtung: data.einrichtungen.get(lehrtaetigkeit.einrichtungsId) as Einrichtung,
                isVertretung: lehrtaetigkeit.isVertretung,
                ungeplanteEinrichtung: lehrtaetigkeit.ungeplanteEinrichtung,
            })
        })
    }
}

const schema = z.object({
    id: z.number().min(1),
    terminId: z.string().min(5),
    person: z.instanceof(Person),
    einrichtung: z.instanceof(Einrichtung),
    isVertretung: z.boolean().optional(),
    ungeplanteEinrichtung: z.boolean().optional(),
})
