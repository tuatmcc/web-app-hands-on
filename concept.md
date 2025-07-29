# Webアプリ入門講習会まとめ

## 1. 目的・概要

後輩向けに **Twitter 風ミニ SNS** を題材としたハンズオン講習会を実施し、HTTP・API・React SPA の基礎を短時間で体験しながら“動くもの”を完成させることを目指す。

---

## 2. 全体設計・スコープ

| 項目                | 採用方針                                  | 補足ポイント                                                                  |
| ----------------- | ------------------------------------- | ----------------------------------------------------------------------- |
| **バックエンド**        | Cloudflare Worker (共有) + ローカル実行テンプレ   | \* CORS 全許可<br>\* OpenAPI (YAML) 配布<br>\* Docker & `wrangler dev` ですぐ動作 |
| **データ衝突対策**       | `id`(UUID) / `createdAt` を必須に         | 名前重複でも識別可能に                                                             |
| **テキスト投稿 → 画像対応** | ステップアップ方式                             | 画像は後半課題で multipart/form-data                                            |
| **認証**            | 初回: テキスト入力のみ<br>後半: `localStorage` 保存 | `X-User-Name` ヘッダー送信でメタ情報学習                                             |
| **フロントエンド**       | React + Vite + TypeScript             | TanStack Router / React Query / React Form 採用                           |
| **UI ライブラリ**      | Chakra UI または shadcn/ui               | デザイン沼回避                                                                 |
| **学習ゴール**         | MVP 完成 & デプロイ体験                       | 余裕があれば機能拡張                                                              |

---

## 3. Cloudflare Workers での共通 API

* **バリデーション**: `body <= 2 KB` などサイズ制限を実装し、エラー例を教材化。
* **コード公開**: テンプレートリポジトリにユニットテストと CI を同梱。

---

## 4. 画像アップロード（後半パート）

1. **学習順序**: テキスト API 完走 → multipart 追加。
2. **ストレージ**: R2 presigned URL で PUT、URL を tweet に保存。
3. **プレビュー**: `URL.createObjectURL` で即時表示。

---

## 5. 名前入力 → localStorage

| フェーズ | 実装                       | 学習ポイント        |
| ---- | ------------------------ | ------------- |
| 初回   | フォーム入力                   | 状態管理・バリデーション  |
| 保存   | `localStorage.setItem()` | ブラウザストレージの永続性 |
| 送信   | `X-User-Name` ヘッダー       | メタデータ付与       |

---

## 6. フロントエンドテンプレート（TanStack）

* **ルーティング**: `/`, `/tweet/:id`, `/new` 。ページ遷移時の fetch cancel を体験。
* **React Query**: Query Keys と `invalidateQueries` でキャッシュ制御。
* **React Form**: バリデーション・エラーメッセージ・disabled 切替を一括管理。

---

## 7. ハンズオンタイムライン（3〜4 時間想定）

1. **イントロ (15 分)** – HTTP & REST 概念、ゴール共有
2. **環境セットアップ (20 分)** – `git clone` → `npm install` → `docker compose up`
3. **API 体験 (30 分)** – Postman / curl で `GET` & `POST /tweets`
4. **React 起動 (10 分)** – `npm run dev` でテンプレ起動確認
5. **タイムライン表示 (50 分)** – `fetch`→map で描画
6. **ツイート投稿フォーム (40 分)** – `POST /tweets` & state 更新
7. **いいね／リプライ (30 分)** – `PATCH` or `POST /tweets/:id/replies`
8. **拡張課題 (残時間)** – 画像アップロード / スタイル調整 / デプロイ

---

## 8. 資料 & 運営 Tips

* **ロードマップ図**: Mermaid で全体と今日やる範囲を色分け。
* **ゴールコードブランチ**: `solution/stepN` で途中救済。
* **OpenAPI**: 生 URL 公開 → Postman/Insomnia 読み込み可。
* **トラブルシューティング表**: CORS・429・TS error などを一覧化。
* **時間シグナル**: 30 分ごとに「ここまで出来れば順調」スライド。

---

## 9. よくある詰まりポイント & 対策

* **CORS エラー**: Worker で `Access-Control-Allow-Origin: *` 。
* **npm install 遅延**: lockfile 固定 & `--legacy-peer-deps`。
* **型エラー**: `openapi-typescript` + `zod` で型自動生成。

---

## 10. まとめ

* Cloudflare Worker 共有 API で“つながっている”実感を提供しつつ、ローカル環境でも完結可能。
* ステップアップ（テキスト→画像、手入力→localStorage）構成で達成感と学習効果を両立。
* TanStack 群を使った **モダン React 開発体験** を通じて実務に直結する知見を得られる。

これをベースに資料を整備すれば、後輩たちが楽しく学びながら完成形を作れるハンズオンになります。
