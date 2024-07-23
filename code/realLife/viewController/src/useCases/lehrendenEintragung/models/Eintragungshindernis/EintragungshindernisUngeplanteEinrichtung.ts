import { EintragungshindernisLehrender } from './EintragungshindernisLehrender'

/** Vom Frontend erzeugtes (künstliches) Eintragungshindernis, wenn die gewählte Einrichtung
 * nicht zu den geplanten passt */
export class EintragungshindernisUngeplanteEinrichtung extends EintragungshindernisLehrender {
    constructor() {
        super({ ungeplanteEinrichtung: true })
    }
}
