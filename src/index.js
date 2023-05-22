import {
  updateTodosDisplay,
  updateProjectsDisplay,
  setupCreateProjectButton,
  setupCreateTodoButton,
  clearTodosDisplay,
  DomStorage,
} from "./dom-manipulation.js";
import { ProjectManager } from "./project.js";
import {
  saveProject,
  getLocalStorageData,
  initializeProjectMethods,
} from "./storage.js";
import "./style.css";

function initializePage() {
  const contentDiv = document.querySelector("#content");

  const sidebarDiv = document.createElement("div");
  sidebarDiv.classList.add("sidebar");

  const projectsHeader = document.createElement("h1");
  projectsHeader.classList.add("projects-title");
  projectsHeader.textContent = "Projects";
  sidebarDiv.appendChild(projectsHeader);

  const projectsDiv = document.createElement("div");
  projectsDiv.classList.add("projects");

  let project;
  if (localStorage.length === 0) {
    project = ProjectManager.createNewProject("Default", true);
    saveProject();
    initializeProjectMethods(project);
  } else {
    getLocalStorageData();
    ProjectManager.defaultProject = ProjectManager.projects[0];
  }

  updateProjectsDisplay(projectsDiv);
  sidebarDiv.appendChild(projectsDiv);

  setupCreateProjectButton(projectsDiv, sidebarDiv);
  contentDiv.appendChild(sidebarDiv);

  const mainDiv = document.createElement("div");
  mainDiv.classList.add("main");

  const todosHeader = document.createElement("h1");
  todosHeader.classList.add("todos-title");
  todosHeader.textContent = "Todos";
  mainDiv.appendChild(todosHeader);

  let todosDiv = DomStorage.projectToTodosDivMap.get(
    ProjectManager.defaultProject.title
  );
  if (todosDiv === undefined) {
    todosDiv = document.createElement("div");
    todosDiv.classList.add("todos");
  } else {
    clearTodosDisplay(todosDiv);
  }
  updateTodosDisplay(todosDiv, true);
  mainDiv.appendChild(todosDiv);

  const createTodoButton = document.createElement("button");
  createTodoButton.classList.add("create-todo");
  createTodoButton.type = "button";
  createTodoButton.textContent = "Create Todo";
  setupCreateTodoButton(createTodoButton, todosDiv);
  mainDiv.appendChild(createTodoButton);

  contentDiv.appendChild(mainDiv);
}

initializePage();
