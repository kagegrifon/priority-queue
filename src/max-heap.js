const Node = require('./node');

class MaxHeap {
  constructor() {
    this.root = null;
    this.parentNodes = [];
  }

  push(data, priority) {
    const node = new Node(data, priority);
    this.insertNode(node);
    this.shiftNodeUp(node);
  }

  pop() {
    if (this.parentNodes.length !== 0) {
      const rootData = this.root.data;
      const detachedRoot = this.detachRoot();
      this.restoreRootFromLastInsertedNode(detachedRoot);
      if (this.root !== null) { 
        this.shiftNodeDown(this.root);
      }
      return rootData;
    }
  }

  detachRoot() {
    const { root } = this;
    this.root = null;

    if (root.right === null) {
      this.parentNodes.shift();
    }
    return root;
  }

  restoreRootFromLastInsertedNode(detached) {
    if (!(detached instanceof Node)) return; // для теста, который запупускает эту функцию с detached = {}

    if (this.parentNodes.length === 0) return; // если отделяемый root был едиственным в дереве

    const lastInserted = this.parentNodes.pop();
    this.root = lastInserted;

    if (lastInserted.parent.parent === null) { // если parent.parent === null, значит lastInserted потомок отсеченного root
      this.parentNodes.unshift(lastInserted);
    } else if (
      lastInserted.parent.priority !== this.parentNodes[0].priority
      && lastInserted.parent.data !== this.parentNodes[0].data
    ) {
      this.parentNodes.unshift(lastInserted.parent);
    }

    lastInserted.remove();

    const { left, right } = detached;
    [left, right].forEach(child => {
      if (child !== null) { // т.к. lastInserter уже удален у своего родителя, он не сможет уже добавить сам себя, даже если бы он изначально был потомком detached
        child.remove();
        lastInserted.appendChild(child);
      }
    });
  }

  size() {
    if (this.root === null) return 0;
  
    let potentialParents = [this.root];
    let nodesCount = 1;
    while (potentialParents.length !== 0) {
      const potentialParentsForNextStep = [];
      potentialParents.forEach(node => {
        ['left', 'right'].forEach(branch => {
          if (node[branch] !== null) {
            nodesCount += 1;
            potentialParentsForNextStep.push(node[branch])
          }
        });
      });
      potentialParents = potentialParentsForNextStep;
    }
    return nodesCount;
  }

  isEmpty() {
    return this.root === null;
  }

  clear() {
    this.root = null;
    this.parentNodes.length = 0;
  }

  insertNode(node) {
    if (this.root === null) {
      this.root = node;
      this.parentNodes.push(node);
    } else {
      this.parentNodes[0].appendChild(node);
      if (this.parentNodes[0].right !== null) {
        this.parentNodes.shift();
      }
      this.parentNodes.push(node);
    }
  }

  shiftNodeUp(node) {
    if (node.parent === null) {
      this.root = node;
    } else if (node.parent.priority < node.priority) {
      const indexesNodesInParentNodes = [node, node.parent].map(checkingNode =>
        this.parentNodes.findIndex(parentNode => parentNode.priority === checkingNode.priority)
      );

      indexesNodesInParentNodes.forEach((indexInParentNodes, i) => {
        if (indexInParentNodes !== -1 && i === 0) { // node index
          this.parentNodes[indexesNodesInParentNodes[0]] = node.parent;
        }
        if (indexInParentNodes !== -1 && i === 1) { // node.parent index
          this.parentNodes[indexesNodesInParentNodes[1]] = node;
        }
      });

      node.swapWithParent();
      this.shiftNodeUp(node);
    }
  }

  shiftNodeDown(node) {
    const comparisonNodes = [node];
    if (node.left !== null) comparisonNodes.push(node.left);
    if (node.right !== null) comparisonNodes.push(node.right);
    if (comparisonNodes.length === 1) return;

    const maxNode = comparisonNodes.reduce((maxPriorityNode, curNode) => {
      if (maxPriorityNode.priority < curNode.priority) {
        return maxPriorityNode = curNode;
      }
      return maxPriorityNode;
    });

    if (maxNode.priority === node.priority) return;

    const indexesNodesInParentNodes = [node, maxNode].map(checkingNode =>
      this.parentNodes.findIndex(parentNode => parentNode.priority === checkingNode.priority)
    );
    indexesNodesInParentNodes.forEach((indexInParentNodes, i) => {
      if (indexInParentNodes !== -1 && i === 0) { // node index
        this.parentNodes[indexesNodesInParentNodes[0]] = maxNode;
      }
      if (indexInParentNodes !== -1 && i === 1) { // one of node child index
        this.parentNodes[indexesNodesInParentNodes[1]] = node;
      }
    });
  
    if (node.parent === null) {
      this.root = maxNode;
    }
  
    maxNode.swapWithParent();
    this.shiftNodeDown(node);
  }
}

module.exports = MaxHeap;
