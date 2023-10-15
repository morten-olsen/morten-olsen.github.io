<script>
	import Work from './work.svelte';
	export let resume;
</script>

<div class="resume">
	<Work work={resume.work} />
</div>

<style module>
	.resume {
		max-width: var(--max-width);
		width: 100%;
		margin: auto;
	}
</style>
