import { ProjectManager } from "./project";

export function isInputValid(inputStr) {
  if (inputStr === "") {
    alert("Please enter a non empty name for the project.");
    return false;
  } else if (inputStr.toLowerCase() === "default") {
    alert(
      "Default is reserved for the project with all the todos. Please enter a different name."
    );
    return false;
  } else {
    let isUnique = true;
    ProjectManager.projects.forEach((project) => {
      if (inputStr.toLowerCase() === project.title.toLowerCase()) {
        alert(
          "There is already a project with that name. Please enter a unique name."
        );
        isUnique = false;
      }
    });
    if (!isUnique) {
      return false;
    }
  }
  return true;
}
