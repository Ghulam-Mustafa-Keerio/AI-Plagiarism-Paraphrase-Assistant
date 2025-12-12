import express from 'express';
import { GoogleGenAI, Type } from '@google/genai';

const app = express();
const port = process.env.PORT || 3000;

// Initialize Gemini Client
// Ensure you have set the API_KEY environment variable.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// LATENCY OPTIMIZATION:
// Use 'gemini-2.5-flash' for both endpoints.
// This model provides the best balance of speed and quality for these specific tasks.
const MODEL_SEARCH = 'gemini-2.5-flash';
const MODEL_PARAPHRASE = 'gemini-2.5-flash';

app.use(express.json());
app.use(express.static('.')); // Serve static files (index.html, style.css) from root

// --- Schemas ---
const paraphraseSchema = {
  type: Type.OBJECT,
  properties: {
    original_text: { type: Type.STRING },
    paraphrased_text: { type: Type.STRING },
    analysis: {
      type: Type.OBJECT,
      properties: {
        similarity_score_estimate: { type: Type.NUMBER },
        transformation_summary: { type: Type.STRING },
      },
      required: ['similarity_score_estimate', 'transformation_summary'],
    },
  },
  required: ['original_text', 'paraphrased_text', 'analysis'],
};

// --- Helpers ---

function cleanAndParseJSON(text) {
  try {
    // Remove markdown code blocks (e.g., ```json ... ```)
    let cleaned = text.replace(/```json\s*/g, '').replace(/```\s*$/g, '');
    // Trim whitespace
    cleaned = cleaned.trim();
    return JSON.parse(cleaned);
  } catch (e) {
    console.error("JSON Parse Error:", e);
    console.error("Raw Text:", text);
    throw new Error("Failed to parse model response as JSON.");
  }
}

// --- Endpoints ---

// 1. Detect Source (Optimized for Speed & Stability)
app.post('/api/detect-source', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: 'Text is required' });

    // Optimized prompt for speed and conciseness
    const prompt = `
      You are a Source Analyst. Use the external search tool immediately.
      Analyze the text below. Search specifically for its origin, prioritizing domains like:
      .edu, .gov, wikipedia.org, scholarly article archives, and major news publications.
      
      Input Text:
      """
      ${text}
      """

      Provide only CONCISE summaries for the fields.
      You MUST return the result in the following strict JSON format:
      {
        "source_summary": "concise string describing likely source",
        "author_estimate": "concise string estimating author",
        "confidence_score": number (0.0 to 1.0)
      }
    `;

    const response = await ai.models.generateContent({
      model: MODEL_SEARCH,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        // Optimization: Standard inference is faster and more stable for this search task.
        temperature: 0.1, 
      },
    });

    // Extract text and parse manually (Schema not supported with Search)
    const result = cleanAndParseJSON(response.text);

    // Extract grounding URLs (Mandatory per system instructions when using googleSearch)
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const urls = groundingChunks
      .map((chunk) => chunk.web?.uri)
      .filter((uri) => uri);
    
    // De-duplicate URLs and add to result
    result.grounding_urls = [...new Set(urls)];

    res.json(result);
  } catch (error) {
    console.error('Source Detection Error:', error);
    res.status(500).json({ error: 'Failed to detect source.' });
  }
});

// 2. Paraphrase / Remove Plagiarism (Optimized for Speed)
app.post('/api/paraphrase', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: 'Text is required' });

    const response = await ai.models.generateContent({
      model: MODEL_PARAPHRASE, // Explicitly using 'gemini-2.5-flash'
      contents: text,
      config: {
        systemInstruction: `You are an expert Academic Editor.
        Task: Rewrite the input text to significantly change vocabulary and sentence structure while preserving the exact semantic meaning.
        
        Tone Requirements:
        - Strict Formal/Academic tone.
        - Sophisticated vocabulary.
        - No colloquialisms or robotic transitions.

        Constraints:
        1. Do NOT change proper nouns, dates, numbers, or specific technical terms.
        2. Do NOT use bullet points or lists.
        3. Return strictly valid JSON.`,
        responseMimeType: 'application/json',
        responseSchema: paraphraseSchema,
        temperature: 0.7,
      },
    });

    // Direct JSON parsing is safe here due to responseSchema
    const result = JSON.parse(response.text);
    res.json(result);
  } catch (error) {
    console.error('Paraphrase Error:', error);
    res.status(500).json({ error: 'Failed to paraphrase text.' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});