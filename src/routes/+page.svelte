<script lang="ts">
	import LayoutGrid, { Cell } from '@smui/layout-grid';
	import ApiKeyDialog from './apiKeyDialog.svelte';
	import Block from './block.svelte';
	import type { BlockHandler, RunBlock } from './types';
	import Button, { Group } from '@smui/button';

	let promptHandler: BlockHandler = async (prompt: string, input: string): Promise<string> => {
		const data = await fetch('http://localhost:5173/api/prompt', {
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

	let googlehandler: BlockHandler = async (input: string) => {
		const data = await fetch('http://localhost:5173/api/google', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				search: input
			})
		});

		const response = await data.json();
		return response.response;
	};

	let blocks: RunBlock[] = [
		{ prompt: '', input: '', output: '', handler: promptHandler, active: false, type: 'prompt' }
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

	const addBlock = (type: string) => {
		let newBlock: RunBlock;
		switch (type) {
			case 'prompt':
				newBlock = {
					prompt: '',
					input: '',
					output: '',
					handler: promptHandler,
					active: false,
					type: type
				};
				break;
			case 'google':
				newBlock = {
					prompt: '',
					input: '',
					output: '',
					handler: googlehandler,
					active: false,
					type: type
				};
				break;
			default:
				return;
		}

		blocks.push(newBlock);
		blocks = blocks;
	};

	const stopPipeline = () => {
		canRun = false;
	};

	const remove = (target: number) => {
		blocks = blocks.filter((_, index) => {
			return index != target;
		});
	};
</script>

<div style="display: flex; justify-content: stretch;">
	<Group style="margin: 0 auto;" variant="outlined">
		<ApiKeyDialog />

		<Button variant="outlined" on:click={() => runPipeline()}>Run Pipeline</Button>
		<Button variant="outlined" on:click={() => stopPipeline()}>Stop Pipeline</Button>
	</Group>
</div>
<LayoutGrid>
	{#each blocks as block, index}
		<Cell span={3}>
			<Button
				on:click={() => {
					remove(index);
				}}>remove</Button
			>
			<Block {block} />
		</Cell>
	{/each}
	<Cell span={1}>
		<Button on:click={() => addBlock('prompt')}>+ Prompt</Button>
		<Button on:click={() => addBlock('google')}>+ google</Button>
	</Cell>
</LayoutGrid>
