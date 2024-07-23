import { Repository } from '../../../models/repository/common/Repository'
import { Termin } from '../../../models/Termin'
import { LehrtaetigkeitRepository } from '../../../models/repository/custom/LehrtaetigkeitRepository'
import { Person } from '../../../models/Person'
import { Veranstaltung } from '../../../models/Studienstruktur/Veranstaltung'
import { Studiengang } from '../../../models/Studienstruktur/Studiengang'
import { Modul } from '../../../models/Studienstruktur/Modul'
import { Raum } from '../../../models/Raum'
import { Einrichtung } from '../../../models/Einrichtung'
import { UnterLehrformat } from '../../../models/Studienstruktur/UnterLehrformat'
import { LehrtaetigkeitViewModel } from './LehrtaetigkeitViewModel'
import Timespan from '../../../models/common/Timespan'
import { initObjectFromDTO } from '../../../models/common/initObjectFromDTO'
import { type domainId } from '../../../models/common/domainId'
import { z } from 'zod'

export class TerminVmDTO {
    readonly id!: domainId
    readonly gruppenbezeichnung!: string
    readonly treffpunkt: string | null = null
    readonly campus: string | null = null
    readonly ohneLehrendeMitMeinerGeplantenEinrichtung: boolean = false
    readonly timespan!: Timespan
    readonly veranstaltungLangTitel!: string
    readonly unterLehrformat!: string
    readonly oberLehrformat!: string
    readonly fachsemester!: number
    readonly modulCode: string | null = null
    readonly modulTitel!: string
    readonly studiengangCode!: string
    readonly raumText: string | null = null
    readonly geplanteEinrichtungen: Einrichtung[] = []
    readonly lehrtaetigkeiten: LehrtaetigkeitViewModel[] = []
}

export class TerminViewModel {
    readonly id!: domainId
    readonly gruppenbezeichnung!: string
    private _treffpunkt: string | null
    readonly campus: string | null
    private _ohneLehrendeMitMeinerGeplantenEinrichtung: boolean
    readonly timespan!: Timespan
    readonly veranstaltungLangTitel!: string
    readonly unterLehrformat!: string
    readonly oberLehrformat!: string
    readonly fachsemester!: number
    readonly modulCode: string | null
    readonly modulTitel!: string
    readonly modulBezeichnung: string
    readonly studiengangCode!: string
    readonly raumText: string | null
    readonly geplanteEinrichtungen: Einrichtung[]
    private _lehrtaetigkeiten: LehrtaetigkeitViewModel[]

    private _ungeplanteEinrichtung!: boolean

    constructor(dto: Partial<TerminVmDTO>) {
        this.geplanteEinrichtungen = dto.geplanteEinrichtungen ?? []
        this._treffpunkt = dto.treffpunkt ?? null
        this.campus = dto.campus ?? null
        this.modulCode = dto.modulCode ?? null
        this.raumText = dto.raumText ?? null
        this._lehrtaetigkeiten = dto.lehrtaetigkeiten ?? []
        this._ohneLehrendeMitMeinerGeplantenEinrichtung = dto.ohneLehrendeMitMeinerGeplantenEinrichtung ?? false
        initObjectFromDTO(dto, this, schema, [
            'treffpunkt',
            'lehrtaetigkeiten',
            'ohneLehrendeMitMeinerGeplantenEinrichtung',
        ])
        this.modulBezeichnung = (this.modulCode ? this.modulCode + ' ' : '') + this.modulTitel
        this.computeUngeplanteEinrichtung()
    }

    private computeUngeplanteEinrichtung() {
        this._ungeplanteEinrichtung = this._lehrtaetigkeiten.some((lt) => lt.ungeplanteEinrichtung)
    }

    get treffpunkt(): string | null {
        return this._treffpunkt
    }

    get lehrtaetigkeiten(): LehrtaetigkeitViewModel[] {
        return this._lehrtaetigkeiten
    }

    get ohneLehrendeMitMeinerGeplantenEinrichtung(): boolean {
        return this._ohneLehrendeMitMeinerGeplantenEinrichtung
    }
    get ungeplanteEinrichtung(): boolean {
        return this._ungeplanteEinrichtung
    }

    public updateTreffpunkt(value: string | null) {
        this._treffpunkt = value
    }

