const lists = document.getElementsByClassName("list-group-item");

for (let i = 0; i < lists.length; i++) {
    if (lists[i].classList.contains("list-group-item-success")) {
        statusForm = lists[i].firstElementChild;
        checkbox = statusForm.children[2];
        checkbox.checked = true;
    }
}

function statusChange(checkbox, taskID) {
    const li = checkbox.closest("li");
    const statusForm = document.getElementById("status-form" + taskID);
    statusForm.submit();
}

function mouseover(event) {
    const favouriteIcon = event.currentTarget;
    const favouriteIconPath = favouriteIcon.querySelector("path");
    favouriteIcon.classList.add("bi-star-fill");
    favouriteIcon.classList.remove("bi-star");
    favouriteIconPath.setAttribute("d", "M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z");

}

function mouseout(event) {
    const favouriteIcon = event.currentTarget;
    const favouriteIconPath = favouriteIcon.querySelector("path");
    favouriteIcon.classList.add("bi-star");
    favouriteIcon.classList.remove("bi-star-fill");
    favouriteIconPath.setAttribute("d", "M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.56.56 0 0 0-.163-.505L1.71 6.745l4.052-.576a.53.53 0 0 0 .393-.288L8 2.223l1.847 3.658a.53.53 0 0 0 .393.288l4.052.575-2.906 2.77a.56.56 0 0 0-.163.506l.694 3.957-3.686-1.894a.5.5 0 0 0-.461 0z");
}

const form = document.getElementById("add_form");
const taskField = document.getElementById("task_input");

const submitButton = form.querySelector("[type='submit']");
submitButton.addEventListener("click", openIfNoTask);

const alert = document.createElement("p");
taskField.after(alert);
alert.style.color = "red";

function openIfNoTask(event) {
   if (taskField.value.trim() === "") {
       event.preventDefault();
       alert.textContent = "Task must be entered to add!";
   }
}

const dateInput = document.getElementById("due_date");
const dateButton = document.getElementById("due_date_btn");
const dateText = document.getElementById("due_date_text");
const dateButtonSVG =  document.getElementById("due_date_svg");
const dateButtonPath1 =  document.getElementById("due_date_path1");
const dateButtonPath2 =  document.getElementById("due_date_path2");

var today = new Date();
const date = String(today.getDate()).padStart(2, '0');
const month = String(today.getMonth() + 1).padStart(2, '0');
const year = today.getFullYear();

today = month + '/' + date + '/' + year;

const datepicker = new Datepicker(dateInput, {
     buttonClass: "btn",
     clearButton: "true",
     todayButton: "true",
     todayButtonMode: 1,
     minDate: today,
});

dateInput.addEventListener("changeDate", function() {
    dateInput.check = !dateInput.check;

    if (dateInput.value == "") {
        dateText.textContent = "Due Date";
        dateText.style.fontSize = "0.875rem";
        dateButton.style.width = "104px";
        dateButtonSVG.setAttribute("class", "bi bi-calendar2-plus");
        dateButtonSVG.setAttribute("fill", "currentColor");
        dateButtonPath1.setAttribute("d", "M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M2 2a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1z");
        dateButtonPath2.setAttribute("d", "M2.5 4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5H3a.5.5 0 0 1-.5-.5zM8 8a.5.5 0 0 1 .5.5V10H10a.5.5 0 0 1 0 1H8.5v1.5a.5.5 0 0 1-1 0V11H6a.5.5 0 0 1 0-1h1.5V8.5A.5.5 0 0 1 8 8");

    }
    else {
        dateText.textContent = dateInput.value;
        dateText.style.fontSize = "0.8rem";
        dateButton.style.width = "115px";
        dateButtonSVG.setAttribute("class", "bi bi-calendar2-plus-fill");
        dateButtonSVG.setAttribute("fill", "#0D6EFD");
        dateButtonPath1.setAttribute("d", "M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M2 3.5v1c0 .276.244.5.545.5h10.91c.3 0 .545-.224.545-.5v-1c0-.276-.244-.5-.546-.5H2.545c-.3 0-.545.224-.545.5m6.5 5a.5.5 0 0 0-1 0V10H6a.5.5 0 0 0 0 1h1.5v1.5a.5.5 0 0 0 1 0V11H10a.5.5 0 0 0 0-1H8.5z");
        dateButtonPath2.setAttribute("d", "");
    }
});

