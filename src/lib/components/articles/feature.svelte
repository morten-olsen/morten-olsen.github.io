<script>
	import Img from '@zerodevx/svelte-img';
	import Color from '$lib/components/color.svelte';
	export let article;
</script>

<Color color={article.color}>
	<a href={article.url} class="root">
		<div class="img">
			<Img class="aside" src={article.thumbSet} alt={article.title} />
		</div>
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
		height: 400px;
		flex: 1;
		min-width: 200px;
		position: relative;
		margin: 15px;
		cursor: pointer;
		display: flex;
		flex-direction: column;

		@media only screen and (max-width: 700px) {
			max-height: 300px;
		}
	}

	.word {
		background: var(--primary);
		color: var(--primary-alt);
		line-height: 40px;
		font-family: 'Black Ops One', sans-serif;
		font-size: 25px;
		padding: 0 5px;
		margin: 5px 0;
	}

	.meta {
		top: 10px;
		left: 10px;
		right: 10px;
		display: flex;
		flex-wrap: wrap;
	}

	.img {
		flex: 1;
		overflow: hidden;
		position: relative;
	}

	.aside {
		background-size: cover;
		background-position: center;
		object-fit: cover;
		object-position: center;
		position: absolute;
		top: 0;
		bottom: 0;
		right: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}
</style>
