import { Router } from "express";
import { getAllTodosCtrl, updateTodosCtrl, deleteTodoCtrl,createTodoCtrl } from "../controllers/todos.controllers.js";
import validarJwt from "../middlewares/validar-jwt.js";

const todosRouter = Router();

todosRouter.get("/", validarJwt,getAllTodosCtrl);
todosRouter.put("/:id", validarJwt, updateTodosCtrl);
todosRouter.delete("/:id", validarJwt, deleteTodoCtrl);
todosRouter.post("/", validarJwt,createTodoCtrl);
export { todosRouter };
