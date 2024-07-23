import { AbstractLehrtaetigkeitAction } from './AbstractLehrtaetigkeitAction'
import { type domainId } from '../../../../../../models/common/domainId'

export class DeleteAction extends AbstractLehrtaetigkeitAction {
    constructor(
        readonly lehrtaetigkeitId: domainId,
        readonly isVertretung: boolean,
    ) {
        super()
    }
}
