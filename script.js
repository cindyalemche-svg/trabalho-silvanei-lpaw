
// Selecionando os elementos HTML

const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const taskList = document.getElementById("task-list");
const emptyMessage = document.getElementById("empty-message");
const taskCounter = document.getElementById("task-counter");
const filterButtons = document.querySelectorAll(".filter");

// Estado inicial

let tasks = [];
let currentFilter = "all";

// Recuperar tarefas salvas

try {
    const savedTasks = localStorage.getItem("tasks");

    if (savedTasks) {
        const parsedTasks = JSON.parse(savedTasks);

        if (Array.isArray(parsedTasks)) {
            tasks = parsedTasks.filter(task =>
                task &&
                typeof task.id === "string" &&
                typeof task.text === "string" &&
                typeof task.completed === "boolean"
            );
        }
    }
} catch (error) {
    console.error("Não foi possível recuperar as tarefas:", error);
}

// Salvar tarefas

function saveTasks() {
    try {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    } catch (error) {
        console.error("Não foi possível salvar as tarefas:", error);
    }
}

// Adicionar tarefa

taskForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const taskText = taskInput.value.trim();

    if (taskText === "") {
        return;
    }

    const newTask = {
        id: crypto.randomUUID(),
        text: taskText,
        completed: false
    };

    tasks.push(newTask);

    saveTasks();

    renderTasks();

    taskInput.value = "";
    taskInput.focus();

});

// Renderizar tarefas

function renderTasks() {

    taskList.innerHTML = "";

    const filteredTasks = tasks.filter(task => {

        if (currentFilter === "pending") {
            return !task.completed;
        }

        if (currentFilter === "completed") {
            return task.completed;
        }

        return true;

    });

    // Verificar lista vazia

    emptyMessage.style.display =
        filteredTasks.length === 0 ? "block" : "none";

    if (filteredTasks.length === 0) {
        if (tasks.length > 0) {
            emptyMessage.textContent =
                "Nenhuma tarefa encontrada neste filtro.";
        } else {
            emptyMessage.textContent =
                "Nenhuma tarefa cadastrada.";
        }
    }

    // Criar elementos das tarefas

    filteredTasks.forEach(task => {

        const article = document.createElement("article");
        article.className = "task";

        if (task.completed) {
            article.classList.add("completed");
        }

        // Área do conteúdo

        const content = document.createElement("div");
        content.className = "task-content";

        // Checkbox

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;
        checkbox.setAttribute(
            "aria-label",
            `Concluir tarefa: ${task.text}`
        );

        checkbox.addEventListener("change", function() {

            task.completed = checkbox.checked;

            saveTasks();
            renderTasks();

        });

        // Texto da tarefa

        const span = document.createElement("span");
        span.className = "task-text";
        span.textContent = task.text;

        content.appendChild(checkbox);
        content.appendChild(span);

        // Botão de excluir

        const deleteButton = document.createElement("button");
        deleteButton.className = "delete-button";
        deleteButton.textContent = "Excluir";

        deleteButton.setAttribute(
            "aria-label",
            `Excluir tarefa: ${task.text}`
        );

        deleteButton.addEventListener("click", function() {

            tasks = tasks.filter(item => item.id !== task.id);

            saveTasks();
            renderTasks();

        });

        // Montagem do artigo

        article.appendChild(content);
        article.appendChild(deleteButton);

        taskList.appendChild(article);

    });

    // Atualizar contador

    const pendingTasks = tasks.filter(
        task => !task.completed
    ).length;

    taskCounter.textContent =
        `${pendingTasks} tarefa(s) pendente(s)`;

}

// Filtros de tarefas

filterButtons.forEach(button => {

    button.addEventListener("click", function() {

        currentFilter = button.dataset.filter;

        filterButtons.forEach(btn => {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        renderTasks();

    });

});

// Inicializar aplicação

renderTasks();
