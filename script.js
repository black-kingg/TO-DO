// Retrieve tasks from local storage
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Add tasks to the HTML list
function renderTasks() {
  const taskList = document.getElementById('task-list');
  taskList.innerHTML = '';

  tasks.forEach((task, index) => {
    const listItem = document.createElement('li');
    listItem.innerHTML = `
      <span class="task ${task.completed ? 'completed' : ''}">${task.title}</span>
      <button onclick="completeTask(${index})">Complete</button>
      <button onclick="deleteTask(${index})">Delete</button>
    `;
    taskList.appendChild(listItem);
  });
}

// Add a new task to the list
function addTask() {
  const taskInput = document.getElementById('task-input');
  const title = taskInput.value.trim();

  if (title !== '') {
    const newTask = { title, completed: false };
    tasks.push(newTask);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    taskInput.value = '';
    renderTasks();
  }
}

// Complete a task
function completeTask(index) {
  tasks[index].completed = true;
  localStorage.setItem('tasks', JSON.stringify(tasks));
  renderTasks();
}

// Delete a task
function deleteTask(index) {
  tasks.splice(index, 1);
  localStorage.setItem('tasks', JSON.stringify(tasks));
  renderTasks();
}

// Render initial tasks
renderTasks();
