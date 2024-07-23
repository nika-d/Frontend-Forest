import { LehrtaetigkeitViewModel } from './LehrtaetigkeitViewModel'
import { Person } from '../../../models/Person'
import { domainId } from '../../../models/common/domainId'
import { Einrichtung } from '../../../models/Einrichtung'
import { EintragungshindernisVertretung } from '../models/Eintragungshindernis/EintragungshindernisVertretung'
import { EintragungshindernisLehrender } from '../models/Eintragungshindernis/EintragungshindernisLehrender'
import { Eintragungshindernis } from '../models/Eintragungshindernis/Eintragungshindernis'

export class LehrtaetigkeitFormModel {
    isMarkedToBeDeleted: boolean = false
    isVertretung: boolean = false

    eintragungshindernis: Eintragungshindernis | undefined = undefined

    person: Person | undefined = undefined
    einrichtung: Einrichtung | undefined = undefined
    private _isEditMode: boolean = false

    constructor(
        readonly terminId: domainId,
        readonly lehrtaetigkeitViewModel: LehrtaetigkeitViewModel | null = null,
    ) {
        if (!lehrtaetigkeitViewModel) {
            return
        }
        this.isVertretung = lehrtaetigkeitViewModel.isVertretung
        this.person = lehrtaetigkeitViewModel.person
        this.einrichtung = lehrtaetigkeitViewModel.einrichtung
        if (lehrtaetigkeitViewModel.ungeplanteEinrichtung)
            this.eintragungshindernis = this.isVertretung
                ? new EintragungshindernisVertretung({ ungeplanteEinrichtung: true })
                : new EintragungshindernisLehrender({ ungeplanteEinrichtung: true })
        this._isEditMode = false
    }

    get isNew(): boolean {
        return !this.lehrtaetigkeitViewModel
    }

    get isChanged(): boolean {
        return (
            this.isMarkedToBeDeleted ||
            this.isNew ||
            this.lehrtaetigkeitViewModel?.person != this.person ||
            this.lehrtaetigkeitViewModel?.einrichtung != this.einrichtung ||
            this.lehrtaetigkeitViewModel?.isVertretung != this.isVertretung
        )
    }

    get isReadyToBeSubmitted(): boolean {
        const isComplete = !!(this.person && this.einrichtung)
        const hasBlockingEintragungshindernis = this.eintragungshindernis?.blocksSaving()
        return this.isChanged && isComplete && !hasBlockingEintragungshindernis
    }

    get isEditMode(): boolean {
        return this._isEditMode
    }

    set isEditMode(value: boolean) {
        if (!value && !this.isNew) {
            this.person = this.lehrtaetigkeitViewModel!.person
            this.einrichtung = this.lehrtaetigkeitViewModel!.einrichtung
            this.isVertretung = this.lehrtaetigkeitViewModel!.isVertretung
        }
        this._isEditMode = value
    }
}
