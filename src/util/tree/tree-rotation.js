function swapParentChild(oldChild, newChild, parent) {
    if (parent) {
        const side = oldChild.isParentRightChild ? 'right' : 'left';
        parent[side](newChild);
    } else {
        newChild.parent = null;
    }
}

 export function leftRotation(node) {
    const newParent = node.right; 
    const grandparent = node.parent; 
    const previousLeft = newParent.left; 


    swapParentChild(node, newParent, grandparent);



    newParent.setLeftAndUpdateParent(node);

    node.setRightAndUpdateParent(previousLeft);

    return newParent;
}

 export function rightRotation(node) {
    const newParent = node.left;
    const grandparent = node.parent; 
    const previousRight = newParent.right; 


    swapParentChild(node, newParent, grandparent);



    newParent.setRightAndUpdateParent(node);

    node.setLeftAndUpdateParent(previousRight);

    return newParent;
}

 export function leftRightRotation(node) {
    leftRotation(node.left);
    return rightRotation(node);
}

 export function rightLeftRotation(node) {
    rightRotation(node.right);
    return leftRotation(node);
}

