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
	import Dialog, { Title } from '@smui/dialog';
	import LinearProgress from '@smui/linear-progress';

	const defaultPrompt =
		'You are helpful AI. Respod only in JSON format! No need for additional information. You respond only with useful content formatted as json. If you have a list of items, return them only as json array';

	let piplineGeneratorPrompt = '';
	let generatedPipeline = '';
	let generating = false;
	let open = false;
	let canRun = true;
	let tutorial = true;
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
						'Generate post ideas for that website that would be interesting for the potential target audience. Only return ideas, without any additional text',
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

	const generatePipeline = async (input: string) => {
		let prompt = `You are an expert in automation. 
		You can create a pipeline of AI blocks. 
		Each block will take the output of the previous block and use it as input. 
		You can create a pipeline of any length. 
		You can use any block type as many times as you want. 
		You can use any block type as input for any other block type. 
		You can use any block type as output for any other block type.
		You can use any block type as input and output for any other block type.

		there are 4 block types:
		1. Prompt - user can setup 'prompt' and 'input' for this block. You can use this block to get a response from a GPT-3 model
		2. Google - you can search google with 'input' and get a response. 
		3. Crawl - you can crawl a website specified in 'input' and get page html. 
		4. Imagine - you can send 'input' descrupbing image to an image generator and get an image.


		
		example pipelines:
		1. generate website posts ideas: [{"prompt":"","input":"https://devspace.kz","output":"","handler":"crawl","active":false,"type":"crawl"},{"prompt":"Explain what that is this site about","input":"","output":"","handler":"prompt","active":false,"type":"prompt"},{"prompt":"Generate post ideas for that website that would be interesting for the potential target audience. Only return ideas, without any additional text","input":"","output":"","handler":"prompt","active":false,"type":"prompt"}]
		2. generate image from post title:  [{"prompt":"Based on provided input about blog post, generate idea of one image that could be used as a cover. Only generate one idea. And describe what should be on that image as thoroughly as possible","input":"","output":"","handler":"prompt","active":false,"type":"prompt"},{"prompt":"","input":"","output":"","handler":"imagine","active":false,"type":"imagine"}]
		
		You should return only pipeline json.
		Do not return any additional text.
		Do not describe the pipeline. Just return the pipeline json.

		'prompt' field in the block is a prompt for GPT-3 model. Do not use it for asking questions to the user.
		'active' should be set to false for all blocks. It is used to show which block is currently active.
		`;
		generating = true;
		return await handlers.promptHandler(prompt, input).finally(() => {
			generating = false;
		});
	};

	const applyGeneratedPipeline = (generated: string) => {
		let newBlocks = JSON.parse(generated);
		addPipeline();
		pipelines[pipelines.length - 1].blocks = newBlocks;
		pipelines = pipelines;
		currentPipeline = pipelines.length - 1;
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
				<Title>Pipelines</Title>
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
			<Group style="margin: 0 auto;" variant="outlined">
				<Button variant="outlined" on:click={() => addPipeline()}>add</Button>
				<Button variant="outlined" on:click={() => (open = true)}>
					<Label>generate</Label>
				</Button>
			</Group>
		</Content>
	</Drawer>

	<AppContent class="app-content">
		<main class="main-content">
			<Title>{pipelines[currentPipeline].name}</Title>

			<div
				style="display: flex; justify-content: space-between; align-items: center; padding: 10px;"
			>
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
	</AppContent>
</div>

<Dialog bind:open aria-labelledby="simple-title" aria-describedby="simple-content">
	<!-- Title cannot contain leading whitespace due to mdc-typography-baseline-top() -->
	<Title id="simple-title">New Pipeline generator</Title>
	<Content id="simple-content">
		<LayoutGrid>
			<Cell span={1} />
			<Cell span={10}>
				<Textfield
					textarea
					style="width:100%; height:fit-content"
					bind:value={piplineGeneratorPrompt}
					label="what do you want to accomplish?"
				/>
			</Cell>
			<Cell span={1} />
			<Cell span={1}>
				<Button
					on:click={async () => {
						generatedPipeline = await generatePipeline(piplineGeneratorPrompt);
					}}
				>
					<Label>generate</Label>
				</Button>
			</Cell>
			<Cell span={11} />
			<Cell span={12}>
				{#if generating}
					<LinearProgress indeterminate />
				{/if}
			</Cell>
			<Cell span={1} />
			<Cell span={10}>
				<Textfield
					textarea
					style="width:100%; height:fit-content"
					bind:value={generatedPipeline}
					label="new pipeline"
				/>
			</Cell>
			<Cell span={1} />
			<Cell span={1}>
				<Button
					on:click={async () => {
						applyGeneratedPipeline(generatedPipeline);
					}}
				>
					<Label>apply</Label>
				</Button>
			</Cell>
			<Cell span={11} />
		</LayoutGrid>
	</Content>

	<Actions>
		<Button
			on:click={() => {
				open = false;
			}}
		>
			<Label>close</Label>
		</Button>
	</Actions>
</Dialog>

<Dialog bind:open={tutorial} aria-labelledby="simple-title" aria-describedby="simple-content">
	<!-- Title cannot contain leading whitespace due to mdc-typography-baseline-top() -->
	<Title id="simple-title">How to use</Title>
	<Content id="simple-content">
		<div class="tutorial" style="padding:0 20px">
			<h5>What is this</h5>
			<p>
				This app allows users to create pipelines of AI blocks that can be used to automate tasks.
				Users can add different types of blocks, such as prompts, Google searches, website crawls,
				and image generators, and connect them in any order to create a custom pipeline. The app
				also allows users to save and manage multiple pipelines, and provides a generator to help
				users create new pipelines based on their specific needs.
			</p>
			<p>
				This app could be useful for anyone who needs to automate a series of tasks that involve
				processing data or information. For example, a content marketer could use this app to
				generate ideas for blog posts by crawling websites and using GPT-3 to generate prompts. A
				data analyst could use this app to automate data collection and analysis by crawling
				websites and using Google search. The app would help these users save time and effort by
				automating repetitive tasks and allowing them to focus on higher-level tasks that require
				human input and decision-making.
			</p>

			<h5>How to use the pipeline generator</h5>
			<p>To use the pipeline generator, follow these steps:</p>
			<ul>
				<li>Create a new pipeline or select an existing one from the list.</li>
				<li>
					Add blocks to the pipeline by clicking on the corresponding buttons. There are four types
					of blocks: prompt, google, crawl, and imagine.
				</li>
				<li>Configure each block by entering the necessary information in the input fields.</li>
				<li>Arrange the blocks in the desired order by using the up and down arrow buttons.</li>
				<li>
					Run the pipeline by clicking on the "play" button. The output of each block will be passed
					as input to the next block in the pipeline.
				</li>
				<li>Save the pipeline by clicking on the "save" button.</li>
				<li>
					If you want to import or export a pipeline, use the JSON editor at the bottom of the page.
				</li>
				<li>
					To generate a new pipeline based on a specific goal, click on the "generate" button and
					enter a prompt. The generator will create a new pipeline based on your input.
				</li>
			</ul>
		</div>
	</Content>
</Dialog>

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

	.tutorial {
		background-color: var(--mdc-theme-primary);
	}
</style>
