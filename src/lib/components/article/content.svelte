<div class="root">
	<slot />
</div>

<style module>
	.root {
		animation: slide-up 0.5s ease-in-out;
		font-size: 1.1rem;
		letter-spacing: 0.08rem;
		line-height: 2.1rem;
		text-align: justify;
		max-width: 700px;
		margin: 2rem 4rem;
		list-style-position: inside;

		@media only screen and (max-width: 700px) {
			margin: 2rem 2rem;
		}
	}

	.root > p,
	.root ul,
	.root ol {
		letter-spacing: 0.08rem;
		line-height: 2.1rem;
		text-align: justify;
		max-width: 700px;
		padding: 2rem 4rem;
		list-style-position: inside;
		background: var(--bg);

		@media only screen and (max-width: 700px) {
			padding: 2rem 2rem;
		}
	}

	.root > p:first-of-type {
		display: block;
		margin-bottom: 2rem;
		padding-bottom: 2rem;
	}

	.root > p:first-of-type::first-letter {
		font-family: 'Black Ops One', sans-serif;
		border: solid 5px var(--fg);
		margin: 0 1rem 0 0;
		font-size: 6rem;
		float: left;
		clear: left;
		padding: 1rem;
	}

	.root li {
		padding: 0.5rem 0;
		margin: 0;
	}

	.root img {
		max-width: 100%;
		margin: auto;
	}

	.root > p + p::first-letter {
		margin-left: 1.8rem;
	}

	.root > p + p::first-letter {
		margin-left: 1.8rem;
	}

	.root h1,
	.root h2,
	.root h3,
	.root h4,
	.root h5,
	.root h6 {
		max-width: 350px;
		margin-left: -100px;
		float: left;
		padding: 20px;
		padding-right: 40px;
		shape-outside: padding-box;
		position: relative;
		font-family: 'Black Ops One', sans-serif;
		text-transform: uppercase;
		display: flex;
		align-items: flex-start;
		background: var(--bg);

		@media only screen and (max-width: 900px) {
			width: 100%;
			margin-left: 0;
			shape-outside: inherit;
			float: none;
		}
	}

	.root h1:after,
	.root h2:after,
	.root h3:after,
	.root h4:after,
	.root h5:after,
	.root h6:after {
		position: absolute;
		content: '';
		right: 20px;
		top: 0;
		bottom: 0;
		border-bottom: solid 15px var(--fg);
		left: 0;

		@media only screen and (max-width: 900px) {
			border: none;
		}
	}
</style>
