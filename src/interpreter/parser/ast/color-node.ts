import Node from './node';

export default class ColorNode extends Node {
    value: string;
    constructor(value: string) {
        super();
        this.value = value;
    }
}
