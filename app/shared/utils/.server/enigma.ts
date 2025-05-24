import ENV from "app/shared/env/.server";
import crypto from "crypto";

export interface EnigmaStrategy {
  encrypt(data: string): string;
  decrypt(data: string): string;
}

export const enigma: EnigmaStrategy = {
  /**
   * データを暗号化する
   * @param {string} data - 暗号化するデータ
   * @returns {string} base64エンコードされた暗号化データ
   * @throws {Error} 暗号化エラー
   */
  encrypt(data: string): string {
    let encryptedData = "";

    try {
      const key = Buffer.from(ENV.AES_KEY, "hex");
      const iv = Buffer.from(ENV.AES_IV, "hex");
      const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
      const buffer = cipher.update(data);
      encryptedData = Buffer.concat([buffer, cipher.final()]).toString(
        "base64",
      );
    } catch {
      throw new Error("Error encrypting data");
    }

    return encryptedData;
  },
  /**
   * データを復号化する
   * @param {string} data - base64エンコードされた暗号化データ
   * @returns {string} 復号化されたデータ
   * @throws {Error} 復号化エラー
   */
  decrypt(data: string): string {
    let decryptedData = "";

    try {
      const key = Buffer.from(ENV.AES_KEY, "hex");
      const iv = Buffer.from(ENV.AES_IV, "hex");
      const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
      const buffer = decipher.update(Buffer.from(data, "base64"));
      decryptedData = Buffer.concat([
        buffer,
        decipher.final(),
      ]).toString();
    } catch {
      throw new Error("Error decrypting data");
    }

    return decryptedData;
  },
};
