import React, { useState } from 'react';
import { Paper, Box, Typography, Button, Fade } from '@mui/material';
import { motion } from 'framer-motion';
import YogiJiChatbot from '../../components/YogiJiChatbot';
import YogiJiButton from '../../components/YogiJiButton';

const Card = motion(Paper);

const YogiJi = () => {
  const [showChatbot, setShowChatbot] = useState(false);

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f5f7fa 60%, #e0e7ff 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', py: 6 }}>
      <Fade in timeout={600}>
        <Card
          elevation={6}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          sx={{
            maxWidth: 540,
            width: '100%',
            borderRadius: 5,
            p: { xs: 3, sm: 5 },
            boxShadow: 6,
            background: 'linear-gradient(135deg, #fff 60%, #e0e7ff 100%)',
            textAlign: 'center',
            position: 'relative',
          }}
        >
          <Typography variant="h3" sx={{ fontWeight: 700, mb: 2, color: 'primary.main', fontFamily: 'Inter, Poppins, sans-serif' }}>
            Yogi Ji's Guidance
          </Typography>
          <Typography variant="subtitle1" sx={{ mb: 3, color: 'text.secondary', fontWeight: 500 }}>
            Your personal guide to holistic wellness and spiritual growth
          </Typography>
          <Typography sx={{ mb: 2, color: 'text.primary' }}>
            Whether you're a beginner or an experienced practitioner, I can help you with:
          </Typography>
          <Box component="ul" sx={{ textAlign: 'left', color: 'text.secondary', mb: 3, pl: 3, fontSize: '1.05rem', lineHeight: 1.7 }}>
            <li>Personalized yoga sequences and pose corrections</li>
            <li>Meditation and mindfulness techniques</li>
            <li>Breathing exercises (Pranayama)</li>
            <li>Nutrition and diet planning based on Ayurvedic principles</li>
            <li>Stress management and mental well-being</li>
            <li>Daily wellness routines and lifestyle guidance</li>
            <li>Spiritual growth and self-discovery</li>
          </Box>
          <Typography sx={{ mb: 3, color: 'text.primary' }}>
            Click the button below to start your journey. I'm here to support you every step of the way!
          </Typography>
          <Button
            className="quick-start-btn"
            onClick={() => setShowChatbot(true)}
            sx={{ mt: 2, mb: 1 }}
          >
            Begin Your Journey with Yogi Ji
          </Button>
        </Card>
      </Fade>
      <YogiJiButton onClick={() => setShowChatbot(true)} />
      {showChatbot && <YogiJiChatbot onClose={() => setShowChatbot(false)} />}
    </Box>
  );
};

export default YogiJi; 