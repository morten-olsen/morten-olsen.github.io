<script>
	import chroma from 'chroma-js';

	export let color = 'red';

	const WHITE = chroma('white');
	const BLACK = chroma('black');

	const isBright = (color) => color.luminance() > 0.4;

	const baseColor = chroma(color);

	const text = isBright(baseColor) ? BLACK : WHITE;
	const bg = isBright(baseColor) ? baseColor.luminance(0.9) : baseColor.luminance(0.01);
</script>

<div
	class="color"
	style:--primary={baseColor.hex()}
	style:--primary-alt={text.hex()}
	style:--fg={text.hex()}
	style:--bg={bg.hex()}
>
	<slot />
</div>

<style module>
	.color {
		display: contents;
	}
</style>
