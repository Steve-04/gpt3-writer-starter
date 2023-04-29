import { useState } from 'react';
import Head from 'next/head';

const Home = () => {
  const [userInput, setUserInput] = useState('');
  const [apiOutput, setApiOutput] = useState('')
  const [conversation, setConversation] = useState([]);
  const [responseIndex, setResponseIndex] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false)

  async function stream() {
    setIsGenerating(true);

    setApiOutput("");
    const updatedConversation = [
      ...conversation,
      { role: "user", content: userInput },
    ];
    setConversation(updatedConversation);
    setResponseIndex((prevIndex) => (prevIndex === null ? 1 : prevIndex + 2));
  
    //console.log("Sending!");
    //console.log(updatedConversation);
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt: userInput, conversation: updatedConversation }),
    });
  
    const data = response.body;
    if (!data) {
      return;
    }

    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      setApiOutput((prev) => prev + chunkValue);
    }
    setIsGenerating(false);
  }

  const onUserChangedText = (event) => {
    const input1 = document.getElementById('input1').value;
    const input2 = document.getElementById('input2').value;
    const input3 = document.getElementById('input3').value;
    const combinedInput = input1 + ' ' + input2 + ' ' + input3;

    setUserInput(combinedInput);
  };

  return (
    <div className="root">
      <Head>
        <title>Personal AI Tutor</title>
      </Head>
      <div className="container">
        <div className="header">
          <div className="header-title">
            <h1>Personal AI Tutor</h1>
          </div>
          <div className="header-subtitle">
            <h2>Tell me which topic you want to learn and I will give a brief description followed by few questions and answers for you to revise!
                <br></br>
                <br></br>Subject: Enter your subject
                <br></br>Topic: Enter your topic
                <br></br>Level: beginner / intermediate / advanced / . . .
            </h2>
          </div>
        </div>
        <div className="prompt-container">
          <textarea 
            id="input1"
            placeholder="subject" 
            className="prompt-box" 
            // value={userInput}
            onChange={onUserChangedText}
          />
          <textarea 
            id="input2"
            placeholder="topic" 
            className="prompt-box" 
            // value={userInput}
            onChange={onUserChangedText}
          />
          <textarea 
            id="input3"
            placeholder="level" 
            className="prompt-box" 
            // value={userInput}
            onChange={onUserChangedText}
          />
          <div className="prompt-buttons">
            <a className="coffee" href="https://www.buymeacoffee.com/steve004" target="_blank">
              <img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" />
            </a>
            <a 
              className={isGenerating ? 'generate-button loading' : 'generate-button'} 
              onClick={stream}
            >
              <div className="generate">
              {isGenerating ? <span className="loader"></span> : <p>Generate</p>}
              </div>
            </a>
          </div>
          {apiOutput && (
            <div className="output">
              <div className="output-header-container">
                <div className="output-header">
                  <h3>Output</h3>
                </div>
              </div>
              <div className="output-content">
                <p>{apiOutput}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;