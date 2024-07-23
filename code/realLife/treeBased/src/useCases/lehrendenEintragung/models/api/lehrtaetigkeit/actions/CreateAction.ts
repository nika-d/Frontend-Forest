import { AbstractLehrtaetigkeitAction } from './AbstractLehrtaetigkeitAction'
import { type domainId } from '../../../../../../models/common/domainId'

export class CreateAction extends AbstractLehrtaetigkeitAction {
    constructor(
        readonly terminId: domainId,
        readonly personId: domainId,
        readonly einrichtungsId: domainId,
        readonly isVertretung: boolean,
    ) {
        super()
    }
}
