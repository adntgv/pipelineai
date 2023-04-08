import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { Configuration, OpenAIApi } from "openai";


export const POST = async (event) => {
    try {
        const { prompt, message } = await event.request.json();
        const configuration = new Configuration({
            // api key from sveltekit environment variable
            apiKey: env.OPENAI_API_KEY
        });
        const openai = new OpenAIApi(configuration);

        console.log(prompt, message)
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

        console.log(completion.data.choices[0].message?.content);

        return json({ output: completion.data.choices[0].message?.content });

    } catch (error) {
        console.log(error);
        return json({ error });
    }
}