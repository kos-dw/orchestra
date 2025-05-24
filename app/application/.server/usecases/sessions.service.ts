import type { PrismaClient as DbClient } from "@prisma-app/client";
import ENV from "app/shared/env/.server";
import { createSessionStorage } from "react-router";

type cookieArg = {
  name: string;
  secrets: string[];
  sameSite: "lax" | "strict" | "none";
  maxAge: number;
};

type SessionData = {
  auth: {
    id: number;
    email: string;
    unique_key: string;
    display_name: string;
  };
};

type SessionFlashData = {
  success: string;
  info: string;
  warning: string;
  error: string;
};

type SessionDataType = Partial<
  SessionData & { __flash_error__: string }
>;

class SessionsService {
  private defaultExpires = 60 * 60 * 24 * 1;
  private cookie: cookieArg = {
    name: ENV.SESSION_NAME,
    secrets: [ENV.SESSION_SECRET],
    sameSite: "lax",
    maxAge: this.defaultExpires,
  };

  constructor(private dbClient: DbClient) {}

  /**
   * セッションストレージの取得
   */
  public getSessionStorage() {
    return createSessionStorage<SessionData, SessionFlashData>({
      cookie: this.cookie,
      createData: this.createData.bind(this),
      readData: this.readData.bind(this),
      updateData: this.updateData.bind(this),
      deleteData: this.deleteData.bind(this),
    });
  }

  /**
   * セッションデータを作成する
   */
  private async createData(data: SessionDataType, expires?: Date) {
    let sessionId: string = "";

    await this.dbClient.$transaction(async (tx) => {
      const session = await tx.sessions.create({
        data: {
          data: JSON.stringify(data),
          expires_at:
            expires ?? new Date(Date.now() + this.defaultExpires),
        },
      });

      sessionId = session.id;
    });

    return sessionId;
  }

  /**
   * セッションデータを取得する
   */
  private async readData(id: string) {
    const session = await this.dbClient.sessions.findUnique({
      where: { id },
    });
    return session ? JSON.parse(session.data) : null;
  }

  /**
   * セッションデータを更新する
   */
  private async updateData(
    id: string,
    data: SessionDataType,
    expires?: Date,
  ) {
    await this.dbClient.$transaction(async (tx) => {
      await tx.sessions.update({
        where: {
          id,
        },
        data: {
          data: JSON.stringify(data),
          expires_at:
            expires ?? new Date(Date.now() + this.defaultExpires),
        },
      });
    });
  }

  /**
   * セッションデータを削除する
   */
  private async deleteData(id: string) {
    await this.dbClient.$transaction(async (tx) => {
      await tx.sessions.delete({
        where: {
          id,
        },
      });
    });
  }
}

export { SessionsService };
