import { database } from "../db/database.js";

export const getAllTodosCtrl = (req, res) => {
  console.log(req.user.id);
  const todos = database.todos.filter(todo => todo.owner === req.user.id);

  res.json({ todos });
};

// Actualizar una tarea
export const updateTodosCtrl = (req, res) => {
  const todo = database.todos.find(todo => todo.id === parseInt(req.params.id) && todo.owner === req.user.id);
  if (!todo) {
    return res.status(403).json({ message: "No tienes permiso para editar esta tarea." });
  }

  // Actualiza la tarea con los datos del cuerpo de la solicitud
  todo.title = req.body.title || todo.title;
  todo.completed = req.body.completed !== undefined ? req.body.completed : todo.completed;

  res.json({ message: "Tarea actualizada", todo });
};

// Eliminar una tarea
export const deleteTodoCtrl = (req, res) => {
  const todoIndex = database.todos.findIndex(todo => todo.id === parseInt(req.params.id) && todo.owner === req.user.id);
  if (todoIndex === -1) {
    return res.status(403).json({ message: "No tienes permiso para eliminar esta tarea." });
  }

  database.todos.splice(todoIndex, 1);
  return res.status(200).json({ message: "Tarea eliminada exitosamente." });
};

  // Crear una nueva tarea
export const createTodoCtrl = (req, res) => {
  const { title, completed } = req.body;

  // Validar que el título esté presente
  if (!title) {
    return res.status(400).json({ message: "El título es obligatorio." });
  }

  // Crear la nueva tarea
  const newTodo = {
    id: database.todos.length + 1, // Generar un ID secuencial
    title,
    completed: completed !== undefined ? completed : false, // Si no se especifica, por defecto no está completada
    owner: req.user.id // Establecer el ID del usuario logueado como propietario
  };

  // Guardar la tarea en la base de datos en memoria
  database.todos.push(newTodo);

  res.status(201).json({ message: "Tarea creada exitosamente", todo: newTodo });
};
