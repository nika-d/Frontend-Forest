import { AbstractLehrtaetigkeitAction } from './AbstractLehrtaetigkeitAction'
import { type domainId } from '../../../../../../models/common/domainId'

export class ChangeVertretungAction extends AbstractLehrtaetigkeitAction {
    constructor(
        readonly lehrtaetigkeitId: domainId,
        readonly toIsVertretung: boolean,
    ) {
        super()
    }
    get fromIsVertretung(): boolean {
        return !this.toIsVertretung
    }
}
