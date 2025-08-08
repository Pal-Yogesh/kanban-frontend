import { useMemo, useState, useCallback } from "react";
import { DndContext, DragEndEvent, DragStartEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { KanbanList } from "./KanbanList";
import { BoardState, List, Task } from "@/types/kanban";
import { Plus } from "lucide-react";
import { TaskModal } from "./TaskModal";
import { toast } from "@/hooks/use-toast";

function makeId(prefix = "id"): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
}

const initialState: BoardState = {
  lists: [
    { id: makeId("list"), title: "To Do", taskIds: [] },
    { id: makeId("list"), title: "In Progress", taskIds: [] },
    { id: makeId("list"), title: "Done", taskIds: [] },
  ],
  tasks: {
    // seeded below
  },
};

// seed a few demo tasks
const t1: Task = { id: makeId("task"), title: "Set up project structure", priority: "high", description: "Initialize repo, linting, and base UI.", dueDate: new Date(Date.now() + 86400000).toISOString().slice(0, 10) };
const t2: Task = { id: makeId("task"), title: "Create Kanban components", priority: "medium", description: "List, Card, and Board with drag-and-drop.", dueDate: new Date(Date.now() + 2*86400000).toISOString().slice(0, 10) };
const t3: Task = { id: makeId("task"), title: "Polish styles", priority: "low", description: "Apply design tokens and micro-interactions.", dueDate: new Date(Date.now() + 3*86400000).toISOString().slice(0, 10) };
initialState.tasks = { [t1.id]: t1, [t2.id]: t2, [t3.id]: t3 };
initialState.lists[0].taskIds = [t1.id, t2.id, t3.id];

export const KanbanBoard = () => {
  const [state, setState] = useState<BoardState>(initialState);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [targetListForNew, setTargetListForNew] = useState<string | null>(null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  const tasksByList = useMemo(() => {
    const map: Record<string, Task[]> = {};
    for (const list of state.lists) {
      map[list.id] = list.taskIds.map((id) => state.tasks[id]).filter(Boolean);
    }
    return map;
  }, [state]);

  const findListByTaskId = (taskId: string): List | undefined =>
    state.lists.find((l) => l.taskIds.includes(taskId));

  const onDragStart = (event: DragStartEvent) => {
    const id = String(event.active.id);
    const task = state.tasks[id];
    if (task) setActiveTask(task);
  };

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);
    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    const sourceList = findListByTaskId(activeId);
    if (!sourceList) return;

    // Dropped over a container
    const maybeContainer = overId.startsWith("container-") ? overId.replace("container-", "") : null;
    const targetList = maybeContainer ? state.lists.find((l) => l.id === maybeContainer) : findListByTaskId(overId);
    if (!targetList) return;

    if (sourceList.id === targetList.id) {
      const oldIndex = sourceList.taskIds.indexOf(activeId);
      const newIndex = overId.startsWith("container-")
        ? sourceList.taskIds.length
        : targetList.taskIds.indexOf(overId);
      const newTaskIds = arrayMove(sourceList.taskIds, oldIndex, newIndex);
      setState((prev) => ({
        ...prev,
        lists: prev.lists.map((l) => (l.id === sourceList.id ? { ...l, taskIds: newTaskIds } : l)),
      }));
    } else {
      // move across lists
      const sourceIds = [...sourceList.taskIds];
      const targetIds = [...targetList.taskIds];
      const fromIndex = sourceIds.indexOf(activeId);
      sourceIds.splice(fromIndex, 1);
      const toIndex = overId.startsWith("container-") ? targetIds.length : Math.max(targetIds.indexOf(overId), 0);
      targetIds.splice(toIndex, 0, activeId);
      setState((prev) => ({
        ...prev,
        lists: prev.lists.map((l) =>
          l.id === sourceList.id ? { ...l, taskIds: sourceIds } : l.id === targetList.id ? { ...l, taskIds: targetIds } : l
        ),
      }));
    }
  };

  const handleAddList = useCallback(() => {
    const newList: List = { id: makeId("list"), title: "New List", taskIds: [] };
    setState((prev) => ({ ...prev, lists: [...prev.lists, newList] }));
    toast({ title: "List created", description: "You can rename it anytime." });
  }, []);

  const handleRenameList = useCallback((listId: string, newTitle: string) => {
    setState((prev) => ({
      ...prev,
      lists: prev.lists.map((l) => (l.id === listId ? { ...l, title: newTitle } : l)),
    }));
  }, []);

  const handleDeleteList = useCallback((listId: string) => {
    setState((prev) => ({
      tasks: Object.fromEntries(
        Object.entries(prev.tasks).filter(([taskId]) => !prev.lists.find((l) => l.id === listId)?.taskIds.includes(taskId))
      ),
      lists: prev.lists.filter((l) => l.id !== listId),
    }));
    toast({ title: "List deleted" });
  }, []);

  const openNewTaskModal = useCallback((listId: string) => {
    setEditingTask(null);
    setTargetListForNew(listId);
    setModalOpen(true);
  }, []);

  const openEditTaskModal = useCallback((task: Task) => {
    setEditingTask(task);
    setTargetListForNew(findListByTaskId(task.id)?.id || null);
    setModalOpen(true);
  }, [findListByTaskId]);

  const deleteTask = useCallback((taskId: string) => {
    setState((prev) => ({
      tasks: Object.fromEntries(Object.entries(prev.tasks).filter(([id]) => id !== taskId)),
      lists: prev.lists.map((l) => ({ ...l, taskIds: l.taskIds.filter((id) => id !== taskId) })),
    }));
    toast({ title: "Task deleted" });
  }, []);

  const upsertTask = useCallback((task: Omit<Task, "id"> & { id?: string }) => {
    const id = task.id ?? makeId("task");
    const newTask: Task = { id, title: task.title, description: task.description, dueDate: task.dueDate, priority: task.priority };

    setState((prev) => {
      const tasks = { ...prev.tasks, [id]: newTask };
      let lists = prev.lists;
      if (!task.id && targetListForNew) {
        lists = prev.lists.map((l) => (l.id === targetListForNew ? { ...l, taskIds: [...l.taskIds, id] } : l));
      }
      return { ...prev, tasks, lists };
    });

    setModalOpen(false);
    setEditingTask(null);
    setTargetListForNew(null);
    toast({ title: task.id ? "Task updated" : "Task created" });
  }, [targetListForNew]);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Your Kanban</h2>
          <p className="text-muted-foreground">Drag tasks between lists, add new ones, and keep work flowing.</p>
        </div>
        <Button onClick={handleAddList} variant="default">
          <Plus className="h-4 w-4 mr-2" /> New list
        </Button>
      </div>
      <Separator className="mb-4" />

      <DndContext sensors={sensors} onDragStart={onDragStart} onDragEnd={onDragEnd}>
        <main className="flex gap-4 overflow-x-auto pb-4">
          {state.lists.map((list) => (
            <KanbanList
              key={list.id}
              list={list}
              tasks={tasksByList[list.id]}
              onAddTask={openNewTaskModal}
              onEditTask={openEditTaskModal}
              onDeleteTask={deleteTask}
              onRenameList={handleRenameList}
              onDeleteList={handleDeleteList}
            />
          ))}
        </main>
      </DndContext>

      <TaskModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        initialTask={editingTask ?? undefined}
        onSubmit={upsertTask}
      />
    </div>
  );
};
