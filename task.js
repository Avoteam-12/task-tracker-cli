const fs = require('fs');
const path = require('path');

// Constants
const TASKS_FILE = path.join(__dirname, 'tasks.json');

// Load tasks from JSON file
function loadTasks() {
    if (!fs.existsSync(TASKS_FILE)) {
        return [];
    }
    const data = fs.readFileSync(TASKS_FILE);
    return JSON.parse(data);
}

// Save tasks to JSON file
function saveTasks(tasks) {
    fs.writeFileSync(TASKS_FILE, JSON.stringify(tasks, null, 4));
}

// Add a new task
function addTask(description) {
    const tasks = loadTasks();
    const taskId = tasks.length + 1;
    const newTask = {
        id: taskId,
        description,
        status: 'todo',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
    tasks.push(newTask);
    saveTasks(tasks);
    console.log(`Task added successfully (ID: ${taskId})`);
}

// Update a task
function updateTask(taskId, newDescription) {
    const tasks = loadTasks();
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        task.description = newDescription;
        task.updatedAt = new Date().toISOString();
        saveTasks(tasks);
        console.log(`Task ${taskId} updated successfully.`);
    } else {
        console.log(`Task ${taskId} not found.`);
    }
}

// Delete a task
function deleteTask(taskId) {
    let tasks = loadTasks();
    tasks = tasks.filter(task => task.id !== taskId);
    saveTasks(tasks);
    console.log(`Task ${taskId} deleted successfully.`);
}

// Mark task as in progress
function markInProgress(taskId) {
    const tasks = loadTasks();
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        task.status = 'in-progress';
        task.updatedAt = new Date().toISOString();
        saveTasks(tasks);
        console.log(`Task ${taskId} marked as in progress.`);
    } else {
        console.log(`Task ${taskId} not found.`);
    }
}

// Mark task as done
function markDone(taskId) {
    const tasks = loadTasks();
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        task.status = 'done';
        task.updatedAt = new Date().toISOString();
        saveTasks(tasks);
        console.log(`Task ${taskId} marked as done.`);
    } else {
        console.log(`Task ${taskId} not found.`);
    }
}

// List tasks
function listTasks(status) {
    const tasks = loadTasks();
    const filteredTasks = status ? tasks.filter(task => task.status === status) : tasks;
    filteredTasks.forEach(task => {
        console.log(`ID: ${task.id}, Description: ${task.description}, Status: ${task.status}`);
    });
}

// Main function to handle user commands
function main() {
    const [,, command, ...args] = process.argv;

    switch (command) {
        case 'add':
            addTask(args.join(' '));
            break;
        case 'update':
            updateTask(parseInt(args[0]), args.slice(1).join(' '));
            break;
        case 'delete':
            deleteTask(parseInt(args[0]));
            break;
        case 'mark-in-progress':
            markInProgress(parseInt(args[0]));
            break;
        case 'mark-done':
            markDone(parseInt(args[0]));
            break;
        case 'list':
            listTasks(args[0]);
            break;
        default:
            console.log('Unknown command. Usage: task-cli <command> [args...]');
    }
}

// Execute main function
main();