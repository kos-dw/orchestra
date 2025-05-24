import { z } from "zod";

export const WeblogFormSchema = z.object({
  crud: z.string(),
  id: z.string(),
  title: z.string().min(1, "タイトルは必須です"),
  eyecatch: z.string().optional(),
  contents: z.string().min(1, "記事本文は必須です"),
  author_unique_key: z.string(),
  is_published: z.string(),
  published_at: z.string().min(1, "公開日は必須です"),
});
export type WeblogFormType = z.infer<typeof WeblogFormSchema>;
