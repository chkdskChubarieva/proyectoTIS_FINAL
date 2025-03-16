import React from "react";
import { TaskCard } from "./TaskCard";
import "./Column.css";

export const Column = ({ column }) => {
  return (
    <div className="column">
      <h2 className="column-header">
        <span className="column-indicator"></span>
        {column.title}
        <span className="task-count">({column.tasks.length})</span>
      </h2>
      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`column-drop-zone ${snapshot.isDraggingOver ? "dragging-over" : ""}`}
          >
            {column.tasks.map((task, index) => (
              <TaskCard key={task.id} task={task} index={index} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};
