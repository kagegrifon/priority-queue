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
    } else if (this.right !== null) {
      this.right = node;
      node.parent = this;
    }
  }

  removeChild(node) {
    if (
      node.data === this.left.data
      && node.priority === this.left.priority
    ) {
      this.left = null;
      node.parent = null;
    } else if (
      node.data === this.right.data
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
      this.parent.removeChild.apply(this.parent, [this]);
    }
  }

  swapWithParent() {
    if (this.parent !== null) {
      const buffer = {
        data: this.data,
        priority: this.priority,
      };

      this.data = this.parent.data;
      this.priority = this.parent.priority;
      this.parent.data = buffer.data;
      this.parent.priority = buffer.priority;
    }
  }
}

module.exports = Node;
