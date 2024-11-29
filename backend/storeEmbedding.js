import { Client } from "@opensearch-project/opensearch"; // Import OpenSearch Client

// Initialize OpenSearch client
const client = new Client({
  node: "https://vpc-roomate-search-bugcwf6tmpfzx4xsdqje2zjv34.us-west-2.es.amazonaws.com", // Replace with your OpenSearch endpoint
});

// Function to store user entry in OpenSearch
export const handler = async (event) => {
  try {
    // Extract user data from the event
    const userId = event.userId;
    const embedding = event.embedding; // Example: embedding vector passed in the request

    // Sample user data
    const userData = {
      userId: userId,
      embedding: embedding,
      timestamp: new Date().toISOString(),
    };

    // Index document in OpenSearch
    const response = await client.index({
      index: "user_embeddings", // Your OpenSearch index
      body: userData,
    });

    // Return a success response
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "User entry added successfully!",
        response: response.body,
      }),
    };
  } catch (error) {
    console.error("Error storing user entry in OpenSearch:", error);

    // Return an error response
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Failed to store user entry",
        error: error.message,
      }),
    };
  }
};
