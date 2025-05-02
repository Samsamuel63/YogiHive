import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaSpa, FaAppleAlt, FaSmile, FaBrain, FaHeart, FaSeedling, FaChevronRight, FaPaperPlane, FaMusic, FaPlus, FaUserSecret, FaThumbtack, FaBroom, FaChartPie } from 'react-icons/fa';
import { Box, Typography, TextField, IconButton, Avatar, Badge, Snackbar, Alert, Tooltip, CircularProgress } from '@mui/material';
import { io } from 'socket.io-client';
import { Picker } from 'emoji-mart';
import 'emoji-mart/css/emoji-mart.css';
import GiphyPicker from 'react-giphy-picker';
import GifIcon from '@mui/icons-material/Gif';
import { Howl } from 'howler';

const rooms = [
  { name: 'Yoga', icon: <FaSpa color="#7f53ac" /> },
  { name: 'Nutrition', icon: <FaAppleAlt color="#43cea2" /> },
  { name: 'Motivation', icon: <FaSmile color="#f7971e" /> },
  { name: 'Mindfulness', icon: <FaBrain color="#43cea2" /> },
  { name: 'Mental Health', icon: <FaHeart color="#ff6a88" /> },
  { name: 'Personal Growth', icon: <FaSeedling color="#43cea2" /> },
];

const yogaMessages = [
  { user: 'Alice', text: 'Welcome to the Yoga room! 🧘‍♂️', time: '09:00', badge: 'Yogi' },
  { user: 'Bob', text: 'Just completed my morning sun salutations! 🌞', time: '09:02', badge: 'Motivator' },
  { user: 'Charlie', text: 'Anyone up for a virtual yoga session later?', time: '09:05', badge: 'Yoga Enthusiast' },
  { user: 'Diana', text: 'I love the new meditation app! It has great guided sessions', time: '09:07', badge: 'Mindfulness Guide' },
  { user: 'Anonymous', text: 'Looking for tips on improving my downward dog', time: '09:08', badge: null, anonymous: true }
];

const nutritionMessages = [
  { user: 'Ethan', text: 'Welcome to the Nutrition room! 🥗', time: '09:00', badge: 'Nutritionist' },
  { user: 'Fiona', text: 'Just made a delicious green smoothie! 🥤', time: '09:02', badge: 'Health Coach' },
  { user: 'George', text: 'Anyone have good protein shake recipes?', time: '09:05', badge: 'Fitness Enthusiast' },
  { user: 'Hannah', text: 'I found this amazing vegan protein powder!', time: '09:07', badge: 'Vegan Expert' },
  { user: 'Anonymous', text: 'Looking for healthy snack ideas', time: '09:08', badge: null, anonymous: true }
];

const motivationMessages = [
  { user: 'Ivy', text: 'Welcome to the Motivation room! 💪', time: '09:00', badge: 'Motivator' },
  { user: 'Jack', text: 'Just hit my 30-day streak! 🎉', time: '09:02', badge: 'Achiever' },
  { user: 'Katie', text: 'Remember: Progress over perfection!', time: '09:05', badge: 'Mindset Coach' },
  { user: 'Liam', text: 'Who else is crushing their goals today?', time: '09:07', badge: 'Goal Crusher' },
  { user: 'Anonymous', text: 'Need some motivation to start my workout', time: '09:08', badge: null, anonymous: true }
];

const mindfulnessMessages = [
  { user: 'Mia', text: 'Welcome to the Mindfulness room! 🧠', time: '09:00', badge: 'Meditation Guide' },
  { user: 'Noah', text: 'Just completed a 20-minute meditation session', time: '09:02', badge: 'Zen Master' },
  { user: 'Olivia', text: 'Anyone tried the new breathing app?', time: '09:05', badge: 'Breathwork Expert' },
  { user: 'Parker', text: 'Mindfulness has changed my life!', time: '09:07', badge: 'Wellness Coach' },
  { user: 'Anonymous', text: 'Looking for guided meditation recommendations', time: '09:08', badge: null, anonymous: true }
];

