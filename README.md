# My Game Navigator - 智能游戏发现与搜索平台

这是一个使用现代 AI 技术构建的先进游戏发现和搜索引擎项目，基于 [Next.js](https://nextjs.org) 开发。项目旨在利用语义理解和关键词匹配，为用户提供精准、智能、个性化的游戏搜索体验。

## ✨ 项目特色与核心能力

本项目整合了多种先进技术，实现了强大的游戏搜索功能：

1.  **数据向量化 (Data Vectorization):**
    *   基于游戏的核心信息（**名称、别名、标签、简介**）生成高质量的语义向量（Embedding）。
    *   使用业界领先的 OpenAI `text-embedding-3-small` 模型进行向量生成。
    *   利用 `Supabase` (基于 PostgreSQL) 及其 `pgvector` 扩展高效存储和检索向量数据。
    *   当前已处理约 **2800+** 款游戏数据。

2.  **关键词搜索 (Keyword Search - FTS):**
    *   利用 PostgreSQL 内建的全文搜索（Full-Text Search）功能，基于游戏**名称和别名**构建 `tsvector` 数据。
    *   创建高效的 GIN 索引 (`games_name_aliases_fts`) 以加速关键词匹配。
    *   实现了触发器，确保游戏数据（名称、别名）变更时自动更新 FTS 索引。

3.  **混合搜索与排序 (Hybrid Search - RRF):**
    *   设计并实现了**混合搜索**策略，有机结合关键词搜索的精确性和语义搜索的理解能力。
    *   通过专门设计的 PostgreSQL 函数 (`hybrid_search_games`) 实现：
        *   并行执行 FTS 和向量相似度搜索。
        *   应用**倒数排序融合 (Reciprocal Rank Fusion, RRF)** 算法，智能合并两路召回结果，生成统一的相关性排序。
        *   引入**向量相似度阈值 (`semantic_threshold`)**，过滤低相关性语义匹配结果，提升结果精准度。
    *   支持通过 API 调整 RRF 关键参数（如 FTS 权重 `full_text_weight`、语义权重 `semantic_weight`、平滑因子 `rrf_k`）以及向量相似度阈值，方便进行相关性调优。

4.  **智能 API 端点 (API Endpoint):**
    *   基于 Next.js 构建了后端 API 路由 (`/api/search`)。
    *   负责接收用户查询，（可选地）调用 LLM 进行查询理解与转换（当前主要调整核心参数，LLM转换暂停优化），生成查询向量。
    *   调用数据库端的 `hybrid_search_games` 函数执行混合搜索。
    *   将经过 RRF 排序和阈值过滤的最终游戏列表返回给前端。

5.  **查询理解探索 (Query Understanding Exploration):**
    *   集成了 DeepSeek LLM (`deepseek-chat`) 用于尝试将用户的自然语言查询转换为更适合 FTS 的关键词/短语。
    *   初步设计了 Prompt Engineering 策略以指导转换过程。
    *   *当前状态：* 经多轮测试发现，在核心参数调优阶段，LLM 转换对当前测试用例影响有限，暂时将优化重心放在混合搜索参数本身。

## 🚀 项目进展与现状

*   **基础架构搭建完成:** 前后端框架、数据库连接、向量存储、FTS索引均已配置并运行正常。
*   **核心数据处理完毕:** 已完成约 2800+ 款游戏（按评分排序）的向量化（名称+别名+标签+简介）和 FTS 索引构建。
*   **混合搜索功能实现:** RRF 融合搜索功能已通过数据库函数和 API 实现，并投入使用。
*   **多轮相关性调优:** 已针对多种典型查询（精确名称、模糊概念、主题描述等）进行了 **4 轮** 以上的迭代测试与参数调优 (`semantic_threshold`, RRF 权重, `k` 值)，显著改善了召回率和部分查询的相关性，特别是解决了关键结果（如 RDR1 for "open world western"）被过滤的问题。
*   **数据扩充流程:** 具备通过脚本 (`fetch_more_games.js` 配合 `fetch-game-data` Edge Function) 持续获取新游戏数据并自动进行向量化和索引的能力。

**当前系统状态:** 核心搜索功能已具备较高可用性，能够在多种搜索场景下提供相关结果，平衡了关键词匹配与语义理解。但部分复杂查询的相关性排序仍有提升空间。

## 🛠️ 技术栈

*   **前端:** Next.js, React, TypeScript, Tailwind CSS (推测)
*   **后端:** Next.js API Routes, Node.js
*   **数据库:** Supabase (PostgreSQL)
*   **向量数据库:** pgvector (PostgreSQL 扩展)
*   **AI 模型:**
    *   OpenAI `text-embedding-3-small` (用于生成 Embedding)
    *   DeepSeek `deepseek-chat` (用于查询转换探索)
*   **版本控制:** Git

## 🏃‍♀️ 快速开始 (本地运行)

1.  **环境准备:** 确保已安装 Node.js (推荐 v18 或更高版本) 和 npm/yarn/pnpm/bun。
2.  **克隆仓库:**
    ```bash
    git clone <your-repository-url>
    cd <your-repository-name>
    ```
3.  **安装依赖:**
    ```bash
    npm install
    # 或
    yarn install
    # 或
    pnpm install
    # 或
    bun install
    ```
4.  **配置环境变量:**
    *   复制 `.env.local.example` (如果存在) 或手动创建 `.env.local` 文件。
    *   在 `.env.local` 文件中填入必要的环境变量，至少包括：
        *   `SUPABASE_PROJECT_URL`: 你的 Supabase 项目 URL。
        *   `SUPABASE_SERVICE_ROLE_KEY`: 你的 Supabase Service Role Key (用于后端操作)。
        *   `OPENAI_API_KEY`: 你的 OpenAI API Key。
        *   `OPENAI_BASE_URL`: (可选) OpenAI API 的代理地址。
        *   `DEEPSEEK_API_KEY`: 你的 DeepSeek API Key。
        *   `DEEPSEEK_BASE_URL`: DeepSeek API 的基础 URL。
        *   *(可能还有其他前端需要的环境变量)*
5.  **启动开发服务器:**
    ```bash
    npm run dev
    # 或
    yarn dev
    # 或
    pnpm dev
    # 或
    bun dev
    ```
6.  **访问应用:** 在浏览器中打开 [http://localhost:3000](http://localhost:3000)。

## 🧭 未来工作与规划 (Roadmap)

*   **持续相关性调优:**
    *   **检查数据库端:** 深入分析 `hybrid_search_games` 函数逻辑，检查 FTS 配置（使用的字段、语言、权重等）和向量索引 (`ivfflat`/`hnsw`) 设置。
    *   **数据质量检查:** 确认关键游戏（如 RDR2）的标签、描述等数据是否准确、充分。
    *   **参数再迭代:** 基于数据库端检查结果，可能需要进行第 5 轮甚至更多的 API 参数 (`threshold`, RRF 参数) 微调。
*   **提升查询理解能力:**
    *   当核心搜索效果稳定后，重新评估并优化 LLM 查询转换策略，使其能更好地处理复杂自然语言查询。
*   **数据扩充与维护:**
    *   定期运行 `fetch_more_games.js` 扩充游戏库。
    *   建立数据清洗或校验机制，保证数据质量。
*   **用户界面与体验优化:**
    *   优化搜索结果的展示方式。
    *   增加筛选器（按类型、平台、评分等）。
    *   增加排序选项。
*   **个性化推荐 (远期):**
    *   探索结合用户历史行为数据，提供个性化的搜索结果排序或推荐。

## 🤝 贡献

欢迎提出 Issue 或提交 Pull Request。请确保遵循项目的行为准则。

## 📄 许可证

本项目采用 [MIT](./LICENSE) 许可证。 (请根据你的实际情况修改或添加 LICENSE 文件)
