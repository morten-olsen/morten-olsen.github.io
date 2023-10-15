<script>
	import TopFeature from './top-feature.svelte';
	import Feature from './feature.svelte';
	import Article from './article.svelte';

	export let articles = [];
	const topFeatured = articles.slice(0, 1)[0];
	const featured = articles.slice(1, 4);
	const remaining = articles.slice(4, 12);
</script>

<div class="root">
	{#if topFeatured}
		<div class="top-featured">
			<TopFeature article={topFeatured} />
		</div>
	{/if}
	<div class="featured">
		{#each featured as article}
			<Feature {article} />
		{/each}
	</div>
	<div class="other">
		{#each remaining as article}
			<Article {article} />
		{/each}
	</div>
</div>

<style module>
	.root {
		width: 100%;
		max-width: var(--max-width);
		margin: auto;
	}
	.top-featured {
		display: flex;
		flex-wrap: wrap;
		margin: 0 auto;
		align-items: center;
		justify-content: center;
		width: 100%;
	}

	.featured {
		display: flex;
		flex-direction: row;
		margin: 0 auto;
		width: 100%;
		flex-wrap: wrap;
	}

	.other {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		margin: 0 auto;
		width: 100%;
	}
</style>
