import { Pinecone } from '@pinecone-database/pinecone';
import { OpenAIEmbeddings } from '@langchain/openai';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PINECONE_INDEX = 'n8n';
const PINECONE_NAMESPACE = 'cooktwo';
const OPENAI_MODEL = 'text-embedding-3-small';
const DIMENSIONS = 1536;
const BATCH_SIZE = 100;

async function main() {
  if (!process.env.OPENAI_API_KEY || !process.env.PINECONE_API_KEY) {
    console.log('Skipping Pinecone indexing (OPENAI_API_KEY / PINECONE_API_KEY not set).');
    console.log('The chatbot still works via live site-content.json + Tavily. Set these env vars to enable the vector store tool.');
    return;
  }

  console.log('Indexing CookTwo content to Pinecone...');

  const contentPath = path.join(__dirname, '..', 'public', 'data', 'site-content.json');
  if (!fs.existsSync(contentPath)) {
    console.log('site-content.json not found — run extract-content.js first. Skipping.');
    return;
  }
  const content = JSON.parse(fs.readFileSync(contentPath, 'utf-8'));

  const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
  const embeddings = new OpenAIEmbeddings({ modelName: OPENAI_MODEL, dimensions: DIMENSIONS });

  const documents = [];

  if (content.business) {
    const b = content.business;
    documents.push({
      pageContent: `${b.name}: ${b.description} Website: ${b.url}. App: ${b.pwaUrl}.`,
      metadata: { type: 'business', title: b.name, source: 'business' },
    });
  }

  for (const item of (content.faq || [])) {
    documents.push({
      pageContent: `Q: ${item.question} A: ${item.answer}`,
      metadata: { type: 'faq', category: item.category, question: item.question, source: 'faq' },
    });
  }

  for (const f of (content.features || [])) {
    documents.push({
      pageContent: `${f.title} (${f.badge || ''}): ${f.description} Highlights: ${(f.highlights || []).join('; ')}.`,
      metadata: { type: 'feature', id: f.id, title: f.title, source: 'features' },
    });
  }

  for (const st of (content.steps || [])) {
    documents.push({
      pageContent: `Step ${st.number}: ${st.title}. ${st.description} ${st.detail || ''}`,
      metadata: { type: 'step', title: st.title, source: 'steps' },
    });
  }

  for (const p of (content.pages || [])) {
    documents.push({
      pageContent: `${p.title}: ${p.description || ''} ${p.content || ''}`,
      metadata: { type: 'page', slug: p.slug, title: p.title, source: 'pages' },
    });
  }

  if (content.comparison) {
    for (const c of (content.comparison.competitors || [])) {
      documents.push({
        pageContent: `Comparison: ${c.name} (${c.tag || ''}). ${JSON.stringify(c.values)}`,
        metadata: { type: 'comparison', title: c.name, source: 'comparison' },
      });
    }
  }

  console.log(`Total documents extracted: ${documents.length}`);

  const splitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000, chunkOverlap: 200 });
  const chunks = await splitter.splitDocuments(documents);
  console.log(`Total chunks after splitting: ${chunks.length}`);

  console.log('Generating embeddings...');
  const texts = chunks.map((c) => c.pageContent);
  const embeddingsList = await embeddings.embedDocuments(texts);

  const vectors = chunks.map((chunk, i) => {
    const cleanMetadata = {};
    for (const [key, value] of Object.entries(chunk.metadata)) {
      if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
        cleanMetadata[key] = value;
      } else if (Array.isArray(value) && value.every((v) => typeof v === 'string')) {
        cleanMetadata[key] = value;
      } else if (typeof value === 'object' && value !== null) {
        cleanMetadata[key] = JSON.stringify(value);
      }
    }
    return {
      id: `cooktwo-${i}-${Date.now()}`,
      values: embeddingsList[i],
      metadata: cleanMetadata,
    };
  });

  const listRes = await fetch('https://api.pinecone.io/indexes', {
    headers: { 'Api-Key': process.env.PINECONE_API_KEY },
  });
  const listData = await listRes.json();
  const indexInfo = (listData.indexes || []).find((idx) => idx.name === PINECONE_INDEX);
  if (!indexInfo) {
    throw new Error(`Pinecone index "${PINECONE_INDEX}" not found. Create it (1536 dims) in your Pinecone account.`);
  }
  const indexHost = indexInfo.host;
  console.log(`Index host: ${indexHost}`);

  for (let i = 0; i < vectors.length; i += BATCH_SIZE) {
    const batch = vectors.slice(i, i + BATCH_SIZE);
    const batchNum = Math.floor(i / BATCH_SIZE) + 1;
    console.log(`Batch ${batchNum}: ${batch.length} vectors`);
    const response = await fetch(`https://${indexHost}/vectors/upsert`, {
      method: 'POST',
      headers: { 'Api-Key': process.env.PINECONE_API_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({ namespace: PINECONE_NAMESPACE, vectors: batch }),
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Pinecone upsert failed: ${response.status} ${errorText}`);
    }
    console.log(`Upserted batch ${batchNum}/${Math.ceil(vectors.length / BATCH_SIZE)}`);
  }

  console.log('Pinecone indexing complete!');
  console.log(`  Index: ${PINECONE_INDEX}`);
  console.log(`  Namespace: ${PINECONE_NAMESPACE}`);
  console.log(`  Total vectors: ${vectors.length}`);
}

main().catch((err) => {
  console.error('Indexing error:', err.message);
  process.exit(1);
});
