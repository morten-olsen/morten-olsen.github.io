<script>
	import { slide } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';

	export let title = '[Title]';
	export let author = 'Morten Olsen';
</script>

<header class="title" transition:slide={{ delay: 250, duration: 300, easing: quintOut, axis: 'x' }}>
	<h1 class="jumbo">
		{#each title.split(' ') as word}
			<span class="word">
				{word}
			</span>
		{/each}
	</h1>
	<a class="author" href="/">
		by {author}
	</a>
</header>

<style module>
	.title {
		animation: slide-up 0.4s ease-out;
		display: block;
		padding: 5rem 2rem;
		margin-top: 10rem;
		min-height: 100%;
		@media only screen and (max-width: 900px) {
			z-index: 1;
			padding-bottom: 2rem;
		}
	}

	.title h1 {
		display: flex;
		align-items: flex-end;
		flex-wrap: wrap;
	}

	.word {
		font-size: 4rem;
		line-height: 4.1rem;
		display: inline-block;
		padding: 0 15px;
		text-transform: uppercase;
		margin: 10px;
		font-family: 'Black Ops One', sans-serif;
		background: var(--primary);
		color: var(--primary-alt);
		@media only screen and (max-width: 900px) {
			z-index: 1;
			font-size: 2.5rem;
			line-height: 3.1rem;
		}
		@media only screen and (max-width: 700px) {
			padding: 5px;
			font-size: 2rem;
			line-height: 2.1rem;
		}
	}

	.author {
		text-transform: uppercase;
		font-family: 'Black Ops One', sans-serif;
		font-size: 2rem;
		margin: 1rem;
		display: inline-block;
		position: relative;
		background: var(--bg);
		text-decoration: none;
		color: var(--fg);
	}
	.author:after {
		content: '';
		border-bottom: solid 15px var(--primary);
		display: block;
		width: 100%;
		height: 5px;
		bottom: -2px;
		z-index: -1;
		position: absolute;
	}
</style>
