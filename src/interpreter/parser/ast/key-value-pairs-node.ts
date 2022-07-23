import Node from './node';

export default class KeyValuePairsNode extends Node {
    pairs: Map<string, Node>;
    constructor() {
        super();
        this.pairs = new Map();
    }
}
