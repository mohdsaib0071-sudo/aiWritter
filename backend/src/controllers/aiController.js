const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const generateEssay = async (req, res) => {
  try {
    const { topic,length } = req.body;
 
     let prompt = topic
   
    console.log("Shib",prompt)

    if (!prompt || !prompt.trim()) {
      return res.status(400).json({
        message: "Prompt is required",
      });
    }

    const fullPrompt = `
Write a clear, well-structured essay on the following topic:

Topic: ${prompt}

Make it:
- informative
- easy to read
- properly paragraphed
- around ${length} words
`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: fullPrompt,
    });

    const text = response.text;

    return res.status(200).json({
      message: "Essay generated successfully",
      text,
    });
  } catch (error) {
    console.error("Essay generation error:", error);
    return res.status(500).json({
      message: "Failed to generate essay",
      error: error.message,
    });
  }
};

const generatePoem = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt || !prompt.trim()) {
      return res.status(400).json({
        message: "Prompt is required",
      });
    }

    const fullPrompt = `
Write a beautiful poem on the following topic:

Topic: ${prompt}

Make it:
- creative
- emotionally engaging
- properly line broken
- medium length
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: fullPrompt,
    });

    const text = response.text;

    return res.status(200).json({
      message: "Poem generated successfully",
      text,
    });
  } catch (error) {
    console.error("Poem generation error:", error);
    return res.status(500).json({
      message: "Failed to generate poem",
      error: error.message,
    });
  }
};

module.exports = {
  generateEssay,
  generatePoem,
};