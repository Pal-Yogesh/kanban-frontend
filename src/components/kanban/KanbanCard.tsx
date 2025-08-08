import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { CalendarDays, Flag, MoreVertical } from "lucide-react";
import { Task } from "@/types/kanban";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";


interface KanbanCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

export const KanbanCard = ({ task, onEdit, onDelete }: KanbanCardProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  } as React.CSSProperties;

  const priorityColor = {
    low: "secondary",
    medium: "default",
    high: "destructive",
  } as const;

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={`w-full text-left p-3 shadow-sm border hover:shadow-md transition-shadow ${isDragging ? "opacity-80" : ""}`}
      {...attributes}
      {...listeners}
      aria-label={`Task card ${task.title}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant={priorityColor[task.priority] as any} aria-label={`Priority ${task.priority}`}>
              <Flag className="h-3.5 w-3.5 mr-1" />
              {task.priority}
            </Badge>
          </div>
          <h4 className="font-medium leading-tight">{task.title}</h4>
          {task.description && (
            <p className="text-sm text-muted-foreground line-clamp-3">{task.description}</p>
          )}
          {task.dueDate && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <CalendarDays className="h-3.5 w-3.5" />
              <span>Due {new Date(task.dueDate).toLocaleDateString()}</span>
            </div>
          )}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Task actions">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(task)}>Edit</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive" onClick={() => onDelete(task.id)}>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Card>
  );
};
