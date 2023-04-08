import { json } from '@sveltejs/kit';
import googleIt from 'google-it';

export const POST = async (event) => {
    const { search } = await event.request.json();

    console.log('search', search)
    try {
        const response = await googleIt({ 'query': search })

        return json({ response });
    } catch (error) {
        console.log(error);
        return json({ error });
    }
}
