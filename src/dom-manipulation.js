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
    makeOtherProjectsInactive(project, projectDiv, projectsDiv);

    makeNoteImageActive(projectDiv);
    makeOtherNoteImagesInactive(projectDiv.firstChild, projectsDiv);
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

function makeOtherProjectsInactive(project, projectDiv, projectsDiv) {
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
    displayTodo(currentTodo, todosDiv, currentProject);
  }
}

function clearTodoDisplay(todosDiv) {
  while (todosDiv.lastChild) {
    todosDiv.removeChild(todosDiv.lastChild);
  }
}

function displayTodo(todo, todosDiv, project) {
  const todoDiv = document.createElement("div");
  todoDiv.classList.add("todo");

  const expandDescriptionButton = document.createElement("button");
  expandDescriptionButton.classList.add("expand-description");
  expandDescriptionButton.type = "button";
  expandDescriptionButton.style = `background-image: url(${downChevronSvg})`;
  setupExpandDescriptionButton(expandDescriptionButton, todo, todoDiv);
  todoDiv.appendChild(expandDescriptionButton);

  const deleteTodoButton = document.createElement("button");
  deleteTodoButton.classList.add("delete-todo");
  deleteTodoButton.type = "button";
  deleteTodoButton.textContent = "X";
  setupDeleteTodoButton(deleteTodoButton, todo, todosDiv, project);
  todoDiv.appendChild(deleteTodoButton);

  const todoTitleHeader = document.createElement("h3");
  todoTitleHeader.classList.add("todo-title");
  todoTitleHeader.contentEditable = "true";
  todoTitleHeader.textContent = todo.title;
  todoTitleHeader.addEventListener("input", () => {
    todo.title = todoTitleHeader.textContent;
  });
  todoDiv.appendChild(todoTitleHeader);

  const todoDueDateParagraph = document.createElement("p");
  todoDueDateParagraph.classList.add("due-date");
  todoDueDateParagraph.textContent = format(todo.dueDate, "yyyy-MM-dd");
  todoDiv.appendChild(todoDueDateParagraph);

  todosDiv.appendChild(todoDiv);
}

function setupExpandDescriptionButton(expandDescriptionButton, todo, todoDiv) {
  expandDescriptionButton.addEventListener("click", () => {
    const descriptionParagraph = document.createElement("p");
    descriptionParagraph.classList.add("description");
    descriptionParagraph.contentEditable = "true";

    descriptionParagraph.addEventListener("input", () => {
      todo.description = descriptionParagraph.innerText;
    });
    descriptionParagraph.textContent = todo.description;

    const shrinkDescriptionButton = document.createElement("button");
    shrinkDescriptionButton.classList.add("shrink-description");
    shrinkDescriptionButton.type = "button";
    shrinkDescriptionButton.style = `background-image: url(${upChevronSvg})`;
    expandDescriptionButton.replaceWith(shrinkDescriptionButton);
    setupShrinkDescriptionButton(
      expandDescriptionButton,
      shrinkDescriptionButton,
      descriptionParagraph,
      todoDiv
    );

    todoDiv.appendChild(descriptionParagraph);
  });
}

function setupShrinkDescriptionButton(
  expandDescriptionButton,
  shrinkDescriptionButton,
  descriptionParagraph,
  todoDiv
) {
  shrinkDescriptionButton.addEventListener("click", () => {
    shrinkDescriptionButton.replaceWith(expandDescriptionButton);

    todoDiv.removeChild(descriptionParagraph);
  });
}

function setupDeleteTodoButton(deleteTodoButton, todo, todosDiv, project) {
  deleteTodoButton.addEventListener("click", () => {
    ProjectManager.removeTodoFromProject(project, todo);
    clearTodoDisplay(todosDiv);
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
    clearTodoDisplay(todosDiv);
    updateTodosDisplay(todosDiv);
  });
}
