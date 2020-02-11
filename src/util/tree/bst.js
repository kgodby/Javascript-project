import {TreeNode} from './treenode'
import {Queue} from '../util/queue'
import {Stack} from'../util/stack'

export class BinarySearchTree {
    constructor() {
        this.root = null;
        this.size = 0;
    }


    add(value) {
        
        const newNode = new TreeNode(value);

        if (this.root) {
            const {parent} = this.findNodeAndParent(value)
            if (value[0] < parent.value[0]) {
                parent.left = newNode;
            } else {
                parent.right = newNode;
            }
        } else {
            this.root = newNode;
        }

        this.size += 1;
        return newNode;
    }  

    has(value){
        return !!find(value);
    }

   find(value){
       return this.findNodeAndParent(value)['node']
   }


    findNodeAndParent(value) {
        let node = this.root;
        let parent;

        while (node) {
            if (node.value === value) {
                break;
            }
            parent = node;
            node = (value[0] >= node.value[0]) ? node.right : node.left;
        }

        return { node, parent };
    }

    getRightmost(node = this.root){
        if (!node || !node.right){
            return node;
        }
        return this.getRightmost(node.right);
    }

    getLeftmost(node = this.root){
        if (!node || !node.left){
            return node;
        }
        return this.getLeftmost(node.left);
    }

    remove(value){
        const { nodeToRemove, parent} = this.findNodeAndParent(value);

        if (!nodeToRemove) return false; 

        const removedNodeChildren = this.combineLeftIntoRightSubtree(nodeToRemove); 

        if(nodeToRemove === this.root){
            this.root = removedNodeChildren;
            if (this.root) {this.root.parent = null;}

        } else if (nodeToRemove.isParentLeftChild) {
            parent.left(removedNodeChildren);
        } else {
            parent.right(removedNodeChildren);
        }

        this.size -= 1;
        return true;
    }

    combineLeftIntoRightSubtree(node){
        if(node.right){
            const leftmost = this.getLeftmost(node.right);
            leftmost.left(node.left)
            return node.right;
        }
        return node.left;
    }


    *bfs(){
        const queue = new Queue();

        queue.add(this.root);

        while (!queue.isEmpty()) {
            const node = queue.remove();
            yield node;

            if (node.left) { queue.add(node.left); }
            if (node.right) { queue.add(node.right); }
        }
    }

    *dfs(){
        const stack = new Stack();

        stack.add(this.root);

        while (!stack.isEmpty()) {
            const node = stack.remove();
            yield node;

            if (node.right) { stack.add(node.right); }
            if (node.left) { stack.add(node.left); }
        }

    }

    *inOrderTraversal(node = this.root) {
        if (node && node.left) { yield * this.inOrderTraversal(node.left); }
        yield node
        if (node && node.right) { yield * this.inOrderTraversal(node.right); }
    }

    *preOrderTraversal(node = this.root) {
        yield node;
        if (node.left) { yield * this.preOrderTraversal(node.left); }
        if (node.right) { yield * this.preOrderTraversal(node.right); }
    }

    *postOrderTraversal(node = this.root) {
        if (node.left) { yield * this.postOrderTraversal(node.left); }
        if (node.right) { yield * this.postOrderTraversal(node.right); }
        yield node;
    }
}

