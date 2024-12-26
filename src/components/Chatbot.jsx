import React, { useState } from 'react';
import axiosInstance from '../intercepts/axiosConfig';
import ApiDefaults from '../defaults/ApiDefaults';

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSend = async () => {
        if (input.trim() === '') return;

        const userMessage = { sender: 'user', text: input };
        setMessages([...messages, userMessage]);
        setInput('');
        setLoading(true);

        try {
            const response = await axiosInstance.post(`${ApiDefaults.BASE_URL}/chat/`, { query: input });
            const botMessages = response.data.message.map((msg) => ({ sender: 'bot', text: msg }));
            setMessages([...messages, userMessage, ...botMessages]);
        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed bottom-4 right-4">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="bg-purple-600 text-white p-2 rounded-full shadow-md"
            >
                {isOpen ? 'Close' : 'Chat'}
            </button>
            {isOpen && (
                <div className="bg-white border border-gray-300 rounded-lg shadow-lg p-4 mt-2 w-80">
                    <div className="h-64 overflow-y-scroll mb-4">
                        {messages.map((message, index) => (
                            <div key={index} className={`mb-2 ${message.sender === 'user' ? 'text-right' : 'text-left'}`}>
                                <span className={`inline-block p-2 rounded-lg ${message.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
                                    {message.text}
                                </span>
                            </div>
                        ))}
                        {loading && (
                            <div className="text-center text-gray-500">thinking about it...</div>
                        )}
                    </div>
                    <div className="flex">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            className="flex-grow p-2 border border-gray-300 rounded-l-lg"
                            placeholder="Type a message..."
                            disabled={loading}
                        />
                        <button
                            onClick={handleSend}
                            className="bg-purple-600 text-white p-2 rounded-r-lg"
                            disabled={loading}
                        >
                            Send
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Chatbot;