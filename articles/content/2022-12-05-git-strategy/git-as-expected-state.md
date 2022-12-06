So how does this relate to Git? Well, Git is a version control system. As such, it should keep track of the state of the code. That, to me, doesn't just include when and why but also where - to elaborate: Git is already great at telling when something happened and also why (provided that you write good commit messages), but it should also be able to answer what is the code state in a given context.

So let's say you have a production environment; a good Git strategy, in my opinion, should be able to answer the question, "What is the expected code state on production right now?"
And note the word "expected" here; it is crucial because Git is, of course, not able to do deployments or sync environments (in most cases) but what it can do is serve as our expected state that I talked about with Kubernetes.

The target is to be able to compare what we expect, with what is actually there completly independant of all the tooling that sits in between, as we want to remove those as a source of error or complexity.
