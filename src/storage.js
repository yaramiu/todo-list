import { DomStorage } from "./dom-manipulation";
import { ProjectManager } from "./project";

export function saveProject() {
  let projectJsonCollection = [];
  ProjectManager.projects.forEach((project) => {
    const projectJson = JSON.stringify(project);
    projectJsonCollection.push(projectJson);
  });
  localStorage.setItem("projects", JSON.stringify(projectJsonCollection));
}

export function saveMap() {
  const mapJson = {};
  const projectTitlesJsonCollection = [];
  const todosDivJsonCollection = [];
  const projectTitles = Array.from(DomStorage.projectToTodosDivMap.keys());

  projectTitles.forEach((projectTitle) => {
    const projectTitleJson = JSON.stringify(projectTitle);
    projectTitlesJsonCollection.push(projectTitleJson);

    const todosDiv = DomStorage.projectToTodosDivMap.get(projectTitle);
    const todosDivJson = JSON.stringify(todosDiv.innerHTML);
    todosDivJsonCollection.push(todosDivJson);
  });

  mapJson.projectKeys = JSON.stringify(projectTitlesJsonCollection);
  mapJson.todosDivValues = JSON.stringify(todosDivJsonCollection);

  localStorage.setItem("map", JSON.stringify(mapJson));

  localStorage.setItem(
    "div",
    JSON.stringify(DomStorage.projectToTodosDivMap.get("Default").outerHTML)
  );
}

export function getLocalStorageData() {
  const projectJsonCollection = JSON.parse(localStorage.getItem("projects"));
  for (let i = 0; i < projectJsonCollection.length; i++) {
    projectJsonCollection[i] = JSON.parse(projectJsonCollection[i]);
  }
  ProjectManager.projects = projectJsonCollection;

  const divJson = JSON.parse(localStorage.getItem("div"));
  let todosDiv = new DOMParser().parseFromString(divJson, "text/html");
  todosDiv = todosDiv.querySelector(".todos");
  while (todosDiv.lastChild) {
    todosDiv.removeChild(todosDiv.lastChild);
  }

  const mapJson = JSON.parse(localStorage.getItem("map"));
  const projectKeysJson = JSON.parse(mapJson.projectKeys);
  const todosDivValuesJson = JSON.parse(mapJson.todosDivValues);
  for (let i = 0; i < projectKeysJson.length; i++) {
    todosDiv.innerHTML = JSON.parse(todosDivValuesJson[i]);

    DomStorage.projectToTodosDivMap.set(
      JSON.parse(projectKeysJson[i]),
      todosDiv
    );
  }
}

export function initializeProjectMethods(project) {
  project.addTodo = new Function(
    project.addTodoJson.function.arguments,
    project.addTodoJson.function.body
  );
  project.removeTodo = new Function(
    project.removeTodoJson.function.arguments,
    project.removeTodoJson.function.body
  );
}
