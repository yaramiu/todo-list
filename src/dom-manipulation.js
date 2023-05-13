export function setupCreateProjectButton(sidebarDiv) {
  const createProjectButton = document.createElement("button");
  createProjectButton.classList.add("create-project");
  createProjectButton.type = "button";
  createProjectButton.textContent = "Create a new project";
  initializeCreateProjectButton(createProjectButton, sidebarDiv);
  sidebarDiv.appendChild(createProjectButton);
}

function initializeCreateProjectButton(createProjectButton, sidebarDiv) {
  createProjectButton.addEventListener("click", () => {
    sidebarDiv.childNodes.forEach((node) => {
      if (Array.from(node.classList).includes("create-project")) {
        sidebarDiv.removeChild(node);
      }
    });
    setupProjectInputForm(sidebarDiv);
  });
}

function setupProjectInputForm(sidebarDiv) {
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
  initializeProjectInputSubmitButton(projectInputSubmitButton, sidebarDiv);

  newProjectForm.appendChild(projectTitleInput);
  newProjectForm.appendChild(projectInputSubmitButton);
  sidebarDiv.appendChild(newProjectForm);
}

function initializeProjectInputSubmitButton(
  projectInputSubmitButton,
  sidebarDiv
) {
  projectInputSubmitButton.addEventListener("click", () => {
    sidebarDiv.childNodes.forEach((node) => {
      if (Array.from(node.classList).includes("new-project")) {
        sidebarDiv.removeChild(node);
      }
    });
    setupCreateProjectButton(sidebarDiv);
  });
}
