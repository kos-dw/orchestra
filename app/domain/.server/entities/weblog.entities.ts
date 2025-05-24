import type { weblog } from "@prisma-app/client";
import { z } from "zod";

type Weblog = weblog & {
  created_by_display_name: string | null;
  updated_by_display_name: string | null;
};
type WeblogEntity = Omit<Weblog, "deleted_at">;

const WeblogSchema = z.object({
  id: z.coerce.number(),
  title: z.string(),
  published_at: z.coerce.date(),
  contents: z.string(),
  eyecatch: z.string().nullable(),
  is_published: z.coerce.boolean(),
  created_by: z.coerce.number().optional(),
  updated_by: z.coerce.number(),
});
type WeblogDto = z.infer<typeof WeblogSchema>;

// const WeblogInsertSchema = z.object({
//   title: z.string(),
//   published_at: z.coerce.date(),
//   contents: z.string(),
//   eyecatch: z.string().nullable(),
//   is_published: z.coerce.boolean(),
//   created_by: z.coerce.number().optional(),
//   updated_by: z.coerce.number(),
// });
// type WeblogInsertDto = z.infer<typeof WeblogInsertSchema>;

// const WeblogUpdateSchema = WeblogInsertSchema.extend({
//   id: z.coerce.number(),
// });

// type WeblogUpdateDto = z.infer<typeof WeblogUpdateSchema>;

export { WeblogSchema };
export type { weblog as Weblog, WeblogDto, WeblogEntity };
