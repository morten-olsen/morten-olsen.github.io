<script>
	import Color from '$lib/components/color.svelte';
	import Img from '@zerodevx/svelte-img';
	import Sheet from '$lib/components/sheet/index.svelte';
	import Articles from '$lib/components/articles/index.svelte';
	import Resume from '$lib/components/resume/index.svelte';
	import me from './me.jpg?as=run';
	/** @type {import('./$types').PageData} */
	export let data;
</script>

<svelte:head>
	<title>Morten Olsen</title>
</svelte:head>
<Color color="#ff9922">
	<div class="root">
		<Sheet>
			<Img src={me} class="fill cover" alt="Me" />
			<div class="fill">
				<h1 class="jumbo title">
					{#each "Hi, I'm Morten".split(' ') as word}
						<span class="word">
							{word}
						</span>
					{/each}
				</h1>
				<h2 class="jumbo title">
					{#each 'And I make Software'.split(' ') as word}
						<span class="word">
							{word}
						</span>
					{/each}
				</h2>
			</div>
			<div class="arrow" />
		</Sheet>
		<Sheet>
			<h3 class="jumbo title">
				{#each 'Table of Content'.split(' ') as word}
					<span class="word">
						{word}
					</span>
				{/each}
			</h3>
			<Articles articles={data?.posts || []} />
			<h3 class="jumbo title">
				{#each 'Curriculum vitae'.split(' ') as word}
					<span class="word">
						{word}
					</span>
				{/each}
			</h3>
			<Resume resume={data.resume} />
		</Sheet>
	</div>
</Color>

<style module>
	@keyframes cover-reveal {
		0% {
			opacity: 0;
			transform: scale(2);
		}
		100% {
			opacity: 0.5;
			transform: translateX(0);
		}
	}
	.root {
		display: contents;
	}
	.fill {
		position: absolute;
		height: 100%;
		width: 100%;
		overflow: hidden;
		object-fit: cover;
		object-position: center;
		background-size: cover;
		background-position: center;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.cover {
		opacity: 0.5;
		animation: cover-reveal 0.5s ease-in-out;
		transform: translateZ(0);
	}

	.title {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
	}

	.word {
		font-size: 60px;
		line-height: 80px;
		display: inline-block;
		background: var(--primary);
		color: var(--primary-alt);
		padding: 0 15px;
		text-transform: uppercase;
		margin: 10px;
		font-family: 'Black Ops One', sans-serif;
		@media only screen and (max-width: 700px) {
			margin: 5px;
			font-size: 3rem;
			line-height: 3.1rem;
		}
	}

	.arrow {
		position: absolute;
		bottom: 20px;
		display: flex;
		align-items: center;
		justify-content: center;
		left: 50%;
		transform: translateX(-50%);
	}

	.arrow:after {
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--primary);
		border-radius: 50%;
		width: 80px;
		height: 80px;
		content: '↓';
		font-size: 50px;
		@media only screen and (max-width: 700px) {
			width: 40px;
			height: 40px;
		}
	}
</style>
