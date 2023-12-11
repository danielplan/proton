import Node from './node';

export default class IdentifierNode extends Node {
    name: string;
    constructor(name: string, parent: Node) {
        super();
        this.name = name;
        this.parent = parent;
    }
}
