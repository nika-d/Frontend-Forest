import {
    EintragungshindernisLehrender,
    EintragungshindernisLehrenderDTO,
} from './EintragungshindernisLehrender'
import {
    EintragungshindernisVertretung,
    EintragungshindernisVertretungDTO,
} from './EintragungshindernisVertretung'
import { initObjectFromDTO } from '../../../../models/common/initObjectFromDTO'
import { type JSONValue } from '../../../../common/api/JSON'
import { type domainId } from '../../../../models/common/domainId'
import { z } from 'zod'

export class EintragungshindernisseDTO {
    public readonly lehrendenId!: domainId
    public readonly terminId!: domainId
    public readonly alsLehrender: Partial<EintragungshindernisLehrenderDTO> | null = null
    public readonly alsVertretung: Partial<EintragungshindernisVertretungDTO> | null = null
}
export class Eintragungshindernisse {
    readonly lehrendenId!: domainId
    readonly terminId!: domainId
    readonly alsLehrender: EintragungshindernisLehrender | undefined
    readonly alsVertretung: EintragungshindernisVertretung | undefined
    constructor(dto: Partial<EintragungshindernisseDTO>) {
        initObjectFromDTO(dto as JSONValue, this, schema)
        this.alsLehrender =
            dto.alsLehrender && this.hatLehrendesHindernis(dto.alsLehrender)
                ? new EintragungshindernisLehrender(dto.alsLehrender)
                : undefined
        this.alsVertretung =
            dto.alsVertretung && this.hatVertretungHindernis(dto.alsVertretung)
                ? new EintragungshindernisVertretung(dto.alsVertretung)
                : undefined
    }

    private hatLehrendesHindernis(dto: Partial<EintragungshindernisLehrenderDTO> | null | undefined) {
        return (
            dto?.abweichenderLehrender ||
            dto?.ungeplanteEinrichtung ||
            dto?.lehrberechtigungFehlt ||
            dto?.terminKonflikte ||
            dto?.qualifikationFehlt
        )
    }
    private hatVertretungHindernis(dto: Partial<EintragungshindernisVertretungDTO>) {
        return dto.ungeplanteEinrichtung || dto.terminKonflikte
    }
}

const schema = z.object({
    lehrendenId: z.string().min(1),
    terminId: z.string().min(2),
    alsLehrender: z.any(),
    alsVertretung: z.any(),
})
