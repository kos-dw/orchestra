import { Command } from "commander";
import fs from "fs";
import path from "path";
import prettier from "prettier";
import sharp from "sharp";

// コマンドライン引数を設定
const program = new Command();
program
  .requiredOption("-i, --input-dir <path>", "Path to the input image folder")
  .option("-o, --output-path <path>", "Path to the output TypeScript file")
  .parse(process.argv);
const options = program.opts();

// 変数の定義
const default_output_path = "./app/constants/meta/image/";
const input_dir_path = path.resolve(options.inputDir);
const input_dir_name = path.basename(input_dir_path);
const output_file_path = options.outputPath
  ? path.resolve(options.outputPath)
  : path.resolve(default_output_path, `${input_dir_name}.ts`);

// フォルダを作成するヘルパー関数
async function ensureDirectoryExists(filePath: string) {
  const dir = path.dirname(filePath);
  try {
    await fs.promises.mkdir(dir, { recursive: true });
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "EEXIST") {
      throw error;
    }
  }
}

// メイン処理
async function main() {
  try {
    await ensureDirectoryExists(output_file_path); // フォルダがなければ作成

    const files = fs
      .readdirSync(input_dir_path)
      .filter((file) => /\.(jpg|jpeg|png|gif|webp)$/i.test(file));

    const imageMeta: {
      src: string;
      width: number;
      height: number;
      extra: object;
      isDisplay: boolean;
    }[] = [];

    for (const file of files) {
      const filePath = path.join(input_dir_path, file);
      const metadata = await sharp(filePath).metadata();

      if (metadata.width && metadata.height) {
        const relativePath = path.posix.join(
          "/",
          path.relative(path.resolve("./public"), filePath).replace(/\\/g, "/"),
        );

        imageMeta.push({
          src: relativePath,
          width: metadata.width,
          height: metadata.height,
          extra: {},
          isDisplay: true,
        });
      }
    }

    // Prettierの設定を取得
    const prettierConfig = await prettier.resolveConfig(process.cwd());

    // TypeScriptのコードを生成
    let outputContent = `export const ${input_dir_name} = ${JSON.stringify(imageMeta)};`;

    // Prettierでフォーマット
    outputContent = await prettier.format(outputContent, {
      ...prettierConfig,
      parser: "typescript",
    });

    // 保存
    await fs.promises.writeFile(output_file_path, outputContent, "utf8");
    console.info(
      `${input_dir_name} has been generated successfully at [${input_dir_name}].`,
    );
  } catch (error) {
    console.error(`Error generating ${input_dir_name}:`, error);
  }
}

// 実行
main();
