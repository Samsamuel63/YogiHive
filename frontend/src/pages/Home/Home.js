import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import YogiJiChatbot from '../../components/YogiJiChatbot';
import YogiJiButton from '../../components/YogiJiButton';
import './Home.css';

export default function Home() {
    const [showChatbot, setShowChatbot] = useState(false);

    return (
        <div className='home-container'>
            <header className='home-header'>
                <h1 className='home-heading'>YogiHive</h1>
                <div className="header-buttons" style={{marginRight: '15px'}}>
                    <Link to='/'>
                    <button className="btn-header rounded-full " id="home-btn"
                    style={{borderRadius: '14px',  color: 'white',  fontSize: '16px'}}>
                    Home</button>

                    </Link>
                    <Link to='/about'>
                        <button className="btn-header" id="about-btn"
                        style={{borderRadius: '14px',  color: 'white',  fontSize: '16px'}}>About</button>
                    </Link>
                    <Link to='/contact'>
                        <button className="btn-header" id="contact-btn"
                        style={{borderRadius: '14px',  color: 'white',  fontSize: '16px'}}>Contact</button>
                    </Link>
                </div>
            </header>

            <main className="home-main">
                <div className="overlay">
                    <h1 className="description">Your AI-Powered Yoga Trainer</h1>
                    <p className="subtext">Transform your mind and body with AI-guided yoga sessions tailored just for you.</p>
                    <div className="btn-section">
                        <Link to='/levels'>
                            <button className="btn start-btn">Let's Begin</button>
                        </Link>
                        <Link to='/tutorials'>
                            <button className="btn start-btn">Tutorials</button>
                        </Link>
                    </div>
                </div>
            </main>

            <YogiJiButton onClick={() => setShowChatbot(true)} />

            {showChatbot && (
                <YogiJiChatbot onClose={() => setShowChatbot(false)} />
            )}
        </div>
    );
}