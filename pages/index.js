import { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import buildspaceLogo from '../assets/buildspace-logo.png';

const Home = () => {
  const [userInput, setUserInput] = useState('');
  const [apiOutput, setApiOutput] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  const callGenerateEndpoint = async () => {
    setIsGenerating(true);
    
    console.log("Calling OpenAI...")
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userInput }),
    });

    const data = await response.json();
    const { output } = data;
    console.log("OpenAI replied...", output.text)

    setApiOutput(`${output.text}`);
    setIsGenerating(false);
  }
  const onUserChangedText = (event) => {
  // console.log(event.target.value);
  setUserInput(event.target.value);
  };
  return (
    <div className="root">
      <Head>
        <title>GPT-3 Writer | buildspace</title>
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
                <br></br>Number of questions and answers: 1 / 2 / 3 / . . .
                <br></br>
                <br></br>Make sure you enter the values in the same order and enter each values in a new line.
                <br></br>For Example:
                <br></br>Maths
                <br></br>Algebra
                <br></br>Beginner
                <br></br>2
            </h2>
          </div>
        </div>
        <div className="prompt-container">
          <textarea 
          placeholder="start typing here..." 
          className="prompt-box" 
          value={userInput}
          onChange={onUserChangedText}
          />
          <div className="prompt-buttons">
          <a 
            className={isGenerating ? 'generate-button loading' : 'generate-button'} 
            onClick={callGenerateEndpoint}
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
      {/* <div className="badge-container grow">
        <a
          href="https://buildspace.so/builds/ai-writer"
          target="_blank"
          rel="noreferrer"
        >
          <div className="badge">
            <Image src={buildspaceLogo} alt="buildspace logo" />
            <p>build with buildspace</p>
          </div>
        </a>
      </div> */}
    </div>
  );
};

export default Home;
