// Quellen:
// https://github.com/quasarframework/quasar/discussions/8761#discussioncomment-4031103
// und darunter der nächste Post
// https://github.com/quasarframework/quasar/discussions/8761#discussioncomment-4673084
import { ComponentConstructor } from 'quasar'
type ExtractComponentProps<T> = T extends ComponentConstructor<infer X> ? X['$props'] : never
export const setQuasarComponentDefaultPropValues = <T extends ComponentConstructor>(
    component: T,
    propDefaults: {
        [K in keyof Partial<ExtractComponentProps<T>>]: ExtractComponentProps<T>[K]
    },
) => {
    for (const key in propDefaults) {
        const prop = component.props[key]
        switch (typeof prop) {
            case 'object':
                prop.default = propDefaults[key]
                break
            case 'function':
                component.props[key] = {
                    type: prop,
                    default: propDefaults[key],
                }
                break
            case 'undefined':
                throw new Error('unknown prop: ' + key)
            default:
                throw new Error('unhandled type: ' + typeof prop)
        }
    }
}
