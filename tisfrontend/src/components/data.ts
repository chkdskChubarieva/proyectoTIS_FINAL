import { Column, Task } from "../Types";

export const initialTasks: Task[] = [
  {
    id: "1",
    title: "Implementar autenticación",
    description: "Añadir login con Google y GitHub",
    priority: "high",
    assignee: "Ana",
  },
  {
    id: "2",
    title: "Diseñar dashboard",
    description: "Crear wireframes y mockups",
    priority: "medium",
    assignee: "Carlos",
  },
  {
    id: "3",
    title: "Optimizar rendimiento",
    description: "Mejorar tiempo de carga",
    priority: "low",
    assignee: "María",
  },
];

export const initialColumns: Column[] = [
  {
    id: "backlog",
    title: "Backlog",
    tasks: [initialTasks[0]],
  },
  {
    id: "in-progress",
    title: "En Progreso",
    tasks: [initialTasks[1]],
  },
  {
    id: "review",
    title: "En Revisión",
    tasks: [initialTasks[2]],
  },
  {
    id: "done",
    title: "Completado",
    tasks: [],
  },
];
