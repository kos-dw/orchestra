import { PrismaClient } from "@prisma-app/client";
import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

// 各種定義
// --------------------------------------------------

// Prisma インスタンスを作成
const prisma = new PrismaClient();

// ロガーインスタンスを作成
const logger = winston.createLogger({
  level: "info",
  transports: [
    new DailyRotateFile({
      filename: "logs/jobs-%DATE%.log",
      format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "14d",
    }),
  ],
});

// メイン処理
// --------------------------------------------------
async function main() {
  try {
    await prisma.sessions.deleteMany({
      where: {
        expires_at: {
          lt: new Date(),
        },
      },
    });
    logger.info("[jobs] Expired sessions deleted");
  } catch (error) {
    logger.error("[jobs] Failed to delete expired sessions", error);
  }
}

// 処理実行
// --------------------------------------------------
void main();
