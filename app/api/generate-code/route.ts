import { GoogleGenAI, Type } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const codeGenerationSchema = {
  type: Type.OBJECT,
  properties: {
    code: {
      type: Type.STRING,
      description: "The generated code based on the user's prompt.",
    },
    language: {
      type: Type.STRING,
      description: "The programming language of the generated code (e.g., 'JavaScript', 'Python', 'TypeScript').",
    },
    explanation: {
      type: Type.STRING,
      description: "A detailed explanation of the generated code, including what it does and key features.",
    },
  },
  required: ['code', 'language', 'explanation'],
};

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();

    if (!prompt || !prompt.trim()) {
      return Response.json({ error: "Prompt is required" }, { status: 400 });
    }

    const fullPrompt = `
      You are CodeRefine-ONSLAUGHT, an expert code generation assistant. Your task is to generate high-quality, production-ready code based on the user's prompt.

      Requirements:
      1. Generate clean, well-structured code that follows best practices
      2. Include helpful comments where necessary
      3. Use meaningful variable and function names
      4. Ensure the code is optimized and efficient
      5. Handle edge cases appropriately
      6. Write code that is easy to understand and maintain

      User's Request:
      ${prompt}

      You must respond ONLY with a single, valid JSON object that strictly adheres to the provided schema. Do not include any markdown formatting like \`\`\`json or any other text outside the JSON object.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: fullPrompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: codeGenerationSchema,
        temperature: 0.7,
      },
    });

    const jsonText = response.text.trim();
    const parsedResult = JSON.parse(jsonText);

    if (!parsedResult.code || !parsedResult.language || !parsedResult.explanation) {
      return Response.json({ error: "Invalid response structure from API" }, { status: 500 });
    }

    return Response.json(parsedResult);
  } catch (error) {
    console.error("Error generating code:", error);
    if (error instanceof Error) {
      if (error.message.includes("JSON")) {
        return Response.json({ error: "Failed to generate code. Please try again with a different prompt." }, { status: 500 });
      }
      return Response.json({ error: error.message }, { status: 500 });
    }
    return Response.json({ error: "An error occurred while generating code." }, { status: 500 });
  }
}
