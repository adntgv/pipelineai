<script lang="ts">
	import Button, { Group } from '@smui/button';

	import LayoutGrid, { Cell } from '@smui/layout-grid';
	import LinearProgress from '@smui/linear-progress';
	import Textfield from '@smui/textfield';
	import type { RunBlock } from './types';
	import handlers from './handlers';
	import { Text } from '@smui/list';

	export let block: RunBlock;

	function getLinks(text: string): string[] {
		//extract urls from text ending in jpg, png, or gif

		const urls = text.match(/https?:\/\/[^\s]+?\.(?:jpg|png|gif)/g);

		if (!urls) return [];
		return urls;
	}

	function validBlock(block: RunBlock): boolean {
		// all block fields are usable
		return (
			block !== undefined &&
			block.type !== undefined &&
			block.handler !== undefined &&
			block.input !== undefined &&
			block.output !== undefined
		);
	}
</script>

{#if validBlock(block)}
	<LayoutGrid>
		<Cell span={12}>
			<p>Type: {block.type}</p>
		</Cell>
		{#if block.type == 'prompt'}
			<Cell span={12}>
				<Textfield style="width: 100%;" textarea bind:value={block.prompt} label="prompt" />
			</Cell>
		{/if}
		<Cell span={12}>
			<Textfield style="width: 100%;" bind:value={block.input} label="input" />
		</Cell>
		<Cell span={12}>
			<Group>
				<Button
					on:click={async () => {
						block.active = true;

						block.output = await handlers.getHandler(block.handler)(block.prompt, block.input);
						block.active = false;
					}}
				>
					Run
				</Button>
				<Button
					on:click={async () => {
						block.output = '';
					}}
				>
					reset
				</Button>
			</Group>
		</Cell>
		<Cell span={12}>
			{#if block.active}
				<LinearProgress indeterminate />
			{/if}
			<div>
				{#if block.type == 'crawl'}
					Output: {block.output.slice(0, 100)}...
				{:else}
					Output: {#each block.output.split('\n').filter((line) => line !== '<div></div>') as line}
						<div>{line}</div>
					{/each}
				{/if}
			</div>
			{#if block.type == 'imagine' && block.output}
				{#each getLinks(block.output) as image}
					<!-- svelte-ignore a11y-missing-attribute -->
					<img src={image} />
				{/each}
			{/if}
		</Cell>
	</LayoutGrid>
{/if}
