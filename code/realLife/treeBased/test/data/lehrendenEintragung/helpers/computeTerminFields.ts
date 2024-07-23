import type Mutable from './Mutable'
import { TerminDTO } from '../../../../src/models/Termin'
import type { TerminLehrtaetigkeitenApiDTO } from '../../../../src/models/Lehrtaetigkeit'
import type { JSONValue } from '../../../../src/common/api/JSON'

export default function (
    termin: TerminDTO & TerminLehrtaetigkeitenApiDTO,
    ohneLehrendeOverrideTrue: boolean = false,
): JSONValue {
    return setTerminOhneLehrende(
        setTerminUngeplant(termin as TerminDTO & TerminLehrtaetigkeitenApiDTO),
        ohneLehrendeOverrideTrue,
    )
}

function setTerminUngeplant(
    termin: Mutable<TerminDTO & TerminLehrtaetigkeitenApiDTO>,
): TerminDTO & TerminLehrtaetigkeitenApiDTO {
    termin.lehrTaetigkeiten.forEach((lehrTaetigkeit) => {
        lehrTaetigkeit.ungeplanteEinrichtung =
            termin.geplanteEinrichtungen && !termin.geplanteEinrichtungen?.includes(lehrTaetigkeit.einrichtungsId)
    })
    termin.vertretungen.forEach((vertretung) => {
        vertretung.ungeplanteEinrichtung = false
    })
    return termin
}

function setTerminOhneLehrende(
    termin: Mutable<TerminDTO & TerminLehrtaetigkeitenApiDTO>,
    ohneLehrendeOverrideTrue: boolean = false,
): JSONValue {
    termin.ohneLehrendeMitMeinerGeplantenEinrichtung = ohneLehrendeOverrideTrue || termin.lehrTaetigkeiten.length == 0
    return termin as unknown as JSONValue
}
