document.addEventListener("DOMContentLoaded", () => {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    
    // saving tasks to local storage 
    const saveTasks = () => {
      localStorage.setItem("tasks", JSON.stringify(tasks));
    };
  
    // Render tasks on the dashboard
    const renderTasks = (filter = "all", query = "") => {
      const taskDashboard = document.getElementById("task-dashboard");
      if (!taskDashboard) return; // Only run if on dashboard page
  
      taskDashboard.innerHTML = "";
  
      let filteredTasks = tasks.filter((task) => {
        if (query && !task.title.toLowerCase().includes(query.toLowerCase())) return false;
  
        switch (filter) {
          case "upcoming":
            return new Date(task.dueDate) >= new Date() && !task.completed;
          case "overdue":
            return new Date(task.dueDate) < new Date() && !task.completed;
          case "completed":
            return task.completed;
          case "priority-high":
            return task.priority === "High";
          case "priority-medium":
            return task.priority === "Medium";
          case "priority-low":
            return task.priority === "Low";
          default:
            return true;
        }
      });
  
      filteredTasks.forEach((task, index) => {
        const taskDiv = document.createElement("div");
        taskDiv.className = "task";
  
        taskDiv.innerHTML = `
          <h3>${task.title}</h3>
          <p>${task.description}</p>
          <p>Due: ${task.dueDate}</p>
          <p>Priority: ${task.priority}</p>
          <p>Status: ${task.completed ? "Completed" : "Pending"}</p>
          <button onclick="toggleTask(${index})">Mark as ${task.completed ? "Pending" : "Completed"}</button>
          <button onclick="deleteTask(${index})">Delete</button>
        `;
  
        taskDashboard.appendChild(taskDiv);
      });
    };
  
    // Toggle task completion
    window.toggleTask = (index) => {
      tasks[index].completed = !tasks[index].completed;
      saveTasks();
      renderTasks();
    };
  
    // Delete a task
    window.deleteTask = (index) => {
      tasks.splice(index, 1);
      saveTasks();
      renderTasks();
    };
  
    // Handle task form submission
    const taskForm = document.getElementById("task-form");
    if (taskForm) {
      taskForm.addEventListener("submit", (e) => {
        e.preventDefault();
  
        const newTask = {
          title: document.getElementById("task-title").value,
          description: document.getElementById("task-desc").value,
          dueDate: document.getElementById("task-due").value,
          priority: document.getElementById("task-priority").value,
          completed: false,
        };
  
        tasks.push(newTask);
        saveTasks();
        window.location.href = "index.html"; // Redirect to dashboard
      });
    }
  
    // Search and filter functionality
    const searchInput = document.getElementById("search");
    const filters = document.querySelectorAll("#task-filters button");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        renderTasks("all", e.target.value);
      });
    }
    if (filters) {
      filters.forEach((button) => {
        button.addEventListener("click", () => {
          renderTasks(button.dataset.filter);
        });
      });
    }
  
    renderTasks();
  });
  