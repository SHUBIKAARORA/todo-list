$(document).ready(function () {
    // Load tasks from local storage when the page is ready
    loadTasks();

    // Function to add a new task
    function addTask() {
        let task = $("#new-entry").val(); // Get the value of the new task input field
        if (task) {
            let taskHtml = createTaskHTML(task, false); // Generate HTML for the new task (uncompleted)
            $("#ul-1").append(taskHtml); // Append the new task to the "uncompleted tasks" list
            saveTasks(); // Save the current tasks to local storage
            $("#new-entry").val(""); // Clear the input field after adding the task
        }
    }

    // Event listener for adding a task when the "Add" button is clicked
    $("#add-button").click(function () {
        addTask();
    });

    // Event listener for adding a task when the "Enter" key is pressed in the input field
    $("#new-entry").keypress(function (event) {
        if (event.which === 13) { // 13 is the Enter key
            addTask();
        }
    });

    // Event listener for marking a task as completed
    $(document).on("click", ".complete-task", function () {
        let parentLi = $(this).closest("li"); // Get the closest <li> element (the task)
        parentLi.find(".complete-task").remove(); // Remove the "Complete Task" button
        parentLi.find(".edit-task").remove(); // Remove the "Edit Task" button
        parentLi
            .find(".ul1-li-buttons")
            .prepend(
                '<button class="restore-task"><img src="./images/restore.svg" alt="Restore Task"></button>' // Add a "Restore Task" button
            );
        $("#ul-2").append(parentLi); // Move the task to the completed tasks list
        saveTasks(); // Save the updated tasks to local storage
    });

    // Event listener for restoring a completed task
    $(document).on("click", ".restore-task", function () {
        let parentLi = $(this).closest("li"); // Get the closest <li> element (the task)
        parentLi.find(".restore-task").remove(); // Remove the "Restore Task" button

        // Re-create the task action buttons (complete, edit, delete)
        let buttonHtml =
            '<button class="complete-task"><img src="./images/complete.svg" alt="Complete Task"></button>' +
            '<button class="edit-task"><img src="./images/edit.svg" alt="Edit Task"></button>' +
            '<button class="delete-task"><img src="./images/delete.svg" alt="Delete Task"></button>';

        parentLi.find(".ul1-li-buttons").html(buttonHtml); // Replace buttons in the task
        $("#ul-1").append(parentLi); // Move the task back to the uncompleted tasks list
        saveTasks(); // Save the updated tasks to local storage
    });

    // Event listener for deleting a task
    $(document).on("click", ".delete-task", function () {
        $(this).closest("li").remove(); // Remove the task from the list
        saveTasks(); // Save the updated tasks to local storage
    });

    // Event listener for editing a task
    $(document).on("click", ".edit-task", function () {
        let parentLi = $(this).closest("li"); // Get the closest <li> element (the task)
        let taskNameSpan = parentLi.find(".task-name"); // Get the span element containing the task name
        let currentTaskName = taskNameSpan.text(); // Get the current task name
        let newTaskName = prompt("Edit Task:", currentTaskName); // Ask the user to edit the task name

        if (newTaskName) { // If the user enters a new task name
            taskNameSpan.text(newTaskName); // Update the task name in the list
            saveTasks(); // Save the updated tasks to local storage
        }
    });

    // Function to save tasks to local storage
    function saveTasks() {
        let uncompletedTasks = [];
        let completedTasks = [];

        // Loop through all uncompleted tasks and store their names
        $("#ul-1 li").each(function () {
            uncompletedTasks.push($(this).find(".task-name").text());
        });

        // Loop through all completed tasks and store their names
        $("#ul-2 li").each(function () {
            completedTasks.push($(this).find(".task-name").text());
        });

        // Save the tasks to local storage
        localStorage.setItem(
            "uncompletedTasks",
            JSON.stringify(uncompletedTasks)
        );
        localStorage.setItem(
            "completedTasks",
            JSON.stringify(completedTasks)
        );
    }

    // Function to load tasks from local storage
    function loadTasks() {
        // Retrieve tasks from local storage or use empty arrays if not found
        let uncompletedTasks =
            JSON.parse(localStorage.getItem("uncompletedTasks")) || [];
        let completedTasks =
            JSON.parse(localStorage.getItem("completedTasks")) || [];

        // Create and append HTML for uncompleted tasks
        uncompletedTasks.forEach(function (task) {
            let taskHtml = createTaskHTML(task, false); // Generate HTML for uncompleted tasks
            $("#ul-1").append(taskHtml);
        });

        // Create and append HTML for completed tasks
        completedTasks.forEach(function (task) {
            let taskHtml = createTaskHTML(task, true); // Generate HTML for completed tasks
            $("#ul-2").append(taskHtml);
        });
    }

    // Function to create the HTML structure for a task (either completed or uncompleted)
    function createTaskHTML(task, isCompleted) {
        let taskHtml = `<li class="ul1-li">
                <span class="task-name">${task}</span>
                <div class="ul1-li-buttons">
                  ${
                    isCompleted
                      ? '<button class="restore-task"><img src="./images/restore.svg" alt="Restore Task"></button>' // If task is completed, show restore button
                      : '<button class="complete-task"><img src="./images/completed.svg" alt="Complete Task"></button>' +
                        '<button class="edit-task"><img src="./images/edit.svg" alt="Edit Task"></button>' // If task is uncompleted, show complete and edit buttons
                  }
                  <button class="delete-task"><img src="./images/delete.svg" alt="Delete Task"></button> <!-- Always show delete button -->
                </div>
              </li>`;
        return taskHtml; // Return the generated task HTML
    }
});