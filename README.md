This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Project Progress & Features

This project implements an advanced game search engine leveraging modern AI techniques. Key milestones and features include:

1.  **Data Vectorization:**
    *   Successfully generated semantic embeddings (using OpenAI's `text-embedding-3-small` model) for approximately 2001 games based on their **name, description, and tags**.
    *   Stored these embeddings in a Supabase PostgreSQL database using the `pgvector` extension.

2.  **Keyword Search Setup (FTS):**
    *   Implemented PostgreSQL Full-Text Search (FTS) by creating a `tsvector` column (`fts_data`) automatically generated from game **name, description, and tags**.
    *   Added a GIN index to the `fts_data` column for efficient keyword searching.
    *   Set up triggers to automatically update the `fts_data` column upon game data changes.

3.  **Hybrid Search Implementation (RRF):**
    *   Developed and refined a **Hybrid Search** strategy combining:
        *   **Keyword Search:** Using `phraseto_tsquery` for precise phrase matching via the FTS index.
        *   **Semantic Search:** Using vector similarity search on the pre-computed embeddings.
    *   Implemented **Reciprocal Rank Fusion (RRF)** via a PostgreSQL function (`hybrid_search_games`) to intelligently merge and rank results from both search methods.
    *   Incorporated **vector similarity threshold filtering** within the RRF function to improve precision by removing low-relevance semantic matches.
    *   Enabled **RRF parameter tuning** (weights for FTS/vector, smoothing constant `k`) via the API for further optimization.

4.  **API Endpoint:**
    *   Created a Next.js API route (`/api/search`) that handles user search queries, generates query embeddings, calls the `hybrid_search_games` database function, and returns the final ranked list of games.

5.  **Testing & Iteration:**
    *   Conducted extensive testing with various query types:
        *   Exact game names (e.g., "elden ring", "gta v") - High accuracy.
        *   Thematic/Descriptive queries (e.g., "open world western") - Significant improvement, ranking key games highly.
        *   Ambiguous/Forgotten name queries - Mixed results, highlighting areas for potential future improvement (e.g., data quality, query understanding).
    *   Iteratively refined SQL functions, API logic, and RRF parameters based on test results.

**Current Status:** The search system provides robust and relevant results for common search patterns, effectively balancing keyword precision and semantic understanding.
