export const resolvePromise = (result) => {
    return new Promise((resolve) => {
        resolve(result)
    })
}
export function createMockedFunction(result: unknown = null) {
    const fn = vi.fn()
    fn.mockImplementation(() => result)
    return fn
}

const voidPromise = () => {
    return new Promise((resolve) => {
        resolve(undefined)
    })
}

export function createMockedVoidPromise() {
    return vi.fn().mockImplementation(() => voidPromise())
}

export function createMockedResultPromise(result: unknown) {
    return vi.fn().mockImplementation(() => resolvePromise(result))
}
