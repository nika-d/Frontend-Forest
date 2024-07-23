import { initObjectFromDTO } from '../../../../models/common/initObjectFromDTO'
import { type domainId } from '../../../../models/common/domainId'
import { z } from 'zod'

export class TerminkonfliktDTO {
    readonly terminId!: domainId
    readonly terminBeschreibung!: string
}
export class Terminkonflikt extends TerminkonfliktDTO {
    constructor(dto: Partial<TerminkonfliktDTO>) {
        super()
        initObjectFromDTO(dto, this, schema)
    }
}

const schema = z.object({
    terminId: z.string().min(1),
    terminBeschreibung: z.string().min(2),
})
