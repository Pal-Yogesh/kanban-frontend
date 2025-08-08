export type Priority = "low" | "medium" | "high";

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate?: string; // ISO date string
  priority: Priority;
}

export interface List {
  id: string;
  title: string;
  taskIds: string[];
}

export interface BoardState {
  lists: List[];
  tasks: Record<string, Task>;
}
