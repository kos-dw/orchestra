# 設定項目

## giboで.gitignoreを生成する

```bash
gibo dump node macOS VSCode > .gitignore
```

## リポジトリの初期化

```bash
git init && git add .gitignore && git commit -m "chore: Initial commit"
```

## release-pleaseで0.1.0から発番するためのからコミットを作成する

```bash
git commit --allow-empty -m "chore: Set initial version" -m "Release-As: 0.1.0"
```

## ESLint

### インストール

```bash
npm init @eslint/config@latest
```

### エディターでの補完が効くように settings.json に追記

```json
{
  "[javascript]": {
    "editor.codeActionsOnSave": {
      "source.fixAll.eslint": "explicit"
    }
  },
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact"
  ]
}
```

## 画像の縦横サイズリストを生成する

- photoswipe 等で画像を表示する際に、画像の縦横サイズを事前にマークアップしておく必要があるため、リストとして生成。
- -oは省略可能 ※省略した場合は$(pwd)/app/constants/meta/image/${画像の保存ディレクトリ}.ts

```bash
npm run utils:img.meta -- -i ${画像の保存ディレクトリ} -o ${出力ファイル}
# e.g. npm run utils:img.meta -- -i ./src/assets/anonymous -o ./src/meta/images/anonymous.ts
```

## サーバーとクライアントのエンドポイントファイルを生成する

entry.server.tsx と entry.client.tsx を生成する。

```bash
react-router reveal
```

## Tailwind CSS のマイグレーション v3 -> v4

```bash
# 移行コマンド実行
npx @tailwindcss/upgrade@next

# Vite Pluginを追加
npm i -D tailwindcss@next @tailwindcss/vite@next

# 不要な依存を削除
npm rm autoprefixer postcss
```

<!-- ### vite.config.tsの更新

```typescript
// cssフィールドを削除してtailwindcssプラグインを追加する
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
}); -->

```

```
