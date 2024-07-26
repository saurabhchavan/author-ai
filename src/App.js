import React, { useState, useRef, useEffect } from 'react';

import './App.scss'; // import CSS for App component
import data from './mockResponse.json'; // import JSON data for chat messages

import parse from "html-react-parser";
import logo from './assets/logo.png'; // import logo image

// function to get response based on input message
export const getResponseMessage = (inputMessage) => {
  const { ai } = data.find(obj => obj.user.toLowerCase() === inputMessage.toLowerCase()) || {};
  return ai || 'I am sorry, I do not understand your message.';
};

function App() {

  // component for demo wrapper
  const DemoWrapper = (props) => {
    return (
      <div className="demo-wrapper" role="region" aria-label="Demo wrapper section">
        <div className="demo-wrapper-content" role="group" aria-label="Demo content group">
          {props.children}
        </div>
      </div>
    )
  }

  // component for chat window
  const ChatWindow = (props) => {

    const windowRef = useRef(null);
    const ref = useRef(null); // reference to get input value

    // state for list of chat messages
    const [messages, setMessages] = useState([
      { type: 'incoming', message: 'Hi! Let us know how we can help' },
      { type: 'incoming', message: 'Select an option:' },
      { type: 'options', options: ['Create Question', 'Others'] }
    ]);

    const OptionsMessage = ({ options }) => {
      return (
        <div className="options">
          {options.map((option, index) => (
            <button key={index} className="option" onClick={() => handleOptionClick(option)}>{option}</button>
          ))}
        </div>
      );
    };

    // Function to handle option button clicks
    const handleOptionClick = (option) => {
      let responseMessage;
      if (option === 'Create Question') {
        responseMessage = "Question Creation can be done by clicking on the 'Create New Question' button on <a target=\"blank\" href=\"https://kna.learnwithatom.com/author/organizations/68700940-f509-4662-975f-a3ba3382aa9b/content-items\">Maestro</a>";
      } else {
        responseMessage = 'Please specify what you need help with.';
      }
      setMessages([...messages, { type: 'outgoing', message: option }, { type: 'incoming', message: responseMessage }]);
    }

    // update the state when a new message is added so we see the latest message
    useEffect(() => {
      if (windowRef.current) {
        windowRef.current.scrollTop = windowRef.current.scrollHeight;
      }

      if (ref.current) {
        ref.current.focus();
      }
    }, [messages]);

    // component for title bar
    const Titlebar = (props) => {
      return (
        <div className="titlebar" role="banner">
          <div className="title" role="heading" aria-level="1" aria-label="Chat header">
          <img src={logo} alt="Logo" className="logo" />
            {props.title}
          </div>
          <div className="action">
            <button className="close" onClick={() => {
              // Add code for close window action
              alert("Do you want to close it ?")
            }}>
              <i className="close-icon" aria-hidden="true"></i>
            </button>

          </div>
        </div>
      )
    }

    // component for message input area
    const MessageArea = (props) => {

      // function to handle form submit
      const handleSubmit = (event) => {
        event.preventDefault(); // prevent default form submission
        const inputMessage = ref.current.value; // get input value
        const responseMessage = getResponseMessage(inputMessage); // get response message based on input
        // add new messages to list of chat messages
        setMessages([...messages, { type: "outgoing", message: inputMessage }, { type: "incoming", message: responseMessage }]);
        ref.current.focus(); // add focus back to textarea on submit
      };

      // function to handle key down events on input field
      const handleKeyDown = (event) => {
        if (event.key === 'Enter' && !event.shiftKey) { // if enter key is pressed and shift is not pressed
          handleSubmit(event); // call the handle submit function
          event.preventDefault(); // prevent default behavior
        }
      };

      // component for text input field
      const TextField = (props) => {
        return (
          <textarea
            required
            rows="1"
            className="text-field"
            placeholder='How can we help you?'
            ref={ref}
            onKeyDown={handleKeyDown}
            aria-label="Enter your message here"
          />
        )
      }

      // component for submit button
      const Button = (props) => {
        return (
          <button type="submit" name="send" alt="send button" role="button" className="btn" aria-label="send button"></button>
        )
      }

      // render message input area
      return (
        <form role="form" aria-label="Send a message" className="message-area" onSubmit={handleSubmit}>
          <TextField />
          <Button />
        </form>
      )
    }

    // component for incoming chat bubble
    const IncomingChatBubble = (props) => {
      return (
        <div className="chat-bubble"><div className="message incoming">
          {parse(props.message)}</div></div>
      )
    }

    // component for outgoing chat bubble
    const OutgoingChatBubble = (props) => {
      return (
        <div className="chat-bubble">
          <div className="message outgoing">
            {props.children}
          </div>
        </div>
      )
    }

    // render chat window
    return (
      <div className="chat-window">
        <Titlebar title="MAI Chat" />

        <div className="chat-wrapper" ref={windowRef}>
          {messages.map((item, index) => {
            if (item.type === "outgoing") {
              return <OutgoingChatBubble key={index}>{item.message}</OutgoingChatBubble>;
            } else if (item.type === "incoming") {
              return <IncomingChatBubble key={index} message={item.message} />;
            } else if (item.type === "options") {
              return <OptionsMessage key={index} options={item.options} />;
            }
            return null;
          })}
        </div>
        {/* <div className="chat-wrapper" ref={windowRef}>
          {messages.map((item, index) => {
            return (
              item.type === "outgoing" ?
                <OutgoingChatBubble key={index}>{item.message}</OutgoingChatBubble> :
                <IncomingChatBubble key={index} message={item.message} />
            );
          })}
        </div> */}
        <MessageArea />
      </div>
    )
  }

  // render demo wrapper containing chat window
  return (
    <DemoWrapper>
      <ChatWindow />
    </DemoWrapper>
  )
}

export default App; // export App component as default
