import { domainId } from '../../../../models/common/domainId'
import { loadAll } from './loadAll'
import { TerminViewModel } from '../../viewModel/TerminViewModel'
import { Router } from 'vue-router'
import { ref, Ref } from 'vue'
import { Repository } from '../../../../models/repository/common/Repository'
import { Person } from '../../../../models/Person'
import { Einrichtung } from '../../../../models/Einrichtung'

export default async function loadData(
    router: Router,
    terminViewModels: Ref<Array<TerminViewModel>> = ref([]),
    zeitsemesterId: domainId | null = null,
    einrichtungsId: domainId | null = null,
    personenRepo: Ref<Repository<Person> | null> = ref(null),
    einrichtungenRepo: Ref<Repository<Einrichtung> | null> = ref(null),
    errorOnMainPage: Ref<Error | null>,
    loadingPromises: Ref<Promise<unknown>[]>,
) {
    if (!zeitsemesterId && router.currentRoute.value?.query?.zeitsemester) {
        zeitsemesterId = router.currentRoute.value.query.zeitsemester as domainId
    }
    if (!einrichtungsId && router.currentRoute.value?.query?.einrichtung) {
        einrichtungsId = router.currentRoute.value.query.einrichtung as domainId
    }
    const loadFromAPIPromises = loadAll(zeitsemesterId, einrichtungsId) // >2000 Termine und versch. Einr.
    loadingPromises.value = loadFromAPIPromises
    await Promise.all(loadFromAPIPromises)
        .then(
            ([
                termine,
                lehrtaetigkeiten,
                personen,
                einrichtungen,
                veranstaltungen,
                module,
                studiengaenge,
                raeume,
                unterLehrformate,
            ]) => {
                terminViewModels.value = TerminViewModel.fromRepos({
                    termine,
                    lehrtaetigkeiten,
                    personen,
                    veranstaltungen,
                    module,
                    studiengaenge,
                    raeume,
                    einrichtungen,
                    unterLehrformate,
                })
                personenRepo.value = personen
                einrichtungenRepo.value = einrichtungen
            },
        )
        .catch((error) => {
            errorOnMainPage.value = error
            console.error(error)
        })
    loadingPromises.value = []
}