const favouriteButton = document.getElementById("favourite_btn");
const favouriteButtonSVG = document.getElementById("favourite_btn_svg");
const favouriteButtonPath = document.getElementById("favourite_btn_path");
const favouriteInput = document.getElementById("favourite");

favouriteButton.addEventListener("click", function(event) {
    favouriteInput.checked = !favouriteInput.checked;
    event.preventDefault();
    if (favouriteInput.checked) {
        favouriteButtonSVG.setAttribute("class", "bi bi-star-fill");
        favouriteButtonSVG.setAttribute("fill", "gold");
        favouriteButtonPath.setAttribute("d", "M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z");
    }
    else {
        favouriteButtonSVG.setAttribute("class", "bi bi-star");
        favouriteButtonSVG.setAttribute("fill", "currentColor");
        favouriteButtonPath.setAttribute("d", "M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.56.56 0 0 0-.163-.505L1.71 6.745l4.052-.576a.53.53 0 0 0 .393-.288L8 2.223l1.847 3.658a.53.53 0 0 0 .393.288l4.052.575-2.906 2.77a.56.56 0 0 0-.163.506l.694 3.957-3.686-1.894a.5.5 0 0 0-.461 0z");
    }
});

const priorityInput = document.getElementById("priority");
const priorityButtonSVG = document.getElementById("priority_svg");
const priorityButtonPath = document.getElementById("priority_path");

