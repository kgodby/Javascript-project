const LEFT = 0;
const RIGHT = 1;

export class TreeNode {
    constructor(value){
        this.value = value;
        this.descendents = [];
        this.parent = null;
    }

    get left(){
        return this.descendents[LEFT];
    }

    set left(node){
        this.descendents[LEFT] = node;
        if (node) {
            node.parent = this;
        }
    }

    get right(){
        return this.descendents[RIGHT];
    }

    set right(node){
        this.descendents[RIGHT] = node;
        if (node) {
            node.parent = this
        }
    }

    isParentRightChild(){
        return this.parent.descendents[1] === this;
    }

    isParentLeftChild(){
        return this.parent.descendents[0] === this;
    }

}

