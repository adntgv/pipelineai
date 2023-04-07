<script lang="ts">
	import Card from '@smui/card';
	import LayoutGrid, { Cell } from '@smui/layout-grid';
	import LinearProgress from '@smui/linear-progress';

	import type { RunBlock } from './types';

	export let block: RunBlock;
</script>

<div class="run-block mdc-elevation-transition flexy-boy">
	<Card>
		<LayoutGrid>
			<Cell span={2} />
			<Cell span={8}>
				<input bind:value={block.prompt} placeholder="Enter prompt" />
				<button
					on:click={() => {
						block.output = block.handler(block.prompt, block.input);
					}}>Next</button
				>
				{#if block.input}
					<p>Input: {block.input}</p>
				{/if}
				{#if block.output}
					<p>Output: {block.output}</p>
				{/if}
			</Cell>
		</LayoutGrid>

		{#if block.active}
			<LinearProgress indeterminate />
		{/if}
	</Card>
</div>
