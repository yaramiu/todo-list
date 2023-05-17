import { ProjectManager } from "./project";
import { hitProjectLimit, isInputValid } from "./validation";
import { Todo } from "./todo";
import format from "date-fns/format";
import notesSvg from "./images/note-multiple.svg";
import greenNotesSvg from "./images/note-multiple-green.svg";
import downChevronSvg from "./images/chevron-down.svg";
import upChevronSvg from "./images/chevron-up.svg";

export function setupCreateProjectButton(projectsDiv, sidebarDiv) {
  const createProjectButton = document.createElement("button");
  createProjectButton.classList.add("create-project");
  createProjectButton.type = "button";
  createProjectButton.textContent = "Create a new project";
  initializeCreateProjectButton(createProjectButton, projectsDiv, sidebarDiv);
  sidebarDiv.appendChild(createProjectButton);
}

function initializeCreateProjectButton(
  createProjectButton,
  projectsDiv,
  sidebarDiv
) {
  createProjectButton.addEventListener("click", () => {
    sidebarDiv.childNodes.forEach((node) => {
      if (Array.from(node.classList).includes("create-project")) {
        sidebarDiv.removeChild(node);
      }
    });
    setupProjectInputForm(projectsDiv, sidebarDiv);
  });
}

function setupProjectInputForm(projectsDiv, sidebarDiv) {
  const newProjectForm = document.createElement("form");
  newProjectForm.classList.add("new-project");

  const projectTitleInput = document.createElement("input");
  projectTitleInput.classList.add("project-title-input");
  projectTitleInput.type = "text";
  projectTitleInput.id = "projectTitle";
  projectTitleInput.name = "projectTitle";
  projectTitleInput.placeholder = "Project Name";

  const projectInputSubmitButton = document.createElement("button");
  projectInputSubmitButton.classList.add("project-input-submit");
  projectInputSubmitButton.type = "button";
  projectInputSubmitButton.textContent = "Add";
  initializeProjectInputSubmitButton(
    projectInputSubmitButton,
    projectsDiv,
    sidebarDiv
  );

  newProjectForm.appendChild(projectTitleInput);
  newProjectForm.appendChild(projectInputSubmitButton);
  sidebarDiv.appendChild(newProjectForm);
}

function initializeProjectInputSubmitButton(
  projectInputSubmitButton,
  projectsDiv,
  sidebarDiv
) {
  projectInputSubmitButton.addEventListener("click", () => {
    if (hitProjectLimit()) {
      return;
    }
    let projectTitleInputStr = document.getElementById("projectTitle").value;
    if (!isInputValid(projectTitleInputStr)) {
      return;
    }
    ProjectManager.createNewProject(projectTitleInputStr, false);
    clearProjectsDisplay(projectsDiv);
    updateProjectsDisplay(projectsDiv);
    sidebarDiv.childNodes.forEach((node) => {
      if (Array.from(node.classList).includes("new-project")) {
        sidebarDiv.removeChild(node);
      }
    });
    setupCreateProjectButton(projectsDiv, sidebarDiv);
  });
}

function clearProjectsDisplay(projectsDiv) {
  while (projectsDiv.lastChild) {
    projectsDiv.removeChild(projectsDiv.lastChild);
  }
}

export function updateProjectsDisplay(projectsDiv) {
  for (let i = 0; i < ProjectManager.projects.length; i++) {
    const project = ProjectManager.projects[i];
    displayProject(project, projectsDiv);
  }
}

