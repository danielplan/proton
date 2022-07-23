import Node from './node';
import NaryNode from './nary-node';

export default class RootNode extends NaryNode {
    constructor() {
        super([]);
    }
}
