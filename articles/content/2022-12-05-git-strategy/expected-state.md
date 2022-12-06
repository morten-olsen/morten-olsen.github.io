So I am going to talk about Kubernetes, yet again - A technology I use less and less but, for some reason, ends up being part of my examples more and more often.

At its core Kubernetes has two conceptually simple tasks; it stores an expected state of the resources that it is supposed to keep track of two; if any of those resources are, in fact, not in the expected state, it tries to right the wrong.

This approach means that when we interact with Kubernetes, we don't ask it to perform a specific task - We never tell it, "create three additional instances of service X," but rather ", There should be five instances of service X".

This approach also means that instead of actions and events, we can use reconciliation - no tracking of what was and what is, just what we expect; the rest is the tool's responsibility.

It also makes it very easy for Kubernetes to track the health of the infrastructure - it knows the expected state. If the actual state differs, it is in some unhealthy state, and if it is unhealthy, it should either fix it or, failing that, raise the alarm for manual intervention.
