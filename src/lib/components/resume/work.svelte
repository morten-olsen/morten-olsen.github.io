<script>
	import SvelteMarkdown from 'svelte-markdown';
	export let work = [];
	console.log(work);
</script>

<div class="root">
	<div class="timeline">
		{#each work as item, i}
			<div class="work">
				<input id="work-{i}" class="toggle" type="checkbox" />
				<label for="work-{i}" class="lbl-toggle">
					<h3>{item.position}</h3>
					<h4>{item.name}</h4>
				</label>
				<label for="work-{i}" class="bg" />
				<div class="collapsible-content">
					<div class="content-inner">
						<div class="content">
							<div class="word position">{item.position}</div>
							<div class="word name">{item.name}</div>
							<SvelteMarkdown source={item.summary} />
							{#if item.highlights}
								<ul>
									{#each item.highlights as highlight}
										<li>{highlight}</li>
									{/each}
								</ul>
							{/if}
						</div>
						<div class="footer">
							<label for="work-{i}" class="lbl-toggle">Close</label>
						</div>
					</div>
				</div>
			</div>
		{/each}
	</div>
</div>

<style module>
	.root {
		max-width: var(--max-width);
		width: 100%;
		margin: 5rem auto;
		justify-content: center;
		overflow-x: auto;
		scrollbar-color: var(--primary) transparent;
		scrollbar-width: auto;
	}

	.timeline {
		display: flex;
		gap: 1rem;
		position: relative;
	}

	.timeline:before {
		content: '';
		position: absolute;
		bottom: 4px;
		left: 50%;
		transform: translateX(-50%);
		width: 100%;
		height: 2px;
		opacity: 0.2;
		max-width: var(--max-width);

		background: var(--primary-alt);
	}

	.work {
		position: relative;
		border-radius: 5px;
		flex: auto;
		flex-shrink: 0;
		background: var(--primary);
		cursor: pointer;
		margin-bottom: 40px;
		color: var(--primary-alt);
	}

	.work h4 {
		font-size: 1.5rem;
	}

	.work::before {
		content: '';
		position: absolute;
		top: calc(100% + 30px);
		left: 50%;
		transform: translateX(-50%);

		width: 10px;
		height: 10px;

		background: var(--primary-alt);
		border-radius: 50%;
	}

	.work::after {
		content: '';
		position: absolute;
		top: 100%;
		left: 50%;
		transform: translateX(-50%);

		width: 0;
		height: 0;
		border-left: 20px solid transparent;
		border-right: 20px solid transparent;

		border-top: 20px solid var(--primary);
	}

	.name {
		font-size: 4.5rem;
		line-height: 4.6rem;
		@media only screen and (max-width: 700px) {
			margin: 5px;
			font-size: 2.5rem;
			line-height: 2.6rem;
		}
	}

	.position {
		font-size: 1.5rem;
		line-height: 1.6rem;
		@media only screen and (max-width: 700px) {
			margin: 5px;
			font-size: 1rem;
			line-height: 1.1rem;
		}
	}

	.root::-webkit-scrollbar {
		height: 10px;
	}

	/* Handle */
	.root::-webkit-scrollbar-thumb {
		background: var(--primary);
	}

	.toggle {
		display: none;
	}
	.lbl-toggle {
		display: inline-block;
		transition: all 0.25s ease-out;
		padding: 1rem;
		font-family: 'Black Ops One', sans-serif;
	}

	.collapsible-content .content-inner {
		padding: 2rem;
		display: flex;
		flex-direction: column;
		flex: 1;
		overflow: hidden;
	}

	.content-inner p,
	.content-inner ul,
	.content-inner ol {
		font-size: 1.1rem;
		letter-spacing: 0.08rem;
		line-height: 2.1rem;
		text-align: justify;
		padding: 2rem 2rem;
	}

	.collapsible-content {
		z-index: 2;
		overflow: hidden;
		/* max-height: 0px; */
		background: var(--primary);
		color: var(--primary-alt);
		position: fixed;
		max-width: var(--max-width);
		width: 100vw;
		left: 50%;
		top: 50%;
		max-height: 90vh;
		display: flex;
		flex-direction: column;
		opacity: 0;
		transform: translate(-50%, -50%) scale(0);
		transition: all 0.35s ease-in-out;
		box-shadow: 0 0 10.5rem var(--primary);
	}

	.word {
		background: var(--primary);
		color: var(--primary-alt);
		padding: 0 15px;
		text-transform: uppercase;
		margin: 10px;
		font-family: 'Black Ops One', sans-serif;
	}

	.content {
		flex: 1;
		overflow-y: auto;
	}

	.bg {
		content: '';
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		backdrop-filter: blur(10px);
		z-index: 1;
		opacity: 0;
		pointer-events: none;
		transition: opacity 0.55s ease-in-out;
	}

	.toggle:checked + .lbl-toggle + .bg {
		opacity: 1;
		pointer-events: auto;
	}
	.toggle:checked + .lbl-toggle + .bg + .collapsible-content {
		/* max-height: 100vh; */
		transform: translate(-50%, -50%) scale(1);
		opacity: 1;
	}
</style>
