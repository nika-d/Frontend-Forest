import { initObjectFromDTO } from '../common/initObjectFromDTO'
import { type domainId } from '../common/domainId'
import { z } from 'zod'

export class StudiengangDTO {
    readonly id!: domainId
    readonly code!: string
}
export class Studiengang extends StudiengangDTO {
    constructor(dto: Partial<StudiengangDTO>) {
        super()
        initObjectFromDTO(dto, this, schema)
    }
}

const schema = z.object({
    id: z.number().min(1),
    code: z.string().min(2),
})
