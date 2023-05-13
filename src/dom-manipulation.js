import { ProjectManager } from "./project";
import { hitProjectLimit, isInputValid } from "./validation";
import notesSvg from "./images/note-multiple.svg";

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
  projectDiv.appendChild(projectTitleButton);

  if (project.title !== "Default") {
    const projectDeleteButton = document.createElement("button");
    projectDeleteButton.classList.add("project-delete");
    projectDeleteButton.textContent = "X";
    projectDiv.appendChild(projectDeleteButton);
  } else {
    projectDiv.classList.add("default");
  }

  projectsDiv.appendChild(projectDiv);
}
