import { AbstractLehrtaetigkeitAction } from './AbstractLehrtaetigkeitAction'
import { type domainId } from '../../../../../../models/common/domainId'

export class ChangeEinrichtungAction extends AbstractLehrtaetigkeitAction {
    constructor(
        readonly lehrtaetigkeitId: domainId,
        readonly newEinrichtungsId: domainId,
        readonly isVertretung: boolean,
    ) {
        super()
    }
}
