import { json } from '@sveltejs/kit';

export const POST = async (event) => {
    const { prompt, message } = await event.request.json();

    const output = await fetch('https://api.devspace.kz/v1/chat/completion', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            prompt,
            message
        })
    }).then(async res => {
        const data = await res.json()
        console.log(data)

        return data
    });


    return json({ output });
}

