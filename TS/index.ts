const BACKEND_ROOT_URL = "http://localhost:3003";
import { Task } from "./Class/Task.js";
import { Todos } from "./Class/Todos.js";

const todos = new Todos(BACKEND_ROOT_URL);

const taskList = <HTMLDListElement>document.getElementById("list");
const addButton = <HTMLButtonElement>document.getElementById("btn");
const taskInput = <HTMLInputElement>document.getElementById("input");

taskInput.disabled = true;

todos
	.getTasks()
	.then((tasks: Array<Task>) => {
		tasks.forEach((task) => {
			renderTask(task);
		});
		taskInput.disabled = false;
	})
	.catch((error) => {
		alert(error);
	});

addButton.addEventListener("click", (event) => {
	const text = taskInput.value.trim();
	if (text === "") {
		alert("Enter Task First");
	} else {
		todos.addTask(text).then((task) => {
			taskInput.value = "";
			taskInput.focus();
			renderTask(<Task>task);
		});
		event.preventDefault();
	}
});

const renderTask = (task: Task) => {
	const newTodo = document.createElement("li");
	newTodo.classList.add("todo");
	newTodo.classList.add("data-key", task.id.toString());

	renderComplete(newTodo);
	renderSpan(newTodo, task.text);
	renderLink(newTodo, task.id);
	taskList.appendChild(newTodo);
};

const renderComplete = (newTodo: HTMLLIElement) => {
	const completedButton = document.createElement("button");
	completedButton.innerHTML = '<i class="fas fa-check-circle"></i>';
	completedButton.classList.add("check");
	newTodo.appendChild(completedButton);
};

const renderSpan = (newTodo: HTMLLIElement, text: string) => {
	const span = newTodo.appendChild(document.createElement("span"));
	span.innerText = text;
};

const renderLink = (newTodo: HTMLLIElement, id: number) => {
	const trashButton = document.createElement("button");
	trashButton.innerHTML = '<i class="fas fa-trash"></i>';
	trashButton.classList.add("trash");
	newTodo.appendChild(trashButton);
	trashButton.addEventListener("click", (event) => {
		todos
			.removeTask(id)
			.then((id) => {
				const elementToRemove: HTMLLIElement = document.querySelector(
					`[data-key="${id}"]`
				);
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
