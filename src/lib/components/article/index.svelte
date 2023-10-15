<script>
	import Color from '$lib/components/color.svelte';
	import Title from './title.svelte';
	import Content from './content.svelte';
	import Img from './image.svelte';
	export let title = '[Title]';
	export let author = 'Morten Olsen';
	export let color;

	/** @type {string} */
	export let image;
</script>

<svelte:head>
	<title>{title} by {author}</title>
</svelte:head>
<Color {color}>
	<div class="root">
		<article class="article">
			<Title {title} {author} />
			<Content>
				<slot />
			</Content>
			<Img {image} />
		</article>
	</div>
</Color>

<style module>
	.root {
		background-color: var(--bg);
		display: flex;
		height: 100%;
		min-height: 100vh;
		overflow: auto;
		color: var(--fg);
	}
	.article {
		margin-right: 40%;
		max-width: 700px;
		width: 100%;
		position: absolute;
		right: 0;

		@media only screen and (max-width: 900px) {
			margin-right: 0;
		}
	}
</style>
