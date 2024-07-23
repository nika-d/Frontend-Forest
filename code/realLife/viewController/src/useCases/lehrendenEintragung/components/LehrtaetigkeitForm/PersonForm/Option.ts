import { Eintragungshindernisse } from '../../../models/Eintragungshindernis/Eintragungshindernisse'
import { EintragungshindernisLehrtaetigkeit } from '../../../models/Eintragungshindernis/EintragungshindernisLehrtaetigkeit'
import { Person } from '../../../../../models/Person'

export class Option {
    eintragungshindernis?: EintragungshindernisLehrtaetigkeit

    constructor(public person: Person) {}

    setEintragungshindernisse(eintragungshindernisse: Eintragungshindernisse | undefined, isVertretung = false) {
        this.eintragungshindernis = isVertretung
            ? eintragungshindernisse?.alsVertretung
            : eintragungshindernisse?.alsLehrender
    }
}
