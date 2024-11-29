const axios = require("axios");

// Hugging Face API URL for the sentence-transformers model
const API_URL =
  "https://api-inference.huggingface.co/models/sentence-transformers/all-MiniLM-L6-v2";

// Your Hugging Face API Token
const API_TOKEN = "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"; // Make sure it's correct

// Function to fetch sentence embeddings using sentence transformers
async function getSentenceEmbedding(sourceSentence, sentences) {
  try {
    query = {
      inputs: {
        source_sentence: sourceSentence, // The reference sentence (User 1's description)
        sentences: sentences, // The array of sentences to compare (User 2's description)
      },
    };
    const response = await axios.post(API_URL, query, {
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
      },
    });

    // Log the entire response to inspect the data
    console.log("Response data:", response.data);

    return response.data;
  } catch (error) {
    console.error(
      "Error fetching sentence embeddings:",
      error.response ? error.response.data : error.message
    );
    return null; // Return null in case of error
  }
}

// Function to compute the cosine similarity
function cosineSimilarity(vec1, vec2) {
  if (!vec1 || !vec2) {
    console.error("Error: One or both sentence embeddings are null.");
    return null;
  }

  const dotProduct = vec1.reduce((sum, val, idx) => sum + val * vec2[idx], 0);
  const norm1 = Math.sqrt(vec1.reduce((sum, val) => sum + val * val, 0));
  const norm2 = Math.sqrt(vec2.reduce((sum, val) => sum + val * val, 0));

  return dotProduct / (norm1 * norm2);
}

// Main function to compare two sentences
async function compareSentences(sentence1, sentence2) {
  // Fetch embeddings for both sentences
  const embedding1 = await getSentenceEmbedding(sentence1);
  const embedding2 = await getSentenceEmbedding(sentence2);

  // If either embedding is null, exit early
  if (!embedding1 || !embedding2) {
    console.log("Failed to fetch embeddings. Cannot compute similarity.");
    return;
  }

  // Compute cosine similarity between the two embeddings
  const similarity = cosineSimilarity(embedding1, embedding2);
  if (similarity !== null) {
    console.log(
      `Cosine Similarity between the sentences: ${similarity.toFixed(4)}`
    );
  }
}

// Example roommate descriptions
const sourceSentence =
  "I am a clean and quiet person who prefers a calm and tidy living environment."; // User 1's description
const sentencesToCompare = [
  "I love cooking and hanging out with roommates, but I need a clean living space.", // User 2's description
  "I'm outgoing and enjoy hosting parties, but I expect a clean apartment.", // Another user description
];

getSentenceEmbedding(sourceSentence, sentencesToCompare);
