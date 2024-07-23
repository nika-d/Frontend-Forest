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
    selectedPerson?: Person | undefined,
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

export async function fetchEintragungshindernisse(
    filteredOptions: Option[],
    terminId: domainId,
    eintragungshinderniseAPI = new EintragungshindernisseAPI(),
) {
    if (filteredOptions.length == 0) {
        return
    }

    const filteredOptionsById = new Map<domainId, Option>(filteredOptions.map((option) => [option.person.id, option]))
    const eintragungshindernisseAllerOptionen: Array<Eintragungshindernisse> = await eintragungshinderniseAPI.fetchAll(
        [terminId],
        [...filteredOptionsById.keys()],
    )
    for (const eintragungshindernisseEinerOption of eintragungshindernisseAllerOptionen) {
        filteredOptionsById
            .get(eintragungshindernisseEinerOption.lehrendenId)!
            .setEintragungshindernisse(eintragungshindernisseEinerOption)
    }
}
