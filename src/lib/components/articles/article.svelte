<script>
	import Color from '$lib/components/color.svelte';
	import Img from '@zerodevx/svelte-img';
	export let article;
</script>

<Color color={article.color}>
	<a href={article.url} class="root">
		<Img class="aside" src={article.thumbSet} alt={article.title} />
		<div class="meta">
			{#each article.title.split(' ') as word}
				<span class="word">
					{word}
				</span>
			{/each}
		</div>
	</a>
</Color>

<style module>
	.root {
		position: relative;
		margin: 15px;
		cursor: pointer;
		display: flex;
		width: 220px;
		height: 200px;

		@media only screen and (max-width: 700px) {
			width: 100%;
		}
	}

	.word {
		line-height: 20px;
		font-size: 20px;
		padding: 5px 5px;
		font-family: 'Black Ops One', sans-serif;
		margin: 5px 0;
		background: var(--primary);
		color: var(--primary-alt);
	}

	.meta {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		padding: 10px;
		max-width: 220px;
		position: absolute;
	}

	.aside {
		background-size: cover;
		background-position: center;
		object-fit: cover;
		object-position: center;
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}
</style>
