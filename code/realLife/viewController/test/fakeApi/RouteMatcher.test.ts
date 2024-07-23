import { type ApiRoute } from './ApiRoute'
import { RouteMatcher } from './RouteMatcher'

const routes: ApiRoute[] = [
    {
        path: 'lehrendeneintragung',
        method: 'GET',
        getResult: () => {},
    },
    {
        path: 'strukturFuerLehrendeneintragung',
        method: 'GET',
        getResult: () => {},
    },
    {
        path: 'lehrendeneintragung/lehrveranstaltungen',
        method: 'GET',
        getResult: () => {},
    },
    {
        path: /lehrendeneintragung\/lehrveranstaltungen\/\d+\/lehrende/,
        method: 'GET',
        getResult: () => {},
    },
]
describe('RouteMatcher', function () {
    test('matches a route given by a string', function () {
        const routeMatcher = new RouteMatcher(routes)
        const matchedRoute = routeMatcher.matchRoute('lehrendeneintragung/lehrveranstaltungen', 'GET')
        expect(matchedRoute).toEqual(routes[0])
    })
    test('matches a route given by a, when containing another route', function () {
        const routeMatcher = new RouteMatcher(routes)
        const matchedRoute = routeMatcher.matchRoute('strukturFuerLehrendeneintragung', 'GET')
        expect(matchedRoute).toEqual(routes[1])
    })
    test('* matches a route given by a regexp * routes with Regexp are matched with higher priority', function () {
        const routeMatcher = new RouteMatcher(routes)
        const matchedRoute = routeMatcher.matchRoute('lehrendeneintragung/lehrveranstaltungen/123/lehrende', 'GET')
        expect(matchedRoute).toEqual(routes[3])
    })
    test('matches a route given by a string with different case', function () {
        const routeMatcher = new RouteMatcher(routes)
        const matchedRoute = routeMatcher.matchRoute('Lehrendeneintragung/Lehrveranstaltungen', 'get')
        expect(matchedRoute).toEqual(routes[0])
    })

    test('returns null if no route matches', function () {
        const routeMatcher = new RouteMatcher(routes)
        const matchedRoute = routeMatcher.matchRoute('lehrendeneintragung/lehrveranstaltungen/123/lehrende', 'POST')
        expect(matchedRoute).toBeNull()
    })
})
