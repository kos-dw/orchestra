# 設計情報

- uploadsディレクトリは直でアクセスできないようにnginxで404を返すようにする
- 管理サイト内で画像を表示させるときは、resourceパスで参照する
- schema.prismaのoutputに任意のパスを指定すると「[vite] Internal server error: exports is not defined」のエラーが発生するため、node_modules/@prisma-＊に出力するようにする（cf. https://github.com/prisma/prisma/discussions/20200）
