import type { MediaLibraryInsertDto } from "app/domain/.server/entities/mediaLibrary.entities";
import { MediaLibraryRepository } from "app/infrastructure/.server/repositories/mediaLibrary.repository";
import { CONFIG } from "app/shared/constants";
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { ulid } from "ulid";

class MediaLibraryService {
  constructor(public repository: MediaLibraryRepository) {}

  /**
   * メディアライブラリの情報を取得する
   */
  public async getListAll() {
    return this.repository.selectAll();
  }

  /**
   * メディアライブラリの情報を新規作成する
   */
  public async create(dto: MediaLibraryInsertDto) {
    return this.repository.insert(dto);
  }

  /**
   * MIMEチェックと、チェックサムの確認を行い、問題なければ保存する
   *
   */
  public async saveFile({
    file,
    checksum,
    user_id,
  }: {
    file: File;
    checksum: string;
    user_id: number;
  }) {
    const ext = path.extname(file.name);

    // MIMEタイプチェック
    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      throw new Error("Invalid file type");
    }

    // ハッシュ値チェック
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const serverChecksum = hashArray
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    if (checksum !== serverChecksum) {
      throw new Error("Checksum mismatch");
    }

    const savePath = path.join(
      CONFIG.UPLOADS_DIR_PATH,
      ulid().toLowerCase().concat(ext),
    );
    const saveFileName = path.basename(savePath);
    const metadata = await sharp(buffer).metadata();

    // 保存ディレクトリが存在しない場合は作成する
    if (!fs.existsSync(CONFIG.UPLOADS_DIR_PATH)) {
      fs.mkdirSync(CONFIG.UPLOADS_DIR_PATH, { recursive: true });
    }

    fs.writeFileSync(savePath, Buffer.from(buffer));

    this.create({
      title: path.basename(file.name, ext),
      filepath: `${CONFIG.UPLOADS_RESOURCES_URL}/${saveFileName}`,
      checksum: serverChecksum,
      created_by: user_id,
      updated_by: user_id,
      mime_type: file.type,
      width: metadata.width ?? 0,
      height: metadata.height ?? 0,
      data_size: file.size,
    });
  }
}

export { MediaLibraryService };
