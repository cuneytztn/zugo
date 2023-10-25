document.addEventListener("DOMContentLoaded", function () {
    function refreshTable() {
        let postTable = document.getElementById("postTableBody");
        postTable.innerHTML = "";

        fetch("https://jsonplaceholder.typicode.com/posts")
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                data.slice(0, 10).forEach(function (post) {
                    let row = document.createElement("tr");
                    row.innerHTML = `
                        <td>${post.userId}</td>
                        <td>${post.title}</td>
                        <td>${post.body}</td>
                        <td>
                            <div class="dropdown">
                                <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    Actions
                                </button>
                                <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                    <li><a class="dropdown-item detail-button" data-id="${post.id}" href="#">Detay</a></li>
                                    <li><a class="dropdown-item delete-button" data-id="${post.id}" href="#">Sil</a></li>
                                </ul>
                            </div>
                        </td>
                    `;
                    postTable.appendChild(row);
                });
            });
    }

    refreshTable();

    let addButton = document.getElementById("addButton");
    let detailTitle = document.getElementById("detailTitle");
    let detailBody = document.getElementById("detailBody");
    let saveButton = document.getElementById("saveButton");
    let deleteButton = document.getElementById("deleteButton");
    let detailModal = new bootstrap.Modal(document.getElementById("detailModal"));
    let activePostId = null; 

    addButton.addEventListener("click", function () {
        detailTitle.value = "";
        detailBody.value = "";
        saveButton.style.display = "block";
        deleteButton.style.display = "none";
        detailModal.show();
        activePostId = null; 
    });

    let postTable = document.getElementById("postTable");
    postTable.addEventListener("click", function (e) {
        if (e.target && e.target.classList.contains("detail-button")) {
            let postId = e.target.getAttribute("data-id");
            fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`)
                .then(function (response) {
                    return response.json();
                })
                .then(function (data) {
                    detailTitle.value = data.title;
                    detailBody.value = data.body;
                    saveButton.style.display = "block"; 
                    detailModal.show();
                    activePostId = postId; 
                });
        }
    });

    saveButton.addEventListener("click", function () {
        let postId = activePostId;
        let title = detailTitle.value;
        let body = detailBody.value;

        if (postId) {
            fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`, {
                method: "PUT",
                body: JSON.stringify({ id: postId, title: title, body: body, userId: 1 }),
                headers: {
                    "Content-type": "application/json; charset=UTF-8",
                },
            })
                .then(function () {
                    refreshTable();
                    detailModal.hide();
                });
        } else {
            fetch("https://jsonplaceholder.typicode.com/posts", {
                method: "POST",
                body: JSON.stringify({ title: title, body: body, userId: 1 }),
                headers: {
                    "Content-type": "application/json; charset=UTF-8",
                },
            })
                .then(function () {
                    refreshTable();
                    detailModal.hide();
                });
        }
    });

    postTable.addEventListener("click", function (e) {
        if (e.target && e.target.classList.contains("delete-button")) {
            let postId = e.target.getAttribute("data-id");
            fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`, {
                method: "DELETE"
            })
                .then(function () {
                    refreshTable();
                });
        }
    });
});

