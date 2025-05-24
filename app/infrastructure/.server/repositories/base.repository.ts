import type { DbClient } from "app/di/.server/inversify.config";
import { HTTP_STATUS } from "app/shared/constants";
import { Exception } from "app/shared/errors";

type TransactionClientType = Omit<
  DbClient,
  | "$connect"
  | "$disconnect"
  | "$on"
  | "$transaction"
  | "$use"
  | "$extends"
>;

export abstract class BaseRepository {
  public isReadOnly = false;
  public db: DbClient | TransactionClientType;

  constructor(public dbClient: DbClient) {
    this.db = this.dbClient;
  }

  /**
   * トランザクション用のクライアントをセットする
   * @param transactionDB
   */
  public setTxClient(transactionDB: TransactionClientType) {
    this.db = transactionDB;
  }

  /**
   * トランザクション用のクライアントをリセットして通常のクライアントに戻す
   */
  public resetTxClient() {
    this.db = this.dbClient;
  }

  /**
   * トランザクション用の関数を取得する
   */
  public transaction<T>(fn: (tx: TransactionClientType) => Promise<T>) {
    if (!("$transaction" in this.db)) {
      throw new Exception(
        "Bad DB client",
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
      );
    }
    return this.db.$transaction(fn);
  }
}
