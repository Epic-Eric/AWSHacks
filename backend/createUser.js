// Import AWS SDK
import { DynamoDB } from 'aws-sdk';

// Initialize DynamoDB DocumentClient
const docClient = new DynamoDB.DocumentClient();

// Lambda function handler
export const handler = async (userData) => {
    try {
        // Parse incoming JSON event (from the form submission)
        const userData = JSON.parse(userData);

        // Generate a unique ID for each preference (for simplicity, using Date.now())
        const id = userData.userId;

        // Prepare the data to be stored in DynamoDB
        const params = {
            TableName: 'PreferencesTable',
            Item: {
                id: id,
                Name: body.Name,
                Education: body.Education,
                Age: body.Age,
                Preference: body.Preference // Store the entire Preference object
            }
        };

        // Put the item into the DynamoDB table
        await docClient.put(params).promise();

        // Return a successful response
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Preferences saved successfully!',
                id: id
            })
        };
    } catch (error) {
        console.error('Error saving preferences:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Failed to save preferences.', error: error.message })
        };
    }
};
