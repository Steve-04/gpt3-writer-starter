import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);
const basePromptPrefix = 
`
Give me a description of the given topic for a person who is of the given level in the topic. The description should contain an explanation of the topic in at least 20 sentences, some examples, and if possible, its application in the real world. The description should be followed by the given number of questions and answers on the given topic. The question and answers should be of the given type.
Topic: 
Level: 
Number of questions and answers: 
Type of questions and answers: 
`
;
const generateAction = async (req, res) => {
  // Run first prompt
  console.log(`API: ${basePromptPrefix}${req.body.userInput}`)

  const baseCompletion = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: `${basePromptPrefix}${req.body.userInput}\n`,
    temperature: 0.8,
    max_tokens: 2000,
  });
  
  const basePromptOutput = baseCompletion.data.choices.pop();

  res.status(200).json({ output: basePromptOutput });
};

export default generateAction;