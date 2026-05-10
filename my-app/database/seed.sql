-- 示例数据
-- 在本地开发环境使用 wrangler d1 execute mynote-db --file=./database/seed.sql --local

-- 插入示例笔记
INSERT INTO notes (id, title, content, created_at, updated_at) VALUES
    (lower(hex(randomblob(16))), '欢迎使用 myNote', '这是一个使用 Cloudflare Workers 和 D1 构建的笔记应用', datetime('now'), datetime('now')),
    (lower(hex(randomblob(16))), '使用指南', '### 功能特性\n\n- 📝 创建和编辑笔记\n- 🔍 全文搜索\n- 🏷️ 标签分类\n- ☁️ 云端同步', datetime('now'), datetime('now'));
