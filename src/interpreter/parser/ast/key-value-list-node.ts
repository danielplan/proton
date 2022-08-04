import Node from './node';

export default class KeyValueListNode extends Node {
    children: Map<string, Node>;
    constructor(parent: Node) {
        super();
        this.children = new Map();
        this.parent = parent;
    }

    addChild(key: string, value: Node) {
        this.children.set(key, value);
    }
}
