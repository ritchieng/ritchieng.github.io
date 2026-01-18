---
title: "Tokenization & Embeddings"
date: "2026-01-18"
category: "tokenization-embeddings"
excerpt: "From Words to Vectors: Tokenization and Embeddings"
---

## From Words to Vectors: Tokenization and Embeddings

If LLMs are the "engine" of modern AI, then **Tokenization** and **Embeddings** are the fuel. Before a model can reason, summarize, or code, it must first translate human language into a language it understands: **high-dimensional mathematics.**

Understanding this bridge is crucial for anyone building AI agents, optimizing RAG pipelines, or managing API costs.

## 1. Tokenization: Breaking Language into Bricks

Tokenization is the process of chopping a string of text into smaller units called **tokens**. Think of tokens as the "atomic units" of processing.

### **The Three Levels of Tokenization**

1. **Word-level:** Splitting by spaces. (Simple, but fails on "running" vs "runner").
2. **Character-level:** Splitting every letter. (Too granular; the model loses context).
3. **Subword-level (The Standard):** Models like GPT-4 use **Byte Pair Encoding (BPE)**. It breaks common words into one token (e.g., "apple") but splits rare words into pieces (e.g., "hallucination" becomes "hallucin" + "ation").

### **Why It Matters:**

* **The 75% Rule:** In English, 1,000 tokens are roughly equivalent to 750 words.
* **Context Windows:** Models have a "memory limit" (e.g., 128k tokens). If your tokenizer is inefficient, you hit that limit faster.
* **Cost:** You are billed by the token. Understanding how your text tokenizes helps you estimate spend and optimize prompts.

## 2. Embeddings: Giving Words a "Map"

Once we have tokens, the model assigns each one a unique ID. But a list of IDs (e.g., `45, 102, 33`) doesn't tell the model that "dog" is related to "puppy."

This is where **Embeddings** come in. An embedding is a numerical representation of a token in a high-dimensional vector space.

### **The Semantic Space**

Imagine a 3D map where words with similar meanings are physically close to each other.

* "Apple" and "Banana" are close together.
* "Apple" and "Laptop" are slightly further apart (unless discussing tech).
* "Apple" and "Justice" are very far apart.

In reality, modern embeddings don't use 3 dimensions—they use **thousands** (e.g., 1,536 dimensions for OpenAI’s `text-embedding-3-small`). Each dimension represents a "feature" of the word that the model learned during training.

### **The Magic of Vector Math**

Because these are numbers, we can perform math on them. The classic example:

`Vector("King") − Vector("Man") + Vector("Woman") ≈ Vector("Queen")`

## 3. How They Work Together: The Pipeline

Here is the journey of a user query through an AI system:

1. **Input:** "How do I fix a leaky faucet?"
2. **Tokenization:** The string is split into tokens: `["How", " do", " I", " fix", " a", " leaky", " fauc", "et", "?"]`.
3. **Lookup:** The model looks up the **Embedding** for each token.
4. **Attention Layer:** The model looks at the vectors and realizes "leaky" is modifying "faucet," creating a combined understanding of the query.
5. **Output:** The model generates the next most likely token vector and turns it back into a word.

## 4. Practical Implementation: When to Care

If you are an AI architect, you will encounter these concepts in two main areas:

### **A. Choosing an Embedding Model**

Not all embeddings are equal. You need to balance **Performance vs. Latency**.

* **Proprietary (OpenAI/Gemini):** Extremely high performance, but you pay per request and data leaves your server.
* **Open Source (Qwen3/Gemma):** Can be hosted locally (good for privacy), but requires your own GPU infrastructure.

### **B. Vector Databases (The RAG Connection)**

When you build a Knowledge Base, you are essentially storing thousands of embeddings.

* **The Process:** You "embed" your entire document library.
* **The Search:** When a user asks a question, you embed the *question* and find the document vectors that are physically closest to it in the vector space. This is called **Cosine Similarity** as an example, there are many other similarity measures beyond this.

## Conclusion: The Math of Meaning

Tokenization and embeddings are why AI feels "human." By turning language into a spatial map, we allow machines to understand nuances, synonyms, and relationships that traditional keyword search could never touch.

If you are building an agent, remember: **Better embeddings lead to better retrieval, and better tokenization leads to better efficiency.**
