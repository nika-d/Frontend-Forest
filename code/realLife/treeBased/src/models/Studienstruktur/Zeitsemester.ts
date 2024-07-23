import { initObjectFromDTO } from '../common/initObjectFromDTO'
import { type domainId } from '../common/domainId'
import { z } from 'zod'

export class ZeitsemesterDTO {
    readonly id!: domainId
    readonly name!: string
}
export class Zeitsemester extends ZeitsemesterDTO {
    constructor(dto: Partial<ZeitsemesterDTO>) {
        super()
        initObjectFromDTO(dto, this, schema)
    }
}

const schema = z.object({
    id: z.number().min(20100),
    name: z.string().min(8).max(8),
})
