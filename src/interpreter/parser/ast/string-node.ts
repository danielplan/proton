import Node from './node';

export default class StringNode extends Node {
    value: string;
    constructor(value: string) {
        super();
        this.value = value;
    }
}
