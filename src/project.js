class Project {
  constructor(title, isDefault) {
    this.title = title;
    this.isDefault = isDefault;
    this.todos = [];
  }

  addTodo(todo) {
    this.todos.push(todo);
  }

  removeTodo(todo) {
    const todoIndex = this.todos.indexOf(todo);
    this.todos.splice(todoIndex, 1);
  }
}

export class ProjectManager {
  static projects = [];
  static currentActiveProject;
  static projectActivity = new Map();
  static defaultProject;

  static createNewProject(title, isDefault) {
    let project = new Project(title, isDefault);
    ProjectManager.projects.push(project);

    if (isDefault) {
      this.defaultProject = project;
    }
  }

  static removeProject(project) {
    for (let i = 0; i < this.projects.length; i++) {
      if (this.projects[i] === project) {
        this.projects.splice(i, 1);
      }
    }
  }

  static addTodoToProject(project, todo) {
    const projectIndex = this.projects.indexOf(project);
    this.projects[projectIndex].addTodo(todo);
  }

  static removeTodoFromProject(project, todo) {
    const projectIndex = this.projects.indexOf(project);
    this.projects[projectIndex].removeTodo(todo);
  }
}
