export type Tokens = {
  refresh: string;
  access: string;
};

export type User = {
  id: number;
  username: string;
  email: string;
  password: string;
};

export type Task = {
  id: number;
  title: string;
  due_date: string;
  is_completed: boolean;
  user_id: number;
};
