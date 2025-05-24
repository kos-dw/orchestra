import crypto from "node:crypto";

export function getChecksumFromBuffer(buffer: Buffer): string {
  const hash = crypto.createHash("sha256");
  hash.update(buffer);
  return hash.digest("hex");
}
