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
