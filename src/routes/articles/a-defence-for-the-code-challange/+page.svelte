<script>
	import Article from '$lib/components/article/index.svelte';
	import Body from './article.svx';
	import image from './assets/cover.png?as=run';
</script>

<Article title="A defence for the coding challange" {image} color="#3d91ef">
	<Body />
</Article>

<style>
	:global(:root) {
	}
</style>