function displayProject(project, projectsDiv) {
  const projectDiv = document.createElement("div");
  projectDiv.classList.add("project");

  const notesImage = new Image();
  notesImage.classList.add("notes");
  notesImage.src = notesSvg;
  projectDiv.appendChild(notesImage);

  const projectTitleButton = document.createElement("button");
  projectTitleButton.classList.add("project-title");
  projectTitleButton.textContent = project.title;
  setupProjectTitleButton(projectTitleButton, project, projectDiv, projectsDiv);
  projectDiv.appendChild(projectTitleButton);

  if (project.title !== "Default") {
    const projectDeleteButton = document.createElement("button");
    projectDeleteButton.classList.add("project-delete");
    projectDeleteButton.type = "button";
    projectDeleteButton.textContent = "X";
    setupProjectDeleteButton(projectDeleteButton, project, projectsDiv);
    projectDiv.appendChild(projectDeleteButton);

    const activity = ProjectManager.projectActivity.get(project);
    if (activity === undefined) {
      projectDiv.classList.add("inactive");
      ProjectManager.projectActivity.set(project, "inactive");
    } else {
      projectDiv.classList.add(activity);
      if (activity === "active") {
        makeNoteImageActive(projectDiv);
      }
    }
  } else {
    projectDiv.classList.add("default");
    if (
      ProjectManager.projects.length === 1 ||
      ProjectManager.projectActivity.get(project) === undefined ||
      ProjectManager.projectActivity.get(project) === "active" ||
      !Array.from(ProjectManager.projectActivity.values()).includes("active")
    ) {
      makeProjectActive(project, projectDiv);
      makeNoteImageActive(projectDiv);
    }
  }

  projectsDiv.appendChild(projectDiv);
}

function setupProjectDeleteButton(projectDeleteButton, project, projectsDiv) {
  projectDeleteButton.addEventListener("click", () => {
    ProjectManager.removeProject(project);
    ProjectManager.projectActivity.delete(project);
    clearProjectsDisplay(projectsDiv);
    updateProjectsDisplay(projectsDiv);

    const TodosDiv = DomStorage.projectToTodosDivMap.get(project);
    if (TodosDiv !== undefined) {
      TodosDiv.childNodes.forEach((node) => {
        ProjectManager.defaultProject.removeTodo(node);
      });
    }

    DomStorage.projectToTodosDivMap.delete(project);
    changeActiveProjectsTodosDisplay();
  });
}

function setupProjectTitleButton(
  projectTitleButton,
  project,
  projectDiv,
  projectsDiv
) {
  projectTitleButton.addEventListener("click", () => {
    makeProjectActive(project, projectDiv);
    makeOtherProjectsInactive(projectDiv, projectsDiv);

    makeNoteImageActive(projectDiv);
    makeOtherNoteImagesInactive(projectDiv.firstChild, projectsDiv);

    changeActiveProjectsTodosDisplay();
  });
}

function makeProjectActive(project, projectDiv) {
  ProjectManager.currentActiveProject = project;
  projectDiv.classList.remove("inactive");
  projectDiv.classList.add("active");
  ProjectManager.projectActivity.set(project, "active");
}

function makeNoteImageActive(projectDiv) {
  const greenNotesImage = new Image();
  greenNotesImage.classList.add("green-notes");
  greenNotesImage.src = greenNotesSvg;
  projectDiv.replaceChild(greenNotesImage, projectDiv.firstChild);
}

function makeOtherProjectsInactive(projectDiv, projectsDiv) {
  let i = 0;
  projectsDiv.childNodes.forEach((node) => {
    if (node !== projectDiv) {
      node.classList.remove("active");
      node.classList.add("inactive");
      ProjectManager.projectActivity.set(
        ProjectManager.projects[i],
        "inactive"
      );
    }
    i++;
  });
}

function makeOtherNoteImagesInactive(greenNotesImage, projectsDiv) {
  projectsDiv.childNodes.forEach((node) => {
    if (node.firstChild !== greenNotesImage) {
      const notesImage = new Image();
      notesImage.classList.add("notes");
      notesImage.src = notesSvg;
      node.firstChild.replaceWith(notesImage);
    }
  });
}

export function updateTodosDisplay(todosDiv) {
  const currentProject = ProjectManager.currentActiveProject;
  for (let i = 0; i < currentProject.todos.length; i++) {
    const currentTodo = currentProject.todos[i];
    displayTodo(currentTodo, todosDiv);
  }

  DomStorage.projectToTodosDivMap.set(currentProject, todosDiv);
}

function clearTodosDisplay(todosDiv) {
  while (todosDiv.lastChild) {
    todosDiv.removeChild(todosDiv.lastChild);
  }
}

