import { json, text } from '@sveltejs/kit';
import fetch from 'node-fetch';


export const POST = async (event) => {
    const { url } = await event.request.json();

    const response = await fetch(url);
    const body = await response.text(); 
    return text(body)
}
