import { Zeitsemester } from './Zeitsemester'

export class AllAndDefaultZeitsemester {
    constructor(
        public readonly defaultZeitsemester: Zeitsemester,
        public readonly all: Zeitsemester[],
    ) {}
}
