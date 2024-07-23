import { type domainId } from '../../common/domainId'
import { ClassWithId } from '../../common/ClassWithId'

export class Repository<T extends ClassWithId> {
    protected map: Map<domainId, T> = new Map<domainId, T>()

    public all(): T[] {
        return [...this.map.values()]
    }
    public get(id: domainId): T | null {
        return this.map.get(id) ?? this.map.get(+id) ?? null
    }

    public addValues(values: T[]): this {
        values.forEach((value) => {
            if (this.map.has(value['id'])) {
                throw new Error(`Repository.addValues: value with id ${value['id']} already exists in repository`)
            }
            this.map.set(value['id'], value)
        })
        return this
    }

    public addOrReplaceValuesOfRepo(repository: Repository<T>): this {
        ;[...repository.map.values()].forEach((value) => {
            this.map.set(value.id, value)
        })
        return this
    }
}
