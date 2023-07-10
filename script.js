// Initialize Firebase with your config object values
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

firebase.initializeApp(firebaseConfig);

// Get a reference to the Firebase authentication and database
const auth = firebase.auth();
const database = firebase.database();

// Auth state change listener
auth.onAuthStateChanged(user => {
  if (user) {
    document.getElementById('auth-container').style.display = 'none';
    document.getElementById('task-container').style.display = 'block';
    loadTasks(user.uid);
  } else {
    document.getElementById('auth-container').style.display = 'block';
    document.getElementById('task-container').style.display = 'none';
    clearTasks();
  }
});

// Sign up a new user
function signup() {
  const email = document.getElementById('signup-email').value.trim();
  const password = document.getElementById('signup-password').value.trim();

  if (email !== '' && password !== '') {
    auth.createUserWithEmailAndPassword(email, password)
      .catch(error => {
        console.error(error.message);
      });
  }
}

// Sign in an existing user
function signin() {
  const email = document.getElementById('signin-email').value.trim();
  const password = document.getElementById('signin-password').value.trim();

  if (email !== '' && password !== '') {
    auth.signInWithEmailAndPassword(email, password)
      .catch(error => {
        console.error(error.message);
      });
  }
}

// Sign out the current user
function signout() {
  auth.signOut();
}

// Add a new task to the Firebase database
function addTask() {
  const taskInput = document.getElementById('task-input');
  const title = taskInput.value.trim();

  if (title !== '') {
    const user = auth.currentUser;
    const tasksRef = database.ref(`tasks/${user.uid}`);
    tasksRef.push({ title, completed: false });
    taskInput.value = '';
  }
}

// Load tasks from the Firebase database
function loadTasks(userId) {
  const tasksRef = database.ref(`tasks/${userId}`);
  tasksRef.on('value', snapshot => {
    const tasks = snapshot.val() || {};
    renderTasks(tasks);
  });
}

// Render tasks in the HTML list
function renderTasks(tasks) {
  const taskList = document.getElementById('task-list');
  taskList.innerHTML = '';

  for (let taskId in tasks) {
    const task = tasks[taskId];
    const listItem = document.createElement('li');
    listItem.innerHTML = `
      <span class="task ${task.completed ? 'completed' : ''}">${task.title}</span>
      <button onclick="completeTask('${taskId}')">Complete</button>
      <button onclick="deleteTask('${taskId}')">Delete</button>
    `;
    taskList.appendChild(listItem);
  }
}

// Clear tasks from the HTML list
function clearTasks() {
  const taskList = document.getElementById('task-list');
  taskList.innerHTML = '';
}

// Complete a task in the Firebase database
function completeTask(taskId) {
  const user = auth.currentUser;
  const taskRef = database.ref(`tasks/${user.uid}/${taskId}`);
  taskRef.update({ completed: true });
}

// Delete a task from the Firebase database
function deleteTask(taskId) {
  const user = auth.currentUser;
  const taskRef = database.ref(`tasks/${user.uid}/${taskId}`);
  taskRef.remove();
}
