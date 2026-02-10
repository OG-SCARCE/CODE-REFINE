
import { GoogleGenAI, Type } from "@google/genai";
import type { AnalysisResult } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const analysisSchema = {
  type: Type.OBJECT,
  properties: {
    language: {
        type: Type.STRING,
        description: "The detected programming language of the code snippet (e.g., 'JavaScript', 'Python', 'TypeScript')."
    },
    summary: { 
      type: Type.STRING,
      description: "A brief, high-level summary of the code's quality and the key improvements made."
    },
    refactoredCode: { 
      type: Type.STRING,
      description: "The complete, refactored version of the provided code."
    },
    optimizations: {
      type: Type.ARRAY,
      description: "A list of specific issues found and the corresponding suggestions.",
      items: {
        type: Type.OBJECT,
        properties: {
          issue: {
            type: Type.STRING,
            description: "A concise description of the identified issue (e.g., 'Inefficient loop', 'Potential null pointer')."
          },
          suggestion: {
            type: Type.STRING,
            description: "A clear suggestion on how to fix or improve the code."
          },
          explanation: {
            type: Type.STRING,
            description: "A detailed explanation of why the suggestion is an improvement (e.g., performance benefits, better readability, bug prevention)."
          },
          category: {
            type: Type.STRING,
            enum: ['Performance', 'Readability', 'Security', 'Best Practices', 'Bug Risk'],
            description: "The category of the issue."
          },
          severity: {
            type: Type.STRING,
            enum: ['High', 'Medium', 'Low'],
            description: "The severity level of the issue."
          }
        },
        required: ['issue', 'suggestion', 'explanation', 'category', 'severity'],
      },
    },
  },
  required: ['language', 'summary', 'refactoredCode', 'optimizations'],
};

export async function analyzeCode(code: string): Promise<AnalysisResult> {
  try {
    const prompt = `
      You are CodeRefine-ONSLAUGHT, an expert AI developer assistant. Your task is to perform a deep analysis of the following code snippet.

      Your analysis must be thorough and cover the following aspects:
      1.  **Language Detection:** First, identify the programming language.
      2.  **Detailed Optimizations:** Identify inefficiencies, potential bugs, security vulnerabilities, and areas for improvement in terms of performance, readability, and maintainability.
      3.  **Categorization:** For each issue, you must assign a 'category' from the following options: 'Performance', 'Readability', 'Security', 'Best Practices', 'Bug Risk'.
      4.  **Severity Assessment:** For each issue, you must assign a 'severity' level: 'High', 'Medium', or 'Low'.
      5.  **Refactoring:** Provide a complete, refactored version of the code that implements your suggestions.
      6.  **Summary:** Write a concise summary of your findings.

      You must respond ONLY with a single, valid JSON object that strictly adheres to the provided schema. Do not include any markdown formatting like \`\`\`json or any other text outside the JSON object.
      
      Code to analyze:
      \`\`\`
      ${code}
      \`\`\`
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        temperature: 0.2,
      },
    });

    const jsonText = response.text.trim();
    const parsedResult = JSON.parse(jsonText);
    
    // Basic validation to ensure the result matches the expected structure.
    // FIX: Corrected a typo from `parsed-Result.refactoredCode` to `parsedResult.refactoredCode`.
    if (!parsedResult.language || !parsedResult.summary || !parsedResult.refactoredCode || !Array.isArray(parsedResult.optimizations)) {
        throw new Error("Invalid response structure from API.");
    }

    return parsedResult as AnalysisResult;
    
  } catch (error) {
    console.error("Error analyzing code:", error);
    if (error instanceof Error && error.message.includes('JSON')) {
        throw new Error("Failed to get a valid analysis from the AI. It might have returned an unexpected format. Please try again.");
    }
    throw new Error("An error occurred while communicating with the AI service.");
  }
}
