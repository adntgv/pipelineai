
export type BlockHandler =  (prompt: string, input: string) => string;

export type RunBlock = {
    prompt: string;
    input: string;
    output: string;
    active: boolean;
    handler: any;
};

