export interface ReminderDto {
  id: string;
  title: string;
  description: string;
  dueAt: string;
  done: boolean;
  createdAt: string;
}

export type UpsertReminderRequest = Omit<ReminderDto, "id" | "createdAt">;
