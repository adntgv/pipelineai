<script lang="ts">
	import Card from '@smui/card';
	import LayoutGrid, { Cell } from '@smui/layout-grid';
	import LinearProgress from '@smui/linear-progress';

	import type { RunBlock } from './types';
	import BlockDetailsDialog from './blockDetailsDialog.svelte';

	export let block: RunBlock;
</script>

<div class="run-block mdc-elevation-transition flexy-boy">
	<Card>
		<LayoutGrid>
			<Cell span={1} />
			<Cell span={10}>
					<BlockDetailsDialog {block} />
			</Cell>
		</LayoutGrid>

		{#if block.active}
			<LinearProgress indeterminate />
		{/if}
	</Card>
</div>
