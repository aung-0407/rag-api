import React, { useState,useEffect,useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/RAGChat.css'; 
import axios from 'axios';

let api = process.env.REACT_APP_API_CHAT;

function RAGChat() {
    const [input, setInput] = useState('');
    const [chatHistory, setChatHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate(); 
    const chatWindowRef = useRef(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userMessage = input.trim();

        setChatHistory(prev => [...prev, { user: userMessage, bot: '' }]);
        setInput('');
        setLoading(true);

        try{
            const response = await axios.post(api,{message : userMessage});
            console.log(response.data.response); 
            const botReply = response.data.response;

            setChatHistory(prev => {
                const updatedHistory = [...prev];
                updatedHistory[updatedHistory.length - 1].bot = botReply; 
                return updatedHistory;
            });
        }
        catch(error){
            alert("Error : " , error)
        }
        finally{
            setLoading(false);
        }
    };

    useEffect(() => {
        if (chatWindowRef.current) {
            chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
        }
    }, [chatHistory]);

    return (
        <div className="rag-chat">
            <div className="d-flex align-items-center mb-3">
                <button 
                    className='btn btn-sm btn-dark' style={{marginRight:"29rem"}} 
                    onClick={() => navigate('/')}
                >
                    <i className="fa fa-arrow-left" aria-hidden="true"></i>&nbsp;&nbsp;<i className="fa fa-home"></i>
                </button>

                <button
                    className='btn btn-sm btn-primary'
                    onClick={() => navigate('/upload-file')}
                >
                    <i class="fa fa-plus-circle" aria-hidden="true"></i> Upload
                </button>
            </div>
            <h3 className="">Chat <i class="fa fa-send" aria-hidden="true" style={{fontSize:"25px"}}></i></h3>
            <div className="chat-window" ref={chatWindowRef}>
                {chatHistory.map((chat, index) => (
                    <div key={index} className="chat-message">
                        <div className="user-message">
                            {chat.user}
                        </div>
                        {
                            chat.bot && (
                                <div className="bot-message">
                                    <strong> <i class="fa fa-drupal" aria-hidden="true"></i> AI Chat:</strong> {chat.bot}
                                </div>
                            )
                        }
                        {loading && index === chatHistory.length - 1 && ( 
                            <div className="loading-message">
                                    <span className="loading-text"> <i class="fa fa-drupal" aria-hidden="true"></i> AI Chat ...</span>
                            </div>
                        )}

                    </div>
                ))}
            </div>
            <form onSubmit={handleSubmit} className="chat-input">
                <input 
                    type="text" 
                    value={input} 
                    onChange={(e) => setInput(e.target.value)} 
                    placeholder="Type your message here..." 
                    className="input-field"
                />
                <button type="submit" className={`${input.trim() === '' ? 'btn btn-light' : 'btn btn-dark'}`} disabled={!input.trim()}><i class="fa fa-arrow-circle-right" aria-hidden="true"></i></button>
            </form>
        </div>
    );
}

export default RAGChat;
