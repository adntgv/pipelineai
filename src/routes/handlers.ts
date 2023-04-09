import type { BlockHandler } from "./types";

const host = '';

let promptHandler: BlockHandler = async (prompt: string, input: string): Promise<string> => {
    const data = await fetch(host + '/api/prompt', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            prompt: prompt,
            message: input
        })
    })
        .then((data) => data.json())
        .catch((err) => {
            console.log(err);
            return {
                error: 'Something went wrong'
            };
        });

    const response = await data;
    return response.output;
};

let googlehandler: BlockHandler = async (_, input: string) => {
    const data = await fetch(host + '/api/google', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            search: input
        })
    })
        .then((data) => data.json())
        .catch((err) => {
            console.log(err);
            return {
                error: 'Something went wrong'
            };
        });

    return data.text();
};

let crawlhandler: BlockHandler = async (_, url: string) => {
    const data = await fetch(host + '/api/crawl', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            url
        })
    })
        .then((data) => data.text())
        .catch((err) => {
            console.log(err);
            return {
                error: 'Something went wrong'
            };
        });
    
        console.log(data)
    return await data.toString();
};

let imaginehandler: BlockHandler = async (_, input: string) => {
    const data = await fetch(host + '/api/imagine', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            prompt: input
        })
    })
        .then((data) => data.text())
        .catch((err) => {
            console.log(err);
            return {
                error: 'Something went wrong'
            };
        });

    return data.toString();
};

const getHandler = (name: string): any => {
    switch (name) {
        case 'prompt':
            return promptHandler;
        case 'google':
            return googlehandler;
        case 'crawl':
            return crawlhandler;
        case 'imagine':
            return imaginehandler;
        default:
            return promptHandler;
    }
};

export default { promptHandler, googlehandler, crawlhandler, imaginehandler, getHandler }