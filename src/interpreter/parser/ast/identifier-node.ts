import Node from './node';

export default class IdentifierNode extends Node {
    name: string;
    constructor(name: string) {
        super();
        this.name = name;
    }
}