function displayTodo(todo, todosDiv) {
  const todoDiv = document.createElement("div");
  todoDiv.classList.add("todo");

  stylePriorityOnTodo(todo, todoDiv);

  const expandTodoButton = document.createElement("button");
  expandTodoButton.classList.add("expand-todo");
  expandTodoButton.type = "button";
  expandTodoButton.style = `background-image: url(${downChevronSvg})`;
  setupExpandTodoButton(expandTodoButton, todo, todoDiv);
  todoDiv.appendChild(expandTodoButton);

  const deleteTodoButton = document.createElement("button");
  deleteTodoButton.classList.add("delete-todo");
  deleteTodoButton.type = "button";
  deleteTodoButton.textContent = "X";
  setupDeleteTodoButton(deleteTodoButton, todo, todosDiv);
  todoDiv.appendChild(deleteTodoButton);

  const todoTitleHeader = document.createElement("h3");
  todoTitleHeader.classList.add("todo-title");
  todoTitleHeader.contentEditable = "true";
  todoTitleHeader.textContent = todo.title;
  todoTitleHeader.addEventListener("input", () => {
    todo.title = todoTitleHeader.textContent;
  });
  todoDiv.appendChild(todoTitleHeader);

  const todoDueDateDiv = document.createElement("div");
  todoDueDateDiv.classList.add("due-date");

  const todoDueDateParagraph = document.createElement("p");
  todoDueDateParagraph.classList.add("due-date-text");
  todoDueDateParagraph.textContent = format(todo.dueDate, "yyyy-MM-dd");
  todoDueDateDiv.appendChild(todoDueDateParagraph);

  const changeDueDateInput = document.createElement("input");
  changeDueDateInput.classList.add("change-due-date");
  changeDueDateInput.type = "date";
  changeDueDateInput.addEventListener("change", (event) => {
    const dateValues = String(event.target.value).split("-");
    const changedDate = new Date(
      dateValues[0],
      dateValues[1] - 1,
      dateValues[2]
    );
    todo.dueDate = changedDate;
    const changedTodoDueDateParagraph = todoDueDateParagraph;
    changedTodoDueDateParagraph.textContent = event.target.value;
    todoDueDateDiv.replaceChild(
      changedTodoDueDateParagraph,
      todoDueDateParagraph
    );
  });
  todoDueDateDiv.appendChild(changeDueDateInput);

  todoDiv.appendChild(todoDueDateDiv);

  todosDiv.appendChild(todoDiv);
}

function setupExpandTodoButton(expandTodoButton, todo, todoDiv) {
  expandTodoButton.addEventListener("click", () => {
    const descriptionParagraph = document.createElement("p");
    descriptionParagraph.classList.add("description");
    descriptionParagraph.contentEditable = "true";

    descriptionParagraph.addEventListener("input", () => {
      todo.description = descriptionParagraph.innerText;
    });
    descriptionParagraph.textContent = todo.description;

    const changePriorityButton = document.createElement("button");
    changePriorityButton.classList.add("change-priority");
    changePriorityButton.type = "button";
    changePriorityButton.textContent = "Change Priority";
    setupChangePriorityButton(changePriorityButton, todo, todoDiv);

    const shrinkTodoButton = document.createElement("button");
    shrinkTodoButton.classList.add("shrink-todo");
    shrinkTodoButton.type = "button";
    shrinkTodoButton.style = `background-image: url(${upChevronSvg})`;
    expandTodoButton.replaceWith(shrinkTodoButton);
    setupShrinkTodoButton(
      expandTodoButton,
      shrinkTodoButton,
      descriptionParagraph,
      todoDiv
    );

    todoDiv.appendChild(descriptionParagraph);
    todoDiv.appendChild(changePriorityButton);
  });
}

function setupShrinkTodoButton(
  expandTodoButton,
  shrinkTodoButton,
  descriptionParagraph,
  todoDiv
) {
  shrinkTodoButton.addEventListener("click", () => {
    shrinkTodoButton.replaceWith(expandTodoButton);

    todoDiv.removeChild(descriptionParagraph);

    Array.from(todoDiv.childNodes).forEach((node) => {
      if (Array.from(node.classList).includes("change-priority")) {
        todoDiv.removeChild(node);
      } else if (Array.from(node.classList).includes("priorities")) {
        todoDiv.removeChild(node);
      }
    });
  });
}

function setupDeleteTodoButton(deleteTodoButton, todo, todosDiv) {
  deleteTodoButton.addEventListener("click", () => {
    ProjectManager.removeTodoFromProjects(todo);
    clearTodosDisplay(todosDiv);
    updateTodosDisplay(todosDiv);
  });
}

