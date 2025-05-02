require('dotenv').config(); // Load .env variables
const readline = require('readline');
const axios = require('axios'); // For making API requests

// Define the persona for the chatbot
const persona = {
    name: "YogiBot",
    description: "a friendly and helpful chatbot that assists with various queries.",
};

// Function to format the prompt for the AI
const formatForPrompt = (persona) => {
    return `You are ${persona.name}, ${persona.description}`;
};

// Function to get AI response using the API
const getAIResponse = async (userMessage) => {
    try {
        console.log("🔍 Fetching AI response...");

        if (userMessage.toLowerCase().includes("your name")) {
            return `I'm ${persona.name}, your assistant!`;
        }

        const formattedPrompt = `${formatForPrompt(persona)}\nUser: ${userMessage}`;

        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
            {
                contents: [
                    {
                        parts: [{ text: formattedPrompt }],
                        role: "user",
                    }
                ]
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        const aiResponse = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (aiResponse) {
            return aiResponse.replace(/\n/g, ' ');
        } else {
            return "Hmm, I’m not sure! But let's solve it together!";
        }
    } catch (error) {
        console.error("🚨 AI Response Error:", error.response?.data || error.message);
        return "I'm experiencing a little shock! Try again later!";
    }
};

// Terminal interaction using readline
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: "You: "
});

console.log("👋 Welcome to YogiBot! Type your message below to chat.");
rl.prompt();

rl.on('line', async (line) => {
    const userMessage = line.trim();
    if (userMessage.toLowerCase() === "exit") {
        console.log("👋 Goodbye!");
        rl.close();
        return;
    }

    const aiResponse = await getAIResponse(userMessage);
    console.log(`${persona.name}: ${aiResponse}`);
    rl.prompt();
}).on('close', () => {
    console.log("👋 Chat session ended.");
    process.exit(0);
});
