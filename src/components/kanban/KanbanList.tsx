import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Plus, Pencil, Trash } from "lucide-react";
import { Task, List } from "@/types/kanban";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { KanbanCard } from "./KanbanCard";

interface KanbanListProps {
  list: List;
  tasks: Task[];
  onAddTask: (listId: string) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onRenameList: (listId: string, newTitle: string) => void;
  onDeleteList: (listId: string) => void;
}

export const KanbanList = ({
  list,
  tasks,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onRenameList,
  onDeleteList,
}: KanbanListProps) => {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(list.title);
  const containerId = `container-${list.id}`;

  const { setNodeRef, isOver } = useDroppable({ id: containerId });

  const handleSave = () => {
    onRenameList(list.id, title.trim() || list.title);
    setEditing(false);
  };

  return (
    <section className="bg-card border rounded-lg p-3 w-80 flex-shrink-0 shadow-sm">
      <header className="flex items-center justify-between gap-2 mb-2">
        {editing ? (
          <div className="flex items-center gap-2 w-full">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
              autoFocus
              aria-label="List name"
            />
            <Button size="sm" onClick={handleSave}>
              Save
            </Button>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-2 w-full">
            <h3 className="text-sm font-semibold tracking-wide">{list.title}</h3>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" aria-label="Rename list" onClick={() => setEditing(true)}>
                <Pencil className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" aria-label="Delete list" onClick={() => onDeleteList(list.id)}>
                <Trash className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          </div>
        )}
      </header>
      <Separator className="mb-2" />

      <div ref={setNodeRef} className={`space-y-2 min-h-[20px] ${isOver ? "bg-accent/40" : ""} rounded-md p-0.5`}>
        <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <KanbanCard key={task.id} task={task} onEdit={onEditTask} onDelete={onDeleteTask} />
          ))}
        </SortableContext>
      </div>

      <div className="pt-3">
        <Button variant="secondary" className="w-full" onClick={() => onAddTask(list.id)} aria-label="Add task">
          <Plus className="h-4 w-4 mr-2" /> Add task
        </Button>
      </div>
    </section>
  );
};
