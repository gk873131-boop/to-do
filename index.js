
let list = document.getElementById("list");
let input = document.getElementById("task");
let date = document.getElementById("date");
let priority = document.getElementById("priority");
let count = document.getElementById("count");
let search = document.getElementById("search");
input.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        addTask();
    }
});

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// ADD
function addTask(textVal, dateVal, priorityVal, done = false) {
    let text = textVal || input.value;
    let d = dateVal || date.value;
    let p = priorityVal || priority.value;

    if (!text.trim()) return;

    let div = document.createElement("div");
    div.className = `task ${p.toLowerCase()}`;
    div.draggable = true;

    if (new Date(d) < new Date()) div.classList.add("overdue");

    // let span = document.createElement("span");
    // span.textContent = `${text} | ${d} | ${p}`;

    let wrapper = document.createElement("div");

    let checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = done;

    let span = document.createElement("span");
    span.textContent = `${text} | ${d} | ${p}`;

    if (done) span.classList.add("done");

    checkbox.onchange = () => {
        span.classList.toggle("done");
        save();
    };

    wrapper.append(checkbox, span);

    if (done) span.classList.add("done");

    span.onclick = () => {
        span.classList.toggle("done");
        save();
    };

    let actions = document.createElement("div");

    let edit = document.createElement("button");
    edit.textContent = "Edit";
    edit.onclick = () => {
        let t = prompt("Edit:", span.textContent);
        if (t) {
            span.textContent = t;
            save();
        }
    };

    let del = document.createElement("button");
    del.textContent = "Delete";
    del.onclick = () => {
        div.remove();
        save();
        updateCount();
    };

    actions.append(edit, del);
    div.append(wrapper, actions);
    list.append(div);

    dragEvents(div);

    input.value = "";
    date.value = "";

    updateCount();
    save();
}

// SAVE
function save() {
    let data = [];
    document.querySelectorAll(".task").forEach(t => {
        let span = t.querySelector("span");
        data.push({
            text: span.textContent,
            done: span.classList.contains("done")
        });
    });
    localStorage.setItem("tasks", JSON.stringify(data));
}

// LOAD
window.onload = () => {
    tasks.forEach(t => {
        let parts = t.text.split(" | ");
        addTask(parts[0], parts[1], parts[2], t.done);
    });
};

// COUNT
function updateCount() {
    count.textContent = list.children.length;
}

// SEARCH
search.addEventListener("input", () => {
    let val = search.value.toLowerCase();
    document.querySelectorAll(".task").forEach(t => {
        t.style.display = t.textContent.toLowerCase().includes(val) ? "flex" : "none";
    });
});

// DRAG & DROP
let dragged;

function dragEvents(el) {
    el.addEventListener("dragstart", () => dragged = el);

    el.addEventListener("dragover", e => e.preventDefault());

    el.addEventListener("drop", () => {
        list.insertBefore(dragged, el);
        save();
    });
}
function clearAll() {
    if (confirm("Are you sure you want to delete all tasks?")) {
        list.innerHTML = "";
        localStorage.removeItem("tasks");
        updateCount();
    }
}
