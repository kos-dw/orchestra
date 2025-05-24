export const INFO = Object.freeze({
  APP_NAME: "ORCHESTRA",
  TITLE: "ORCHESTRA - コンテンツ管理プラットフォーム",
  DESCRIPTION: "ORCHESTRAは、各種コンテンツの管理を行います",
  ESTERBLISHMENT_YEAR: "2025",
  POWERED_BY: "KOS DESIGNWORKS",
} as const);

export const CONFIG = Object.freeze({
  UPLOADS_DIR_PATH: "uploads",
  UPLOADS_RESOURCES_URL: "/resources",
} as const);

export const DI_TYPES = {
  LOGGER: Symbol.for("LOGGER"),
  DB: Symbol.for("DB"),
  SESSIONS: Symbol.for("SESSIONS"),
  AUTH_MANAGER: Symbol.for("AUTH_MANAGER"),
};

export enum HTTP_STATUS {
  // 1xx: Informational responses
  CONTINUE = 100, // リクエストの一部を受信し、処理を続行可能。
  SWITCHING_PROTOCOLS = 101, // プロトコルの変更を承認。
  PROCESSING = 102, // WebDAVにおける処理の継続中。
  EARLY_HINTS = 103, // キャッシュを先読みするためのヘッダー送信。

  // 2xx: Successful responses
  OK = 200, // リクエスト成功。
  CREATED = 201, // 新しいリソースが作成された。
  ACCEPTED = 202, // リクエストは受理されたが、処理は未完了。
  NON_AUTHORITATIVE_INFORMATION = 203, // 代理サーバーが変更した情報を提供。
  NO_CONTENT = 204, // 成功したが、返す内容なし。
  RESET_CONTENT = 205, // クライアントに入力フォームのリセットを指示。
  PARTIAL_CONTENT = 206, // 部分的なリクエストに対する応答（Range ヘッダー）。
  MULTI_STATUS = 207, // WebDAV における複数のステータスを含むレスポンス。
  ALREADY_REPORTED = 208, // WebDAV でリソースがすでに報告済み。
  IM_USED = 226, // リソースがすでに変換適用済み。

  // 3xx: Redirection messages
  MULTIPLE_CHOICES = 300, // 複数の選択肢がある。
  MOVED_PERMANENTLY = 301, // リソースの URL が恒久的に変更された。
  FOUND = 302, // 一時的に別の URL に移動。
  SEE_OTHER = 303, // 別の URL を参照するように指示。
  NOT_MODIFIED = 304, // キャッシュを使用するように指示。
  USE_PROXY = 305, // プロキシを使用する必要がある（非推奨）。
  TEMPORARY_REDIRECT = 307, // 一時的なリダイレクトで、メソッドを変えずにリクエスト。
  PERMANENT_REDIRECT = 308, // 永続的なリダイレクトで、メソッドを変えずにリクエスト。

  // 4xx: Client errors
  BAD_REQUEST = 400, // リクエストが不正。
  UNAUTHORIZED = 401, // 認証が必要。
  PAYMENT_REQUIRED = 402, // 将来のために予約されたコード（現在は未使用）。
  FORBIDDEN = 403, // アクセス禁止。
  NOT_FOUND = 404, // リソースが見つからない。
  METHOD_NOT_ALLOWED = 405, // 使用禁止の HTTP メソッド。
  NOT_ACCEPTABLE = 406, // クライアントの要求を満たせない形式。
  PROXY_AUTHENTICATION_REQUIRED = 407, // プロキシ認証が必要。
  REQUEST_TIMEOUT = 408, // リクエストがタイムアウト。
  CONFLICT = 409, // リソースの競合が発生。
  GONE = 410, // リソースが削除済み。
  LENGTH_REQUIRED = 411, // Content-Length ヘッダーが必要。
  PRECONDITION_FAILED = 412, // 前提条件が満たされない。
  PAYLOAD_TOO_LARGE = 413, // リクエストデータが大きすぎる。
  URI_TOO_LONG = 414, // URI が長すぎる。
  UNSUPPORTED_MEDIA_TYPE = 415, // サポートされていないメディアタイプ。
  RANGE_NOT_SATISFIABLE = 416, // 範囲リクエストが無効。
  EXPECTATION_FAILED = 417, // Expect ヘッダーの条件が満たされない。
  IM_A_TEAPOT = 418, // ジョークステータスコード（ティーポットなのでコーヒーは淹れられない）。
  MISDIRECTED_REQUEST = 421, // サーバーがリクエストを処理できない。
  UNPROCESSABLE_ENTITY = 422, // 構文は正しいが処理できない（WebDAV）。
  LOCKED = 423, // リソースがロックされている（WebDAV）。
  FAILED_DEPENDENCY = 424, // 依存関係の失敗により処理できない（WebDAV）。
  TOO_EARLY = 425, // 早すぎるリクエストのため処理できない。
  UPGRADE_REQUIRED = 426, // プロトコルのアップグレードが必要。
  PRECONDITION_REQUIRED = 428, // リクエストに前提条件が必要。
  TOO_MANY_REQUESTS = 429, // リクエストが多すぎる（レート制限）。
  REQUEST_HEADER_FIELDS_TOO_LARGE = 431, // リクエストヘッダーが大きすぎる。
  UNAVAILABLE_FOR_LEGAL_REASONS = 451, // 法的理由によりアクセス禁止。

  // 5xx: Server errors
  INTERNAL_SERVER_ERROR = 500, // サーバー内エラー。
  NOT_IMPLEMENTED = 501, // 実装されていない機能。
  BAD_GATEWAY = 502, // 不正なゲートウェイ応答。
  SERVICE_UNAVAILABLE = 503, // サービス利用不可（過負荷など）。
  GATEWAY_TIMEOUT = 504, // ゲートウェイのタイムアウト。
  HTTP_VERSION_NOT_SUPPORTED = 505, // HTTP バージョンが未対応。
  VARIANT_ALSO_NEGOTIATES = 506, // コンテンツ交渉のループが発生。
  INSUFFICIENT_STORAGE = 507, // ストレージ不足（WebDAV）。
  LOOP_DETECTED = 508, // 無限ループを検出（WebDAV）。
  NOT_EXTENDED = 510, // 拡張が必要なリクエスト。
  NETWORK_AUTHENTICATION_REQUIRED = 511, // ネットワーク認証が必要
}
