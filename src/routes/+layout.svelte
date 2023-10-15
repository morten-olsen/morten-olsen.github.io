<script>
	import 'reset-css';
	import '../app.css';
	import '../fonts.css';
	import Color from '$lib/components/color.svelte';
</script>

<Color color="red">
	<slot />
</Color>
