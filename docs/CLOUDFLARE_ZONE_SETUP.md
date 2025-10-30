# Cloudflare ゾーン設定チェックリスト

このドキュメントは、ruuley.com の Cloudflare ゾーン設定を確認・有効化するための手順です。

## 1. SSL/TLS 設定

**場所**: Cloudflare ダッシュボード → ゾーン「ruuley.com」→ SSL/TLS

### 必須設定
- [ ] **SSL/TLS encryption mode**: `Full (strict)` に設定
- [ ] **Always Use HTTPS**: `ON` に設定
- [ ] **HSTS (HTTP Strict Transport Security)**: `ON` に設定
  - Max Age: `12 months`（推奨）または `6 months`
  - Include subdomains: ✓ チェック
  - Preload: 任意（HSTS Preload リストへの登録が必要）

### 確認方法
- `https://ruuley.com` が正常に表示される
- `http://ruuley.com` → `https://ruuley.com` に自動リダイレクトされる

## 2. セキュリティ設定

**場所**: Cloudflare ダッシュボード → ゾーン「ruuley.com」→ Security

### WAF (Web Application Firewall)
- [ ] **Managed rules**: `ON` に設定（デフォルトで有効の可能性あり）
- [ ] 必要に応じてカスタムルールを追加

### Bot 管理
- [ ] **Bot Fight Mode**: `ON` に設定
- [ ] **AI Scrapers and Crawlers**: `Block` に設定
  - 注意: 検索エンジンのクローラ（Googlebot など）は自動的に許可されます

### Rate Limiting（オプション）
- [ ] 必要に応じてレート制限を設定
  - お問い合わせフォームのスパム対策として推奨

## 3. パフォーマンス設定

**場所**: Cloudflare ダッシュボード → ゾーン「ruuley.com」→ Speed

### 圧縮・プロトコル
- [ ] **Brotli**: `ON` に設定
- [ ] **HTTP/3 (with QUIC)**: `ON` に設定
- [ ] **Early Hints**: `ON` に設定

### キャッシュ設定
- [ ] **Caching level**: `Standard` または `Aggressive`
- [ ] **Browser Cache TTL**: `Respect Existing Headers`（`_headers` で設定済み）

### Cache Rules（オプション）
推奨設定:
- HTML: `Cache-Control: public, max-age=300`（5分）
- 静的アセット (`/assets/*`): `Cache-Control: public, max-age=2592000`（30日）

**注意**: `public/_headers` で既に設定済みですが、Cloudflare Cache Rules でも設定可能です。

## 4. 確認コマンド

設定後、以下のコマンドで確認できます：

```bash
# SSL/TLS 確認
curl -I https://ruuley.com

# HSTS ヘッダー確認
curl -I https://ruuley.com | grep -i strict-transport-security

# HTTP → HTTPS リダイレクト確認
curl -I http://ruuley.com | grep -i location
```

## 5. トラブルシューティング

### SSL/TLS エラーが出る場合
- オリジンサーバー（Cloudflare Pages）の SSL 証明書が有効か確認
- SSL/TLS mode を `Full`（strictでない）に一時的に変更してテスト

### リダイレクトが動作しない場合
- Cloudflare Pages の Custom domains 設定を確認
- `www.ruuley.com` が正しく設定されているか確認

### パフォーマンスが期待通りでない場合
- Cloudflare Analytics でキャッシュヒット率を確認
- Cache Rules が正しく適用されているか確認

## 参考リンク

- [Cloudflare SSL/TLS ドキュメント](https://developers.cloudflare.com/ssl/)
- [Cloudflare WAF ドキュメント](https://developers.cloudflare.com/waf/)
- [Cloudflare Speed 最適化](https://developers.cloudflare.com/speed/)

