// elements
let ul = document.getElementById("ul");
const todoItems = document.querySelectorAll(".listItem");
const addButton = document.getElementById("btnAdd");
const todoInput = document.getElementById("todoInput");
const clearBtn = document.getElementById("clearBtn");
let todoItemsList;
let deleteButtons = document.querySelectorAll("#btnDelete");
//#region onInit

const onInit = () => {
    getLocalItems().forEach((item) => {
        getLiElements(item);
    });
    deleteButtonsListener();
};
onInit();
//#endregion
//#region button listener for add item to list
addButton.addEventListener("click", function () {
    if (todoInput.value == "") {
        // blank value check
        alertify.error("Input cannot be left blank");
    } else {
        const todo = {
            text: todoInput.value,
            isComplete: false,
        };
        todoItemsList = getLocalItems();
        todoItemsList.push(todo);
        setLocalItems(todoItemsList);
        alertify.success(todoInput.value + " was added"); // alertifyjs success notifications
        todoInput.value = "";
        deleteButtons = document.querySelectorAll("#btnDelete");
        deleteButtonsListener();
    }
});
//#endregion
//#region change values
let count = 0;
const changeValues = (e) => {
    if (e.button == 0) {
        count += 1;
    }
    setTimeout(function () {
        count = 0;
    }, 2000);
    if (count == 3) {
        if (e.target) {
            todoItemsList.forEach((item) => {
                if (item.text == e.target.value) {
                    item.isComplete = !item.isComplete;
                }
            });
            setLocalItems(todoItemsList);
        }
    } else if (count == 1) {
        if (e.target) {
            e.target.disabled = false;
            let newList;
            newList = todoItemsList.filter(
                (item) => item.text != e.target.value
            );

            e.target.addEventListener("keyup", function (e) {
                //keyup is for keyboard actions

                if (e.keyCode === 13) {
                    // keyCode=13 is Enter

                    newList.push({
                        text: e.target.value,
                        isComplete: false,
                    });
                    setLocalItems(newList);
                }
            });
        }
    }
};
ul.addEventListener("click", changeValues);

//#endregion
//#region clear completed todos
const clearCompletedTodos = (e) => {
    if (e.target) {
        todoItemsList = getLocalItems().filter(
            (item) => item.isComplete == false
        );
        setLocalItems(todoItemsList);
    }
};
clearBtn.addEventListener("click", clearCompletedTodos);

//#endregion

//#region deletes list item when close button clicked
function deleteTodo(e) {
    const li = e.target.parentElement; // for select the delete button's parent element (li)
    const text = li.children[0].value;
    todoItemsList = todoItemsList.filter((item) => item.text !== text);
    li.remove();
    setLocalItems(todoItemsList);
}

function deleteButtonsListener() {
    deleteButtons.forEach((btn) => {
        btn.addEventListener("click", deleteTodo);
    });
}
//#endregion

//#region get and set localStorage
function getLocalItems() {
    if (localStorage.getItem("todoItems") === null) {
        todoItemsList = [];
    } else {
        todoItemsList = JSON.parse(localStorage.getItem("todoItems"));
    }
    return todoItemsList;
}
function setLocalItems(list) {
    localStorage.setItem("todoItems", JSON.stringify(list));
    ul.innerHTML = "";
    onInit();
}

//#endregion

//#region  Create Li Element
function getLiElements(item) {
    if (getLocalItems !== null) {
        const li = document.createElement("li"); //create li element
        li.classList.add("input-group", "mb-2");
        const input = document.createElement("input");
        // input's default attributes
        input.setAttribute("type", "text");
        input.setAttribute("disabled", "true");
        input.setAttribute("value", item.text);

        const btnDelete = document.createElement("button");
        btnDelete.setAttribute("id", "btnDelete");
        btnDelete.innerHTML = "X";
        btnDelete.classList.add("btn", "btn-outline-danger"); // close button's default classlist
        li.appendChild(input); //first append input to li
        li.appendChild(btnDelete); // and button
        ul.appendChild(li); // then append li to ul as child
        if (item.isComplete == false) {
            input.classList.add(
                // input's default classlist
                "form-control",
                "bg-secondary",
                "bg-opacity-25",
                "list-group",
                "list-group-item-action",
                "px-2"
            );
        } else {
            input.classList.add(
                "form-control",
                "text-decoration-line-through",
                "bg-danger",
                "bg-opacity-25",
                "list-group",
                "list-group-item-action",
                "px-2"
            );
        }
        deleteButtons = document.querySelectorAll("#btnDelete");
    }
}
//#endregion
