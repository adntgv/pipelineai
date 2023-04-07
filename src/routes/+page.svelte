<script lang="ts">
	import LayoutGrid, { Cell } from '@smui/layout-grid';
	import ApiKeyDialog from './apiKeyDialog.svelte';
	import Block from './block.svelte';
	import type { RunBlock } from './types';

	let handler = async (prompt: string, input: string): Promise<string> => {
		const data = await fetch('http://localhost:5173/api', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				prompt: prompt,
				message: input
			})
		});

        const response = await data.json();
		return response.output.response;
	};

	let blocks: RunBlock[] = [
		{ prompt: 'Hello', input: '', output: '', handler, active: false },
		{ prompt: 'Hello', input: '', output: '', handler, active: false }
	];

	let canRun = true;
	// Run the pipeline
	const runPipeline = async () => {
		canRun = true;
		for (let i = 0; i < blocks.length; i++) {
			if (!canRun) {
				break;
			}
			blocks[i].active = true;
			await new Promise((resolve) => setTimeout(resolve, 1000));
			blocks[i].output = await blocks[i].handler(blocks[i].prompt, blocks[i].input);
			if (i < blocks.length - 1) {
				blocks[i + 1].input = blocks[i].output;
			}
			blocks[i].active = false;

			if (!canRun) {
				break;
			}
		}
	};

	const addBlock = () => {
		blocks.push({ prompt: '', input: '', output: '', handler, active: false });
		blocks = blocks;
	};

	const stopPipeline = () => {
		canRun = false;
	};
</script>

<ApiKeyDialog />

<button on:click={() => runPipeline()}>Run Pipeline</button>
<button on:click={() => stopPipeline()}>Stop Pipeline</button>

<LayoutGrid>
	{#each blocks as block}
		<Cell>
			<Block {block} />
		</Cell>
	{/each}
	<Cell>
		<button on:click={() => addBlock()}>Add Block</button>
	</Cell>
</LayoutGrid>
