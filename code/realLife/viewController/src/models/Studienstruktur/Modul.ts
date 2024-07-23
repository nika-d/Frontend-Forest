import { initObjectFromDTO } from '../common/initObjectFromDTO'
import { type domainId } from '../common/domainId'
import { z } from 'zod'

export class ModulDTO {
    readonly id!: domainId
    readonly studiengangId!: domainId
    readonly fachsemester!: number
    readonly titel!: string
    readonly code: string | null = null
}
export class Modul extends ModulDTO {
    constructor(dto: Partial<ModulDTO>) {
        super()
        initObjectFromDTO(dto, this, schema)
    }
}

const schema = z.object({
    id: z.number().min(1),
    studiengangId: z.number().min(1),
    fachsemester: z.number().min(1),
    titel: z.string().min(2),
    code: z.string().min(2).optional().nullable(),
})
