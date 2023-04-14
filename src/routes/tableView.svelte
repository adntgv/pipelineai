<script lang="ts">
	import Button, { GroupItem, Icon, Label } from '@smui/button';
	import { Actions, Title } from '@smui/dialog';
	import { Group } from '@smui/list';
	import type { Pipeline, RunBlock } from './types';
	import LayoutGrid, { Cell } from '@smui/layout-grid';
	import Card from '@smui/card';
	import IconButton from '@smui/icon-button';
	import Block from './block.svelte';
	import Textfield from '@smui/textfield';

	export let currentPipeline = 0;
	export let pipelines: Pipeline[] = [];
	export let blocks: RunBlock[] = [];

	export let addBlock = (type: string) => {};
	export let moveUp = (index: number) => {};
	export let moveDown = (index: number) => {};
	export let savePipeline = () => {};
	export let runPipeline = () => {};
	export let importPipeline = (pipeline: any) => {};

	export let debug = false;
	export let remove = (index: number) => {};
	export let jsonBlocks: any = '';
</script>

<main class="main-content">
	<Title>{pipelines[currentPipeline].name}</Title>

	<div style="display: flex; justify-content: space-between; align-items: center; padding: 10px;">
		<Group style="margin: 0 auto;" variant="outlined">
			<!-- <ApiKeyDialog /> -->
			<Button variant="outlined" on:click={() => runPipeline()}>
				<Icon class="material-icons">play_arrow</Icon>
				<Label>run pipeline</Label>
			</Button>
			<!-- <Button variant="outlined" on:click={() => stopPipeline()}>stop</Button> -->
			<Button variant="outlined" on:click={() => savePipeline()}>save</Button>
		</Group>
		<Group style="margin: 0 auto;" variant="outlined">
			<Button variant="outlined" on:click={() => addBlock('prompt')}>+ Prompt</Button>
			<Button variant="outlined" on:click={() => addBlock('google')}>+ Google</Button>
			<Button variant="outlined" on:click={() => addBlock('crawl')}>+ Crawl</Button>
			<Button variant="outlined" on:click={() => addBlock('imagine')}>+ Imagine</Button>
		</Group>
	</div>
	<LayoutGrid>
		{#each blocks as block, index}
			<Cell span={2} />

			<Cell span={8}>
				<Card>
					<Actions>
						<Group>
							<IconButton
								class="material-icons"
								size="button"
								on:click={() => moveUp(index)}
								disabled={index === 0}>arrow_upward</IconButton
							>
							<IconButton
								class="material-icons"
								size="button"
								on:click={() => moveDown(index)}
								disabled={index === blocks.length - 1}
							>
								arrow_downward
							</IconButton>
							<IconButton
								class="material-icons"
								size="button"
								on:click={() => {
									remove(index);
								}}>delete</IconButton
							>
						</Group>
					</Actions>
					<Block {block} />
					<br />
				</Card>
			</Cell>
			<Cell span={2} />
		{/each}
	</LayoutGrid>
	{#if debug}
		<Textfield style="width:100%; height:fit-content" textarea bind:value={jsonBlocks} />
		<Button on:click={() => importPipeline(jsonBlocks)}>Import</Button>
	{/if}
</main>
