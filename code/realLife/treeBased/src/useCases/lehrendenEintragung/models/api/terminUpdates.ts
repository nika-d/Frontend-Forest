import { AbstractLehrtaetigkeitAction } from './lehrtaetigkeit/actions/AbstractLehrtaetigkeitAction'
import { DeleteAction } from './lehrtaetigkeit/actions/DeleteAction'
import { CreateAction } from './lehrtaetigkeit/actions/CreateAction'
import { ChangeEinrichtungAction } from './lehrtaetigkeit/actions/ChangeEinrichtungAction'
import { ChangeVertretungAction } from './lehrtaetigkeit/actions/ChangeVertretungAction'
import { LehrtaetigkeitEditAPI } from './lehrtaetigkeit/LehrtaetigkeitEditAPI'
import { TerminReloadAPI } from './TerminReloadAPI'
import { TerminViewModel } from '../../viewModel/TerminViewModel'
import { LehrtaetigkeitViewModel } from '../../viewModel/LehrtaetigkeitViewModel'
import { Repository } from '../../../../models/repository/common/Repository'
import { Person } from '../../../../models/Person'
import { Einrichtung } from '../../../../models/Einrichtung'
import throwManyErrors from '$src/useCases/lehrendenEintragung/components/copyPaste/throwManyErrors'
import { domainId } from '../../../../models/common/domainId'
import { TreffpunktEditAPI } from './TreffpunktEditAPI'
import { showNotification } from '../../../../common/alerts/showNotification'
import SuccessAlert from '../../../../common/alerts/SuccessAlert'
import ErrorAlert from '../../../../common/alerts/ErrorAlert'
import putArgumentsIntoText from '../../../../common/utils/putArgumentsIntoText'
import uiTextsLE from '../../../../common/uiTexts/lehrendenEintragung.json'
import { LehrenderSchonEingetragenError } from '../../../../common/api/LehrenderSchonEingetragenError'
import { ref } from 'vue'
import { LehrtaetigkeitFormData } from '../../viewModel/LehrtaetigkeitFormData'

export type DataToPasteType = { lehrtaetigkeitVM?: LehrtaetigkeitViewModel; treffpunkt?: string }

export const doPasteLaehrtaetigkeiten = () => {
    const dataToPaste = ref<DataToPasteType | null>(null)
    const indexToPaste = ref<number>(0)

    async function updateTermine({
        lehrtaetigkeitenFormsData,
        terminViewModels,
        personRepo,
        einrichtungRepo,
        selectedEinrichtungsId = null,
    }: {
        lehrtaetigkeitenFormsData: LehrtaetigkeitFormData[]
        terminViewModels: TerminViewModel[]
        personRepo: Repository<Person>
        einrichtungRepo: Repository<Einrichtung>
        selectedEinrichtungsId?: domainId | null
    }) {
        let successNumber = 0
        let failureNumber = 0
        for (indexToPaste.value = 0; indexToPaste.value < terminViewModels.length; indexToPaste.value++) {
            const lehrtaetigkeitenFormData = lehrtaetigkeitenFormsData[indexToPaste.value]
            if (!dataToPaste.value) {
                break
            }
            try {
                await updateLehrtaetigkeiten({
                    lehrtaetigkeitenFormsData: [lehrtaetigkeitenFormData] ?? [],
                    personRepo,
                    einrichtungRepo,
                    selectedEinrichtungsId,
                    terminVM: terminViewModels[indexToPaste.value],
                })
                successNumber++
            } catch (error) {
                if (error instanceof LehrenderSchonEingetragenError) {
                    successNumber++
                } else {
                    failureNumber++
                }
            }
        }

        if (successNumber > 0) {
            showNotification(
                new SuccessAlert(
                    putArgumentsIntoText(uiTextsLE.PASTE_FINISH_SUCCESS_DETAILS, successNumber.toString()),
                ),
            )
        }
        if (failureNumber > 0) {
            showNotification(
                new ErrorAlert(putArgumentsIntoText(uiTextsLE.PASTE_FINISH_FAILURE_DETAILS, failureNumber.toString())),
            )
        }
    }

    return { updateTermine, dataToPaste, indexToPaste }
}

export async function updateTreffpunktInAlleTermine(
    treffpunkt: string | null,
    terminViewModels: TerminViewModel[],
    personRepo: Repository<Person>,
    einrichtungRepo: Repository<Einrichtung>,
    selectedEinrichtungsId?: domainId | null,
) {
    const terminIds = terminViewModels.map((termin: TerminViewModel) => termin.id)
    await Promise.all(
        terminIds.map((terminId: domainId) => new TreffpunktEditAPI().executeUpdate(terminId, treffpunkt)),
    )

    await Promise.all(
        terminViewModels.map((terminVM) => reloadTermin(terminVM, personRepo, einrichtungRepo, selectedEinrichtungsId)),
    )

    showNotification(
        new SuccessAlert(putArgumentsIntoText(uiTextsLE.PASTE_FINISH_SUCCESS_DETAILS, terminIds.length.toString())),
    )
}

