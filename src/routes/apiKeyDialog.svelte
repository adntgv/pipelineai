<script lang="ts">
	import Dialog, { Title, Content, Actions } from '@smui/dialog';
	import Button, { Label } from '@smui/button';

	let apiKey: string;
	let open = false;
</script>

<Dialog bind:open aria-labelledby="simple-title" aria-describedby="simple-content">
	<!-- Title cannot contain leading whitespace due to mdc-typography-baseline-top() -->
	<Title id="simple-title">OpenAI API Key</Title>
	<Content id="simple-content">
		<label for="api-key">API Key</label>
		<input type="text" id="api-key" bind:value={apiKey} />
	</Content>

	<Actions>
		<Button on:click={() => localStorage.setItem('apiKey', apiKey)}>
			<Label>Save</Label>
		</Button>
	</Actions>
</Dialog>

<Button variant="outlined" on:click={() => (open = true)}>
	<Label>Set API Key</Label>
</Button>
