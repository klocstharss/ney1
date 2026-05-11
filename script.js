// Obtener elementos del DOM
const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const pendingCount = document.getElementById("pendingCount");
const clearCompletedBtn = document.getElementById("clearCompleted");
const filterBtns = document.querySelectorAll(".filter-btn");

// Estado de la aplicación
let tasks = [];
let currentFilter = "all"; // 'all', 'pending', 'completed'

// Cargar tareas desde localStorage al inicio
function loadTasks() {
  const savedTasks = localStorage.getItem("tasks");
  if (savedTasks) {
    tasks = JSON.parse(savedTasks);
  }
  renderTasks();
}

// Guardar tareas en localStorage
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Agregar nueva tarea
function addTask() {
  const text = taskInput.value.trim();
  if (text === "") {
    alert("Escribe una tarea antes de agregar");
    return;
  }

  const newTask = {
    id: Date.now(),
    text: text,
    completed: false,
  };

  tasks.push(newTask);
  saveTasks();
  renderTasks();
  taskInput.value = "";
  taskInput.focus();
}

// Eliminar tarea por ID
function deleteTask(id) {
  tasks = tasks.filter((task) => task.id !== id);
  saveTasks();
  renderTasks();
}

// Alternar estado completado/no completado
function toggleTask(id) {
  const task = tasks.find((task) => task.id === id);
  if (task) {
    task.completed = !task.completed;
    saveTasks();
    renderTasks();
  }
}

// Eliminar todas las tareas completadas
function clearCompleted() {
  tasks = tasks.filter((task) => !task.completed);
  saveTasks();
  renderTasks();
}

// Contar tareas pendientes
function countPendingTasks() {
  return tasks.filter((task) => !task.completed).length;
}

// Actualizar contador de pendientes
function updatePendingCount() {
  const pending = countPendingTasks();
  pendingCount.textContent = `${pending} pendiente${pending !== 1 ? "s" : ""}`;
}

// Filtrar tareas según el filtro actual
function getFilteredTasks() {
  if (currentFilter === "pending") {
    return tasks.filter((task) => !task.completed);
  } else if (currentFilter === "completed") {
    return tasks.filter((task) => task.completed);
  }
  return tasks; // 'all'
}

// Renderizar la lista de tareas en el HTML
function renderTasks() {
  const filteredTasks = getFilteredTasks();

  if (filteredTasks.length === 0) {
    taskList.innerHTML =
      '<div class="empty-message">✨ No hay tareas para mostrar</div>';
    updatePendingCount();
    return;
  }

  taskList.innerHTML = "";

  filteredTasks.forEach((task) => {
    const li = document.createElement("li");
    li.className = "task-item";

    // Checkbox
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "task-checkbox";
    checkbox.checked = task.completed;
    checkbox.addEventListener("change", () => toggleTask(task.id));

    // Texto de la tarea
    const taskText = document.createElement("span");
    taskText.className = `task-text ${task.completed ? "completed" : ""}`;
    taskText.textContent = task.text;

    // Botón eliminar
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "🗑️ Eliminar";
    deleteBtn.className = "delete-btn";
    deleteBtn.addEventListener("click", () => deleteTask(task.id));

    li.appendChild(checkbox);
    li.appendChild(taskText);
    li.appendChild(deleteBtn);

    taskList.appendChild(li);
  });

  updatePendingCount();
}

// Cambiar filtro activo
function setFilter(filter) {
  currentFilter = filter;

  // Actualizar estilos de botones
  filterBtns.forEach((btn) => {
    if (btn.dataset.filter === filter) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });

  renderTasks();
}

// Event Listeners
addBtn.addEventListener("click", addTask);
taskInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    addTask();
  }
});
clearCompletedBtn.addEventListener("click", clearCompleted);

filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    setFilter(btn.dataset.filter);
  });
});

// Inicializar la aplicación
loadTasks();
