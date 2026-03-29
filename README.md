# doro-data-converter

[国土数値情報として公開されている道路データ](https://nlftp.mlit.go.jp/ksj/gmlold/datalist/gmlold_KsjTmplt-N01.html)を、GIS での標示に適した GeoJSON 形式に変換するツール。

出力ファイルは道路種別コードごとに分割する仕様としている。

これにより出力したデータを地図として表示する Web アプリも別途作成した。

https://github.com/tris5572/doro-viewer

## 動作

- 入力ファイルについて：
  - 道路データの Shapefile を GeoJSON 形式に変換したものを入力データとして受け取る。
    - Shapefile を GeoJSON 形式に変換するには、[shp2json](https://www.npmjs.com/package/shp2json) を使用できる。
- 出力ファイルについて：
  - 名称などのキーを元の `N01_001` などから、`roadTypeCode` などのわかりやすい名前に変換する。
  - 出力ファイルは道路種別コードごとに分割し、ファイル名は `<道路種別コード>.json` となる。

## 使い方

### 前提

- Node.js と pnpm がインストールされていること。

### 手順

1. 国土数値情報のサイトから、変換したい道路データの Zip ファイル（世界測地系）をダウンロードする。
2. ダウンロードした Zip ファイルを解凍する。
3. `pnpm --package=shapefile dlx shp2json --encoding Shift-JIS path/to/file.shp > out.json` コマンドを実行して、Shapefile を GeoJSON 形式に変換する。（コマンドの `path/to/file.shp` は、解凍したファイルの中にある `.shp` ファイルのパスに置き換える）
4. このリポジトリを clone して、プロジェクトのルートディレクトリで `pnpm install` を実行して依存関係をインストールする。
5. 手順 3 で変換した GeoJSON ファイル `out.json` を、プロジェクト内などの適当な場所に配置する。
6. `src/index.ts` 内の `fileData` 変数の値を、変換したい GeoJSON ファイルのパスに変更する。
7. `pnpm start` コマンドを実行して、変換処理を実行する。変換後の GeoJSON ファイルは、プロジェクトの `output` ディレクトリに保存される。