function addPriority(priorityLevel) {
    if (priorityLevel.id == "priority1") {
        priorityInput.value = 1;
        priorityButtonSVG.setAttribute("class", "bi bi-flag-fill");
        priorityButtonSVG.setAttribute("fill", "red");
        priorityButtonPath.setAttribute("d", "M14.778.085A.5.5 0 0 1 15 .5V8a.5.5 0 0 1-.314.464L14.5 8l.186.464-.003.001-.006.003-.023.009a12 12 0 0 1-.397.15c-.264.095-.631.223-1.047.35-.816.252-1.879.523-2.71.523-.847 0-1.548-.28-2.158-.525l-.028-.01C7.68 8.71 7.14 8.5 6.5 8.5c-.7 0-1.638.23-2.437.477A20 20 0 0 0 3 9.342V15.5a.5.5 0 0 1-1 0V.5a.5.5 0 0 1 1 0v.282c.226-.079.496-.17.79-.26C4.606.272 5.67 0 6.5 0c.84 0 1.524.277 2.121.519l.043.018C9.286.788 9.828 1 10.5 1c.7 0 1.638-.23 2.437-.477a20 20 0 0 0 1.349-.476l.019-.007.004-.002h.001");
    }
    else if (priorityLevel.id == "priority2") {
        priorityInput.value = 2;
        priorityButtonSVG.setAttribute("class", "bi bi-flag-fill");
        priorityButtonSVG.setAttribute("fill", "orange");
        priorityButtonPath.setAttribute("d", "M14.778.085A.5.5 0 0 1 15 .5V8a.5.5 0 0 1-.314.464L14.5 8l.186.464-.003.001-.006.003-.023.009a12 12 0 0 1-.397.15c-.264.095-.631.223-1.047.35-.816.252-1.879.523-2.71.523-.847 0-1.548-.28-2.158-.525l-.028-.01C7.68 8.71 7.14 8.5 6.5 8.5c-.7 0-1.638.23-2.437.477A20 20 0 0 0 3 9.342V15.5a.5.5 0 0 1-1 0V.5a.5.5 0 0 1 1 0v.282c.226-.079.496-.17.79-.26C4.606.272 5.67 0 6.5 0c.84 0 1.524.277 2.121.519l.043.018C9.286.788 9.828 1 10.5 1c.7 0 1.638-.23 2.437-.477a20 20 0 0 0 1.349-.476l.019-.007.004-.002h.001");
    }
    else if (priorityLevel.id == "priority3") {
        priorityInput.value = 3;
        priorityButtonSVG.setAttribute("class", "bi bi-flag-fill");
        priorityButtonSVG.setAttribute("fill", "gold");
        priorityButtonPath.setAttribute("d", "M14.778.085A.5.5 0 0 1 15 .5V8a.5.5 0 0 1-.314.464L14.5 8l.186.464-.003.001-.006.003-.023.009a12 12 0 0 1-.397.15c-.264.095-.631.223-1.047.35-.816.252-1.879.523-2.71.523-.847 0-1.548-.28-2.158-.525l-.028-.01C7.68 8.71 7.14 8.5 6.5 8.5c-.7 0-1.638.23-2.437.477A20 20 0 0 0 3 9.342V15.5a.5.5 0 0 1-1 0V.5a.5.5 0 0 1 1 0v.282c.226-.079.496-.17.79-.26C4.606.272 5.67 0 6.5 0c.84 0 1.524.277 2.121.519l.043.018C9.286.788 9.828 1 10.5 1c.7 0 1.638-.23 2.437-.477a20 20 0 0 0 1.349-.476l.019-.007.004-.002h.001");
    }
    else {
        priorityInput.value = 4;
        priorityButtonSVG.setAttribute("class", "bi bi-flag");
        priorityButtonSVG.setAttribute("fill", "currentColor");
        priorityButtonPath.setAttribute("d", "M14.778.085A.5.5 0 0 1 15 .5V8a.5.5 0 0 1-.314.464L14.5 8l.186.464-.003.001-.006.003-.023.009a12 12 0 0 1-.397.15c-.264.095-.631.223-1.047.35-.816.252-1.879.523-2.71.523-.847 0-1.548-.28-2.158-.525l-.028-.01C7.68 8.71 7.14 8.5 6.5 8.5c-.7 0-1.638.23-2.437.477A20 20 0 0 0 3 9.342V15.5a.5.5 0 0 1-1 0V.5a.5.5 0 0 1 1 0v.282c.226-.079.496-.17.79-.26C4.606.272 5.67 0 6.5 0c.84 0 1.524.277 2.121.519l.043.018C9.286.788 9.828 1 10.5 1c.7 0 1.638-.23 2.437-.477a20 20 0 0 0 1.349-.476l.019-.007.004-.002h.001M14 1.221c-.22.078-.48.167-.766.255-.81.252-1.872.523-2.734.523-.886 0-1.592-.286-2.203-.534l-.008-.003C7.662 1.21 7.139 1 6.5 1c-.669 0-1.606.229-2.415.478A21 21 0 0 0 3 1.845v6.433c.22-.078.48-.167.766-.255C4.576 7.77 5.638 7.5 6.5 7.5c.847 0 1.548.28 2.158.525l.028.01C9.32 8.29 9.86 8.5 10.5 8.5c.668 0 1.606-.229 2.415-.478A21 21 0 0 0 14 7.655V1.222z");
    }
}

const labelText = document.getElementById("label-text");
const labelSVG = document.getElementById("label-svg");
const labelColorInput = document.getElementById("label-color-input");
const labelTextInput = document.getElementById("label-text-input");

labelColorInput.addEventListener("input", function() {
    if (labelTextInput.value.trim() !== "") {
        labelSVG.setAttribute("fill", labelColorInput.value);

   }
});

labelTextInput.addEventListener("input", function() {
    if (labelTextInput.value.trim() === "") {
        labelColorInput.value = "#6C757D";
        labelSVG.setAttribute("fill", "#6C757D");
        labelText.textContent = "Label";
    }
    else {
        labelText.textContent = labelTextInput.value.trim();
    }

});


