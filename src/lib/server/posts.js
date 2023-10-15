const metadataImports = import.meta.glob('../../routes/**/post.meta.js', {
	eager: true
});

const posts = Object.entries(metadataImports)
	.map(([path, cur]) => {
		const urlParts = path.split('/').slice(3, -1);
		const url = ['', ...urlParts].join('/');
		return {
			url,
			...cur.meta
		};
	})
	.sort((a, b) => b.published - a.published);

export { posts };
