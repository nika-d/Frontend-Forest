import { type domainId } from './common/domainId'
import { z } from 'zod'
import { validate } from './common/validate'

type PossibleEinrichtungsFunktionen = 'einrichtungsleitung' | 'lehrkoordination' | 'lehrsekretariat'

export type EinrichtungsFunktionDto = {
    einrichtungsId: domainId
    art: PossibleEinrichtungsFunktionen
}

export class EinrichtungsFunktion {
    readonly einrichtungsId: domainId
    readonly art: EinrichtungsfunktionArt
    constructor(dto: EinrichtungsFunktionDto) {
        validate(dto, schema)
        this.einrichtungsId = dto.einrichtungsId
        this.art = new EinrichtungsfunktionArt(dto.art)
    }
}

export class EinrichtungsfunktionArt {
    constructor(public readonly art: PossibleEinrichtungsFunktionen) {
        validate(art, schemaArt)
    }
    hasRightOnLehrendeneintragung() {
        return this.art === 'lehrkoordination' || this.art === 'lehrsekretariat'
    }
}

const schemaArt = z.enum(['einrichtungsleitung', 'lehrkoordination', 'lehrsekretariat'])

const schema = z.object({
    einrichtungsId: z.number(),
    art: schemaArt,
})
