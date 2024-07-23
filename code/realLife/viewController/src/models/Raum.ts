import { initObjectFromDTO } from './common/initObjectFromDTO'
import { type domainId } from './common/domainId'
import { z } from 'zod'

export class RaumDTO {
    readonly id!: domainId
    readonly titel!: string
    readonly adresse!: string
}
export class Raum extends RaumDTO {
    constructor(dto: Partial<RaumDTO>) {
        super()
        initObjectFromDTO(dto, this, schema)
    }

    toString() {
        return this.titel + ', ' + this.adresse
    }

    get raumText() {
        return this.titel + ', ' + this.adresse
    }
}

const schema = z.object({
    id: z.number().min(1),
    titel: z.string().min(3),
    adresse: z.string().min(3),
})
