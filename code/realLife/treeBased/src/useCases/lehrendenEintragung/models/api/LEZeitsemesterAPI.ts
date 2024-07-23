import { AbstractTermineAPI } from './AbstractTermineAPI'
import apiContainer from '../../../../common/api/ApiContainer'
import URLs from './URLs'
import { Zeitsemester, ZeitsemesterDTO } from '../../../../models/Studienstruktur/Zeitsemester'
import { AllAndDefaultZeitsemester } from '../../../../models/Studienstruktur/AllAndDefaultZeitsemester'

export class LEZeitsemesterAPI extends AbstractTermineAPI {
    protected endpoint = URLs.zeitsemester

    fetchAllAndDefault(): Promise<AllAndDefaultZeitsemester> {
        const response = apiContainer.get(this.endpoint)
        return response.then((data) => {
            const dataTyped = data as unknown as {
                defaultZeitsemester: ZeitsemesterDTO
                alleZeitsemester: ZeitsemesterDTO[]
            }
            const defaultZeitsemester = new Zeitsemester(dataTyped['defaultZeitsemester'])
            const allZeitsemester = dataTyped['alleZeitsemester'].map(
                (zeitsemester: Zeitsemester) => new Zeitsemester(zeitsemester),
            )
            return new AllAndDefaultZeitsemester(defaultZeitsemester, allZeitsemester)
        })
    }
}
