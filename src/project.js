class Project {
  constructor(title, isDefault) {
    this.title = title;
    this.isDefault = isDefault;
    this.todos = [];
  }

  addTodo(todo) {
    this.todos.push(todo);
  }
}

export class ProjectManager {
  static projects = [];

  static createNewProject(title, isDefault) {
    let project = new Project(title, isDefault);
    ProjectManager.projects.push(project);
  }

  static addTodoToProject(project, todo) {
    for (let i = 0; i < length(this.projects); i++) {
      if (this.projects[i] === project) {
        this.projects[i].addTodo(todo);
      }
    }
  }
}
