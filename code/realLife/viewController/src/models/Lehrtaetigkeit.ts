import { initObjectFromDTO } from './common/initObjectFromDTO'
import { type domainId } from './common/domainId'
import { z } from 'zod'

export type TerminLehrtaetigkeitenApiDTO = {
    id: domainId
    lehrTaetigkeiten: LehrtaetigkeitApiDTO[]
    vertretungen: LehrtaetigkeitApiDTO[]
}

export class LehrtaetigkeitApiDTO {
    readonly id!: domainId
    readonly personId!: domainId
    readonly einrichtungsId!: domainId
    readonly ungeplanteEinrichtung: boolean = false
}

export class LehrtaetigkeitModelDTO extends LehrtaetigkeitApiDTO {
    readonly terminId!: domainId
    readonly isVertretung: boolean = false
}
export class Lehrtaetigkeit extends LehrtaetigkeitModelDTO {
    constructor(dto: Partial<LehrtaetigkeitModelDTO>) {
        super()
        initObjectFromDTO(dto, this, schema)
    }

    static fromTerminJson(terminJson: TerminLehrtaetigkeitenApiDTO): Lehrtaetigkeit[] {
        const terminId = terminJson.id
        const alleLehrtaetigkeiten: Lehrtaetigkeit[] = []
        if (terminJson['lehrTaetigkeiten']) {
            terminJson['lehrTaetigkeiten'].forEach((lehrtaetigkeitDTO: LehrtaetigkeitApiDTO) => {
                const lehrtaetigkeitModelDTO: LehrtaetigkeitModelDTO = {
                    terminId,
                    isVertretung: false,
                    ...lehrtaetigkeitDTO,
                }
                alleLehrtaetigkeiten.push(new Lehrtaetigkeit(lehrtaetigkeitModelDTO))
            })
        }
        if (terminJson['vertretungen']) {
            terminJson['vertretungen'].forEach((lehrtaetigkeitDTO: LehrtaetigkeitApiDTO) => {
                const lehrtaetigkeitModelDTO: LehrtaetigkeitModelDTO = {
                    terminId,
                    isVertretung: true,
                    ...lehrtaetigkeitDTO,
                }
                alleLehrtaetigkeiten.push(new Lehrtaetigkeit(lehrtaetigkeitModelDTO))
            })
        }
        return alleLehrtaetigkeiten
    }
}

const schema = z.object({
    id: z.number().min(1),
    terminId: z.string().min(5),
    personId: z.string().min(1),
    einrichtungsId: z.number().min(1),
    ungeplanteEinrichtung: z.boolean().optional(),
    isVertretung: z.boolean().optional(),
})
