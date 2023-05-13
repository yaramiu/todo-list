import {
  updateProjectsDisplay,
  setupCreateProjectButton,
} from "./dom-manipulation.js";
import { ProjectManager } from "./project.js";
import "./style.css";

const contentDiv = document.querySelector("#content");

function initializePage() {
  const sidebarDiv = document.createElement("div");
  sidebarDiv.classList.add("sidebar");

  const projectsHeader = document.createElement("h1");
  projectsHeader.classList.add("project-main-title");
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
  mainDiv.appendChild(todosDiv);

  contentDiv.appendChild(mainDiv);
}

initializePage();
