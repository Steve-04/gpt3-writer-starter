import { OpenAI } from "openai-streams";

const basePromptPrefix = 
`
Prepare a detailed table of contents for the given subject on the given topic for a person who is of the given level in the topic and the table of contents should be in the given language. The table of contents should contain all the important points on the given topic in the given language. The table of contents should be enough for someone preparing for a big exam. Take the table of contents and generate a very detailed study material in the given language. Give a very detailed explanation for each of the topics and their sub-topics in the given language. Give the respective heading in the given language before explaining each topic. The study material should be followed by questions and answers on the given topic in the given language. At the end of the study material give resources for further learning. All the output should be in the given language only without any grammatical or spelling mistakes.
Subject:
Topic:
Level:
Language:
Study material:
`
;

export default async function handler(req) {
  
    //console.log("got here");
    const body = await req.json();
    //console.log(body);
    const stream = await OpenAI(
        "completions",
        {
        model: "text-davinci-003",
        prompt: `${basePromptPrefix}${body.prompt}`,
        temperature: 0.5,
        max_tokens: 3000
        }
    );

    return new Response(stream);
}

export const config = {
  runtime: "edge"
};