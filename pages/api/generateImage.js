import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
	apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const basePromptPrefix = `
You are an expert in generating highly detailed prompts to generate images using DALL-E. Go through the given subject and the given topic and give relevant prompts which will generate images in DALL-E. The prompts should be highly detailed, describing every minute details, colours, lighting, so that the generated images are highly realistic. And the prompts should be such that it will help students understand the given subject and given topic in a even better way and the prompts should be relevant only to the given subject and the given topic. You have to generate only 2 such prompts.
Subject:
Topic:
Level:
Prompts: 
`;

const generateAction = async (req, res) => {
    
	const baseCompletion = await openai.createChatCompletion({
		model: "gpt-3.5-turbo",
        messages: [{"role": "system", "content": basePromptPrefix},
                    {"role": "user", "content": req.body.userInput}],
		temperature: 0.5,
		max_tokens: 1500,
	});

	const basePromptOutput = baseCompletion.data.choices[0].message.content;
	const myArray = basePromptOutput.split("\n");

    const responses = [];

    for (let i = 0; i < myArray.length; i++) {
        if(myArray[i].length > 50){
            const response = await openai.createImage({
                prompt: myArray[i],
                n: 1,
                size: "1024x1024",
            });
            responses.push(response.data.data.pop().url);
        }
    }

    res.status(200).json({ output: responses });
};

export default generateAction;