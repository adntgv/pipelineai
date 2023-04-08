<script lang="ts">
	import Dialog, { Title, Content, Actions } from '@smui/dialog';
	import Button, { Label } from '@smui/button';
	import Textfield from '@smui/textfield';

	import type { RunBlock } from './types';
	import LayoutGrid from '@smui/layout-grid/src/LayoutGrid.svelte';
	import Cell from '@smui/layout-grid/src/Cell.svelte';
	import LinearProgress from '@smui/linear-progress';
	import Group from '@smui/button/src/Group.svelte';
	import BlockEditor from './blockEditor.svelte';

	export let block: RunBlock;
	let open = true;
</script>

<Dialog bind:open aria-labelledby="simple-title" aria-describedby="simple-content">
	<!-- Title cannot contain leading whitespace due to mdc-typography-baseline-top() -->
	<Title id="simple-title">Block details</Title>
	<Content id="simple-content">
		<BlockEditor {block} />
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
