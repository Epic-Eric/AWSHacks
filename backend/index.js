const { ComprehendClient, DetectKeyPhrasesCommand } = require("@aws-sdk/client-comprehend");
const { BedrockRuntimeClient, InvokeModelCommand } = require("@aws-sdk/client-bedrock-runtime");
require("dotenv").config();

// AWS Region and Credentials
const AWS_REGION = "us-west-2";
const AWS_CREDENTIALS = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    sessionToken: process.env.AWS_SESSION_TOKEN,
};

// AWS Clients Setup
const comprehendClient = new ComprehendClient({
    region: AWS_REGION,
    credentials: AWS_CREDENTIALS,
});
const bedrockClient = new BedrockRuntimeClient({
    region: AWS_REGION,
    credentials: AWS_CREDENTIALS,
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
 * Fetches high-dimensional embeddings using Amazon Titan on Bedrock.
 * @param {string[]} sentences - An array of sentences to embed
 * @returns {Promise<number[][]>} A promise that resolves to an array of embeddings
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

            // Decode the Uint8Array response body to a string
            const responseBody = new TextDecoder("utf-8").decode(response.body);


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
 * Computes the cosine similarity between two vectors.
 * @param {number[]} vec1 - First vector
 * @param {number[]} vec2 - Second vector
 * @returns {number} The cosine similarity value
 */
function cosineSimilarity(vec1, vec2) {
    const dotProduct = vec1.reduce((sum, val, idx) => sum + val * vec2[idx], 0);
    const norm1 = Math.sqrt(vec1.reduce((sum, val) => sum + val * val, 0));
    const norm2 = Math.sqrt(vec2.reduce((sum, val) => sum + val * val, 0));
    return dotProduct / (norm1 * norm2);
}

/**
 * Function to obtain just the vector, without comparing the descriptions.
 * @param {string} description - Roommate description
 * @returns {number[]} The embedding vector for the description
 */
async function getRoommateDescriptionEmbedding(description) {
    console.log("Extracting key phrases...");
    const keyPhrases = await extractKeyPhrases(description);
    console.log("Generating embedding...");
    const embedding = await getEmbeddings([keyPhrases.join(", ")]);
    return embedding[0];
}


/**
 * Main function to compare roommate descriptions.
 * @param {string} description1 - First roommate description
 * @param {string} description2 - Second roommate description
 */
async function compareRoommateDescriptions(description1, description2) {

    const embeddings = [];

    // Get embeddings for each description
    for (const description of [description1, description2]) {
        console.log(`Processing description: ${description}`);
        const embedding = await getRoommateDescriptionEmbedding(description);
        embeddings.push(embedding);
    }

    // Compute similarity
    const similarity = cosineSimilarity(embeddings[0], embeddings[1]);
    console.log(`Cosine Similarity between descriptions: ${similarity.toFixed(4)}`);
}


// Example Usage
(async () => {


    const s1 = "I’m an easy-going individual who loves spending time with roommates but also values personal space. I enjoy having people over for dinner or game nights, but I make sure to clean up afterward. I’m a bit of a neat freak, so I love a tidy and organized living environment. I’m also an introvert at heart, so while I enjoy socializing, I appreciate quiet time alone. I usually spend my free time reading, drawing, or cooking, but I’m open to joining my roommates for activities like watching movies or working on joint projects.";
    const s2 = "I'm a laid-back person who enjoys hanging out with my roommates in the evenings, whether it’s watching TV or cooking meals together. I like to maintain a peaceful and tidy home, and I always try to respect everyone’s personal space. I’m an introvert, so I enjoy my quiet time but am always happy to join social events when it feels right. I spend most of my free time reading, doing crafts, or trying new recipes in the kitchen. Overall, I’m a calm person who values organization but enjoys casual interaction with others.";
    await compareRoommateDescriptions(s1, s2);


    const d1 =
        "I am a very quiet and reserved individual who values a peaceful and organized living environment. My daily routine revolves around studying, working from home, and occasionally engaging in solo hobbies like reading and painting. I prefer a clean space and believe in maintaining mutual respect for personal space. Although I am introverted, I enjoy light conversations with roommates, but I do appreciate my privacy. I try to keep a low-key lifestyle and only participate in group activities when necessary. My ideal living space is calm, orderly, and conducive to focusing on my work and personal projects.";

    const d2 = "I am a social person who loves a lively and interactive atmosphere at home. I work from a flexible schedule, so I am often at home, but I enjoy being active with my roommates, whether it’s cooking together, hosting movie nights, or enjoying games. I believe in a balanced living environment where both work and play can coexist peacefully. Cleanliness is important to me, but I also like to have fun and relax. I enjoy having guests over and don’t mind if there’s occasional noise, as long as everyone respects each other’s space when needed. I’m easygoing, and I’m always open to spontaneous activities or casual hangouts."

    await compareRoommateDescriptions(d1, d2);


    const d3 = "I'm a very introverted and quiet person who enjoys solitude and a peaceful environment. I value my personal space and am most comfortable when I can relax in my room with a good book, music, or simply thinking. I prefer minimal interaction with others and find social gatherings overwhelming. I like a tidy, organized home but don’t often engage with people. My hobbies include reading, writing, hiking, and spending time in nature. I’m generally a night owl and enjoy staying up late. I appreciate roommates who respect privacy and maintain a calm, quiet atmosphere.";
    const d4 = "I'm an outgoing and extroverted individual who loves being around people and staying active. I thrive in social environments, whether it’s having friends over for parties, going out to events, or organizing group activities. I’m always up for a spontaneous adventure or exploring new places. My energy is high, and I’m constantly busy with something, whether it’s hanging out with roommates, meeting new people, or trying new things. I’m a bit messy because I’m always on the go, but I’m always happy to help with chores if someone needs it. I enjoy living in a lively, energetic space and love to interact with others often.";
    await compareRoommateDescriptions(d3, d4);

    console.log("Done!");

})();