const mentalHealthMessages = [
  { user: 'Quinn', text: 'Welcome to the Mental Health room! 💚', time: '09:00', badge: 'Therapist' },
  { user: 'Riley', text: 'Remember to be kind to yourself today', time: '09:02', badge: 'Mental Health Advocate' },
  { user: 'Sam', text: 'Self-care isn\'t selfish!', time: '09:05', badge: 'Wellness Warrior' },
  { user: 'Taylor', text: 'Anyone want to share their self-care routine?', time: '09:07', badge: 'Self-Care Expert' },
  { user: 'Anonymous', text: 'Looking for stress management tips', time: '09:08', badge: null, anonymous: true }
];

const personalGrowthMessages = [
  { user: 'Uma', text: 'Welcome to the Personal Growth room! 🌱', time: '09:00', badge: 'Life Coach' },
  { user: 'Victor', text: 'Just finished reading an amazing book!', time: '09:02', badge: 'Book Worm' },
  { user: 'Wendy', text: 'Growth happens outside your comfort zone!', time: '09:05', badge: 'Growth Mindset' },
  { user: 'Xavier', text: 'Anyone want to start a book club?', time: '09:07', badge: 'Knowledge Seeker' },
  { user: 'Anonymous', text: 'Looking for personal development resources', time: '09:08', badge: null, anonymous: true }
];

const roomMessages = {
  'Yoga': yogaMessages,
  'Nutrition': nutritionMessages,
  'Motivation': motivationMessages,
  'Mindfulness': mindfulnessMessages,
  'Mental Health': mentalHealthMessages,
  'Personal Growth': personalGrowthMessages
};

const sampleMessages = [
  { user: 'Alice', text: 'Welcome to the Yoga room! 🧘‍♂️', time: '09:00', badge: 'Yogi' },
  { user: 'Anonymous', text: 'Anyone have tips for morning motivation?', time: '09:02', badge: null, anonymous: true },
  { user: 'Bob', text: 'Try a gratitude journal! 🙏', time: '09:03', badge: 'Motivator' },
  { user: 'Charlie', text: 'I love starting my day with sun salutations! 🌞', time: '09:05', badge: 'Yoga Enthusiast' },
  { user: 'Diana', text: 'Has anyone tried the new meditation app?', time: '09:07', badge: 'Mindfulness Guide' },
  { user: 'Anonymous', text: 'I find it really helpful for stress relief', time: '09:08', badge: null, anonymous: true },
  { user: 'Ethan', text: 'Just completed my 30-day yoga challenge! 🎉', time: '09:10', badge: 'Achiever' },
  { user: 'Fiona', text: 'That\'s amazing! Keep up the great work! 💪', time: '09:11', badge: 'Motivator' },
  { user: 'George', text: 'Any recommendations for yoga mats?', time: '09:13', badge: 'New Yogi' },
  { user: 'Hannah', text: 'I love my Manduka Pro mat! It\'s worth the investment.', time: '09:15', badge: 'Yoga Expert' }
];

const ChatroomsContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background: linear-gradient(135deg, #e0e7ff 0%, #f5f7fa 100%);
  font-family: 'Poppins', sans-serif;
`;
const Sidebar = styled(motion.div)`
  width: 260px;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(18px);
  padding: 2rem 1rem 2rem 1rem;
  box-shadow: 0 8px 32px rgba(102, 126, 234, 0.10);
  border-right: 1.5px solid rgba(102, 126, 234, 0.13);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  z-index: 10;
  @media (max-width: 700px) {
    width: 70px;
    padding: 1rem 0.5rem;
    align-items: center;
  }
`;
const RoomItem = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-radius: 14px;
  cursor: pointer;
  color: ${({ active }) => (active ? '#667eea' : '#4a5568')};
  background: ${({ active }) => (active ? 'rgba(102, 126, 234, 0.13)' : 'transparent')};
  margin-bottom: 0.5rem;
  font-weight: 600;
  font-size: 1.1rem;
  transition: all 0.3s cubic-bezier(0.4,0,0.2,1);
  position: relative;
  min-width: 44px;
  &:hover {
    background: rgba(102, 126, 234, 0.08);
    color: #667eea;
    transform: translateX(3px) scale(1.03);
  }
  @media (max-width: 700px) {
    gap: 0.5rem;
    padding: 0.7rem;
    font-size: 1.3rem;
    justify-content: center;
  }
`;
const MainContent = styled.div`
  flex: 1;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #f5f7fa 0%, #e0e7ff 100%);
  @media (max-width: 700px) {
    padding: 0.5rem;
  }
`;
const ChatHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;
const ChatFeed = styled.div`
  flex: 1;
  overflow-y: auto;
  margin-bottom: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
`;
const MessageBubble = styled(motion.div)`
  align-self: ${({ isOwn }) => (isOwn ? 'flex-end' : 'flex-start')};
  background: ${({ isOwn }) => (isOwn ? 'linear-gradient(90deg, #667eea 0%, #43cea2 100%)' : 'rgba(255,255,255,0.95)')};
  color: ${({ isOwn }) => (isOwn ? 'white' : '#2d3748')};
  border-radius: 18px 18px 6px 18px;
  padding: 1rem 1.3rem;
  box-shadow: 0 2px 12px rgba(102, 126, 234, 0.08);
  max-width: 70vw;
  min-width: 80px;
  position: relative;
  font-size: 1.08rem;
  @media (max-width: 700px) {
    font-size: 1rem;
    padding: 0.7rem 1rem;
  }
`;
const MessageMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 0.7rem;
  margin-bottom: 0.2rem;
`;
const InputBar = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  background: rgba(255,255,255,0.95);
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(102, 126, 234, 0.08);
  padding: 0.7rem 1.2rem;
`;

const AMBIENT_SOUND_URL = 'https://cdn.pixabay.com/audio/2022/07/26/audio_124bfae5b2.mp3'; // Free calming sound

const NEGATIVE_KEYWORDS = [
  'hate', 'stupid', 'idiot', 'dumb', 'useless', 'kill', 'annoying', 'shut up', 'shut-up', 'worst', 'sucks', 'angry', 'mad', 'depressed', 'sad', 'loser', 'fool', 'trash', 'toxic', 'bully', 'mean', 'ugly', 'fat', 'dumb', 'crazy', 'shame', 'ashamed', 'worthless', 'hopeless', 'give up', 'give-up'
];
const POSITIVITY_NUDGES = [
  "Let's keep it kind and uplifting! 💛",
  'Remember, empathy and gratitude go a long way. 🌱',
  'Your words matter—spread positivity! ✨',
  "Let's support each other with kindness. 🤗",
  'A little encouragement can make someone\'s day! 🌞'
];

const DAILY_PROMPTS = [
  "Share one thing you're grateful for today.",
  "What's your favorite way to practice mindfulness?",
  'How do you stay motivated on tough days?',
  'Share a healthy recipe or snack idea!',
  "What's a small win you're celebrating this week?",
  'How do you unwind and relax after a busy day?'
];

const BADGES = {
  'You': ['Wellness Star', 'Top Contributor'],
  'Alice': ['Yogi'],
  'Bob': ['Motivator']
};

const SHOUTOUTS = {
  'You': '🌟 Shoutout! You are a Top Wellness Contributor this week!'
};

const dummyAnalytics = {
  sentiment: '+87% positive',
  engagement: 'High',
  activeUsers: 12
};

const isModerator = (user) => user.name === 'You';

const SidebarCard = styled.div`
  background: linear-gradient(135deg, #fff 60%, #e4e8f0 100%);
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(102, 126, 234, 0.08);
  padding: 1.2rem 1rem;
  margin-bottom: 1.2rem;
  width: 100%;
`;

function escapeHTML(str) {
  if (!str) return '';
  return str.replace(/[&<>'"`]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','\'':'&#39;','"':'&quot;','`':'&#96;'}[c]));
}

