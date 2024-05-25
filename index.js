class Node {
  constructor(data) {
    this.data = data;
    this.left = null;
    this.right = null;
  }
}

class Tree {
  constructor(array) {
    this.root = this.buildTree([...new Set(array)].sort((a, b) => a - b));
  }

  buildTree(array) {
    if (array.length === 0) return null;

    const mid = Math.floor(array.length / 2);
    const root = new Node(array[mid]);

    root.left = this.buildTree(array.slice(0, mid));
    root.right = this.buildTree(array.slice(mid + 1));

    return root;
  }

  insert(value, node = this.root) {
    if (node === null) {
      return new Node(value);
    }

    if (value < node.data) {
      node.left = this.insert(value, node.left);
    } else if (value > node.data) {
      node.right = this.insert(value, node.right);
    }

    return node;
  }

  deleteItem(value, node = this.root) {
    if (node === null) return node;

    if (value < node.data) {
      node.left = this.deleteItem(value, node.left);
    } else if (value > node.data) {
      node.right = this.deleteItem(value, node.right);
    } else {
      if (node.left === null) return node.right;
      if (node.right === null) return node.left;

      node.data = this.minValue(node.right);
      node.right = this.deleteItem(node.data, node.right);
    }

    return node;
  }

  minValue(node) {
    let min = node.data;
    while (node.left !== null) {
      min = node.left.data;
      node = node.left;
    }
    return min;
  }

  find(value, node = this.root) {
    if (node === null || node.data === value) return node;

    if (value < node.data) {
      return this.find(value, node.left);
    } else {
      return this.find(value, node.right);
    }
  }

  levelOrder(callback) {
    const queue = [this.root];
    const result = [];

    while (queue.length > 0) {
      const node = queue.shift();
      if (callback) callback(node);
      result.push(node.data);

      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }

    return callback ? null : result;
  }

  inOrder(callback, node = this.root, result = []) {
    if (node !== null) {
      this.inOrder(callback, node.left, result);
      if (callback) callback(node);
      result.push(node.data);
      this.inOrder(callback, node.right, result);
    }
    return callback ? null : result;
  }

  preOrder(callback, node = this.root, result = []) {
    if (node !== null) {
      if (callback) callback(node);
      result.push(node.data);
      this.preOrder(callback, node.left, result);
      this.preOrder(callback, node.right, result);
    }
    return callback ? null : result;
  }

  postOrder(callback, node = this.root, result = []) {
    if (node !== null) {
      this.postOrder(callback, node.left, result);
      this.postOrder(callback, node.right, result);
      if (callback) callback(node);
      result.push(node.data);
    }
    return callback ? null : result;
  }

  height(node = this.root) {
    if (node === null) return -1;

    const leftHeight = this.height(node.left);
    const rightHeight = this.height(node.right);

    return Math.max(leftHeight, rightHeight) + 1;
  }

  depth(node, current = this.root, level = 0) {
    if (current === null) return -1;
    if (current === node) return level;

    const leftDepth = this.depth(node, current.left, level + 1);
    if (leftDepth !== -1) return leftDepth;

    return this.depth(node, current.right, level + 1);
  }

  isBalanced(node = this.root) {
    if (node === null) return true;

    const leftHeight = this.height(node.left);
    const rightHeight = this.height(node.right);

    const heightDifference = Math.abs(leftHeight - rightHeight) <= 1;

    return heightDifference && this.isBalanced(node.left) && this.isBalanced(node.right);
  }

  rebalance() {
    const values = this.inOrder();
    this.root = this.buildTree(values);
  }

  prettyPrint(node = this.root, prefix = "", isLeft = true) {
    if (node === null) return;
    if (node.right !== null) {
      this.prettyPrint(node.right, `${prefix}${isLeft ? "│   " : "    "}`, false);
    }
    console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.data}`);
    if (node.left !== null) {
      this.prettyPrint(node.left, `${prefix}${isLeft ? "    " : "│   "}`, true);
    }
  }
}

function getRandomArray(size, max) {
  return Array.from({ length: size }, () => Math.floor(Math.random() * max));
}

const randomArray = getRandomArray(15, 100);
const tree = new Tree(randomArray);

console.log("Is the tree balanced? ", tree.isBalanced());
console.log("Level Order: ", tree.levelOrder());
console.log("Pre Order: ", tree.preOrder());
console.log("In Order: ", tree.inOrder());
console.log("Post Order: ", tree.postOrder());

tree.insert(150);
tree.insert(200);
tree.insert(250);
tree.insert(300);

console.log("Is the tree balanced after adding numbers > 100? ", tree.isBalanced());

tree.rebalance();

console.log("Is the tree balanced after rebalancing? ", tree.isBalanced());
console.log("Level Order: ", tree.levelOrder());
console.log("Pre Order: ", tree.preOrder());
console.log("In Order: ", tree.inOrder());
console.log("Post Order: ", tree.postOrder());

tree.prettyPrint();