function initDatePicker(taskID) {
    const dateButtonInList =  document.getElementById("due-date-btn-list");
    const dateInputInList = document.getElementById("date-picker" + taskID);
    const dateForm = document.getElementById("date-form" + taskID);
    const datepicker2 = new Datepicker(dateInputInList, {
           buttonClass: "btn",
           clearButton: "true",
           todayButton: "true",
           todayButtonMode: 1,
           minDate: today,
    });

    dateInputInList.addEventListener("changeDate", function() {
        dateForm.submit();
    });
}

function showModal(taskID, editURL) {
    const form = document.getElementById("edit_form");
    form.setAttribute("action", editURL);
}

function sidebarAddHover(link) {
    const icon = link.querySelector("svg");
    const path = icon.querySelectorAll("path");
    icon.classList.remove("bi-plus-circle");
    icon.classList.add("bi-plus-circle-fill");
    icon.removeChild(path[1]);
    path[0].setAttribute("d", "M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3z");
}

function sidebarAddNotHover(link) {
    const icon = link.querySelector("svg");
    const path1 = icon.querySelector("path");
    icon.classList.remove("bi-plus-circle-fill");
    icon.classList.add("bi-plus-circle");
    path1.setAttribute("d", "M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16");
    const path2 = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path2.setAttribute("d", "M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4");
    icon.insertBefore(path2, path1);
}

function sidebarAllHover(link) {
    const icon = link.querySelector("svg");
    const path = icon.querySelector("path");
    icon.classList.remove("bi-house-door");
    icon.classList.add("bi-house-door-fill");
    path.setAttribute("d", "M6.5 14.5v-3.505c0-.245.25-.495.5-.495h2c.25 0 .5.25.5.5v3.5a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5");
}

function sidebarAllNotHover(link) {
    const icon = link.querySelector("svg");
    const path = icon.querySelector("path");
    icon.classList.remove("bi-house-door-fill");
    icon.classList.add("bi-house-door");
    path.setAttribute("d", "M8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4.5a.5.5 0 0 0 .5-.5v-4h2v4a.5.5 0 0 0 .5.5H14a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293zM2.5 14V7.707l5.5-5.5 5.5 5.5V14H10v-4a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5v4z");
}

function sidebarFavouritesHover(link) {
    const icon = link.querySelector("svg");
    const path = icon.querySelector("path");
    icon.classList.remove("bi-star");
    icon.classList.add("bi-star-fill");
    path.setAttribute("d", "M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z");
}

function sidebarFavouritesNotHover(link) {
    if (!link.classList.contains("active")) {
        const icon = link.querySelector("svg");
        const path = icon.querySelector("path");
        icon.classList.remove("bi-star-fill");
        icon.classList.add("bi-star");
        path.setAttribute("d", "M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.56.56 0 0 0-.163-.505L1.71 6.745l4.052-.576a.53.53 0 0 0 .393-.288L8 2.223l1.847 3.658a.53.53 0 0 0 .393.288l4.052.575-2.906 2.77a.56.56 0 0 0-.163.506l.694 3.957-3.686-1.894a.5.5 0 0 0-.461 0z");
    }
}

function sidebarCompletedHover(link) {
    const icon = link.querySelector("svg");
    const path = icon.querySelectorAll("path");
    icon.classList.remove("bi-check-square");
    icon.classList.add("bi-check-square-fill");
    icon.removeChild(path[1]);
    path[0].setAttribute("d", "M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm10.03 4.97a.75.75 0 0 1 .011 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.75.75 0 0 1 1.08-.022");

}

function sidebarCompletedNotHover(link) {
    if (!link.classList.contains("active")) {
        const icon = link.querySelector("svg");
        const path1 = icon.querySelector("path");
        icon.classList.remove("bi-check-square");
        icon.classList.add("bi-check-square-fill");
        path1.setAttribute("d", "M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z");
        const path2 = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path2.setAttribute("d", "M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425z");
        icon.insertBefore(path2, path1);
    }
}