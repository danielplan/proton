import Node from './node';

export default class NullNode extends Node {
    constructor(parent: Node) {
        super();
        this.parent = parent;
    }

}
