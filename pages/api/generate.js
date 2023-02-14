import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);
const basePromptPrefix = 
`
Write me a detailed table of contents for the given subject on the given topic for a person who is of the given level in the topic. The table of contents should contain all the important points on the given topic. The table of contents should be enough for someone preparing for a big exam.
Subject: 
Topic: 
Level: 
Number of questions and answers: 
`
;
const generateAction = async (req, res) => {
  // Run first prompt
  console.log(`API: ${basePromptPrefix}${req.body.userInput}`)

  const baseCompletion = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: `${basePromptPrefix}${req.body.userInput}`,
    temperature: 0.8,
    max_tokens: 500,
  });
  
  const basePromptOutput = baseCompletion.data.choices.pop();

  const secondPrompt = `
  Take the table of contents and generate a very detailed study material. Give a very detailed explanation for each of the topics and their sub-topics. Give the respective heading before explaining each topic. The study material should be followed by the given number of questions and answers on the given topic. At the end of the study material give resources for further learning.
  Subject: ${req.body.userInput}
  Topic: ${req.body.userInput}
  Level: ${req.body.userInput}
  Number of questions and answers: ${req.body.userInput}
  Table of Contents: ${basePromptOutput.text}
  Study Material:
  `
  ;

  // I call the OpenAI API a second time with Prompt #2
	const secondPromptCompletion = await openai.createCompletion({
		model: "text-davinci-003",
		prompt: `${secondPrompt}`,
		temperature: 0.8,
		max_tokens: 3000,
	});

  const secondPromptOutput = secondPromptCompletion.data.choices.pop();

  res.status(200).json({ output: secondPromptOutput });
};

export default generateAction;