import { z } from 'zod'
import { initObjectFromDTO } from './common/initObjectFromDTO'
import { EinrichtungsFunktion, type EinrichtungsFunktionDto } from './EinrichtungsFunktion'
import { type domainId } from './common/domainId'

export class PersonCommonValues {
    readonly id!: domainId
    readonly nachname!: string
    readonly vorname!: string
    readonly email!: string
    readonly titel: string | null = null

    readonly aktiv: boolean = true

    readonly einrichtungsIds: domainId[] = []
    readonly qualifikationen: string[] = []
}

export class PersonDTO extends PersonCommonValues {
    readonly einrichtungsFunktionen: EinrichtungsFunktionDto[] = []
}

export class Person extends PersonCommonValues {
    readonly einrichtungsFunktionen: EinrichtungsFunktion[] = []

    constructor(dto: Partial<PersonDTO>) {
        super()
        initObjectFromDTO(dto, this, schema, ['einrichtungsFunktionen'])
        this.einrichtungsFunktionen = dto.einrichtungsFunktionen?.map((f) => new EinrichtungsFunktion(f)) ?? []
    }

    get vollerName(): string {
        return this.nachname + ', ' + this.vorname
    }
}

const schema = z.object({
    id: z.string(),
    vorname: z.string().min(2),
    nachname: z.string().min(2),
    email: z.string().email(),
    titel: z.string().min(2).nullable().optional(),
    einrichtungsIds: z.array(z.number()).optional(),
    einrichtungsFunktionen: z.array(z.any()).optional(),
    qualifikationen: z.array(z.string().min(1)).optional(),
    aktiv: z.boolean().optional(),
})
