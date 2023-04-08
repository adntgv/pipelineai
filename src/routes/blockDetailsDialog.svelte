<script lang="ts">
	import Dialog, { Title, Content, Actions } from '@smui/dialog';
	import Button, { Label } from '@smui/button';
	import Textfield from '@smui/textfield';

	import type { RunBlock } from './types';
	import LayoutGrid from '@smui/layout-grid/src/LayoutGrid.svelte';
	import Cell from '@smui/layout-grid/src/Cell.svelte';
	import LinearProgress from '@smui/linear-progress';
	import Group from '@smui/button/src/Group.svelte';

	export let block: RunBlock;
	let open = false;
</script>

<Dialog bind:open aria-labelledby="simple-title" aria-describedby="simple-content">
	<!-- Title cannot contain leading whitespace due to mdc-typography-baseline-top() -->
	<Title id="simple-title">Block details</Title>
	<Content id="simple-content">
		<LayoutGrid>
			<Cell span={12}>
				<Textfield bind:value={block.input} label="input" />
			</Cell>
			{#if block.type == 'prompt'}
				<Cell span={12}>
					<Textfield textarea bind:value={block.prompt} label="prompt" />
				</Cell>
			{/if}
			<Cell span={12}>
				<Group>
					<Button
						on:click={async () => {
							block.active = true;
							block.output = await block.handler(block.prompt, block.input);
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
				<p>Output: {block.output}</p>
			</Cell>
		</LayoutGrid>
	</Content>

	<Actions>
		<Button>
			<Label>close</Label>
		</Button>
	</Actions>
</Dialog>

<div>
	<p>Block type: {block.type}</p>

	<Button on:click={() => (open = true)}>
		<Label>Details</Label>
	</Button>
</div>