export function setupCreateTodoButton(createTodoButton, todosDiv) {
  createTodoButton.addEventListener("click", () => {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const currentDay = new Date().getDate();
    const newTodo = new Todo(
      "Title",
      "Description",
      new Date(currentYear, currentMonth, currentDay),
      "low",
      false
    );
    ProjectManager.addTodoToProject(
      ProjectManager.currentActiveProject,
      newTodo
    );
    if (!ProjectManager.currentActiveProject.isDefault) {
      ProjectManager.addTodoToProject(ProjectManager.defaultProject, newTodo);
    }
    clearTodosDisplay(todosDiv);
    updateTodosDisplay(todosDiv);
  });
}

function setupChangePriorityButton(changePriorityButton, todo, todoDiv) {
  changePriorityButton.addEventListener("click", () => {
    todoDiv.removeChild(document.querySelector(".change-priority"));

    const prioritiesDiv = document.createElement("div");
    prioritiesDiv.classList.add("priorities");

    const lowPriorityButton = document.createElement("button");
    lowPriorityButton.classList.add("low-priority");
    lowPriorityButton.type = "button";
    lowPriorityButton.textContent = "Low";
    prioritiesDiv.appendChild(lowPriorityButton);

    const mediumPriorityButton = document.createElement("button");
    mediumPriorityButton.classList.add("medium-priority");
    mediumPriorityButton.type = "button";
    mediumPriorityButton.textContent = "Medium";
    prioritiesDiv.appendChild(mediumPriorityButton);

    const highPriorityButton = document.createElement("button");
    highPriorityButton.classList.add("high-priority");
    highPriorityButton.type = "button";
    highPriorityButton.textContent = "High";
    prioritiesDiv.appendChild(highPriorityButton);

    setupPriorityButtons(todo, todoDiv, prioritiesDiv);

    todoDiv.appendChild(prioritiesDiv);
  });
}

function setupPriorityButtons(todo, todoDiv, prioritiesDiv) {
  prioritiesDiv.childNodes.forEach((node) => {
    if (Array.from(node.classList).includes("low-priority")) {
      node.addEventListener("click", () => {
        let todoToChangePriority =
          ProjectManager.currentActiveProject.todos[
            ProjectManager.currentActiveProject.todos.indexOf(todo)
          ];
        todoToChangePriority.priority = "low";
        stylePriorityOnTodo(todo, todoDiv);
      });
    } else if (Array.from(node.classList).includes("medium-priority")) {
      node.addEventListener("click", () => {
        let todoToChangePriority =
          ProjectManager.currentActiveProject.todos[
            ProjectManager.currentActiveProject.todos.indexOf(todo)
          ];
        todoToChangePriority.priority = "medium";
        stylePriorityOnTodo(todo, todoDiv);
      });
    } else if (Array.from(node.classList).includes("high-priority")) {
      node.addEventListener("click", () => {
        let todoToChangePriority =
          ProjectManager.currentActiveProject.todos[
            ProjectManager.currentActiveProject.todos.indexOf(todo)
          ];
        todoToChangePriority.priority = "high";
        stylePriorityOnTodo(todo, todoDiv);
      });
    }
  });
}

function stylePriorityOnTodo(todo, todoDiv) {
  todoDiv.classList.remove("low-priority");
  todoDiv.classList.remove("medium-priority");
  todoDiv.classList.remove("high-priority");

  if (todo.priority === "low") {
    todoDiv.classList.add("low-priority");
  } else if (todo.priority === "medium") {
    todoDiv.classList.add("medium-priority");
  } else if (todo.priority === "high") {
    todoDiv.classList.add("high-priority");
  }
}

function changeActiveProjectsTodosDisplay() {
  let todosDiv = DomStorage.projectToTodosDivMap.get(
    ProjectManager.currentActiveProject
  );
  if (todosDiv === undefined) {
    todosDiv = DomStorage.projectToTodosDivMap.get(
      ProjectManager.defaultProject
    );
    clearTodosDisplay(todosDiv);
    return;
  }
  clearTodosDisplay(todosDiv);
  updateTodosDisplay(todosDiv);
}

class DomStorage {
  static projectToTodosDivMap = new Map();
}
