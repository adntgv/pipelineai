<script lang="ts">
	import Node from './node.svelte';

	let nodes = [
		{ id: 1, x: 100, y: 200, content: 'Node 1' },
		{ id: 2, x: 300, y: 400, content: 'Node 2' },
		{ id: 3, x: 500, y: 600, content: 'Node 3' }
	];

	function handleUpdateContent(id: any, newContent: any) {
		nodes = nodes.map((node) => {
			if (node.id === id) {
				return { ...node, content: newContent };
			}
			return node;
		});
	}
</script>

<div>
	{#each nodes as node}
		<Node {node} on:updateContent={(event) => handleUpdateContent(node.id, event.detail)} />
	{/each}
</div>
