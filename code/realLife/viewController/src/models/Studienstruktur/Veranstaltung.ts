import { initObjectFromDTO } from '../common/initObjectFromDTO'
import { type domainId } from '../common/domainId'
import { z } from 'zod'

export class VeranstaltungDTO {
    readonly id!: domainId
    readonly unterLehrformatId!: domainId
    readonly modulId!: domainId
    readonly langTitel!: string
}
export class Veranstaltung extends VeranstaltungDTO {
    constructor(dto: Partial<VeranstaltungDTO>) {
        super()
        initObjectFromDTO(dto, this, schema)
    }
}

const schema = z.object({
    id: z.number().min(1),
    unterLehrformatId: z.number().min(1),
    modulId: z.number().min(1),
    langTitel: z.string().min(2),
})
