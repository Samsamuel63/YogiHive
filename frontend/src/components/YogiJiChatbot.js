import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';

const ChatContainer = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 350px;
  height: 500px;
  background: white;
  border-radius: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  z-index: 1000;
`;

const ChatHeader = styled.div`
  background: linear-gradient(135deg, #4CAF50, #45a049);
  color: white;
  padding: 15px;
  border-radius: 15px 15px 0 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ChatTitle = styled.h3`
  margin: 0;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 1.2rem;
`;

const MessagesContainer = styled.div`
  flex: 1;
  padding: 15px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Message = styled.div`
  max-width: 80%;
  padding: 10px 15px;
  border-radius: 15px;
  background: ${props => props.isUser ? '#e3f2fd' : '#f5f5f5'};
  align-self: ${props => props.isUser ? 'flex-end' : 'flex-start'};
  color: ${props => props.isUser ? '#1976d2' : '#333'};
  white-space: pre-wrap;
`;

const InputContainer = styled.div`
  padding: 15px;
  border-top: 1px solid #eee;
  display: flex;
  gap: 10px;
`;

const Input = styled.input`
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 20px;
  outline: none;
  &:focus {
    border-color: #4CAF50;
  }
`;

const SendButton = styled.button`
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 20px;
  padding: 10px 20px;
  cursor: pointer;
  &:hover {
    background: #45a049;
  }
`;

const persona = {
  name: "Yogi Ji",
  description: "A wise and experienced health trainer specializing in yoga, meditation, nutrition, and holistic wellness. I provide personalized guidance on yoga poses, breathing techniques, meditation practices, and healthy lifestyle choices. I'm here to help you achieve physical, mental, and spiritual well-being through ancient wisdom and modern science.",
  expertise: [
    "Yoga and meditation instruction",
    "Nutrition and diet planning",
    "Breathing techniques (Pranayama)",
    "Stress management",
    "Holistic wellness",
    "Mind-body connection",
    "Ayurvedic principles"
  ]
};

const formatForPrompt = (persona) => {
  return `You are ${persona.name}, ${persona.description}. Your areas of expertise include: ${persona.expertise.join(', ')}. You speak in a warm, encouraging, and knowledgeable manner, often using Sanskrit terms when appropriate. You provide practical, actionable advice while maintaining a spiritual and holistic perspective.`;
};

const getAIResponse = async (userMessage) => {
  try {
    console.log("🔍 Fetching AI response...");

    if (userMessage.toLowerCase().includes("your name")) {
      return `I'm ${persona.name}, your assistant!`;
    }

    const formattedPrompt = formatForPrompt(persona) + `\nUser: ${userMessage}`;

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.REACT_APP_GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [{ text: formattedPrompt }],
            role: "user",
          },
        ],
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const aiResponse = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    return aiResponse ? aiResponse.replace(/\n/g, ' ') : `Hmm, I'm not sure! But let's solve it together!`;
  } catch (error) {
    console.error("🚨 AI Response Error:", error.response?.data || error.message);
    return "I'm experiencing a little shock! Try again later!";
  }
};

const YogiJiChatbot = ({ onClose }) => {
  const [messages, setMessages] = useState([
    {
      text: "Namaste! I'm Yogi Ji, your personal guide to holistic wellness. I'm here to help you with yoga poses, meditation techniques, nutrition advice, and overall well-being. How can I assist you today?",
      isUser: false
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { text: input, isUser: true };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const botResponse = await getAIResponse(input);
      const botMessage = { text: botResponse, isUser: false };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const formatMessage = (text) => {
    return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  };

  return (
    <ChatContainer>
      <ChatHeader>
        <ChatTitle>
          <span>🧘‍♂️ Yogi Ji</span>
        </ChatTitle>
        <CloseButton onClick={onClose}>×</CloseButton>
      </ChatHeader>
      <MessagesContainer>
        {messages.map((message, index) => (
          <Message 
            key={index} 
            isUser={message.isUser}
            dangerouslySetInnerHTML={{ __html: formatMessage(message.text) }}
          />
        ))}
        {isLoading && (
          <Message isUser={false}>
            Yogi Ji is thinking...
          </Message>
        )}
        <div ref={messagesEndRef} />
      </MessagesContainer>
      <InputContainer>
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Yogi Ji anything..."
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          disabled={isLoading}
        />
        <SendButton 
          onClick={handleSend}
          disabled={isLoading}
        >
          {isLoading ? '...' : 'Send'}
        </SendButton>
      </InputContainer>
    </ChatContainer>
  );
};

export default YogiJiChatbot;
