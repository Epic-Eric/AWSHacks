import {
  ComprehendClient,
  DetectKeyPhrasesCommand,
} from "@aws-sdk/client-comprehend";
import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";
import { LambdaClient, InvokeCommand } from "@aws-sdk/client-lambda";

// AWS Region
const AWS_REGION = "us-west-2";

// AWS Clients Setup
const comprehendClient = new ComprehendClient({ region: AWS_REGION });
const bedrockClient = new BedrockRuntimeClient({ region: AWS_REGION });
const lambdaClient = new LambdaClient({ region: AWS_REGION });

// Model name and embedding parameters
const MODEL_NAME = "amazon.titan-embed-text-v2:0";
const VECTOR_DIMENSION = 1024;

/**
 * Extracts key phrases from text using AWS Comprehend.
 */
async function extractKeyPhrases(text, languageCode = "en") {
  try {
    const command = new DetectKeyPhrasesCommand({
      Text: text,
      LanguageCode: languageCode,
    });
    const response = await comprehendClient.send(command);
    return response.KeyPhrases?.map((phrase) => phrase.Text || "") || [];
  } catch (error) {
    console.error("Error extracting key phrases:", error);
    throw error;
  }
}

/**
 * Fetches embeddings for a list of sentences using Amazon Titan.
 */
async function getEmbeddings(sentences) {
  try {
    const embeddings = [];

    for (const sentence of sentences) {
      const payload = {
        inputText: sentence,
        dimensions: VECTOR_DIMENSION,
        normalize: true,
      };

      const command = new InvokeModelCommand({
        modelId: MODEL_NAME,
        contentType: "application/json",
        accept: "*/*",
        body: JSON.stringify(payload),
      });

      const response = await bedrockClient.send(command);
      const responseBody = new TextDecoder("utf-8").decode(response.body);
      const data = JSON.parse(responseBody);

      if (data.embedding) {
        embeddings.push(data.embedding);
      } else {
        console.warn("No embedding returned for:", sentence);
      }
    }

    return embeddings;
  } catch (error) {
    console.error("Error fetching embeddings:", error);
    throw error;
  }
}

/**
 * Calculates cosine similarity between two vectors.
 */
function cosineSimilarity(vectorA, vectorB) {
  const dotProduct = vectorA.reduce((sum, val, i) => sum + val * vectorB[i], 0);
  const magnitudeA = Math.sqrt(vectorA.reduce((sum, val) => sum + val ** 2, 0));
  const magnitudeB = Math.sqrt(vectorB.reduce((sum, val) => sum + val ** 2, 0));
  return dotProduct / (magnitudeA * magnitudeB);
}

/**
 * Generates embeddings for a single roommate description.
 */
async function getRoommateDescriptionEmbedding(description) {
  const keyPhrases = await extractKeyPhrases(description);
  const embedding = await getEmbeddings([keyPhrases.join(", ")]);
  return embedding[0];
}

/**
 * Compares a primary roommate description with others.
 */
async function compareRoomates(description1, ...descriptions) {
  const embedding1 = await getRoommateDescriptionEmbedding(description1);
  const results = [];

  for (const { id, description } of descriptions) {
    const embedding2 = await getRoommateDescriptionEmbedding(description);
    const similarity = cosineSimilarity(embedding1, embedding2);
    results.push({ id, similarity });
  }

  return results;
}

/**
 * Lambda function handler.
 */
export const handler = async (event) => {
  try {
    console.log("Lambda function started...");

    // Validate input
    const { userid, description, compareDescriptions } = event;
    if (!userid || !description || !compareDescriptions) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "Missing userid, description, or compareDescriptions.",
        }),
      };
    }

    // Generate embeddings for the primary description
    const primaryEmbedding = await getRoommateDescriptionEmbedding(description);

    // Compare embeddings
    const results = await compareRoomates(
      description,
      ...compareDescriptions.map(({ id, description }) => ({
        id,
        description,
      }))
    );

    // Save the primary embedding via the storeEmbeddings Lambda
    const storePayload = {
      userId: userid,
      embedding: primaryEmbedding,
    };

    const storeCommand = new InvokeCommand({
      FunctionName: "storeEmbeddings",
      Payload: Buffer.from(JSON.stringify(storePayload)),
    });

    const storeResponse = await lambdaClient.send(storeCommand);
    console.log("storeEmbeddings response:", storeResponse);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Embedding generated and comparisons completed successfully!",
        comparisons: results,
      }),
    };
  } catch (error) {
    console.error("Error processing request:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "An internal error occurred." }),
    };
  }
};
