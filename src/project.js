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

  static removeProject(project) {
    for (let i = 0; i < this.projects.length; i++) {
      if (this.projects[i] === project) {
        this.projects.splice(i, 1);
      }
    }
  }

  static addTodoToProject(project, todo) {
    for (let i = 0; i < this.projects.length; i++) {
      if (this.projects[i] === project) {
        this.projects[i].addTodo(todo);
      }
    }
  }
}
