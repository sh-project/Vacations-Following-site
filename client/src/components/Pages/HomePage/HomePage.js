import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

function HomePage() {
    return (
        <div className="travels-wraper">
            <div className="travels-container">
                <div className="travels">
                    <h1 className="travels-header tracking-in-expand">London</h1>
                    <Link to="/login" className="travel-button">Follow your travel</Link>
                </div>
                <div className="how-box">
                    <a className="how-button" href="#how">How It Works?</a>
                </div>
            </div>
            <div className="how">
                <h2 id="how">That's how it works...</h2>
                <div className="step-frames">
                    <div className="step-frame scale-up-center">
                        Sign up for free - registration is quick and easy.
                    </div>
                    <div className="next-step-symbol scale-up-center">
                        <img src="/images/logos/plane.png" alt="next-step-symbol"></img>
                    </div>
                    <div className="step-frame scale-up-center">
                        Search and follow the magical vacations that are of particular interest to you.
                    </div>
                    <div className="next-step-symbol scale-up-center"><img src="/images/logos/plane.png" alt="next-step-symbol"></img></div>
                    <div className="step-frame scale-up-center">
                        Watch in real time, changes and updates on the vacations you follow.
                    </div>
                    <div className="next-step-symbol scale-up-center"><img src="/images/logos/plane.png" alt="next-step-symbol"></img></div>
                    <div className="step-frame scale-up-center">
                        Book your vacation, and start enjoying.
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HomePage;
