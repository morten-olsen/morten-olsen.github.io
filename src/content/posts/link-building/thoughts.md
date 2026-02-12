
# Let's reinvent link building

I was investigating the web mention standard the other day - so for context, I am not happy with the current state of the internet, everything converging into major networks curated by attention over value algorithms

So the idea of websites being their own entities with their quircks and charms, being able to interlink to create a shared discors seemed like an interesting prospect

After this I was thinking about the graph that could get build from this, site A links to site B which links to site C - great, but most sites currently don't support web mentions, so could we expand this? yes, we could just take all the links on a page and that way build the graph - and then I realized, not only was I X years to late to invent link based page scoring, but I had invented the thing that already has caused the SEO industry and the slow decline of the internet that we love

But then I thought some more - and I think I found a flaw in the original implementation of linked based ranking - If we consider just the number of links as a value in and off it self, or even say on a global scale that a webpage has "trust" and therefore further boost the link value we create a lot of oppertunities for a link build SEO driven nightmare - but what if we instead applied some web-of-trust to this model.

So let's say I have a few publications that I really trust - now we need to evaluate a sites "trust worthiness" in relation to me - so now with out graph in hand and knowledge of a few sites I trust we can actually see what is the shortest distance in the graph between a site I trust and this new site, thereby getting an indication it this site is to be trusted

I would not expect any of the publications I trust to link to spammy or bad actors, and I would also expect them to link to sites less likely to promote bad faith content - so the shorter the path, the more likely this is to generate high quality responese.

But one of the publications may post a link, as part of a story, to a bad faith website as an example of where not to go - my web of trust has now been poisoned, and will start to surface bad content - so what could be done?

One idea is to extend the link format to include more of a link "context", so consider the `a` tag in HTML, usually it just holds the link text and target (href), but say we extended this to include meta data such as trust hinting, for instance `<a href="..." trust="avoid">Don't ever buy from this provider it is a scam</a>` - now we can actually start to score our graph connections, to not just capture A -> B -> C but A don't trust B, B trust C - we should likely not surface this result in a search

This would in my head remove many of the frustrations around search, as a search engine would just have to index the content of the page, but not really care about if it is created in good fate or is created for dubious reasons as we can apply our web of trust to it on a user basis, to see if this article has a high properbility of containing authentic content, based on the users preferences.
