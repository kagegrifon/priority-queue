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
      const detachedRoot = this.detachRoot(); // доделать
      this.restoreRootFromLastInsertedNode(detachedRoot);
      this.shiftNodeDown(this.root);
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
    if (this.parentNodes.length === 0) return; // если отделяемый root был едиственным в дереве

    const lastInserted = this.parentNodes.pop();
    this.root = lastInserted;

    const { left, right } = detached;
    [left, right].forEach(child => {
      if (child !== null) {
        child.remove();
        if ( // чтобы не пришлось добавлять самого себя
          lastInserted.data === child.data
          && lastInserted.priority === child.priority
        ) {
          lastInserted.appendChild(child);
        }
      }
    });
    if (lastInserted.parent !== null) { // если null, то отделенный root был его родителем
      this.parentNodes.unshift(lastInserted.parent);
    } else {
      this.parentNodes.unshift(lastInserted);
    }
  }

  size() {

  }

  isEmpty() {

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
    if (node.parent.priority < node.priority) {
      const indexesNodesInParentNodes = [node, node.parent].map(checkingNode =>
        this.parentNodes.findIndex(parentNode => parentNode.priority === checkingNode.priority)
      );
      // const nodeIndexInParentNodes = this.parentNodes.findIndex(parentNode =>
      //   parentNode.priority === node.priority
      // );
      // const nodeParentIndexInParentNodes = this.parentNodes.findIndex(parentNode =>
      //   parentNode.priority === node.parent.priority
      // );

      // toDo доделать обработку nodeParents
      indexesNodesInParentNodes.forEach((indexInParentNodes, i) => {
        if (indexInParentNodes !== -1 && i === 0) {
          this.parentNodes[indexesNodesInParentNodes[0]] = node.parent;
        }
        if (indexInParentNodes !== -1 && i === 0) {
          this.parentNodes[indexesNodesInParentNodes[0]] = node.parent;
        }
      })
      if (indexesNodesInParentNodes.every(index => index !== -1)) { // по индексу 0 - node, 1 - node.parent
        this.parentNodes[indexesNodesInParentNodes[0]] = node.parent;
        this.parentNodes[indexesNodesInParentNodes[1]] = node;
      } else if (indexesNodesInParentNodes[0] !== -1) {
        this.parentNodes[indexesNodesInParentNodes[0]] = node.parent;
      }
      node.swapWithParent();
      this.shiftNodeUp(node);
    }
  }

  shiftNodeDown(node) {
    const comparisonNodes = [node];
    if (node.left) comparisonNodes.push(node.left);
    if (node.right) comparisonNodes.push(node.left);
    if (comparisonNodes.length === 1) return;

    const maxNode = comparisonNodes.reduce((maxPriorityNode, curNode) => {
      if (maxPriorityNode.priority < curNode.priority) {
        return maxPriorityNode = curNode;
      }
    });

    if (maxNode.priority === node.priority) return;

    const indexesNodesInParentNodes = [node, maxNode].map(checkingNode =>
      this.parentNodes.findIndex(parentNode => parentNode.priority === checkingNode.priority)
    );

    if (indexesNodesInParentNodes.every(index => index !== -1)) { // по индексу 0 - node, 1 - потомок с наибольшим priority
      this.parentNodes[indexesNodesInParentNodes[0]] = node.parent;
      this.parentNodes[indexesNodesInParentNodes[1]] = node;
    } else if (indexesNodesInParentNodes[0] !== -1) {
      this.parentNodes[indexesNodesInParentNodes[0]] = node.parent;
    }

    const getDirection = {
      withRightNode: () => {
        let direction = null;
        if (
          node.priority < node.left.priority
          && node.left.priority > node.right.priority
        ) {
          direction = 'left';
        } else if (
          node.priority < node.right.priority
          && node.right.priority > node.left.priority
        ) {
          direction = 'right';
        }
        return direction;
      },
      withoutRightNode: () => {
        let direction = ''
        if (node.priority < node.left.priority) {
          direction = 'left';
        }
      },
    };
    const conditionAction = {
      withRightNode: () => {
        if (
          node.priority < node.left.priority
          && node.left.priority > node.right.priority
        ) {
          node.left.swapWithParent();
          this.shiftNodeDown(node);
        } else if (
          node.priority < node.right.priority
          && node.right.priority > node.left.priority
        ) {
          node.right.swapWithParent();
          this.shiftNodeDown(node);
        }
      },
      withoutRightNode: () => {
        if (node.priority < node.left.priority) {
          node.left.swapWithParent();
          this.shiftNodeDown(node);
        }
      },
    };

    if (node.left !== null && node.right !== null) {
      conditionAction.withRightNode();
    } else if (node.left !== null) {
      conditionAction.withoutRightNode();
    }
  }
}

module.exports = MaxHeap;
