<script lang="ts">
	import LayoutGrid, { Cell } from '@smui/layout-grid';
	import ApiKeyDialog from './apiKeyDialog.svelte';
	import Block from './block.svelte';
	import type { RunBlock } from './types';

	let handler = (prompt: string, input: string) => {
		return prompt + input;
	};

	let blocks: RunBlock[] = [
		{ prompt: 'Hello', input: '', output: '', handler, active: false },
		{ prompt: 'Hello', input: '', output: '', handler, active: false }
	];

	// Run the pipeline
	const runPipeline = async () => {
		for (let i = 0; i < blocks.length; i++) {
			blocks[i].active = true;
			await new Promise((resolve) => setTimeout(resolve, 1000));
            blocks[i].output = blocks[i].handler(blocks[i].prompt, blocks[i].input);
            if (i < blocks.length - 1) {
                blocks[i + 1].input = blocks[i].output;
            }
			blocks[i].active = false;
		}
	};
</script>

<ApiKeyDialog />

<LayoutGrid>
	{#each blocks as block}
		<Cell>
			<Block {block} />
		</Cell>
	{/each}
</LayoutGrid>

<button on:click={() => runPipeline()}>Run Pipeline</button>
