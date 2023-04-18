import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { Configuration, OpenAIApi } from "openai";
import { get_encoding, encoding_for_model } from "@dqbd/tiktoken";


export const POST = async (event) => {
    try {
        let { prompt, message } = await event.request.json();
        const configuration = new Configuration({
            // api key from sveltekit environment variable
            apiKey: env.OPENAI_API_KEY
        });
        const openai = new OpenAIApi(configuration);

        if (tooLong(prompt + message)) { 
            let chunks = getChunks(message);
            let summaries: string[] = [];

            for (let chunk of chunks) { 
                const summary = await summarize(openai, chunk);
                summaries.push(summary);
            }

            message = await summarize(openai, summaries.join(" "));
        }
 
        const completion = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    "content": message,
                    "role": "user"
                },
                {
                    "content": prompt,
                    "role": "system"
                }
            ]
        });

        return json({ output: completion.data.choices[0].message?.content });

    } catch (error) {
        console.log(error);
        return json({ error });
    }
}


const tooLong = (request: string, forResponse: number = 1024): boolean => {
    const enc = encoding_for_model("gpt-3.5-turbo");
    const data = enc.encode(request)

    return data.length + forResponse > 4096
}

const tokenize = (request: string): number => {
    const enc = encoding_for_model("gpt-3.5-turbo");
    const data = enc.encode(request)

    return data.length
}

const getChunks = (request: string, forResponse: number = 1024): string[] => {
    const enc = encoding_for_model("gpt-3.5-turbo");
    let data = enc.encode(request)

    const chunks = [];

    while (data.length > 0) {
        const chunk = data.slice(0, 4096 - forResponse)
        data = data.slice(4096 - forResponse, data.length)
        const part = new TextDecoder().decode(enc.decode(chunk))
        chunks.push(part);
    }

    return chunks;
}

async function summarize(openai: OpenAIApi, chunk: string): Promise<string> {
    const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
            {
                "content": chunk,
                "role": "user"
            },
            {
                "content": "summarize",
                "role": "system"
            }
        ]
    });

    return completion.data.choices[0].message?.content ?? "";
}
