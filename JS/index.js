const BACKEND_ROOT_URL = "http://localhost:3003";
import { Todos } from "./Class/Todos.js";
const todos = new Todos(BACKEND_ROOT_URL);
const taskList = document.getElementById("list");
const addButton = document.getElementById("btn");
const taskInput = document.getElementById("input");
taskInput.disabled = true;
todos
    .getTasks()
    .then((tasks) => {
    tasks.forEach(task => {
        renderTask(task);
    });
    taskInput.disabled = false;
})
    .catch((error) => {
    alert(error);
});
addButton.addEventListener("click", event => {
    const text = taskInput.value.trim();
    if (text === "") {
        alert("Enter Task First");
    }
    else {
        todos.addTask(text).then((task) => {
            taskInput.value = "";
            taskInput.focus();
            renderTask(task);
        });
        event.preventDefault();
    }
});
const renderTask = (task) => {
    const newTodo = document.createElement("li");
    newTodo.classList.add("todo");
    newTodo.classList.add("data-key", task.id.toString());
    renderComplete(newTodo);
    renderSpan(newTodo, task.text);
    renderLink(newTodo, task.id);
    taskList.appendChild(newTodo);
};
const renderComplete = (newTodo) => {
    const completedButton = document.createElement("button");
    completedButton.innerHTML = '<i class="fas fa-check-circle"></i>';
    completedButton.classList.add("check");
    newTodo.appendChild(completedButton);
};
const renderSpan = (newTodo, text) => {
    const span = newTodo.appendChild(document.createElement("span"));
    span.innerText = text;
};
const renderLink = (newTodo, id) => {
    const trashButton = document.createElement("button");
    trashButton.innerHTML = '<i class="fas fa-trash"></i>';
    trashButton.classList.add("trash");
    newTodo.appendChild(trashButton);
    trashButton.addEventListener("click", (event) => {
        todos
            .removeTask(id)
            .then((id) => {
            const elementToRemove = document.querySelector(`[data-key="${id}"]`);
            if (elementToRemove) {
                taskList.removeChild(elementToRemove);
            }
        })
            .catch((error) => {
            alert(error);
        });
    });
};
taskList.addEventListener("click", completeORdeleteTask);
function completeORdeleteTask(e) {
    const item = e.target;
    if (item.classList[0] === "check") {
        const task = item.parentElement;
        if (task.classList.contains("completed")) {
            return;
        }
        task.classList.add("completed");
    }
    if (item.classList[0] === "trash") {
        const task = item.parentElement;
        if (task.classList.contains("completed")) {
        }
        task.remove();
    }
}
