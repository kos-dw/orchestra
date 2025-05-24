import type { media_library } from "@prisma-app/client";
import { z } from "zod";

type MediaLibrary = media_library & {
  created_by_display_name: string | null;
  updated_by_display_name: string | null;
};
type MediaLibraryEntity = Omit<MediaLibrary, "deleted_at">;

const MediaLibraryInsertSchema = z.object({
  title: z.string().nullable(),
  filepath: z.string(),
  checksum: z.string(),
  created_by: z.coerce.number(),
  updated_by: z.coerce.number(),
  mime_type: z.string(),
  width: z.number().nullable(),
  height: z.number().nullable(),
  data_size: z.number(),
});

type MediaLibraryInsertDto = z.infer<typeof MediaLibraryInsertSchema>;

export { MediaLibraryInsertSchema };
export type { MediaLibrary, MediaLibraryEntity, MediaLibraryInsertDto };
