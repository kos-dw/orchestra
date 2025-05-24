import { type DbClient } from "app/di/.server/inversify.config";
import { type UsersEntity } from "app/domain/.server/entities/users.entities";
import { HTTP_STATUS } from "app/shared/constants";
import { Exception } from "app/shared/errors";
import { BaseRepository } from "./base.repository";

/**
 * ユーザー情報のCRUD操作クラス
 */
class UsersRepository extends BaseRepository {
  constructor(db: DbClient) {
    super(db);
  }

  /**
   * 情報を取得する
   */
  public async selectAll(): Promise<UsersEntity[]> {
    const recordList = await this.db.users.findMany({
      where: { deleted_at: null },
    });

    const userList = recordList.map((record) => ({
      created_at: record.created_at,
      updated_at: record.updated_at,
      deleted_at: record.deleted_at,
      id: record.id,
      email: record.email,
      role_master_id: record.role_master_id,
      last_login_at: record.last_login_at,
      unique_key: record.unique_key,
    }));

    return userList;
  }

  /**
   * ユニークキーを元に情報を取得する
   */
  public async selectByUniqueKey(key: string): Promise<UsersEntity> {
    const record = await this.db.users.findUnique({
      where: { unique_key: key, deleted_at: null },
    });

    if (!record) {
      throw new Exception(
        HTTP_STATUS[HTTP_STATUS.NOT_FOUND],
        HTTP_STATUS.NOT_FOUND,
      );
    }

    return {
      created_at: record.created_at,
      updated_at: record.updated_at,
      id: record.id,
      email: record.email,
      role_master_id: record.role_master_id,
      last_login_at: record.last_login_at,
      unique_key: record.unique_key,
    };
  }
}

export { UsersRepository };