    public updateLehrtaetigkeiten(lehrtaetigkeitenNew: LehrtaetigkeitViewModel[]) {
        this._lehrtaetigkeiten = lehrtaetigkeitenNew
        this.computeUngeplanteEinrichtung()
    }

    public updateOhneLehrendeMitMeinerGeplantenEinrichtung(value: boolean) {
        this._ohneLehrendeMitMeinerGeplantenEinrichtung = value
    }

    static fromRepos(data: {
        termine: Repository<Termin>
        lehrtaetigkeiten: LehrtaetigkeitRepository
        personen: Repository<Person>
        veranstaltungen: Repository<Veranstaltung>
        module: Repository<Modul>
        studiengaenge: Repository<Studiengang>
        raeume: Repository<Raum>
        einrichtungen: Repository<Einrichtung>
        unterLehrformate: Repository<UnterLehrformat>
    }): TerminViewModel[] {
        return data.termine.all().map((termin) => {
            const veranstaltung = data.veranstaltungen.get(termin.veranstaltungsId)
            if (!veranstaltung) throw new Error('Veranstaltung not found: ' + termin.veranstaltungsId)
            const modul = data.module.get(veranstaltung.modulId)
            if (!modul) throw new Error('Modul not found: ' + veranstaltung.modulId)
            const unterLehrformat = data.unterLehrformate.get(veranstaltung.unterLehrformatId)
            if (!unterLehrformat) throw new Error('UnterLehrformat not found: ' + veranstaltung.unterLehrformatId)
            const studiengang = data.studiengaenge.get(modul.studiengangId)
            if (!studiengang) throw new Error('Studiengang not found: ' + modul.studiengangId)
            const geplanteEinrichtungen = termin.geplanteEinrichtungsIds.map((einrichtungsId) => {
                const einrichtung = data.einrichtungen.get(einrichtungsId)
                if (!einrichtung) throw new Error('Einrichtung not found: ' + einrichtungsId)
                return einrichtung
            })
            const raum = termin.raumId ? data.raeume.get(termin.raumId) : null
            if (termin.raumId && !raum) throw new Error('Raum not found: ' + termin.raumId)

            return new TerminViewModel({
                id: termin.id,
                gruppenbezeichnung: termin.gruppenbezeichnung,
                treffpunkt: termin.treffpunkt,
                campus: termin.campus,
                ohneLehrendeMitMeinerGeplantenEinrichtung: termin.ohneLehrendeMitMeinerGeplantenEinrichtung,
                timespan: termin.timespan,
                veranstaltungLangTitel: veranstaltung.langTitel,
                unterLehrformat: unterLehrformat.titel,
                oberLehrformat: unterLehrformat.oberLehrformat,
                fachsemester: modul.fachsemester,
                modulCode: modul.code,
                modulTitel: modul.titel,
                studiengangCode: studiengang.code,
                raumText: raum ? raum.raumText : null,
                geplanteEinrichtungen: geplanteEinrichtungen,
                lehrtaetigkeiten: LehrtaetigkeitViewModel.fromRepos({
                    lehrtaetigkeiten: data.lehrtaetigkeiten.allByTerminId(termin.id),
                    personen: data.personen,
                    einrichtungen: data.einrichtungen,
                }),
            } as unknown as TerminVmDTO)
        })
    }
}

const schema = z.object({
    id: z.string().min(2),
    gruppenbezeichnung: z.string().min(1),
    treffpunkt: z.string().min(1).optional().nullable(),
    campus: z.string().min(2).optional().nullable(),
    timespan: z.instanceof(Timespan),
    veranstaltungLangTitel: z.string().min(1),
    unterLehrformat: z.string().min(1),
    oberLehrformat: z.string().min(1),
    fachsemester: z.number().min(1),
    modulCode: z.string().min(1).optional().nullable(),
    modulTitel: z.string().min(1),
    studiengangCode: z.string().min(1),
    raumText: z.string().min(1).optional().nullable(),
    ohneLehrendeMitMeinerGeplantenEinrichtung: z.boolean().optional().nullable(),
    geplanteEinrichtungen: z.array(z.instanceof(Einrichtung)).optional().nullable(),
    lehrtaetigkeiten: z.array(z.instanceof(LehrtaetigkeitViewModel)).optional().nullable(),
})
