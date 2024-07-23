import {
    Terminkonflikt,
    TerminkonfliktDTO,
} from './Terminkonflikt'
import { EintragungshindernisLehrtaetigkeit } from './EintragungshindernisLehrtaetigkeit'
import { initObjectFromDTO } from '../../../../models/common/initObjectFromDTO'
import { type JSONValue } from '../../../../common/api/JSON'
import { z } from 'zod'

export class EintragungshindernisLehrenderDTO {
    readonly terminKonflikte: Partial<TerminkonfliktDTO>[] | null = null
    readonly lehrberechtigungFehlt: boolean = false
    readonly qualifikationFehlt: null | string = null
    readonly ungeplanteEinrichtung: boolean = false
    readonly abweichenderLehrender: false | string[] = false
}
export class EintragungshindernisLehrender extends EintragungshindernisLehrtaetigkeit {
    readonly terminKonflikte: Terminkonflikt[] = []
    readonly lehrberechtigungFehlt: boolean = false
    readonly qualifikationFehlt: string | null = null
    readonly ungeplanteEinrichtung: boolean = false
    readonly abweichenderLehrender: boolean = false
    constructor(dto: Partial<EintragungshindernisLehrenderDTO>) {
        super()
        initObjectFromDTO(dto as JSONValue, this, schema)

        this.abweichenderLehrender = Array.isArray(dto.abweichenderLehrender)
            ? dto.abweichenderLehrender.length > 0
            : !!dto.abweichenderLehrender
        const terminKonflikte = dto.terminKonflikte ?? []
        this.terminKonflikte = terminKonflikte.map((konfliktDTO) => new Terminkonflikt(konfliktDTO))
    }

    public blocksSaving(): boolean {
        return !!this.qualifikationFehlt || this.lehrberechtigungFehlt || this.terminKonflikte.length > 0
    }
}

const schema = z.object({
    terminKonflikte: z.array(z.any()).optional().nullable(),
    lehrberechtigungFehlt: z.boolean().optional(),
    qualifikationFehlt: z.string().optional().nullable(),
    ungeplanteEinrichtung: z.boolean().optional(),
    abweichenderLehrender: z.union([z.boolean(), z.array(z.string())]).optional(),
})
