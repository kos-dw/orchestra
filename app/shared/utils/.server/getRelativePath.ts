import path from "node:path";

export function getRelativePath(fullPath: string) {
  const publicDirName = "public";
  let relativePath = path.relative(process.cwd(), fullPath);
  relativePath = `/${relativePath}`; // UNIX系では `/` を追加
  const publicRegexp = new RegExp(`^\/${publicDirName}`);
  relativePath = relativePath.replace(publicRegexp, "");
  return relativePath;
}
