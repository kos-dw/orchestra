import child_process from "child_process";
import fs from "node:fs";
import path from "node:path";

const BACKUP_DIRNAME = ".bak";
const REPO_PATH = process.cwd();
const REPO_NAME = path.basename(REPO_PATH);
const BACKUP_DIR = path.join(REPO_PATH, "../", BACKUP_DIRNAME);
const BACKUP_FILENAME = `${REPO_NAME}_${Date.now()}`;

main();

/**
 * メイン処理
 */
function main() {
  createBackupDirectory();
  const backup_path = createBackupPath();
  backupRepository(REPO_PATH, backup_path);
}

/**
 * バックアップディレクトリを作成します。
 */
function createBackupDirectory() {
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR);
  }
}

/**
 * バックアップパスを作成します。
 * @returns {string} バックアップパス
 */
function createBackupPath(): string {
  const backup_path = path.join(BACKUP_DIR, BACKUP_FILENAME);
  fs.mkdirSync(backup_path);
  return backup_path;
}

/**
 * リポジトリをバックアップします。
 * @param {string} source_path - ソースパス
 * @param {string} destination_path - ディスティネーションパス
 */
function backupRepository(source_path: string, destination_path: string) {
  const exclude = "--exclude='node_modules' --exclude='.git'";
  const command = `rsync -av ${exclude} ${source_path}/ ${destination_path}/`;
  console.log(`Backup repository: ${source_path} -> ${destination_path}`);
  child_process.execSync(command, { stdio: "inherit" });
}
