<!-- Node.svelte -->
<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let node: any = {
		id: 0,
		x: 0,
		y: 0,
		content: 'Node'
	};
	export let selected = false;

	const dispatch = createEventDispatcher();

	let isDragging = false;
	let dragStartX = 0;
	let dragStartY = 0;

	function handleMouseDown(event: any) {
		isDragging = true;
		dragStartX = event.clientX;
		dragStartY = event.clientY;
	}

	function handleMouseMove(event: any) {
		if (isDragging) {
			const deltaX = event.clientX - dragStartX;
			const deltaY = event.clientY - dragStartY;
			node.x += deltaX;
			node.y += deltaY;
			dragStartX = event.clientX;
			dragStartY = event.clientY;
		}
	}

	function handleMouseUp() {
		isDragging = false;
	}

	function handleDoubleClick() {
		const newContent = prompt('Enter new content:', node.content);
		if (newContent !== null) {
			dispatch('updateContent', newContent);
		}
	}
</script>

<div
	class="node {selected ? 'selected' : ''}"
	style="transform: translate({node.x}px, {node.y}px)"
	on:mousedown={handleMouseDown}
	on:mousemove={handleMouseMove}
	on:mouseup={handleMouseUp}
	on:dblclick={handleDoubleClick}
>
	{node.content}
</div>

<style>
	.node {
		position: absolute;
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100px;
		height: 50px;
		background-color: #fff;
		border: 1px solid #000;
		cursor: pointer;
		user-select: none;
		z-index: 1;
	}

	.node.selected {
		border-color: #f00;
		z-index: 2;
	}
</style>
