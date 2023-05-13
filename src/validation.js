import { ProjectManager } from "./project";

export function hitProjectLimit() {
  const PROJECT_LIMIT = 12;
  if (ProjectManager.projects.length === PROJECT_LIMIT) {
    alert(
      "You have exceeded the project limit of 12. Please remove a project before adding another one."
    );
    return true;
  }
  return false;
}

export function isInputValid(inputStr) {
  if (inputStr === "") {
    alert("Please enter a non empty name for the project.");
    return false;
  } else if (inputStr === "Default") {
    alert(
      "Default is reserved for the project with all the todos. Please enter a different name."
    );
    return false;
  }
  return true;
}
