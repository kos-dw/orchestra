import { type DbClient } from "app/di/.server/inversify.config";
import { HTTP_STATUS } from "app/shared/constants";
import { type EnigmaStrategy } from "app/shared/utils/.server/enigma";
import { z } from "zod";

type Result =
  | {
      Ok: {
        id: number;
        email: string;
        unique_key: string;
        display_name: string;
      };
      Err: null;
    }
  | {
      Ok: null;
      Err: {
        log: string;
        issues: z.ZodIssue[] | [{ message: string }];
        status: HTTP_STATUS;
      };
    };

class AuthService {
  private FormSchema = z.object({
    email: z.string().min(1, { message: "Emailは必須です " }),
    password: z.string().min(1, { message: "パスワードは必須です" }),
  });

  public constructor(
    private dbClient: DbClient,
    private enigma: EnigmaStrategy,
  ) {}

  /**
   * 認証情報を取得する
   */
  public async authCredential(formData: FormData): Promise<Result> {
    // バリデーション結果取得
    // --------------------------------------------------
    const validationResult = this.FormSchema.safeParse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    // バリデーションエラーの確認
    // --------------------------------------------------
    if (!validationResult.success) {
      return {
        Ok: null,
        Err: {
          log: "Validation error.",
          issues: validationResult.error.issues,
          status: HTTP_STATUS.BAD_REQUEST,
        },
      };
    }

    // フォームとDBからデータの取得
    // --------------------------------------------------
    const { email, password } = validationResult.data;
    const user = await this.dbClient.users.findUnique({
      select: {
        id: true,
        email: true,
        password: true,
        unique_key: true,
        user_identity: {
          select: {
            display_name: true,
          },
        },
      },
      where: { email: email },
    });

    // ユーザーの存在確認
    // --------------------------------------------------
    if (!user) {
      return {
        Ok: null,
        Err: {
          log: "Email is not found.",
          issues: [
            {
              message:
                "メールアドレスまたはパスワードが正しくありません",
            },
          ],
          status: HTTP_STATUS.UNAUTHORIZED,
        },
      };
    }

    // クレデンシャルの照合
    // --------------------------------------------------
    const hashedPassword = this.enigma.encrypt(password.toString());
    const correctEmail = user.email;
    const correctPassword = user.password;
    if (email !== correctEmail || hashedPassword !== correctPassword) {
      return {
        Ok: null,
        Err: {
          log: "Email or password is incorrect.",
          issues: [
            {
              message:
                "メールアドレスまたはパスワードが正しくありません",
            },
          ],
          status: HTTP_STATUS.UNAUTHORIZED,
        },
      };
    }

    // 認証成功
    // --------------------------------------------------
    // サインインの日時を更新
    await this.dbClient.users.update({
      where: { id: user.id },
      data: { last_login_at: new Date() },
    });

    // 認証データの返却
    return {
      Ok: {
        id: user.id,
        email: user.email,
        unique_key: user.unique_key,
        display_name: user.user_identity[0].display_name ?? "Anonymous",
      },
      Err: null,
    };
  }
}

export { AuthService };
