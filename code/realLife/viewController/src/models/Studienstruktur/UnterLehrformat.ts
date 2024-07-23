import { initObjectFromDTO } from '../common/initObjectFromDTO'
import { type domainId } from '../common/domainId'
import { z } from 'zod'

export class UnterLehrformatDTO {
    readonly id!: domainId
    readonly titel!: string
    readonly oberLehrformat!: string
}
export class UnterLehrformat extends UnterLehrformatDTO {
    constructor(dto: Partial<UnterLehrformatDTO>) {
        super()
        initObjectFromDTO(dto, this, schema)
    }
}

const schema = z.object({
    id: z.number().min(1),
    titel: z.string().min(3),
    oberLehrformat: z.string().min(2),
})
