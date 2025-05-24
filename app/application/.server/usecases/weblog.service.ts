import { UsersService } from "app/application/.server/usecases/users.service";
import { WeblogRepository } from "app/infrastructure/.server/repositories/weblog.repository";
import { HTTP_STATUS } from "app/shared/constants";
import { Exception } from "app/shared/errors";
import { WeblogFormSchema } from "app/shared/validator";
import { z } from "zod";

/**
 * ウェブログの記事情報を操作するクラス
 */
class WeblogService {
  constructor(
    public readonly repository: WeblogRepository,
    private readonly usersService: UsersService,
  ) {}

  /**
   * 記事の情報を取得する
   */
  public async getListAll() {
    return this.repository.selectAll();
  }

  /**
   * ユニークキーでレコードを取得、keyにはUUIDが入る
   */
  public async getDataByUniqueKey(key: string) {
    return this.repository.selectByUniqueKey(key);
  }

  /**
   * プライマリキーで日付の前後のレコードを取得
   */
  public async getDataSurroundingByCreateAt(primaryKey: number) {
    const [newer, older] =
      await this.repository.selectBeforeAndAfterCursor(primaryKey);
    return [newer[0], older[0]];
  }

  /**
   * フォームデータからエントリDTOを取得する
   */
  public async getEntryDto(formData: FormData) {
    const parsedData = WeblogFormSchema.safeParse(
      Object.fromEntries(formData.entries()),
    );
    if (!parsedData.success) {
      throw new Exception(
        HTTP_STATUS[HTTP_STATUS.BAD_REQUEST],
        HTTP_STATUS.BAD_REQUEST,
      );
    }
    const entry = parsedData.data;

    const userData = await this.usersService.getRecordByUniqueKey(
      entry.author_unique_key,
    );

    return {
      id: Number(entry.id),
      title: entry.title,
      eyecatch: entry.eyecatch || null,
      contents: entry.contents,
      is_published: entry.is_published === "1",
      created_by: userData.id,
      updated_by: userData.id,
      published_at: new Date(entry.published_at),
    };
  }

  /**
   * ウェブログの記事情報を新規作成する
   */
  public async create(formData: FormData) {
    const dto = await this.getEntryDto(formData);
    return this.repository.insert(dto);
  }

  /**
   * ウェブログの記事情報を更新する
   */
  public async update(formData: FormData) {
    const dto = await this.getEntryDto(formData);
    return this.repository.update(dto);
  }

  /**
   * プライマリキーでレコードを削除する
   */
  public async delete(primaryKey: string | null) {
    const parsedId = z
      .string()
      .refine(
        (val) => {
          return !isNaN(Number(val));
        },
        {
          message: "id must be a number",
        },
      )
      .transform((val) => Number(val))
      .safeParse(primaryKey);

    if (!parsedId.success) {
      throw new Exception(
        HTTP_STATUS[HTTP_STATUS.BAD_REQUEST],
        HTTP_STATUS.BAD_REQUEST,
      );
    }

    return this.repository.delete(parsedId.data);
  }
}

export { WeblogService };
