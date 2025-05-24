import os from "node:os";
import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

class LoggingService {
  constructor(readonly logger: winston.Logger) {}

  /**
   * 情報レベルのログを記録します
   */
  public info(message: string, hotspot: string | null = null): void {
    this.logger.info({
      message: message,
      host: os.hostname(),
      hotspot,
    });
  }

  /**
   * エラーレベルのログを記録
   */
  public error(message: string, hotspot: string): void {
    this.logger.error({
      message: message,
      host: os.hostname(),
      hotspot,
    });
  }

  /**
   * デバッグレベルのログを記録
   */
  public debug(message: string, hotspot: string): void {
    this.logger.debug({
      message: message,
      host: os.hostname(),
      hotspot,
    });
  }

  /**
   * 警告レベルのログを記録します
   */
  public warn(message: string, hotspot: string): void {
    this.logger.warn({
      message: message,
      host: os.hostname(),
      hotspot,
    });
  }
}

const logger: winston.Logger = winston.createLogger({
  level: "info",
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.colorize(),
        winston.format.simple(),
      ),
    }),
    new DailyRotateFile({
      filename: "logs/app-%DATE%.log",
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "14d",
    }),
  ],
});

export { logger, LoggingService };
