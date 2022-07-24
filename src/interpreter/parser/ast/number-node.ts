import Node from './node';

export default class NumberNode extends Node {
    value: number;
    unit: string | null;
    constructor(value: number, unit: string | null) {
        super();
        this.value = value;
        this.unit = unit;
    }
}
