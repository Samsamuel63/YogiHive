import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const AuthContainer = styled.div`
  display: flex;
  min-height: 100vh;
  width: 100%;
  overflow: hidden;
`;

const LeftPanel = styled(motion.div)`
  flex: 1;
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #2E7D32 0%, #1B5E20 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  @media (max-width: 768px) {
    display: none;
  }
`;

const RightPanel = styled(motion.div)`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: #f5f7fa;
`;

const QuoteContainer = styled.div`
  position: absolute;
  bottom: 2rem;
  left: 2rem;
  color: white;
  max-width: 80%;
`;

const Quote = styled.h2`
  font-family: 'Poppins', sans-serif;
  font-size: 1.5rem;
  font-weight: 300;
  line-height: 1.4;
  margin: 0;
  opacity: 0.9;
`;

const Author = styled.p`
  font-family: 'Poppins', sans-serif;
  font-size: 1rem;
  margin-top: 1rem;
  opacity: 0.7;
`;

const quotes = [
  {
    text: "Each breath brings you closer to balance",
    author: "Yogi Bhajan"
  },
  {
    text: "The nature of yoga is to shine the light of awareness into the darkest corners of the body",
    author: "Jason Crandell"
  },
  {
    text: "Yoga is the journey of the self, through the self, to the self",
    author: "The Bhagavad Gita"
  }
];

export default function AuthLayout({ children }) {
  const [currentQuote, setCurrentQuote] = React.useState(0);
  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % quotes.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);
  return (
    <AuthContainer>
      <LeftPanel
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* You can add a background image or logo here if desired */}
        <QuoteContainer>
          <motion.div
            key={currentQuote}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <Quote>{quotes[currentQuote].text}</Quote>
            <Author>— {quotes[currentQuote].author}</Author>
          </motion.div>
        </QuoteContainer>
      </LeftPanel>
      <RightPanel
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {children}
      </RightPanel>
    </AuthContainer>
  );
} 