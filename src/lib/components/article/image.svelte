<script>
	import Img from '@zerodevx/svelte-img';

	/** @type {string} */
	export let image;
</script>

<div class="aside">
	<Img class="image" src={image} alt="Article image" />
</div>

<style module>
	.aside {
		animation: slide-left 0.5s ease-in-out;
		position: fixed;
		right: 0;
		top: 0;
		width: 40%;
		height: 100%;
		clip-path: polygon(40% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 50%);

		@media only screen and (max-width: 900px) {
			width: 100%;
			height: 350px;
			clip-path: none;
			z-index: -1;
		}
	}

	.image {
		object-fit: cover;
		object-position: center;
		background-size: cover;
		background-position: center;
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
	}
</style>
