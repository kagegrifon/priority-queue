class Node {
  constructor(data, priority) {
    this.data = data;
    this.priority = priority;
    this.parent = null;
    this.left = null;
    this.right = null;
  }

  appendChild(node) {
    if (this.left === null) {
      this.left = node;
      node.parent = this;
    } else if (this.right === null) {
      this.right = node;
      node.parent = this;
    }
  }

  removeChild(node) {
    if (
      this.left !== null
      && node.data === this.left.data
      && node.priority === this.left.priority
    ) {
      this.left = null;
      node.parent = null;
    } else if (
      this.right !== null
      && node.data === this.right.data
      && node.priority === this.right.priority
    ) {
      this.right = null;
      node.parent = null;
    } else {
      throw new Error();
    }
  }

  remove() {
    if (this.parent !== null) {
      this.parent.removeChild.call(this.parent, this);
    }
  }

  swapWithParent() {
    if (this.parent !== null) {
      const { left: parentLeft, right: parentRight, parent: parentParent } = this.parent;
      const { left, right, parent } = this;

      [left, right, parentLeft, parentRight, parent].forEach(node => {
        if (node !== null) node.remove();
      });

      [left, right].forEach(node => {
        if (node !== null) parent.appendChild(node);
      });

      [parentLeft, parentRight].forEach(node => {
        if (node !== null) {
          if (
            node.priority === this.priority
            && node.data === this.data
          ) {
            this.appendChild(parent);
          } else {
            this.appendChild(node);
          }
        }
      });
      if (parentParent !== null) {
        parentParent.appendChild(this);
      }
    }
  }
}

module.exports = Node;
