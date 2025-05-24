// QuillのDelta型
export type { Delta as DeltaType } from "quill";

// クライアントに送信するユーザー情報
export type UserData = {
  user_unique_key: string;
  display_name: string;
  user_email: string;
};

export type Crud = "create" | "read" | "update" | "delete";
