import { logger } from "app/application/.server/usecases/logging.service";
import { z } from "zod";

// 環境変数のスキーマを定義
const envSchema = z.object({
  NODE_ENV: z.string(),
  SESSION_NAME: z.string(),
  SESSION_SECRET: z.string(),
  AES_KEY: z.string(),
  AES_IV: z.string(),
  SLACK_IW_URL: z.string(),
  CLIENT_NAME: z.string(),
});

// 環境変数を検証
const result = envSchema.safeParse(process.env);
if (!result.success) {
  logger.error(
    JSON.stringify(result.error.flatten().fieldErrors),
    import.meta.filename.replace(process.cwd(), ""),
  );
  process.exit(1);
}

// 環境変数をエクスポート
export default result.data;
