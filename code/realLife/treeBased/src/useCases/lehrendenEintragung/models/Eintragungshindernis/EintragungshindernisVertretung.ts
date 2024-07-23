import {
    Terminkonflikt,
    TerminkonfliktDTO,
} from './Terminkonflikt'
import { EintragungshindernisLehrtaetigkeit } from './EintragungshindernisLehrtaetigkeit'
import { initObjectFromDTO } from '../../../../models/common/initObjectFromDTO'
import { z } from 'zod'

export class EintragungshindernisVertretungDTO {
    readonly terminKonflikte: Partial<TerminkonfliktDTO>[] | null = null
    readonly ungeplanteEinrichtung: boolean = false
}
export class EintragungshindernisVertretung extends EintragungshindernisLehrtaetigkeit {
    readonly terminKonflikte: Terminkonflikt[] = []
    readonly ungeplanteEinrichtung: boolean = false
    readonly lehrberechtigungFehlt: boolean = false
    readonly qualifikationFehlt: string | null = null
    readonly abweichenderLehrender: boolean = false

    constructor(dto: Partial<EintragungshindernisVertretungDTO>) {
        super()
        initObjectFromDTO(dto, this, schema)
        const terminKonflikte = dto.terminKonflikte ?? []
        this.terminKonflikte = terminKonflikte.map((konfliktDTO) => new Terminkonflikt(konfliktDTO))
    }

    public blocksSaving(): boolean {
        return this.terminKonflikte.length > 0
    }
}

const schema = z.object({
    terminKonflikte: z.array(z.any()).optional().nullable(),
    ungeplanteEinrichtung: z.boolean().optional(),
})
