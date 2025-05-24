import type { PrismaClient } from "@prisma-app/client";
import type {
  WeblogDto,
  WeblogEntity,
} from "app/domain/.server/entities/weblog.entities";
import { BaseRepository } from "./base.repository";

/**
 *  ウェブログのCRUD操作クラス
 */
class WeblogRepository extends BaseRepository {
  constructor(dbClient: PrismaClient) {
    super(dbClient);
  }

  public async selectAll() {
    const recordList = await this.db.weblog.findMany({
      select: {
        created_at: true,
        updated_at: true,
        deleted_at: true,
        id: true,
        title: true,
        contents: true,
        eyecatch: true,
        unique_key: true,
        is_published: true,
        published_at: true,
        created_by: true,
        updated_by: true,
        users_weblog_created_byTousers: {
          select: {
            user_identity: {
              select: {
                display_name: true,
              },
            },
          },
        },
        users_weblog_updated_byTousers: {
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
      orderBy: { published_at: "desc" },
    });
    const weblogList = recordList.map((record) => ({
      created_at: record.created_at,
      updated_at: record.updated_at,
      wid: record.id,
      title: record.title,
      contents: record.contents,
      eyecatch: record.eyecatch,
      unique_key: record.unique_key,
      is_published: record.is_published,
      published_at: record.published_at,
      created_by: record.created_by,
      created_by_display_name:
        record.users_weblog_created_byTousers?.user_identity[0]
          .display_name ?? null,
      updated_by: record.updated_by,
      updated_by_display_name:
        record.users_weblog_updated_byTousers?.user_identity[0]
          .display_name ?? null,
    }));

    return weblogList;
  }

  public async selectByPrimaryKey(
    key: number,
  ): Promise<WeblogEntity | null> {
    const record = await this.db.weblog.findUnique({
      select: {
        created_at: true,
        updated_at: true,
        deleted_at: true,
        id: true,
        title: true,
        contents: true,
        eyecatch: true,
        unique_key: true,
        is_published: true,
        published_at: true,
        created_by: true,
        updated_by: true,
        users_weblog_created_byTousers: {
          select: {
            user_identity: {
              select: {
                display_name: true,
              },
            },
          },
        },
        users_weblog_updated_byTousers: {
          select: {
            user_identity: {
              select: {
                display_name: true,
              },
            },
          },
        },
      },
      where: { id: key, deleted_at: null },
    });

    return record
      ? {
          created_at: record.created_at,
          updated_at: record.updated_at,
          id: record.id,
          title: record.title,
          contents: record.contents,
          eyecatch: record.eyecatch,
          unique_key: record.unique_key,
          is_published: record.is_published,
          published_at: record.published_at,
          created_by: record.created_by,
          created_by_display_name:
            record.users_weblog_created_byTousers?.user_identity[0]
              .display_name ?? null,
          updated_by: record.updated_by,
          updated_by_display_name:
            record.users_weblog_updated_byTousers?.user_identity[0]
              .display_name ?? null,
        }
      : null;
  }

  public async selectByUniqueKey(key: string) {
    const record = await this.db.weblog.findUnique({
      select: {
        created_at: true,
        updated_at: true,
        deleted_at: true,
        id: true,
        title: true,
        contents: true,
        eyecatch: true,
        unique_key: true,
        is_published: true,
        published_at: true,
        created_by: true,
        updated_by: true,
        users_weblog_created_byTousers: {
          select: {
            user_identity: {
              select: {
                display_name: true,
              },
            },
          },
        },
        users_weblog_updated_byTousers: {
          select: {
            user_identity: {
              select: {
                display_name: true,
              },
            },
          },
        },
      },
      where: { unique_key: key, deleted_at: null },
    });
    return record
      ? {
          created_at: record.created_at,
          updated_at: record.updated_at,
          id: record.id,
          title: record.title,
          contents: record.contents,
          eyecatch: record.eyecatch,
          unique_key: record.unique_key,
          is_published: record.is_published,
          published_at: record.published_at,
          created_by: record.created_by,
          created_by_display_name:
            record.users_weblog_created_byTousers?.user_identity[0]
              .display_name ?? null,
          updated_by: record.updated_by,
          updated_by_display_name:
            record.users_weblog_updated_byTousers?.user_identity[0]
              .display_name ?? null,
        }
      : null;
  }

  public async selectBeforeAndAfterCursor(primaryKey: number) {
    const newer = await this.db.weblog.findMany({
      where: {
        deleted_at: null,
      },
      orderBy: {
        created_at: "desc",
      },
      cursor: { id: primaryKey },
      skip: 1,
      take: -1,
    });
    const older = await this.db.weblog.findMany({
      where: {
        deleted_at: null,
      },
      orderBy: {
        created_at: "desc",
      },
      cursor: { id: primaryKey },
      skip: 1,
      take: 1,
    });

    return [newer, older];
  }

  public async insert(dto: WeblogDto) {
    if (this.isReadOnly) {
      console.info(dto);
      console.info(new Error().stack?.split("\n")[1].trim());
      return null;
    } else {
      const record = await this.db.weblog.create({
        data: {
          title: dto.title,
          contents: dto.contents,
          eyecatch: dto.eyecatch,
          is_published: dto.is_published,
          published_at: dto.published_at,
          created_by: dto.created_by,
          updated_by: dto.updated_by,
        },
      });

      return record;
    }
  }

  public async update(dto: WeblogDto) {
    if (this.isReadOnly) {
      console.info(dto);
      console.info(new Error().stack?.split("\n")[1].trim());
      return null;
    } else {
      const record = await this.db.weblog.update({
        data: {
          title: dto.title,
          contents: dto.contents,
          eyecatch: dto.eyecatch,
          is_published: dto.is_published,
          published_at: dto.published_at,
          updated_by: dto.updated_by,
        },
        where: {
          id: dto.id,
        },
      });
      return record;
    }
  }

  public async delete(primaryKey: number) {
    if (this.isReadOnly) {
      console.info(primaryKey);
      console.info(new Error().stack?.split("\n")[1].trim());
      return null;
    } else {
      const record = await this.db.weblog.update({
        data: {
          deleted_at: new Date(),
        },
        where: {
          id: primaryKey,
        },
      });

      return record;
    }
  }
}

export { WeblogRepository };
