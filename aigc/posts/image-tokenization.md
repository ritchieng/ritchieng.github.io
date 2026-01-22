---
title: "Image Tokenization"
date: "2026-01-22"
category: "toknization-embeddings"
pinned: false
excerpt: "How CLIP Bridges Pixels and Prose"
---

## How CLIP Bridges Pixels and Prose
This post focuses specifically on **CLIP** (Contrastive Language-Image Pre-training), the breakthrough architecture from OpenAI that taught AI to "see" by reading and "read" by looking.

Unlike standard LLMs that only understand text, CLIP creates a bridge between vision and language. Here's how it tokenizes images to match the language of text.

For years, Computer Vision and Natural Language Processing (NLP) were two different worlds. Vision models looked for edges and textures; text models looked for grammar and syntax.

CLIP changed everything. It proved that if you "tokenize" an image correctly, you can force it into the same mathematical space as text. This is the foundation of tools like DALL-E, Midjourney, and advanced semantic image search.

## The "Two Towers" Architecture
CLIP operates using two parallel encoders—often called the "Two Towers":

- **The Text Tower**: A standard Transformer (like GPT) that tokenizes text using Byte Pair Encoding (BPE).
- **The Image Tower**: A Vision Transformer (ViT) that "tokenizes" an image into a sequence of patches.

The goal isn't just to understand them separately, but to project both into a shared **Multimodal Embedding Space**.

## Tokenizing the Image: The Patching Strategy
To make an image "look" like a sentence, CLIP doesn't look at individual pixels. Instead, it treats the image like a jigsaw puzzle:

- **Patching**: The image (e.g., $224 \times 224$ pixels) is chopped into a grid of squares, usually $16 \times 16$ pixels each.
- **Linear Projection**: Each patch is flattened into a vector. If a patch has $16 \times 16$ pixels with 3 color channels (RGB), it starts as 768 numbers.
- **The "Class" Token**: Just as a text model adds a special token to represent the "entire sentence," CLIP adds a `[CLS]` token to the image sequence. This token eventually learns to represent the summary of the entire image.
- **Position Embeddings**: Because the model needs to know that the "cloud" patch is above the "grass" patch, a unique "coordinate" vector is added to each patch.

## The "Aha!" Moment: Contrastive Learning
How do we make the vector for the word "Golden Retriever" look like the vector for a patch-grid of a dog? CLIP uses a training method called **Contrastive Learning**.

Imagine a batch of $N$ images and $N$ captions:

- **The Goal**: Maximize the cosine similarity between the correct pairs (Image A + Caption A).
- **The Constraint**: Minimize the similarity between the incorrect pairs (Image A + Caption B).

Mathematically, CLIP calculates the dot product of the image and text vectors. The model is essentially playing a massive game of "Match the Caption to the Photo."

## Why This Matters: Zero-Shot Intelligence
Traditional vision models were rigid. If you trained a model on "cats" and "dogs," it would fail if it saw a "panda."

Because CLIP uses textual descriptions as its labels, it has **Zero-Shot capabilities**. You can give it an image of a "Cyberpunk-style neon city" (something it was never specifically trained to categorize) and because it understands the tokens for "neon," "city," and "cyberpunk," it can find that image in the vector space with incredible accuracy.

## Practical Implementation: The Latent Space
When you build an application using CLIP, you aren't storing images; you are storing **Image Embeddings** (typically 512 or 768 dimensions).

- **Image Search**: You embed your entire photo library. When a user types "sunset at the beach," you embed that text and find the image vectors with the highest cosine similarity.
- **Content Moderation**: You can check if an image embedding is mathematically close to the embedding of "prohibited content" tokens.

## Summary: The Unified Language of Vectors
| Feature | Text Tokenization | Image "Tokenization" (ViT) |
|---------|-------------------|---------------------------|
| Basic Unit | Sub-word (BPE) | $16 \times 16$ Pixel Patch |
| Sequence | List of word IDs | Grid of patch vectors |
| Final Output | Text Embedding (d-dim) | Visual Embedding (d-dim) |
| The Bridge | Contrastive Loss forces them to match in the Latent Space. | |

## What's Next?
By bridging the gap between sight and language, CLIP allows machines to navigate the world more like we do—through concepts rather than just raw data.

