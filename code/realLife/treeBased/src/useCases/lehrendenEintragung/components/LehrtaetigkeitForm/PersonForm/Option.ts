import { Person } from '../../../../../models/Person'
import { Eintragungshindernisse } from '../../../models/Eintragungshindernis/Eintragungshindernisse'
import { EintragungshindernisLehrender } from '../../../models/Eintragungshindernis/EintragungshindernisLehrender'
import { EintragungshindernisVertretung } from '../../../models/Eintragungshindernis/EintragungshindernisVertretung'

export class Option {
    person: Person
    private _eintragungshindernisse: {
        alsLehrendes?: EintragungshindernisLehrender
        alsVertretung?: EintragungshindernisVertretung
    } = {}

    constructor(person: Person) {
        this.person = person
    }

    set eintragungshindernisse(eintragungshindernisse: Partial<Eintragungshindernisse>) {
        this._eintragungshindernisse.alsLehrendes = eintragungshindernisse.alsLehrender
        this._eintragungshindernisse.alsVertretung = eintragungshindernisse.alsVertretung
    }

    getEintragungshindernis(
        isVertretung: boolean,
    ): EintragungshindernisLehrender | EintragungshindernisVertretung | undefined {
        return isVertretung ? this._eintragungshindernisse.alsVertretung : this._eintragungshindernisse.alsLehrendes
    }
}
