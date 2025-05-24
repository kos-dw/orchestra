import { UsersRepository } from "app/infrastructure/.server/repositories/users.repository";

class UsersService {
  constructor(public repository: UsersRepository) {}

  /**
   * 情報を取得する
   */
  public async getListAll() {
    return this.repository.selectAll();
  }

  /**
   * ユニークキーを元に情報を取得する
   */
  public async getRecordByUniqueKey(key: string) {
    return this.repository.selectByUniqueKey(key);
  }
}

export { UsersService };
