import { LehrtaetigkeitViewModel } from './LehrtaetigkeitViewModel'
import { Person } from '../../../models/Person'
import { domainId } from '../../../models/common/domainId'
import { Einrichtung } from '../../../models/Einrichtung'
import { EintragungshindernisLehrtaetigkeit } from '../models/Eintragungshindernis/EintragungshindernisLehrtaetigkeit'
import { EintragungshindernisUngeplanteEinrichtung } from '../models/Eintragungshindernis/EintragungshindernisUngeplanteEinrichtung'
import { EintragungshindernisseAPI } from '../models/api/EintragungshindernisseAPI'
import { getArrayIntersection } from '../../../common/utils/arrayFunctions'
import { Repository } from '../../../models/repository/common/Repository'
import { LehrtaetigkeitFormData } from './LehrtaetigkeitFormData'

export class LehrtaetigkeitFormViewModel implements LehrtaetigkeitFormData {
    private _isEditMode: boolean = false
    isMarkedToBeDeleted: boolean = false

    private _person: Person | null = null
    private _einrichtung: Einrichtung | null = null
    private _isVertretung: boolean = false
    private _einrichtungsOptionen: Einrichtung[] = []

    private _eintragungshindernis: EintragungshindernisLehrtaetigkeit | null = null
    private _eintragungshindernisFromApi: EintragungshindernisLehrtaetigkeit | null = null

    constructor(
        readonly terminId: domainId,
        public readonly geplanteEinrichtungen: Einrichtung[],
        readonly lehrtaetigkeitViewModel: LehrtaetigkeitViewModel | null = null,
        private readonly einrichtungsRepo: Repository<Einrichtung> | null = null,
        private readonly eintragungshindernisseAPI = new EintragungshindernisseAPI(),
    ) {
        if (lehrtaetigkeitViewModel) {
            this._isVertretung = lehrtaetigkeitViewModel.isVertretung
            this._person = lehrtaetigkeitViewModel.person
            this.updateEinrichtungsOptionen(this._person)
            this.einrichtung = lehrtaetigkeitViewModel.einrichtung
        }
    }

    get person(): Person | null {
        return this._person
    }

    set person(person: Person | null) {
        this._person = person
        this.updateEinrichtungsOptionen(person)
        this.autoselectEinrichtung()
    }

    get einrichtung(): Einrichtung | null {
        return this._einrichtung
    }

    set einrichtung(value: Einrichtung | null) {
        this._einrichtung = value
        this.updateEintragungshindernis()
    }

    get isVertretung(): boolean {
        return this._isVertretung
    }

    set isVertretung(isVertretung: boolean) {
        this._isVertretung = isVertretung
        this.fetchEintragungshindernisseOfCurrentPerson(isVertretung)
    }

    get isEditMode(): boolean {
        return this._isEditMode
    }

    set isEditMode(value: boolean) {
        if (!value && !this.isNew) {
            this._person = this.lehrtaetigkeitViewModel!.person
            this._einrichtung = this.lehrtaetigkeitViewModel!.einrichtung
            this._isVertretung = this.lehrtaetigkeitViewModel!.isVertretung
        }
        this._isEditMode = value
    }

    get isNew(): boolean {
        return !this.lehrtaetigkeitViewModel
    }

    get isChanged(): boolean {
        return (
            this.isMarkedToBeDeleted ||
            this.isNew ||
            this.lehrtaetigkeitViewModel?.person != this._person ||
            this.lehrtaetigkeitViewModel?.einrichtung != this._einrichtung ||
            this.lehrtaetigkeitViewModel?.isVertretung != this._isVertretung
        )
    }

    get isReadyToBeSubmitted(): boolean {
        const isComplete = !!this._person && !!this._einrichtung
        const hasBlockingEintragungshindernis = this._eintragungshindernis?.blocksSaving()
        return this.isChanged && isComplete && !hasBlockingEintragungshindernis
    }

    get einrichtungsOptionen(): Einrichtung[] {
        return this._einrichtungsOptionen
    }

    get eintragungshindernis(): EintragungshindernisLehrtaetigkeit | null {
        return this._eintragungshindernis
    }

    set eintragungshindernisFromApi(value: EintragungshindernisLehrtaetigkeit | null) {
        this._eintragungshindernisFromApi = value
        this.updateEintragungshindernis()
    }

    private fetchEintragungshindernisseOfCurrentPerson(isVertretung: boolean) {
        if (!this._person) {
            return
        }
        this.eintragungshindernisseAPI
            .fetchEintragungshindernisseForLehrtaetigkeit(this.terminId, this._person.id)
            .then((eintragungshindernisse) => {
                this.eintragungshindernisFromApi = isVertretung
                    ? eintragungshindernisse?.alsVertretung ?? null
                    : eintragungshindernisse?.alsLehrender ?? null
            })
    }

    private updateEintragungshindernis(): void {
        this._eintragungshindernis =
            this.einrichtung &&
            this.geplanteEinrichtungen.length > 0 &&
            !this.geplanteEinrichtungen.includes(this.einrichtung) &&
            !this._eintragungshindernisFromApi?.blocksSaving()
                ? new EintragungshindernisUngeplanteEinrichtung()
                : this._eintragungshindernisFromApi
    }

    private updateEinrichtungsOptionen(person: Person | null) {
        this._einrichtungsOptionen = person
            ? person.einrichtungsIds.map((einrichtungId) => this.einrichtungsRepo!.get(einrichtungId)!)
            : []
    }

    private autoselectEinrichtung(): void {
        if (this._einrichtungsOptionen.length == 0) {
            this._einrichtung = null
        } else if (this._einrichtungsOptionen?.length === 1) {
            this.einrichtung = this._einrichtungsOptionen[0]
        } else {
            const einrichtungenGeplantPersonIntersection = getArrayIntersection(
                this._einrichtungsOptionen,
                this.geplanteEinrichtungen,
            )
            if (einrichtungenGeplantPersonIntersection.length === 1) {
                this.einrichtung = einrichtungenGeplantPersonIntersection[0]
            } else {
                this.einrichtung = null
            }
        }
    }
}
