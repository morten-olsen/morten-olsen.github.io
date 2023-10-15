<script>
	import Article from '$lib/components/article/index.svelte';
	import Body from './article.svx';
	import image from './assets/cover.png?as=run';
</script>

<Article title="How to hire engineers, by an engineer" color="#8bae8c" {image}>
	<Body />
</Article>

<style>
	:global(:root) {
	}
</style>
