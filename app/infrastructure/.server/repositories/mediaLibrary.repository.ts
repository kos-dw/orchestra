import { type DbClient } from "app/di/.server/inversify.config";
import { type MediaLibraryInsertDto } from "app/domain/.server/entities/mediaLibrary.entities";
import { BaseRepository } from "./base.repository";

/**
 * メディアライブラリのCRUD操作クラス
 */
class MediaLibraryRepository extends BaseRepository {
  constructor(db: DbClient) {
    super(db);
  }

  /**
   * 情報を取得する
   */
  public async selectAll() {
    const recordList = await this.db.media_library.findMany({
      select: {
        created_at: true,
        updated_at: true,
        deleted_at: true,
        id: true,
        title: true,
        filepath: true,
        checksum: true,
        created_by: true,
        updated_by: true,
        mime_type: true,
        width: true,
        height: true,
        data_size: true,
        unique_key: true,
        users_media_library_created_byTousers: {
          select: {
            user_identity: {
              select: {
                display_name: true,
              },
            },
          },
        },
        users_media_library_updated_byTousers: {
          select: {
            user_identity: {
              select: {
                display_name: true,
              },
            },
          },
        },
      },
      where: { deleted_at: null },
      orderBy: { created_at: "desc" },
    });
    const mediaLibraryList = recordList.map((record) => ({
      created_at: record.created_at,
      updated_at: record.updated_at,
      deleted_at: record.deleted_at,
      id: record.id,
      title: record.title,
      filepath: record.filepath,
      checksum: record.checksum,
      created_by: record.created_by,
      updated_by: record.updated_by,
      unique_key: record.unique_key,
      mime_type: record.mime_type,
      width: record.width,
      height: record.height,
      data_size: record.data_size,
      created_by_display_name:
        record.users_media_library_created_byTousers?.user_identity[0]
          .display_name ?? null,
      updated_by_display_name:
        record.users_media_library_updated_byTousers?.user_identity[0]
          .display_name ?? null,
    }));

    return mediaLibraryList;
  }

  /**
   * メディアライブラリの情報を作成する
   */
  public async insert(dto: MediaLibraryInsertDto) {
    if (this.isReadOnly) {
      console.info(dto);
      console.info(new Error().stack?.split("\n")[1].trim());
      return null;
    } else {
      const record = await this.db.media_library.create({
        data: {
          title: dto.title,
          filepath: dto.filepath,
          checksum: dto.checksum,
          created_by: dto.created_by,
          updated_by: dto.updated_by,
          mime_type: dto.mime_type,
          width: dto.width,
          height: dto.height,
          data_size: dto.data_size,
        },
      });
      return record;
    }
  }
}

export { MediaLibraryRepository };
