// controllers/analyzerController.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
// import openai from '../utils/openai.js'; // REMOVE: No longer using OpenAI
import applicationModel from '../models/applicationModel.js'; // Assuming this is your Mongoose model

// Emulate __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Calls the Gemini API to get a text generation response.
 * @param {string} prompt The text prompt to send to the Gemini model.
 * @returns {Promise<string>} The generated text from the Gemini model.
 * @throws {Error} If the API call fails or the response is unexpected.
 */
async function callGeminiAPI(prompt) {
    // IMPORTANT: It's highly recommended to load your API key from environment variables
    // for security reasons (e.g., process.env.GEMINI_API_KEY).
    // For this example, it's left as an empty string, assuming the Canvas environment
    // will inject it at runtime, or you should configure it on your server.
    const apiKey =  process.env.GEMINI_API_KEY; // Leave as-is for Canvas, or set process.env.GEMINI_API_KEY for your server
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

    const chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
    const payload = { contents: chatHistory };

    // Implement exponential backoff for API calls
    let retries = 0;
    const maxRetries = 5;
    const baseDelay = 1000; // 1 second

    while (retries < maxRetries) {
        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorBody = await response.text();
                console.error(`Gemini API HTTP error! Status: ${response.status}, Body: ${errorBody}`);
                // If it's a rate limit error (429) or server error (5xx), retry
                if (response.status === 429 || response.status >= 500) {
                    retries++;
                    const delay = baseDelay * Math.pow(2, retries - 1);
                    console.warn(`Retrying Gemini API call in ${delay / 1000} seconds... (Attempt ${retries}/${maxRetries})`);
                    await new Promise(resolve => setTimeout(resolve, delay));
                    continue; // Go to next iteration of the loop
                } else {
                    throw new Error(`Gemini API request failed with status ${response.status}: ${errorBody}`);
                }
            }

            const result = await response.json();

            if (result.candidates && result.candidates.length > 0 &&
                result.candidates[0].content && result.candidates[0].content.parts &&
                result.candidates[0].content.parts.length > 0) {
                return result.candidates[0].content.parts[0].text;
            } else {
                throw new Error("Gemini API response structure unexpected or content missing.");
            }
        } catch (error) {
            console.error("Error during Gemini API fetch:", error);
            if (retries < maxRetries) {
                retries++;
                const delay = baseDelay * Math.pow(2, retries - 1);
                console.warn(`Retrying Gemini API call due to network error in ${delay / 1000} seconds... (Attempt ${retries}/${maxRetries})`);
                await new Promise(resolve => setTimeout(resolve, delay));
            } else {
                throw new Error(`Failed to call Gemini API after ${maxRetries} retries: ${error.message}`);
            }
        }
    }
    throw new Error("Maximum retries reached for Gemini API call.");
}

const analyzeResume = async (req, res) => {
    try {
        const { resumePath, jobTitle, jobDescription, qualification, applicationId } = req.body;

        // Validate required fields
        if (!resumePath || !jobDescription || !qualification || !applicationId) {
            return res.status(400).json({ success: false, message: "Missing fields: resumePath, jobDescription, qualification, or applicationId." });
        }

        // Construct the full path to the resume file
        // Ensure that 'uploads' is correctly relative to where your server starts or is deployed
        const resumeFilePath = path.join(__dirname, '..', 'uploads', resumePath);

        // Check if the resume file exists
        if (!fs.existsSync(resumeFilePath)) {
            console.error(`Resume file not found at: ${resumeFilePath}`);
            return res.status(404).json({ success: false, message: "Resume file not found on server." });
        }

        // Read the resume file content
        const resumeText = fs.readFileSync(resumeFilePath, "utf-8");

        // Generate the AI prompt for Gemini
        const prompt = `
            You are an AI HR Assistant. Based on the job description, required qualifications, and the applicant's resume, decide if the applicant should be 'ACCEPTED' or 'REJECTED'.
            Justify your answer briefly.

            Job Title: ${jobTitle}
            Job Description: ${jobDescription}
            Required Qualification: ${qualification}

            Applicant Resume:
            ${resumeText}

            Respond with this format:
            Decision: [Accepted or Rejected]
            Reason: [Short explanation]
        `;

        // Call Gemini API
        const aiResponse = await callGeminiAPI(prompt);
        console.log("Gemini AI Raw Response:", aiResponse);

        // Extract decision and reason from AI response
        const decisionMatch = aiResponse.match(/Decision:\s*(Accepted|Rejected)/i);
        const reasonMatch = aiResponse.match(/Reason:\s*(.*)/i);

        const decision = decisionMatch ? decisionMatch[1].trim() : 'Pending'; // Default to 'Pending' if not found
        const reason = reasonMatch ? reasonMatch[1].trim() : 'Could not extract a specific reason from AI response.';

        if (!decisionMatch) {
            console.warn("AI response did not contain a clear 'Decision:' field.");
        }

        // Update the application status in the database
        // Assuming applicationModel is a Mongoose model
        const updatedApplication = await applicationModel.findByIdAndUpdate(
            applicationId,
            { status: decision, aiDecisionReason: reason }, // Store both decision and reason
            { new: true } // Return the updated document
        );

        if (!updatedApplication) {
            return res.status(404).json({ success: false, message: "Application not found for update." });
        }

        // Send success response with decision and reason
        res.status(200).json({ success: true, decision: decision, reason: reason });

    } catch (error) {
        console.error("AI analysis error:", error);
        res.status(500).json({ success: false, message: "Internal Server Error during AI analysis." });
    }
};

export { analyzeResume };
