import Node from './node';

export default class KeyValueListNode extends Node {
    children: Map<string, Node>;
    constructor() {
        super();
        this.children = new Map();
    }

    addChild(key: string, value: Node) {
        this.children.set(key, value);
    }
}
