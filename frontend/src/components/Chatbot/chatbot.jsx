import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { chatSession } from './chat_utilis';
import { BsChatDots, BsX } from "react-icons/bs";

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const ChatButton = styled.button`
  position: fixed;
  bottom: 250px;
  right: 20px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.3);

  &:hover {
    background: #0056b3;
  }
`;

const ChatContainer = styled.div`
  position: fixed;
  bottom: 200px;
  right: 20px;
  width: 350px;
  height: 350px;
  background: #323232;
  border-radius: 10px;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.3);
  display: ${({ isOpen }) => (isOpen ? "flex" : "none")};
  flex-direction: column;
  animation: ${fadeIn} 0.5s ease-out;
  overflow: hidden;
`;

const Header = styled.div`
  background: #007bff;
  color: white;
  padding: 10px;
  text-align: center;
  font-size: 18px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 20px;
  cursor: pointer;
`;

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 10px;
  background: #fff;
`;

const Message = styled.div`
  margin: 10px 0;
  padding: 10px;
  border-radius: 5px;
  background: ${({ isUser }) => (isUser ? '#DCF8C6' : '#eee')};
  align-self: ${({ isUser }) => (isUser ? 'flex-end' : 'flex-start')};
  line-height: 27px;
  font-family: monospace;
  white-space: pre-wrap;
  color : black ;
`;

const InputContainer = styled.div`
  display: flex;
  padding: 10px;
  background: white;
`;

const Input = styled.input`
  flex: 1;
  padding: 8px;
  border-radius: 5px;
  border: 1px solid #ccc;
  color : Black  ;
`;

const Button = styled.button`
  padding: 8px 15px;
  margin-left: 10px;
  border-radius: 5px;
  background: #007bff;
  color: white;
  cursor: pointer;

  &:hover {
    background: #0056b3;
  }
`;

const ChatAI = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleSend = async () => {
    if (input.trim()) {
      const userMessage = input;
      const newMessages = [...messages, { text: userMessage, isUser: true }];
      setMessages(newMessages);
      setInput('');

      try {
        const modifiedInput = `You are a coding assistant specialized in web development. Provide syntax, best practices, and generate code snippets based on the user's request. Focus on frontend (React, JavaScript, CSS) and backend (Node.js, Express, MongoDB). Respond concisely and clearly.` + userMessage;
        const result = await chatSession.sendMessage(modifiedInput);
        const ans = await result.response.text();
        setMessages([...newMessages, { text: ans, isUser: false }]);
      } catch (error) {
        setMessages([...newMessages, { text: 'Something went wrong. Please try again.', isUser: false }]);
      }
    }
  };

  return (
    <>
      <ChatButton onClick={() => setIsOpen(true)}>
        <BsChatDots />
      </ChatButton>

      <ChatContainer isOpen={isOpen}>
        <Header>
          <span>Web Dev Assistant</span>
          <CloseButton onClick={() => setIsOpen(false)}><BsX /></CloseButton>
        </Header>
        <MessagesContainer>
          {messages.map((msg, index) => (
            <Message key={index} isUser={msg.isUser}>{msg.text}</Message>
          ))}
        </MessagesContainer>
        <InputContainer>
          <Input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => { if (e.key === 'Enter') handleSend(); }}
            placeholder="Ask about web development..."
          />
          <Button onClick={handleSend}>Send</Button>
        </InputContainer>
      </ChatContainer>
    </>
  );
};

export default ChatAI;
