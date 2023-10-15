<script>
	/** @type {string|undefined} */
	export let bg = undefined;

	/** @type {string|undefined} */
	export let fg = undefined;

	/** @type {string|undefined} */
	export let primary = undefined;

	/** @type {string|undefined} */
	export let primaryAlt = undefined;
</script>

<div
	class="root"
	style:--bg={bg}
	style:--fg={fg}
	style:--primary={primary}
	style:--primary-alt={primaryAlt}
>
	<slot />
</div>

<style>
	.root {
		position: relative;
		min-height: 90vh;
		color: var(--fg);
		background: var(--bg);
	}
</style>
