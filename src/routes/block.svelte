<script lang="ts">
	import Card from '@smui/card';
	import LayoutGrid, { Cell } from '@smui/layout-grid';
	import LinearProgress from '@smui/linear-progress';

	import type { RunBlock } from './types';
	import BlockDetailsDialog from './blockDetailsDialog.svelte';
	import BlockEditor from './blockEditor.svelte';

	export let block: RunBlock;
</script>

<div class="run-block mdc-elevation-transition flexy-boy">
	<LayoutGrid>
		<Cell span={1} />
		<Cell span={10}>
			<BlockEditor {block} />
		</Cell>
	</LayoutGrid>

	{#if block.active}
		<LinearProgress indeterminate />
	{/if}
</div>
