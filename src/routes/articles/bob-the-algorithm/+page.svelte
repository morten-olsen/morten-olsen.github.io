<script>
	import Article from '$lib/components/article/index.svelte';
	import Body from './article.svx';
	import image from './assets/cover.png?as=run';
</script>

<Article title="My day is being planned by an algorithm" color="#e7d9ac" {image}>
	<Body />
</Article>

<style>
	:global(:root) {
	}
</style>
