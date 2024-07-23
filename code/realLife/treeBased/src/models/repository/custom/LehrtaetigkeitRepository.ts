import { Lehrtaetigkeit } from '../../Lehrtaetigkeit'
import { Repository } from '../common/Repository'
import { type domainId } from '../../common/domainId'

export class LehrtaetigkeitRepository extends Repository<Lehrtaetigkeit> {
    private mapByTermin: Map<domainId, Lehrtaetigkeit[]> = new Map<string, Lehrtaetigkeit[]>()
    constructor(values: Lehrtaetigkeit[]) {
        super()
        this.addValues(values)
        values.forEach((value) => {
            if (!this.mapByTermin.has(value.terminId)) {
                this.mapByTermin.set(value.terminId, [])
            }
            this.mapByTermin.get(value.terminId)!.push(value)
        })
    }
    allByTerminId(terminId: domainId): Lehrtaetigkeit[] {
        return this.mapByTermin.get(terminId) ?? []
    }
}
