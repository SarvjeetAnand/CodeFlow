const { GoogleGenerativeAI } = require("@google/generative-ai");
const CodeConversion = require("../models/Conversion");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);


exports.convertCode = async (req, res) => {
  try {
    const { inputCode, sourceLang, targetLang } = req.body;
    const userId = req.user.id;

    if (!inputCode || !sourceLang || !targetLang) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Gemini prompt
const prompt = `Convert the following ${sourceLang} code to ${targetLang}. 
Return only the converted ${targetLang} code as plain text. 
Do NOT include explanations, markdown formatting, or comments:\n\n${inputCode}`;

    // Load Gemini model
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const convertedCode = response.text();
    

    // Save to DB
    const record = await CodeConversion.create({
      userId,
      inputCode,
      sourceLang,
      targetLang,
      convertedCode,
    });

    res.status(200).json({ convertedCode, record });
  } catch (error) {
    console.error("Conversion Error:", error);
    res.status(500).json({ message: "Conversion failed", error: error.message });
  }
};

exports.getHistory = async (req, res) => {
  try {
    const history = await Conversion.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(history);
  } catch (err) {
    res.status(500).json({ message: "Could not fetch history", error: err.message });
  }
};
