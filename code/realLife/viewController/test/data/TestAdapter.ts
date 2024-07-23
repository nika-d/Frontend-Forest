import { AbstractApiAdapter } from '../../src/common/api/AbstractApiAdapter'
import type { JSONValue } from '../../src/common/api/JSON'
import httpAdapter from '../../src/common/api/HttpAdapter'
import { FakeAPI } from '../fakeApi/FakeAPI'

class TestAdapter implements AbstractApiAdapter {
    constructor(private fakeAPI: FakeAPI = new FakeAPI()) {}

    public async httpCall(path: string, method: string, parameters: JSONValue): Promise<Response> {
        const callResult = httpAdapter.httpCall(path, method, parameters)
        return await callResult
            .then((response) => response)
            .catch(() => {
                return this.fakeAPI.makeCall(path, method, parameters)
            })
    }
}

const testAdapter = new TestAdapter()

export default testAdapter
