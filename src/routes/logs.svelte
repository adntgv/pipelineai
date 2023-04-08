<script lang="ts">
	export let logs: string[];
</script>

{#each logs as entry}
	<p>{entry}</p>
{/each}
