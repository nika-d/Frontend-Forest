import { type JSONValue } from '../../src/common/api/JSON'
import createPromiseOfResponse from '../data/createPromiseOfResponse'
import { allCommonRoutes, resetCommonRoutesData } from './routes/commonRoutes'
import {
    allLehrendeneintragungRoutes,
    resetLehrendeneintragungRoutesData,
} from './routes/useCases/lehrendeneintragungRoutes'
import { type ApiRoute } from './ApiRoute'
import { type ResponseType } from '../data/ResponseType'
import { RouteMatcher } from './RouteMatcher'

const resetFunctions: Array<() => void> = [resetCommonRoutesData, resetLehrendeneintragungRoutesData]
const allRoutes = [...allCommonRoutes, ...allLehrendeneintragungRoutes]

export class FakeAPI {
    constructor(private routeMatcher = new RouteMatcher(allRoutes)) {
        this.resetData()
    }
    public async makeCall(path: string, method: string, parameters: JSONValue): Promise<Response> {
        const response = this.getResult(path, method, parameters)
        return createPromiseOfResponse(response)
    }

    public resetData() {
        resetFunctions.forEach((resetFunction: () => void) => resetFunction())
    }

    public getResult(path: string, method: string, parameters: JSONValue): ResponseType {
        const matchedRoute: ApiRoute | null = this.routeMatcher.matchRoute(path, method)

        if (!matchedRoute) {
            throw new Error('FakeAPI kennt Route nicht: ' + method + '-' + path + '_')
        }

        const response = matchedRoute.getResult(path, method, parameters)
        console.log('FAKE API CALL: ' + method + ' ' + path + '. Response:')
        console.log(response)

        return response
    }
}