export default function Chatrooms() {
  const [activeRoom, setActiveRoom] = useState(rooms[0].name);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState(roomMessages[rooms[0].name]);
  const [typingUser, setTypingUser] = useState(null);
  const typingTimeout = useRef(null);
  const chatFeedRef = useRef(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showGifPicker, setShowGifPicker] = useState(false);
  const [ambientPlaying, setAmbientPlaying] = useState(false);
  const ambientSoundRef = useRef(null);
  const [reactions, setReactions] = useState({});
  const [reactionPickerIdx, setReactionPickerIdx] = useState(null);
  const [anonymous, setAnonymous] = useState(false);
  const [showNudge, setShowNudge] = useState(false);
  const [nudgeMsg, setNudgeMsg] = useState('');
  const [pinnedMsg, setPinnedMsg] = useState(null);
  const [cleared, setCleared] = useState(false);
  const [gifLoadingIdx, setGifLoadingIdx] = useState(null);
  // Placeholder for user info
  const user = { name: 'You', avatar: '', badge: 'Wellness Star' };

  // Update the room switching function
  const handleRoomSwitch = (roomName) => {
    setActiveRoom(roomName);
    setMessages(roomMessages[roomName]);
  };

  // Modified sendMessage function to work locally
  const sendMessage = () => {
    if (!input.trim()) return;
    
    const newMessage = {
      user: anonymous ? 'Anonymous' : user.name,
      text: input,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      badge: anonymous ? null : user.badge,
      anonymous: anonymous,
      type: 'text'
    };
    
    setMessages(prev => [...prev, newMessage]);
    setInput('');
  };

  // Modified handleInputChange to work locally
  const handleInputChange = (e) => {
    setInput(e.target.value);
    // Positivity nudge
    const lower = e.target.value.toLowerCase();
    if (NEGATIVE_KEYWORDS.some(word => lower.includes(word))) {
      setNudgeMsg(POSITIVITY_NUDGES[Math.floor(Math.random() * POSITIVITY_NUDGES.length)]);
      setShowNudge(true);
    } else {
      setShowNudge(false);
    }
  };

  // Scroll to bottom on new message
  useEffect(() => {
    if (chatFeedRef.current) {
      chatFeedRef.current.scrollTop = chatFeedRef.current.scrollHeight;
    }
  }, [messages]);

  // Ambient sound logic
  useEffect(() => {
    if (!ambientPlaying) {
      if (ambientSoundRef.current) ambientSoundRef.current.stop();
      return;
    }
    if (!ambientSoundRef.current) {
      ambientSoundRef.current = new Howl({ src: [AMBIENT_SOUND_URL], loop: true, volume: 0.25 });
    }
    ambientSoundRef.current.play();
    return () => {
      if (ambientSoundRef.current) ambientSoundRef.current.stop();
    };
  }, [ambientPlaying]);

  // Add emoji to input
  const addEmoji = (emoji) => {
    setInput(input + emoji.native);
    setShowEmojiPicker(false);
  };

  // Add GIF to chat
  const sendGif = (gif) => {
    if (!input.trim()) return;
    const msg = {
      user: anonymous ? 'Anonymous' : user.name,
      type: 'gif',
      gifUrl: gif.images.fixed_height.url,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      badge: anonymous ? null : user.badge,
      anonymous: anonymous
    };
    setMessages(prev => [...prev, msg]);
    setInput('');
  };

  // Add or remove reaction
  const toggleReaction = (msgIdx, emoji) => {
    setReactions(prev => {
      const msgReactions = prev[msgIdx] || {};
      const users = msgReactions[emoji] || [];
      if (users.includes(user.name)) {
        // Remove reaction
        return {
          ...prev,
          [msgIdx]: { ...msgReactions, [emoji]: users.filter(u => u !== user.name) }
        };
      } else {
        // Add reaction
        return {
          ...prev,
          [msgIdx]: { ...msgReactions, [emoji]: [...users, user.name] }
        };
      }
    });
  };

  // Add new reaction
  const addReaction = (msgIdx, emoji) => {
    setReactions(prev => {
      const msgReactions = prev[msgIdx] || {};
      const users = msgReactions[emoji.native] || [];
      return {
        ...prev,
        [msgIdx]: { ...msgReactions, [emoji.native]: [...users, user.name] }
      };
    });
    setReactionPickerIdx(null);
  };

  // Hide nudge after 4 seconds
  useEffect(() => {
    if (showNudge) {
      const t = setTimeout(() => setShowNudge(false), 4000);
      return () => clearTimeout(t);
    }
  }, [showNudge]);

  // Pin a message (moderator tool)
  const handlePin = (msg) => setPinnedMsg(msg);
  // Clear chat (moderator tool)
  const handleClear = () => { setMessages([]); setCleared(true); setTimeout(() => setCleared(false), 2000); };

  // Pick a daily prompt
  const todayPrompt = DAILY_PROMPTS[new Date().getDate() % DAILY_PROMPTS.length];

  // Close pickers on outside click or Escape
  useEffect(() => {
    const handleClick = (e) => {
      if (showEmojiPicker || showGifPicker) {
        if (!e.target.closest('.emoji-mart') && !e.target.closest('.giphy-picker')) {
          setShowEmojiPicker(false);
          setShowGifPicker(false);
        }
      }
    };
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        setShowEmojiPicker(false);
        setShowGifPicker(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [showEmojiPicker, showGifPicker]);

  return (
    <ChatroomsContainer>
      <Sidebar>
        {rooms.map((room, idx) => (
          <RoomItem
            key={room.name}
            active={activeRoom === room.name}
            onClick={() => handleRoomSwitch(room.name)}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.98 }}
          >
            {room.icon}
            <span style={{ display: 'inline-block', minWidth: 60 }}>{room.name}</span>
            {activeRoom === room.name && <FaChevronRight style={{ marginLeft: 'auto', color: '#667eea' }} />}
          </RoomItem>
        ))}
        {/* Profile Highlights */}
        <SidebarCard>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#667eea', mb: 1 }}>Profile Highlights</Typography>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 6 }}>
            {(BADGES[user.name] || []).map(badge => (
              <span key={badge} style={{ background: '#e0e7ff', color: '#667eea', borderRadius: 8, padding: '2px 8px', fontWeight: 600, fontSize: 13 }}>{badge}</span>
            ))}
          </div>
          {SHOUTOUTS[user.name] && (
            <div style={{ background: '#f5f7fa', color: '#43cea2', borderRadius: 8, padding: '4px 8px', fontWeight: 600, fontSize: 14, marginTop: 4 }}>{SHOUTOUTS[user.name]}</div>
          )}
        </SidebarCard>
        {/* Community Analytics */}
        <SidebarCard>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#764ba2', mb: 1 }}><FaChartPie style={{ marginRight: 6 }} />Community Analytics</Typography>
          <div style={{ fontSize: 15, color: '#4a5568', marginBottom: 2 }}>Sentiment: <b style={{ color: '#43cea2' }}>{dummyAnalytics.sentiment}</b></div>
          <div style={{ fontSize: 15, color: '#4a5568', marginBottom: 2 }}>Engagement: <b style={{ color: '#667eea' }}>{dummyAnalytics.engagement}</b></div>
          <div style={{ fontSize: 15, color: '#4a5568' }}>Active Users: <b style={{ color: '#764ba2' }}>{dummyAnalytics.activeUsers}</b></div>
        </SidebarCard>
        {/* Moderator Tools */}
        {isModerator(user) && (
          <SidebarCard>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#f7971e', mb: 1 }}>Moderator Tools</Typography>
            <Tooltip title="Clear Chat for Everyone" arrow>
              <button onClick={handleClear} style={{ background: '#e0e7ff', color: '#667eea', border: 'none', borderRadius: 8, padding: '6px 12px', fontWeight: 600, marginRight: 8, cursor: 'pointer' }}><FaBroom style={{ marginRight: 4 }} />Clear Chat</button>
            </Tooltip>
            <span style={{ color: '#43cea2', fontWeight: 600 }}>{cleared && 'Chat Cleared!'}</span>
          </SidebarCard>
        )}
      </Sidebar>
      <MainContent>
        <ChatHeader>
          {rooms.find(r => r.name === activeRoom)?.icon}
          <Typography variant="h5" sx={{ fontWeight: 700 }}>{activeRoom} Room</Typography>
          <Tooltip title={ambientPlaying ? 'Pause Ambient Sound' : 'Play Ambient Sound'} arrow>
            <IconButton onClick={() => setAmbientPlaying(v => !v)} color={ambientPlaying ? 'primary' : 'default'} sx={{ ml: 2 }} aria-label="Toggle ambient sound" tabIndex={0}>
              <FaMusic />
            </IconButton>
          </Tooltip>
        </ChatHeader>
        {/* Emoji Picker */}
        {showEmojiPicker && (
          <div style={{ position: 'absolute', bottom: 90, right: 100, zIndex: 20 }} className="emoji-mart">
            <Picker onSelect={addEmoji} theme="light" title="Pick an emoji" emoji="point_up" />
          </div>
        )}
        {/* GIF Picker */}
        {showGifPicker && (
          <div style={{ position: 'absolute', bottom: 90, right: 220, zIndex: 20, width: 350 }} className="giphy-picker">
            <GiphyPicker onSelected={sendGif} apiKey="dc6zaTOxFJmzC" />
          </div>
        )}
        {/* Guided Prompt */}
        <SidebarCard style={{ maxWidth: 600, margin: '0 auto 1.2rem auto', textAlign: 'center', background: 'linear-gradient(90deg, #e0e7ff 0%, #f5f7fa 100%)' }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#667eea' }}>💡 Daily Prompt: {todayPrompt}</Typography>
        </SidebarCard>
        {/* Pinned Message */}
        {pinnedMsg && (
          <SidebarCard style={{ maxWidth: 600, margin: '0 auto 1.2rem auto', background: '#fffbe6', border: '1.5px solid #ffe066', color: '#b7791f' }}>
            <FaThumbtack style={{ marginRight: 6 }} /> <b>Pinned:</b> {pinnedMsg.text || '[GIF]'}
          </SidebarCard>
        )}
        <ChatFeed ref={chatFeedRef}>
          {messages.length === 0 && (
            <div style={{ textAlign: 'center', color: '#667eea', fontWeight: 600, marginTop: 40, fontSize: 18 }}>No messages yet. Start the conversation!</div>
          )}
          {messages.map((msg, idx) => (
            <div key={idx} style={{ position: 'relative' }}>
              {msg.type === 'gif' ? (
                <MessageBubble
                  isOwn={msg.user === user.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.08 }}
                >
                  <MessageMeta>
                    <Avatar sx={{ width: 28, height: 28, bgcolor: msg.anonymous ? '#bdbdbd' : '#667eea', fontSize: 16 }}>
                      {msg.anonymous ? '?' : msg.user[0]}
                    </Avatar>
                    <span style={{ fontWeight: 600 }}>{msg.anonymous ? 'Anonymous' : msg.user}</span>
                    {msg.badge && <Badge badgeContent={msg.badge} color="primary" sx={{ ml: 1 }} />}
                    <span style={{ color: '#718096', fontSize: 13 }}>{msg.time}</span>
                  </MessageMeta>
                  <div style={{ position: 'relative', minHeight: 60 }}>
                    {gifLoadingIdx === idx && <CircularProgress size={32} sx={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)' }} />}
                    <img
                      src={msg.gifUrl}
                      alt="GIF"
                      style={{ maxWidth: 220, borderRadius: 12, marginTop: 8, opacity: gifLoadingIdx === idx ? 0.3 : 1 }}
                      onLoad={() => setGifLoadingIdx(null)}
                      onError={() => setGifLoadingIdx(null)}
                      onClick={() => setGifLoadingIdx(idx)}
                      tabIndex={0}
                      aria-label="GIF message"
                    />
                  </div>
                </MessageBubble>
              ) : (
                <MessageBubble
                  isOwn={msg.user === user.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.08 }}
                >
                  <MessageMeta>
                    <Avatar sx={{ width: 28, height: 28, bgcolor: msg.anonymous ? '#bdbdbd' : '#667eea', fontSize: 16 }}>
                      {msg.anonymous ? '?' : msg.user[0]}
                    </Avatar>
                    <span style={{ fontWeight: 600 }}>{msg.anonymous ? 'Anonymous' : msg.user}</span>
                    {msg.badge && <Badge badgeContent={msg.badge} color="primary" sx={{ ml: 1 }} />}
                    <span style={{ color: '#718096', fontSize: 13 }}>{msg.time}</span>
                  </MessageMeta>
                  <span dangerouslySetInnerHTML={{ __html: escapeHTML(msg.text) }} />
                </MessageBubble>
              )}
              {/* Moderator pin button */}
              {isModerator(user) && (
                <Tooltip title="Pin Message" arrow>
                  <button onClick={() => handlePin(msg)} style={{ position: 'absolute', right: 8, top: 8, background: 'none', border: 'none', color: '#f7971e', cursor: 'pointer' }} title="Pin Message"><FaThumbtack /></button>
                </Tooltip>
              )}
              {/* Reactions row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 44, marginTop: 2 }}>
                {Object.entries(reactions[idx] || {}).map(([emoji, users]) => (
                  <span
                    key={emoji}
                    style={{
                      background: users.includes(user.name) ? '#e0e7ff' : '#f5f7fa',
                      borderRadius: 12,
                      padding: '2px 8px',
                      cursor: 'pointer',
                      fontSize: 18,
                      border: users.includes(user.name) ? '1.5px solid #667eea' : '1px solid #e2e8f0',
                      fontWeight: 600
                    }}
                    onClick={() => toggleReaction(idx, emoji)}
                  >
                    {emoji} {users.length}
                  </span>
                ))}
                <span
                  style={{ cursor: 'pointer', color: '#667eea', fontSize: 18, marginLeft: 2 }}
                  onClick={() => setReactionPickerIdx(idx)}
                >
                  <FaPlus />
                </span>
                {reactionPickerIdx === idx && (
                  <div style={{ position: 'absolute', zIndex: 30, left: 60, bottom: 30 }}>
                    <Picker onSelect={emoji => addReaction(idx, emoji)} theme="light" title="React" emoji="sparkles" />
                  </div>
                )}
              </div>
            </div>
          ))}
          {/* Typing indicator */}
          {typingUser && typingUser !== user.name && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              style={{ marginLeft: 12, marginBottom: 8, color: '#667eea', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 8 }}
            >
              <span style={{ fontSize: 18 }}>💬</span>
              <span>{typingUser} is typing...</span>
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 1 }}
                style={{ display: 'inline-block', marginLeft: 4 }}
              >
                ...
              </motion.span>
            </motion.div>
          )}
        </ChatFeed>
        {/* Positivity Nudge */}
        <Snackbar open={showNudge} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
          <Alert severity="info" sx={{ fontWeight: 600, fontSize: 18, borderRadius: 2, background: 'linear-gradient(90deg, #e0e7ff 0%, #f5f7fa 100%)', color: '#667eea' }}>
            {nudgeMsg}
          </Alert>
        </Snackbar>
        <InputBar>
          <Tooltip title={anonymous ? 'Posting Anonymously' : 'Post as Anonymous'} arrow>
            <IconButton onClick={() => setAnonymous(a => !a)} color={anonymous ? 'primary' : 'default'} aria-label="Toggle anonymous posting" tabIndex={0}>
              <FaUserSecret />
            </IconButton>
          </Tooltip>
          <Tooltip title="Add Emoji" arrow>
            <IconButton onClick={() => setShowEmojiPicker(v => !v)} color={showEmojiPicker ? 'primary' : 'default'} aria-label="Add emoji" tabIndex={0}>
              <FaSmile />
            </IconButton>
          </Tooltip>
          <Tooltip title="Add GIF" arrow>
            <IconButton onClick={() => setShowGifPicker(v => !v)} color={showGifPicker ? 'primary' : 'default'} aria-label="Add GIF" tabIndex={0}>
              <GifIcon />
            </IconButton>
          </Tooltip>
          <TextField
            fullWidth
            variant="standard"
            placeholder={`Message #${activeRoom.toLowerCase()}`}
            value={input}
            onChange={handleInputChange}
            onKeyDown={(e) => { if (e.key === 'Enter') sendMessage(); }}
            InputProps={{ disableUnderline: true, style: { fontSize: 18 } }}
            sx={{ flex: 1 }}
            inputProps={{ 'aria-label': 'Chat message input' }}
          />
          <Tooltip title="Send Message" arrow>
            <IconButton color="primary" onClick={sendMessage} sx={{ ml: 1 }} aria-label="Send message" tabIndex={0}>
              <FaPaperPlane />
            </IconButton>
          </Tooltip>
        </InputBar>
      </MainContent>
    </ChatroomsContainer>
  );
} 