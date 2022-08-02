import NaryNode from './nary-node';
import Node from './node';

export default class ValueListNode extends NaryNode {
    constructor(public values: Node[]) {
        super();
        this.children = values;
    }
}
