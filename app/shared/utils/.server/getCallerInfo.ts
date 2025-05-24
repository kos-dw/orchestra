function getCallerInfo() {
  const stack = new Error().stack || "";
  const stackLines = stack.split("\n");

  // 3行目が呼び出し元の情報（0: Error, 1: getCallerInfo, 2: logger）
  const callerLine = stackLines[2].trim() || "";

  return callerLine.replace(process.cwd(), "");
}

export { getCallerInfo };
