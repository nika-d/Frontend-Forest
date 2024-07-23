import { Option } from './Option'
import { Person } from '../../../../../models/Person'
import { domainId } from '../../../../../models/common/domainId'
import { EintragungshindernisseAPI } from '../../../models/api/EintragungshindernisseAPI'
import { Eintragungshindernisse } from '../../../models/Eintragungshindernis/Eintragungshindernisse'

export function createAllOptionsByNameAndMail(
    allePersonen: Person[],
    personenInAllenLehrtaetigkeitenDesTermins: Set<Person>,
    initialPerson?: Person | undefined,
) {
    const alleAktiven = allePersonen.filter((person) => person.aktiv)
    const ohnePersonenInAnderenLehrtaetigkeitenDesTermins = alleAktiven
        .filter((person) => !personenInAllenLehrtaetigkeitenDesTermins.has(person))
        .concat(initialPerson || [])
    return new Map<string, Option>(
        ohnePersonenInAnderenLehrtaetigkeitenDesTermins.map((person) => [
            person.vollerName.toLowerCase() + person.email,
            new Option(person),
        ]),
    )
}

export function computeOptionsByInput(
    inputValue: string,
    allOptionsByNameAndMail: Map<string, Option>,
    selectedPerson?: Person | null,
): Option[] {
    if (selectedPerson || inputValue === '') {
        return []
    }
    const searchValue = inputValue.toLowerCase()
    const returnArray = []
    for (const [name, option] of allOptionsByNameAndMail.entries()) {
        if (returnArray.length >= 10) break
        if (name.includes(searchValue)) returnArray.push(option)
    }
    return returnArray
}

export async function fetchEintragungshindernisseForOptions(
    filteredOptions: Option[],
    terminId: domainId,
    isVertretung: boolean,
    eintragungshinderniseAPI = new EintragungshindernisseAPI(),
) {
    if (filteredOptions.length == 0) {
        return
    }

    const eintragungshindernisseAllerOptionen: Array<Eintragungshindernisse> = await eintragungshinderniseAPI.fetchAll(
        [terminId],
        filteredOptions.map((option) => option.person.id),
    )
    for (const eintragungshindernisseEinerOption of eintragungshindernisseAllerOptionen) {
        filteredOptions
            .find((option) => option.person.id === eintragungshindernisseEinerOption.lehrendenId)
            ?.setEintragungshindernisse(eintragungshindernisseEinerOption, isVertretung)
    }
}
