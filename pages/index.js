import { useState } from 'react';
import Head from 'next/head';
import { PDFDownloadLink, Document, Page, Text, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  body: {
    paddingTop: 35,
    paddingBottom: 65,
    paddingHorizontal: 35,
  },
  title: {
    fontSize: 24,
    textAlign: "center",
    fontFamily: 'Oswald'
  },
  text: {
    margin: 12,
    fontSize: 14,
    textAlign: "justify",
    fontFamily: "Times-Roman",
  },
  image: {
    marginVertical: 15,
    marginHorizontal: 100,
  },
  header: {
    fontSize: 12,
    marginBottom: 20,
    textAlign: "center",
    color: "grey",
  },
  pageNumber: {
    position: "absolute",
    fontSize: 12,
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: "center",
    color: "grey",
  },
});

const MyDocument = ({ apiOutput }) => {
  return (
    <Document>
      <Page style={styles.body}>
      <Text style={styles.header} fixed></Text>
      <Text style={styles.text}>
        {apiOutput}
      </Text>
      <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
        `${pageNumber} / ${totalPages}`)}
        fixed 
      />
      </Page>
    </Document>
  );
};

const Home = () => {
  const [userInput, setUserInput] = useState('');
  const [apiOutput, setApiOutput] = useState('')
  const [apiOutputImage, setApiOutputImage] = useState([])
  const [conversation, setConversation] = useState([]);
  const [responseIndex, setResponseIndex] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false)

  async function stream() {
    setIsGenerating(true);

    setApiOutput("");
    setApiOutputImage([]);
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
    
    const response2 = await fetch("/api/generateImage", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
			},
			body: JSON.stringify({ userInput: userInput }),
		});

		const data2 = await response2.json();
		const { output } = data2;

		setApiOutputImage(output);

    setIsGenerating(false);
  }

  const onUserChangedText = (event) => {
    const input1 = document.getElementById('input1').value;
    const input2 = document.getElementById('input2').value;
    const input3 = document.getElementById('input3').value;
    // const input4 = document.getElementById('input4').value;
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
          {/* <textarea 
            id="input4"
            placeholder="language" 
            className="prompt-box" 
            // value={userInput}
            onChange={onUserChangedText}
          /> */}
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
              {apiOutputImage && (
                <div className="image-section">
                  {apiOutputImage.map((image, _index) => (
                    <img key={_index} src={image} />
                  ))}
                </div>
              )}
              <PDFDownloadLink
                document={<MyDocument apiOutput={apiOutput} />}
                fileName={`${document.getElementById('input1').value}_${document.getElementById('input2').value}_${document.getElementById('input3').value}`}
              >
                <a className='download-button'>
                  <div className="download">
                    <p>Download PDF</p>
                  </div>
                </a>
              </PDFDownloadLink>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;