import { useRef, useState } from "react";

interface Position {
  x: number;
  y: number;
}

export const useDrag = () => {
  const [isDragging, setIsDragging] = useState(false);
  const draggedItem = useRef(null);
  const initialPosition = useRef({ x: 0, y: 0 });
  const dragOffset = useRef({ x: 0, y: 0 });

  const handleDragStart = (e: React.MouseEvent, element: HTMLElement) => {
    const rect = element.getBoundingClientRect();
    draggedItem.current = element;
    initialPosition.current = { x: rect.left, y: rect.top };
    dragOffset.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
    setIsDragging(true);

    const clone = element.cloneNode(true) as HTMLElement;
    clone.style.position = "fixed";
    clone.style.left = `${rect.left}px`;
    clone.style.top = `${rect.top}px`;
    clone.style.width = `${rect.width}px`;
    clone.style.height = `${rect.height}px`;
    clone.style.pointerEvents = "none";
    clone.style.opacity = "0.8";
    clone.style.transform = "scale(1.05)";
    clone.id = "dragging-clone";
    document.body.appendChild(clone);
  };

  const handleDrag = (e: MouseEvent) => {
    if (!isDragging || !draggedItem.current) return;

    const clone = document.getElementById("dragging-clone");
    if (!clone) return;

    const x = e.clientX - dragOffset.current.x;
    const y = e.clientY - dragOffset.current.y;

    clone.style.left = `${x}px`;
    clone.style.top = `${y}px`;
  };

  const handleDragEnd = (
    onDrop: (
      source: string,
      destination: string,
      sourceIndex: number,
      destinationIndex: number,
    ) => void,
  ) => {
    if (!isDragging || !draggedItem.current) return;

    const clone = document.getElementById("dragging-clone");
    if (clone) {
      clone.remove();
    }

    const dropZones = document.querySelectorAll(".column-drop-zone");
    const draggedRect = draggedItem.current.getBoundingClientRect();
    const sourceColumnId = draggedItem.current.getAttribute("data-column-id");
    const taskIndex = parseInt(
      draggedItem.current.getAttribute("data-task-index") || "0",
      10,
    );

    dropZones.forEach((zone) => {
      const zoneRect = zone.getBoundingClientRect();
      if (
        draggedRect.left + draggedRect.width / 2 >= zoneRect.left &&
        draggedRect.left + draggedRect.width / 2 <= zoneRect.right &&
        draggedRect.top + draggedRect.height / 2 >= zoneRect.top &&
        draggedRect.top + draggedRect.height / 2 <= zoneRect.bottom
      ) {
        const destinationColumnId = zone.getAttribute("data-column-id");
        const tasks = zone.querySelectorAll(".task-card");
        let destinationIndex = tasks.length;

        tasks.forEach((task, index) => {
          const taskRect = task.getBoundingClientRect();
          if (draggedRect.top < taskRect.top) {
            destinationIndex = Math.min(destinationIndex, index);
          }
        });

        if (sourceColumnId && destinationColumnId) {
          onDrop(
            sourceColumnId,
            destinationColumnId,
            taskIndex,
            destinationIndex,
          );
        }
      }
    });

    setIsDragging(false);
    draggedItem.current = null;
  };

  return {
    handleDragStart,
    handleDrag,
    handleDragEnd,
    isDragging,
  };
};
