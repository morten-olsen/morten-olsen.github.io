Let's talk about code challanges. This is a topic with a lot of opinions and something I myself has been unsure if i liked or absolutly hated, but I would like to make a case for why I think there are situations where this practice actually are benificial, not only for the interviewer, but the candidate as well.

## Downsides

But before getting that far I would like to point out some of the down sides to code challanges, because it isn't a one size fits all and you may want to steer completly clear of them, or only use them in specific cercumstances.

## Downside #1
The primary issue with coding challanges are that they may be build in a way that prevents the candidate from showing their strength. I have for instance often seen those logic-style code challanges being applied to all development prositions, so a front-end developer would be quiz'ed in his ability to solve sorting algorithms, while what he would be suppose to do after being hired where aligning stuff correctly with CSS. This kind of skill tests, which ultimatly assesses a completly different set of skills than what is needed will lead to alienating the candidate, and allow a candidate with skills in the quized topic to overshine one with the skills actually required.

Later I will talk a little bit about some requirements that I think need to be thought into a good code test, so if used, at least would give a better indication of a candidates skill in relation to the specific role, not just as a "guy who does computer stuff".

## Downside #2

Second one is one I have mentioned before, but in a competative hiring market, being the company with the longest hiring process means that you might very well miss out on some of the best candidates, due to them not having the available time to complete these tasks in their spair time, or because another company was able to close the hire quicker.

# Why you may want to use code challanges

My first point here was one I was debating with my self if I should add to the downside as well. A lot of people don't perform well under this kind of pressure, so this might obscure the results. The reason I did not put it into the downsides, but will instead use it as my first argument is that the alternative is that you can only showcase your technical skills in the actual interview!

The IT space has historically been associated with an introvert stereo type. While not always the case, they are definatly out there, and there is nothing wrong with that, but they are usually not the strongest at selling them self, and that is basically what most job interviews are about. So if we give a candidate only the ability to showcase their skills through an interview it stands to reason that the guy we end out hiring aren't nessicairly the strongest candidate for the job, but the one most who is best at showcasing hers/his skill.

Using a code challange along side the interview allows you to use the interview part to assess the person, get an idea about how they would interact on the time, have time to explain to them what the job would be like, without having the "hidden" agenda, of trying to trip them up with arbitrary technical questions, to try to see if they can answer correctly on the spot.

So instead of the on the spot question style, the candidate would get the time to seek information and solve the tasks in a style much more remanisant of how they would actually work in the real world.

Additionally, if done right, the code challange can also help the company/team to prepare for the new candidate after the hire. If your code challange can give an indication of the candidates strength, weaknesses and knowladge level with various technologies, this can help put the "training"-program together, to help the new hire being up and running and comftable in the position as quicly as possible.

## What makes a good code challange

It is a difficult question to ask, as it would very from position to position, team to team and company to company. Some position may require a specific knowladge set, where the "implement a sorting algorithm" may be the right test, and be something you would expect any candidate to be able to.

I can give an example of my recommendation for a code test, to use with new developers. The role is actually quite open ended, we need good developers, and have so many open positions so if you have talent in an area, we most likely need you.
The particually test in question should be one that could be used to test people both at their frontend, backend-for-frontend, QA, DevOps, etc. skills. Not that a candidate should have skills in all those areas, but we want the candidate to be able to show there skills in any of those areas.

So the idea I came up with was to create a small `next.js` app, which is an application building platform we use in a lot of our projects and has a large industry adoption.
I would have prefer to not have to tie it to any specific technologies but that would have made the codebase to large for a small code challange.

In the `next.js` app we would create and API endpoint with a simple data source. This endpoint would contain bugs.

We would also implement a frontend feature, which used this endpoint. And the frontend would contain bugs.

The project would also have a few broken unit and end-to-end tests

It would also have a target environment that it was deployed to, but with no DevOps pipelines for it.

All the code would be written in a suboptimal way (not linting compliant, less than perfect naming etc.)

Additionally there would be a "backlog" with a few items that the ficticious product owner and team of this ficticious product had created, which would contain action items for fixing the backend bug, fixing the frontend bug, improve the styling of the code, setup CI/CD, fix/add QA etc. along with a new feature request which would require adding a new API endpoint as well as an interface
