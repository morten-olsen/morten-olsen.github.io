<script>
	import Img from '@zerodevx/svelte-img';
	export let article;
</script>

<a href={article.url} class="root">
	<Img class="aside" src={article.thumbSet} alt={article.title} />
	<div class="meta">
		<h2 class="title">{article.title}</h2>
		<p class="summary">{article.summary}</p>
	</div>
</a>

<style module>
	.root {
		height: 300px;
		width: 100%;
		position: relative;
		margin: 15px;
		cursor: pointer;
		display: flex;

		@media only screen and (max-width: 700px) {
			flex-direction: column;
			height: 500px;
		}
	}

	.root picture {
		display: contents;
	}

	.meta {
		display: flex;
		flex-direction: column;
		padding: 40px;
		flex: 1 0 0;
	}

	.aside {
		background-size: cover;
		background-position: center;
		object-fit: cover;
		object-position: center;
		flex: 1 0 0;
		height: 100%;

		@media only screen and (max-width: 700px) {
			width: 100%;
		}
	}

	.title {
		line-height: 40px;
		font-family: 'Black Ops One', sans-serif;
		font-size: 25px;
		padding: 0 5px;
		margin: 5px 0;
		color: var(--fg);
	}

	.summary {
		max-width: 300px;
		padding: 0 5px;
		margin: 5px 0;
		overflow: hidden;
		letter-spacing: 0.5px;
		line-height: 2.1rem;

		@media only screen and (max-width: 700px) {
			max-height: 100px;
		}
	}
</style>
