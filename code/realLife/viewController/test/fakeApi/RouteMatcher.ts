import { type ApiRoute } from './ApiRoute'

export class RouteMatcher {
    constructor(private allRoutes: Array<ApiRoute>) {}

    public matchRoute(path: string, method: string): ApiRoute | null {
        let matchedRoute: ApiRoute = null
        matchedRoute = this.allRoutes.find((route) => this.routeMatchesWithRegexp(route, path, method))
        if (!matchedRoute) {
            matchedRoute = this.allRoutes.find((route) => this.routeMatchesWithString(route, path, method))
        }
        return matchedRoute || null
    }

    private routeMatchesWithRegexp(route: ApiRoute, path: string, method: string): boolean {
        if (route.method !== method) {
            return false
        }
        if (!(route.path instanceof RegExp)) {
            return false
        }
        return route.path.exec(path) !== null
    }

    private routeMatchesWithString(route: ApiRoute, path: string, method: string): boolean {
        if (route.method.toLowerCase() !== method.toLowerCase()) {
            return false
        }
        if (route.path instanceof RegExp) {
            return false
        }
        return ('/' + path).toLowerCase().includes(('/' + route.path).toLowerCase())
    }
}
