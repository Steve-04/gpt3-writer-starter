import { OpenAI } from "openai-streams";

const basePromptPrefix = 
`
Prepare a detailed table of contents for the given subject on the given topic for a person who is of the given level in the topic. The table of contents should contain all the important points on the given topic. The table of contents should be enough for someone preparing for a big exam. Take the table of contents and generate a very detailed study material. Give a very detailed explanation for each of the topics and their sub-topics. Give the respective heading before explaining each topic. The study material should be followed by questions and answers on the given topic. At the end of the study material give resources for further learning.
Subject:
Topic:
Level:
Study material:
`
;

export default async function handler(req) {

    const body = await req.json();
    const prompt = body.prompt;
    const stream = await OpenAI(
        "chat",
        {
        model: "gpt-3.5-turbo",
        messages: [{"role": "system", "content": basePromptPrefix},
                    {"role": "user", "content": prompt}],
        temperature: 0.5,
        max_tokens: 3000
        }
    );

    return new Response(stream);
}

export const config = {
  runtime: "edge"
};