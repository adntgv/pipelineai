<script lang="ts">
	import LayoutGrid, { Cell } from '@smui/layout-grid';
	import ApiKeyDialog from './apiKeyDialog.svelte';
	import Block from './block.svelte';
	import type { BlockHandler, Pipeline, RunBlock } from './types';
	import Button, { Group, Icon, Label } from '@smui/button';
	import Drawer, { AppContent, Content } from '@smui/drawer';
	import List, { Item, Text } from '@smui/list';
	import Textfield from '@smui/textfield';
	import Card from '@smui/card/src/Card.svelte';
	import { onMount } from 'svelte';
	import handlers from './handlers';
	import Actions from '@smui/card/src/Actions.svelte';
	import IconButton from '@smui/icon-button';

	const defaultPrompt =
		'You are helpful AI. Respod only in JSON format! No need for additional information. You respond only with useful content formatted as json. If you have a list of items, return them only as json array';

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
			blocks[i].output = await handlers.getHandler(blocks[i].handler)(
				blocks[i].prompt,
				blocks[i].input
			);
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
					prompt: defaultPrompt,
					input: '',
					output: '',
					handler: type,
					active: false,
					type: type
				};
				break;
			case 'google':
				newBlock = {
					prompt: '',
					input: '',
					output: '',
					handler: type,
					active: false,
					type: type
				};
				break;
			case 'crawl':
				newBlock = {
					prompt: '',
					input: '',
					output: '',
					handler: type,
					active: false,
					type: type
				};
				break;
			case 'imagine':
				newBlock = {
					prompt: '',
					input: '',
					output: '',
					handler: type,
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

	const moveUp = (index: number) => {
		if (index > 0) {
			const temp = blocks[index - 1];
			blocks[index - 1] = blocks[index];
			blocks[index] = temp;
			blocks = blocks;
		}
	};

	const moveDown = (index: number) => {
		if (index < blocks.length - 1) {
			const temp = blocks[index + 1];
			blocks[index + 1] = blocks[index];
			blocks[index] = temp;
			blocks = blocks;
		}
	};

	let pipelines: Pipeline[] = [
		{
			name: 'Post ideas',
			blocks: [
				{
					prompt: '',
					input: 'https://devspace.kz',
					output: '',
					handler: 'crawl',
					active: false,
					type: 'crawl'
				},
				{
					prompt: 'Explain what that is this site about',
					input: '',
					output: '',
					handler: 'prompt',
					active: false,
					type: 'prompt'
				},
				{
					prompt:
						'Generate post ideas for that website that would be interesting for the potential target audience. Return the list as the ',
					input: '',
					output: '',
					handler: 'prompt',
					active: false,
					type: 'prompt'
				}
			]
		},
		{
			name: 'Post image',
			blocks: [
				{
					prompt:
						'Based on provided input about blog post, generate idea of one image that could be used as a cover. Only generate one idea. And describe what should be on that image as thoroughly as possible',
					input: '',
					output: '',
					handler: 'prompt',
					active: false,
					type: 'prompt'
				},
				{ prompt: '', input: '', output: '', handler: 'imagine', active: false, type: 'imagine' }
			]
		},
		{
			name: 'Default',
			blocks: [
				{
					prompt: defaultPrompt,
					input: '',
					output: '',
					handler: 'prompt',
					active: false,
					type: 'prompt'
				}
			]
		}
	];

	let editingPipelineName = -1;
	let currentPipeline = 0;

	let blocks: RunBlock[] = pipelines[currentPipeline].blocks;

	const addPipeline = () => {
		const newPipeline: Pipeline = {
			name: 'New Pipeline',
			blocks: [
				{
					prompt: defaultPrompt,
					input: '',
					output: '',
					handler: 'prompt',
					active: false,
					type: 'prompt'
				}
			]
		};

		pipelines.push(newPipeline);
		pipelines = pipelines;
	};

	let debug = true;

	let jsonBlocks = JSON.stringify(blocks);

	const savePipeline = () => {
		pipelines[currentPipeline].blocks = blocks;
		localStorage.setItem('pipelines', JSON.stringify(pipelines));
	};

	const importPipeline = (jsonString: string) => {
		const newPipeline = JSON.parse(jsonString);
		pipelines[currentPipeline].blocks = newPipeline;
		blocks = newPipeline;
		pipelines = pipelines;
	};

	onMount(() => {
		const stored = localStorage.getItem('pipelines');
		if (stored) {
			pipelines = JSON.parse(stored);
			blocks = pipelines[0].blocks;
		} else {
			localStorage.setItem('pipelines', JSON.stringify(pipelines));
		}
	});
</script>

<div class="drawer-container">
	<Drawer>
		<Content>
			<div>
				<IconButton class="material-icons" on:click={() => addPipeline()}>add</IconButton>
			</div>
			<List>
				{#each pipelines as pipeline, index}
					<Item
						href="javascript:void(0)"
						on:click={() => {
							blocks = pipelines[index].blocks;
							currentPipeline = index;
							jsonBlocks = JSON.stringify(blocks);
						}}
					>
						{#if editingPipelineName === index}
							<IconButton
								size="button"
								class="material-icons"
								on:click={() => (editingPipelineName = -1)}>save</IconButton
							>
							<Textfield style="width: 100%;" bind:value={pipeline.name} label="name" />
						{:else}
							<IconButton
								size="button"
								class="material-icons"
								on:click={() => (editingPipelineName = index)}>edit</IconButton
							>
							<IconButton
								size="button"
								class="material-icons"
								on:click={() => {
									if (index == pipelines.length - 1) {
										currentPipeline = 0;
									}
									pipelines = pipelines.filter((_, i) => i != index);
								}}>delete</IconButton
							>
							<Text>{pipeline.name}</Text>
						{/if}
					</Item>
				{/each}
			</List>
		</Content>
	</Drawer>

	<AppContent class="app-content">
		<main class="main-content">
			<div
				style="display: flex; justify-content: space-between; align-items: center; padding: 10px;"
			>
				<Group style="margin: 0 auto;" variant="outlined">
					<Button disabled>{pipelines[currentPipeline].name}</Button>
					<!-- <ApiKeyDialog /> -->
					<IconButton class="material-icons" on:click={() => runPipeline()}>play_arrow</IconButton>
					<IconButton class="material-icons" on:click={() => stopPipeline()}>stop</IconButton>
					<IconButton class="material-icons" on:click={() => savePipeline()}>save</IconButton>
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
									<Button on:click={() => moveUp(index)} disabled={index === 0}>Up</Button>
									<Button on:click={() => moveDown(index)} disabled={index === blocks.length - 1}>
										Down
									</Button>
									<Button
										on:click={() => {
											remove(index);
										}}>remove</Button
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
	</AppContent>
</div>

<style>
	/* These classes are only needed because the
	  drawer is in a container on the page. */
	.drawer-container {
		position: relative;
		display: flex;
		height: 98vh;
		border: 1px solid var(--mdc-theme-text-hint-on-background, rgba(0, 0, 0, 0.1));
		overflow: hidden;
		z-index: 0;
	}

	* :global(.app-content) {
		flex: auto;
		overflow: auto;
		position: relative;
		flex-grow: 1;
	}

	.main-content {
		overflow: auto;
		padding: 16px;
		height: 100%;
		box-sizing: border-box;
	}
</style>
