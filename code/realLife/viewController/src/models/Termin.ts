import { initObjectFromDTO } from './common/initObjectFromDTO'
import Timespan from './common/Timespan'
import { type domainId } from './common/domainId'
import { z } from 'zod'

class CommonTerminDTOValues {
    readonly id!: domainId
    readonly veranstaltungsId!: domainId
    readonly raumId: domainId | null = null
    readonly campus: string | null = ''
    readonly gruppenbezeichnung!: string
    readonly treffpunkt: string | null = null
    readonly ohneLehrendeMitMeinerGeplantenEinrichtung: boolean = false
}
export class TerminDTO extends CommonTerminDTOValues {
    readonly start!: string
    readonly ende!: string
    readonly geplanteEinrichtungen: domainId[] = []
}
export class Termin extends CommonTerminDTOValues {
    readonly timespan: Timespan
    readonly geplanteEinrichtungsIds: domainId[]

    constructor(dto: Partial<TerminDTO>) {
        super()
        this.timespan = new Timespan(dto.start as string, dto.ende as string)
        this.geplanteEinrichtungsIds = dto.geplanteEinrichtungen ?? []
        initObjectFromDTO(dto, this, schema, ['start', 'ende', 'geplanteEinrichtungen'])
        //delete this['start']
        //delete this['ende']
        //delete this['geplanteEinrichtungen']
    }
}

const schema = z.object({
    id: z.string().min(5),
    veranstaltungsId: z.number().min(1),
    raumId: z.number().min(1).nullable().optional(),
    start: z.string().datetime({ offset: true }),
    ende: z.string().datetime({ offset: true }),
    campus: z.nullable(z.string().min(1).nullable().optional()),
    gruppenbezeichnung: z.string().min(1),
    treffpunkt: z.string().min(3).nullable().optional(),
    geplanteEinrichtungen: z.array(z.number().min(1)).optional(),
    ohneLehrendeMitMeinerGeplantenEinrichtung: z.boolean().optional(),
})
