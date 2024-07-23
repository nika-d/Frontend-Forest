import apiContainer from '../../../../../common/api/ApiContainer'
import { AbstractLehrtaetigkeitAction } from './actions/AbstractLehrtaetigkeitAction'
import { CreateAction } from './actions/CreateAction'
import { DeleteAction } from './actions/DeleteAction'
import { ChangeEinrichtungAction } from './actions/ChangeEinrichtungAction'
import { ChangeVertretungAction } from './actions/ChangeVertretungAction'
import URLs from '../URLs'

export class LehrtaetigkeitEditAPI {
    protected endpointLehrtaetigkeit = URLs.lehrTaetigkeit + '/'
    protected endpointVertretung = URLs.vertretung + '/'

    async executeActions(actions: AbstractLehrtaetigkeitAction[]): Promise<Error[]> {
        const errors: Error[] = []

        for (const action of actions.filter((action) => action instanceof CreateAction)) {
            await this.executeCreate(action as CreateAction).catch((error: Error) => errors.push(error))
        }

        for (const action of actions.filter((action) => action instanceof ChangeEinrichtungAction)) {
            await this.executeChangeEinrichtung(action as ChangeEinrichtungAction).catch((error: Error) =>
                errors.push(error),
            )
        }

        for (const action of actions.filter((action) => action instanceof ChangeVertretungAction)) {
            await this.executeChangeVertretungsStatus(action as ChangeVertretungAction).catch((error: Error) =>
                errors.push(error),
            )
        }

        for (const action of actions.filter((action) => action instanceof DeleteAction)) {
            await this.executeDelete(action as DeleteAction).catch((error: Error) => errors.push(error))
        }

        return errors
    }

    private executeCreate(action: CreateAction): Promise<void> {
        const endpoint = action.isVertretung ? this.endpointVertretung : this.endpointLehrtaetigkeit
        return apiContainer.post(endpoint + action.terminId + '/_' + action.personId + '_/' + action.einrichtungsId)
    }

    private executeDelete(action: DeleteAction): Promise<void> {
        const endpoint = action.isVertretung ? this.endpointVertretung : this.endpointLehrtaetigkeit
        return apiContainer.delete(endpoint + action.lehrtaetigkeitId)
    }

    private executeChangeEinrichtung(action: ChangeEinrichtungAction): Promise<void> {
        const endpoint = action.isVertretung ? this.endpointVertretung : this.endpointLehrtaetigkeit
        return apiContainer.put(endpoint + action.lehrtaetigkeitId + '/' + action.newEinrichtungsId)
    }

    private executeChangeVertretungsStatus(action: ChangeVertretungAction): Promise<void> {
        const endpoint = action.fromIsVertretung
            ? URLs.vertretungMacheZuLehrTaetigkeit + '/'
            : URLs.lehrTaetigkeitMacheZuVertretung + '/'
        return apiContainer.patch(endpoint + action.lehrtaetigkeitId)
    }
}
