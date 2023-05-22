export class Project {
  constructor(title, isDefault) {
    this.title = title;
    this.isDefault = isDefault;
    this.todos = [];
    this.addTodoJson = {
      function: { arguments: "todo", body: "this.todos.push(todo);" },
    };
    this.removeTodoJson = {
      function: {
        arguments: "todo",
        body: "const todoIndex = this.todos.indexOf(todo);this.todos.splice(todoIndex, 1);",
      },
    };
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

    return project;
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
    project.addTodo = new Function(
      project.addTodoJson.function.arguments,
      project.addTodoJson.function.body
    );
    this.projects[projectIndex].addTodo(todo);
  }

  static removeTodoFromProjects(todoToRemove) {
    this.projects.forEach((project) => {
      project.todos.forEach((todo) => {
        if (todo.objectId === todoToRemove.objectId) {
          const todoIndex = project.todos.indexOf(todo);
          project.todos.splice(todoIndex, 1);
        }
      });
    });
  }

  static syncTodoContents(todoToSync, event, newContent) {
    this.projects.forEach((project) => {
      project.todos.forEach((todo) => {
        if (todo.objectId === todoToSync.objectId) {
          if (event === "title") {
            todo.title = newContent;
          } else if (event === "due-date") {
            todo.dueDate = newContent;
          } else if (event === "description") {
            todo.description = newContent;
          } else if (event === "priority") {
            todo.priority = newContent;
          }
        }
      });
    });
  }
}
