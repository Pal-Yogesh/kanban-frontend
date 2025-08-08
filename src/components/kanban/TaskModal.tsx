import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Priority, Task } from "@/types/kanban";

interface TaskModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialTask?: Task;
  onSubmit: (task: Omit<Task, "id"> & { id?: string }) => void;
}

export const TaskModal = ({ open, onOpenChange, initialTask, onSubmit }: TaskModalProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState<string | undefined>(undefined);
  const [priority, setPriority] = useState<Priority>("medium");

  useEffect(() => {
    if (initialTask) {
      setTitle(initialTask.title);
      setDescription(initialTask.description ?? "");
      setDueDate(initialTask.dueDate);
      setPriority(initialTask.priority);
    } else {
      setTitle("");
      setDescription("");
      setDueDate(undefined);
      setPriority("medium");
    }
  }, [initialTask, open]);

  const isEdit = useMemo(() => Boolean(initialTask), [initialTask]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit({ id: initialTask?.id, title: title.trim(), description: description.trim() || undefined, dueDate, priority });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent aria-label={isEdit ? "Edit task" : "Create task"}>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit task" : "Create task"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={4} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="due">Due date</Label>
              <Input id="due" type="date" value={dueDate ?? ""} onChange={(e) => setDueDate(e.target.value || undefined)} />
            </div>
            <div className="space-y-2">
              <Label>Priority</Label>
              <Select value={priority} onValueChange={(v) => setPriority(v as Priority)}>
                <SelectTrigger>
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="pt-2 flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">{isEdit ? "Save changes" : "Create task"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
