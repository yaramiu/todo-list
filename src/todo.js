class Todo {
  constructor(title, description, dueDate, priority, isComplete) {
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
    this.priority = priority;
    this.isComplete = isComplete;
  }

  changePriority(newPriority) {
    this.priority = newPriority;
  }

  markComplete() {
    if (this.isComplete === false) {
      this.isComplete = true;
    }
  }
}
