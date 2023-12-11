import Node from './node';

export default class RootNode extends Node {
    children: Node[];
    constructor() {
        super();
        this.children = [];
        this.parent = null;
    }
}
