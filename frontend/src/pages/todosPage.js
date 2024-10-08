export const todosPage = () => {
  const container = document.createElement("div");

  container.classList.add(
    "flex",
    "flex-col",
    "items-center",
    "justify-center",
    "h-screen",
    "bg-gray-200"
  );

  const btnHome = document.createElement("button");
  btnHome.classList.add(
    "bg-blue-500",
    "text-white",
    "p-2",
    "rounded",
    "hover:bg-blue-600",
    "mb-4"
  );
  btnHome.textContent = "Home";
  btnHome.addEventListener("click", () => {
    window.location.pathname = "/home";
  });

  const title = document.createElement("h1");
  title.classList.add("text-3xl", "font-bold", "mb-4");
  title.textContent = "List of Todos";

  const btnCreate = document.createElement("button");
  btnCreate.classList.add(
    "bg-blue-500",
    "text-white",
    "p-2",
    "rounded",
    "hover:bg-blue-600",
    "mb-4"
  );
  btnCreate.textContent = "Create Todo";

  // Modal creation and event for opening it
  btnCreate.addEventListener("click", () => {
    const modal = document.createElement('div');
    modal.innerHTML = `
      <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div class="bg-white p-4 rounded shadow-md w-1/3">
          <h2 class="text-xl font-bold mb-4">Crear Tarea</h2>
          <form id="createTodoForm">
            <label for="title">Título</label>
            <input type="text" id="title" name="title" class="border p-2 w-full mb-4" placeholder="Título de la tarea" required>

            <label for="completed">Completado</label>
            <select id="completed" name="completed" class="border p-2 w-full mb-4">
              <option value="false">No</option>
              <option value="true">Sí</option>
            </select>

            <div class="flex justify-end">
              <button type="button" class="bg-red-500 text-white px-4 py-2 rounded mr-2" id="closeModal">Cancelar</button>
              <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded">Guardar Tarea</button>
            </div>
          </form>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    document.getElementById('closeModal').addEventListener('click', () => {
      document.body.removeChild(modal);
    });

    document.getElementById('createTodoForm').addEventListener('submit', (e) => {
      e.preventDefault();

      const title = document.getElementById('title').value;
      const completed = document.getElementById('completed').value === 'true';

      fetch('http://localhost:4000/todos', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          completed
        }),
      })
      .then((response) => response.json())
      .then((data) => {
        alert('Tarea creada exitosamente');
        addTodoToTable(data.todo); // Añadir la nueva tarea a la tabla
        document.body.removeChild(modal); // Cerrar el modal
      })
      .catch((error) => {
        console.error('Error creando la tarea:', error);
      });
    });
  });

  const table = document.createElement("table");
  table.classList.add(
    "w-1/2",
    "bg-white",
    "shadow-md",
    "h-[700px]",
    "overflow-y-scroll"
  );

  const thead = document.createElement("thead");
  const tr = document.createElement("tr");
  const th1 = document.createElement("th");
  th1.classList.add("border", "px-4", "py-2");
  th1.textContent = "ID";

  const th2 = document.createElement("th");
  th2.classList.add("border", "px-4", "py-2");
  th2.textContent = "Title";

  const th3 = document.createElement("th");
  th3.classList.add("border", "px-4", "py-2");
  th3.textContent = "Completed";

  const th4 = document.createElement("th");
  th4.classList.add("border", "px-4", "py-2");
  th4.textContent = "Owner Id";

  const th5 = document.createElement("th");
  th5.classList.add("border", "px-4", "py-2");
  th5.textContent = "Actions";

  tr.appendChild(th1);
  tr.appendChild(th2);
  tr.appendChild(th3);
  tr.appendChild(th4);
  tr.appendChild(th5);
  thead.appendChild(tr);

  const tbody = document.createElement("tbody");
  tbody.classList.add("text-center");
  table.appendChild(thead);
  table.appendChild(tbody);

  container.appendChild(btnHome);
  container.appendChild(title);
  container.appendChild(btnCreate);
  container.appendChild(table);

  fetch("http://localhost:4000/todos", {
    credentials: 'include',
  })
    .then((response) => response.json())
    .then((data) => {
      data.todos.forEach((todo) => {
        addTodoToTable(todo);
      });
    })
    .catch((error) => {
      console.error("Error fetching todos:", error);
    });

  return container;

  // Función para añadir una tarea a la tabla
  function addTodoToTable(todo) {
    const tr = document.createElement("tr");

    const td1 = document.createElement("td");
    td1.classList.add("border", "px-4", "py-2");
    td1.textContent = todo.id;

    const td2 = document.createElement("td");
    td2.classList.add("border", "px-4", "py-2");
    td2.textContent = todo.title;

    const td3 = document.createElement("td");
    td3.classList.add("border", "px-4", "py-2");
    td3.textContent = todo.completed ? "Sí" : "No";

    const td4 = document.createElement("td");
    td4.classList.add("border", "px-4", "py-2");
    td4.textContent = todo.owner;

    const td5 = document.createElement("td");
    td5.classList.add("border", "px-4", "py-2");

    const btnEdit = document.createElement("button");
    btnEdit.textContent = "Edit";
    btnEdit.classList.add("bg-yellow-500", "text-white", "px-2", "py-1", "rounded", "mr-2");
    btnEdit.addEventListener("click", () => openEditModal(todo));

    const btnDelete = document.createElement("button");
    btnDelete.textContent = "Delete";
    btnDelete.classList.add("bg-red-500", "text-white", "px-2", "py-1", "rounded");
    btnDelete.addEventListener("click", () => deleteTodo(todo.id));

    td5.appendChild(btnEdit);
    td5.appendChild(btnDelete);

    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);
    tr.appendChild(td4);
    tr.appendChild(td5);
    tbody.appendChild(tr);
  }

  // Función para abrir el modal de edición
  function openEditModal(todo) {
    const modal = document.createElement('div');
    modal.innerHTML = `
      <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div class="bg-white p-4 rounded shadow-md w-1/3">
          <h2 class="text-xl font-bold mb-4">Editar Tarea</h2>
          <form id="editTodoForm">
            <label for="title">Título</label>
            <input type="text" id="title" name="title" class="border p-2 w-full mb-4" value="${todo.title}" required>

            <label for="completed">Completado</label>
            <select id="completed" name="completed" class="border p-2 w-full mb-4">
              <option value="false" ${!todo.completed ? 'selected' : ''}>No</option>
              <option value="true" ${todo.completed ? 'selected' : ''}>Sí</option>
            </select>

            <div class="flex justify-end">
              <button type="button" class="bg-red-500 text-white px-4 py-2 rounded mr-2" id="closeModal">Cancelar</button>
              <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded">Guardar Cambios</button>
            </div>
          </form>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    document.getElementById('closeModal').addEventListener('click', () => {
      document.body.removeChild(modal);
    });

    document.getElementById('editTodoForm').addEventListener('submit', (e) => {
      e.preventDefault();

      const title = document.getElementById('title').value;
      const completed = document.getElementById('completed').value === 'true';

      fetch(`http://localhost:4000/todos/${todo.id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          completed
        }),
      })
      .then((response) => response.json())
      .then((data) => {
        alert('Tarea actualizada exitosamente');
        location.reload(); // Refresca la página para mostrar los cambios
      })
      .catch((error) => {
        console.error('Error actualizando la tarea:', error);
      });
    });
  }

  // Función para eliminar una tarea
  function deleteTodo(todoId) {
    fetch(`http://localhost:4000/todos/${todoId}`, {
      method: 'DELETE',
      credentials: 'include',
    })
    .then(() => {
      alert('Tarea eliminada exitosamente');
      location.reload(); // Refresca la página para mostrar los cambios
    })
    .catch((error) => {
      console.error('Error eliminando la tarea:', error);
    });
  }
};


