
export type BlockHandler = (prompt: string, input: string) => Promise<string>;

export type RunBlock = {
    prompt: string;
    input: string;
    output: string;
    active: boolean;
    handler: string;
    type: string;
};

