import {
  ComprehendClient,
  DetectKeyPhrasesCommand,
} from "@aws-sdk/client-comprehend";
import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";

// AWS Region
const AWS_REGION = "us-west-2";

// AWS Clients Setup (No need for manual credentials)
const comprehendClient = new ComprehendClient({
  region: AWS_REGION,
});
const bedrockClient = new BedrockRuntimeClient({
  region: AWS_REGION,
});

// Model name for Titan
const MODEL_NAME = "amazon.titan-embed-text-v2:0";
const VECTOR_DIMENSION = 1024;

/**
 * Extracts key phrases from text using AWS Comprehend.
 * @param {string} text - The input text to analyze
 * @param {string} languageCode - The language code for the text (default: "en")
 * @returns {Promise<string[]>} A promise that resolves to an array of key phrases
 */
async function extractKeyPhrases(text, languageCode = "en") {
  try {
    console.log("Calling Comprehend API to extract key phrases..."); // Added log
    const command = new DetectKeyPhrasesCommand({
      Text: text,
      LanguageCode: languageCode,
    });
    const response = await comprehendClient.send(command);
    console.log("Comprehend response:", response); // Added log for response
    return response.KeyPhrases?.map((phrase) => phrase.Text || "") || [];
  } catch (error) {
    console.error("Error extracting key phrases:", error);
    throw error;
  }
}

/**
 * Fetches high-dimensional embeddings using Amazon Titan on Bedrock.
 * @param {string[]} sentences - An array of sentences to embed
 * @returns {Promise<number[][]>} A promise that resolves to an array of embeddings
 */
async function getEmbeddings(sentences) {
  try {
    console.log("Calling Bedrock API to get embeddings..."); // Added log
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

      // Decode the Uint8Array response body to a string
      const responseBody = new TextDecoder("utf-8").decode(response.body);
      console.log("Bedrock response body:", responseBody); // Added log for response body

      // Parse the response body to get the embeddings
      const data = JSON.parse(responseBody);

      if (data.embedding) {
        embeddings.push(data.embedding);
      } else {
        console.warn("No embedding vector returned for input:", sentence);
      }
    }

    return embeddings;
  } catch (error) {
    console.error("Error fetching embeddings:", error);
    throw error;
  }
}

/**
 * Function to obtain just the vector, without comparing the descriptions.
 * @param {string} description - Roommate description
 * @returns {number[]} The embedding vector for the description
 */
async function getRoommateDescriptionEmbedding(description) {
  console.log("Extracting key phrases...");
  const keyPhrases = await extractKeyPhrases(description);
  console.log("Key Phrases:", keyPhrases);

  console.log("Generating embedding...");
  const embedding = await getEmbeddings([keyPhrases.join(", ")]);

  console.log("Generated Embedding:", embedding);
  return embedding[0];
}

/**
 * Lambda function handler for processing descriptions and generating embeddings.
 * @param {Object} event - The event input for the Lambda function
 * @param {Object} context - The context object for the Lambda function (not used in this case)
 * @returns {Object} The response with the generated embedding
 */
export const handler = async (event, context) => {
  try {
    console.log("Lambda function started..."); // Added log to confirm start

    if (!event.userid) {
      console.error("No user id");
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "No user id." }),
      };
    }

    if (!event.description) {
      console.error("No description provided in the input."); // Added log for error
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "No description provided in the input.",
        }),
      };
    }

    const description = event.description;
    const userid = event.userid;

    const embedding = await getRoommateDescriptionEmbedding(description);

    const userId = event.userId; // Extract the userId from the incoming request
    const embedding = event.embedding; // Extract the embedding vector

    // Create payload for the storeEmbeddings Lambda
    const payload = JSON.stringify({
      userId: userId,
      embedding: embedding,
    });

    // Set up the request to invoke the storeEmbeddings Lambda function
    const command = new InvokeCommand({
      FunctionName: "storeEmbeddings", // Replace with your storeEmbeddings Lambda function name
      Payload: Buffer.from(payload),
    });

    // Invoke the storeEmbeddings Lambda function
    const result = await lambdaClient.send(command);

    // Optionally, log the result or handle the response from storeEmbeddings
    console.log("storeEmbeddings Lambda response:", result);

    // Return a success response
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Embedding generated and stored successfully!",
      }),
    };
  } catch (error) {
    console.error("Error processing the description:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "An error occurred while processing the description.",
      }),
    };
  }
};
