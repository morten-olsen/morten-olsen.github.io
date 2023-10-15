<script>
	import Article from '$lib/components/article/index.svelte';
	import Body from './article.svx';
	import image from './assets/cover.png?as=run';
</script>

<Article title="A meta talk about Git strategies" color="ff9922" {image}>
	<Body />
</Article>

<style>
	:global(:root) {
	}
</style>