export async function updateTreffpunkt(treffpunkt: string | null, terminId: domainId) {
    await new TreffpunktEditAPI().executeUpdate(terminId, treffpunkt)
}
export async function updateLehrtaetigkeiten({
    lehrtaetigkeitenFormsData,
    personRepo,
    einrichtungRepo,
    selectedEinrichtungsId = null,
    terminVM,
}: {
    lehrtaetigkeitenFormsData: LehrtaetigkeitFormData[]
    personRepo: Repository<Person>
    einrichtungRepo: Repository<Einrichtung>
    selectedEinrichtungsId?: domainId | null
    terminVM: TerminViewModel
}) {
    const actions = createActionsFromFormsData(lehrtaetigkeitenFormsData)

    const errorsPromise = new LehrtaetigkeitEditAPI().executeActions(actions)
    await errorsPromise.then((errors) => {
        throwManyErrors(errors)
    })

    await reloadTermin(terminVM, personRepo, einrichtungRepo, selectedEinrichtungsId)
}

async function reloadTermin(
    terminVM: TerminViewModel,
    personRepo: Repository<Person>,
    einrichtungRepo: Repository<Einrichtung>,
    selectedEinrichtungsId?: domainId | null,
) {
    const [terminRepo, lehrtaetigkeitRepo] = new TerminReloadAPI(selectedEinrichtungsId).allTermineUndLehrtaetigkeiten([
        terminVM.id,
    ])
    await Promise.all([terminRepo, lehrtaetigkeitRepo]).then(([terminRepo, lehrtaetigkeitRepo]) => {
        const lt = LehrtaetigkeitViewModel.fromRepos({
            lehrtaetigkeiten: lehrtaetigkeitRepo.allByTerminId(terminVM.id),
            personen: personRepo,
            einrichtungen: einrichtungRepo,
        })
        terminVM.updateLehrtaetigkeiten(lt)
        terminVM.updateOhneLehrendeMitMeinerGeplantenEinrichtung(
            terminRepo.get(terminVM.id)?.ohneLehrendeMitMeinerGeplantenEinrichtung ?? false,
        )
        terminVM.updateTreffpunkt(terminRepo.get(terminVM.id)!.treffpunkt)
    })
}

function createActionsFromFormsData(
    lehrtaetigkeitenFormsData: LehrtaetigkeitFormData[],
): AbstractLehrtaetigkeitAction[] {
    return lehrtaetigkeitenFormsData.map((formData) => lehrtaetigkeitFormDataToActions(formData)).flat()
}
function lehrtaetigkeitFormDataToActions(formData: LehrtaetigkeitFormData): AbstractLehrtaetigkeitAction[] {
    if (!formData.isEditMode && !formData.isMarkedToBeDeleted && !formData.isNew) {
        return []
    }
    const actions: AbstractLehrtaetigkeitAction[] = []
    if (formData.isMarkedToBeDeleted) {
        actions.push(
            new DeleteAction(
                formData.lehrtaetigkeitViewModel?.id ?? '',
                formData.lehrtaetigkeitViewModel?.isVertretung ?? false,
            ),
        )
        return actions
    }
    if (formData.person != formData.lehrtaetigkeitViewModel?.person) {
        actions.push(
            new CreateAction(
                formData.terminId,
                formData.person?.id ?? '',
                formData.einrichtung?.id ?? 0,
                formData.isVertretung,
            ),
        )
        if (formData.lehrtaetigkeitViewModel?.person) {
            actions.push(
                new DeleteAction(
                    formData.lehrtaetigkeitViewModel?.id ?? '',
                    formData.lehrtaetigkeitViewModel?.isVertretung ?? false,
                ),
            )
        }

        return actions
    }
    if (formData.isNew) {
        actions.push(
            new CreateAction(
                formData.terminId,
                formData.person?.id ?? '',
                formData.einrichtung?.id ?? 0,
                formData.isVertretung,
            ),
        )
        return actions
    }

    if (formData.einrichtung?.id != formData.lehrtaetigkeitViewModel?.einrichtung.id) {
        actions.push(
            new ChangeEinrichtungAction(
                formData.lehrtaetigkeitViewModel?.id ?? '',
                formData.einrichtung?.id ?? 0,
                formData.lehrtaetigkeitViewModel!.isVertretung,
            ),
        )
    }

    if (formData.isVertretung != formData.lehrtaetigkeitViewModel?.isVertretung) {
        actions.push(new ChangeVertretungAction(formData.lehrtaetigkeitViewModel?.id ?? '', formData.isVertretung))
    }

    return actions
}
