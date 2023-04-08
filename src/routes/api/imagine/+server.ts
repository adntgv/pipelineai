import { json } from '@sveltejs/kit';
import replicate from 'node-replicate'

const image = 'prompthero/openjourney:9936c2001faa2194a261c01381f90e65261879985476014a0a37a334593a05eb'
const logo = "laion-ai/erlich:92fa143ccefeed01534d5d6648bd47796ef06847a6bc55c0e5c5b6975f2dcdfb"
export const POST = async (event) => {
    const { prompt } = await event.request.json();

    if (!prompt) {
        return json({ error: 'No input provided' });
    }

    const model = prompt.includes('logo') ? logo : image
 
    let result = await replicate.run(model, { prompt })

    return json({ result });
}
