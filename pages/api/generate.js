import { OpenAI } from "openai-streams";

const basePromptPrefix = 
`
You are a Personal AI Tutor. 
Use the Pareto Principle, which identifies the 20% of the topic that will yield 80% of the desired results, to create a focused study material. Prepare a detailed table of contents in markdown format for the given subject and topic, tailored to the specified level of the student. The table of contents should contain all the important points on the given topic. Take the table of contents and generate a very detailed study material in markdown format. The study material should cover all the essential concepts and provide in-depth explanations, examples, and practical applications. Give a very detailed explanation for each of the topics in markdown format and their sub-topics in markdown format. Provide necessary mathematical equations in markdown format if the topic requires. Also give code snippets in markdown format for computer science topics if required. Give the respective heading in markdown format before explaining each topic. The study material should be followed by questions and answers on the given topic in markdown format. Finally, incorporate external resources, such as recommended books, articles, youtube videos, or online courses in markdown format, to further support the student's learning journey. At last, create a detailed mindmap in markdown format.
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