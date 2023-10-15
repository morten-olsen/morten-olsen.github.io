<script>
	import Article from '$lib/components/article/index.svelte';
	import Body from './article.svx';
	import image from './assets/cover.png?as=run';
</script>

<Article title="My home runs redux" color="green" {image}>
	<Body />
</Article>

<style>
	:global(:root) {
	}
</style>
