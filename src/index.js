import {
  updateTodosDisplay,
  updateProjectsDisplay,
  setupCreateProjectButton,
  setupCreateTodoButton,
} from "./dom-manipulation.js";
import { ProjectManager } from "./project.js";
import "./style.css";

const contentDiv = document.querySelector("#content");

function initializePage() {
  const sidebarDiv = document.createElement("div");
  sidebarDiv.classList.add("sidebar");

  const projectsHeader = document.createElement("h1");
  projectsHeader.classList.add("projects-title");
  projectsHeader.textContent = "Projects";
  sidebarDiv.appendChild(projectsHeader);

  const projectsDiv = document.createElement("div");
  projectsDiv.classList.add("projects");
  ProjectManager.createNewProject("Default", true);
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

  const todosDiv = document.createElement("div");
  todosDiv.classList.add("todos");
  updateTodosDisplay(todosDiv);
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
