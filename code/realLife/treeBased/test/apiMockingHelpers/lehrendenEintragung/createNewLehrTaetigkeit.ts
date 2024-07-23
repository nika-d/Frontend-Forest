import type { domainId } from '../../../src/models/common/domainId'
import { LehrtaetigkeitApiDTO } from '../../../src/models/Lehrtaetigkeit'

export default function (personId: domainId, einrichtungsId: domainId): LehrtaetigkeitApiDTO {
    const neueLehrTaetigkeit: LehrtaetigkeitApiDTO = {
        id: Math.round(Math.random() * 100000),
        personId: personId,
        einrichtungsId: typeof einrichtungsId === 'string' ? parseInt(einrichtungsId) : einrichtungsId,
        ungeplanteEinrichtung: false,
    }
    return neueLehrTaetigkeit
}
