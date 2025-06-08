import type { User, Tokens, Task } from "./Models";

export type LoginRequest = {
  username_or_email: string;
  password: string;
};

export type LoginResponse = {
  user: User;
  tokens: Tokens;
};

export type GetAllTasksResponse = Task[];
