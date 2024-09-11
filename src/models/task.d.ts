export interface TaskType {
    id: string;
    title: string;
    completed: boolean;
    date: string;
    reminderId?: string | null | undefined;
    reminderDate?: string | null | undefined;
  }