import apiContainer from '../../../../common/api/ApiContainer'
import { AbstractAPI } from '../../../../models/api/AbstractAPI'
import { Repository } from '../../../../models/repository/common/Repository'
import { Veranstaltung } from '../../../../models/Studienstruktur/Veranstaltung'
import { Modul } from '../../../../models/Studienstruktur/Modul'
import { Studiengang } from '../../../../models/Studienstruktur/Studiengang'
import { type domainId } from '../../../../models/common/domainId'
import URLs from './URLs'
import { ClassWithId } from '../../../../models/common/ClassWithId'
import { JSONValue } from '../../../../common/api/JSON'

export class StudienstrukturFuerMeineEinrichtungstermineAPI extends AbstractAPI<ClassWithId> {
    protected endpoint = URLs.studienstrukturFuerMeineEinrichtungstermine
    constructor(zeitsemester: domainId, einrichtungsId: domainId | null = null) {
        super()
        this.endpoint += '/' + zeitsemester
        if (einrichtungsId) {
            this.endpoint += '/' + einrichtungsId
        }
    }

    allStrukturModels(): [
        Promise<Repository<Veranstaltung>>,
        Promise<Repository<Modul>>,
        Promise<Repository<Studiengang>>,
    ] {
        const response = apiContainer.get(this.endpoint, this.getQueryParamsWithStagingUserId())
        const veranstaltungRepo = this.createCommonRepositoryFromApiResponse(
            response.then((json) => json['veranstaltungen' as keyof JSONValue]),
            Veranstaltung as unknown as ClassWithId,
        ) as Promise<Repository<Veranstaltung>>
        const modulRepo = this.createCommonRepositoryFromApiResponse(
            response.then((json) => json['module' as keyof JSONValue]),
            Modul as unknown as ClassWithId,
        ) as Promise<Repository<Modul>>
        const studiengangRepo = this.createCommonRepositoryFromApiResponse(
            response.then((json) => json['studiengaenge' as keyof JSONValue]),
            Studiengang as unknown as ClassWithId,
        ) as Promise<Repository<Studiengang>>
        return [veranstaltungRepo, modulRepo, studiengangRepo]
    }
}
