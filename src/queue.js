const MaxHeap = require('./max-heap.js');

class PriorityQueue {
  constructor(maxSize = 30) {
    this.maxSize = maxSize;
    this.heap = new MaxHeap();
  }

  push(data, priority) {
    if (data >= 0 && data <= this.maxSize) {
      this.heap.push(data, priority);
    } else {
      throw new Error();
    }
  }

  shift() {
    // написать условие выкидывания ошибки при отсутствии значений
    if (this.heap.queue.length === 0) {
      throw new Error();
    }
    return this.heap.pop(); // возможно нужно переделать возврат значения
  }

  size() {
    return this.heap.queue.length; // переделать
  }

  isEmpty() {
    return this.heap.queue.length === 0; // переделать
  }
}

module.exports = PriorityQueue;
