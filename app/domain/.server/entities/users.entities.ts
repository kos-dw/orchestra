import { type users } from "@prisma-app/client";

type Users = users;
type UsersEntity = Omit<Users, "deleted_at" | "password">;

export type { Users, UsersEntity };
