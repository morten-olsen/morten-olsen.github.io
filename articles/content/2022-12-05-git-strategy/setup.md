We want to have something with the simplicity of the Kubernetes approach - we declare an expected state, and the tooling enforces this or alerts us if it can not.

We also need to ensure that we can compare our expected state to the actual state.

To achieve this we are going to focus on Git SHAs, so we will be tracking if a deployed resource is a deployment of our expected SHA.

For a web resource, an excellent way to do this could be through a `/.well-known/deployment-meta.json` while if you are running something like Terraform and AWS, you could tag your resources with this SHA - Try to have as few different methods of exposing this information as possible to keep monitoring simple.

With this piece of information, we are ready to create our monitor. Let's say we have a Git ref called `environments/production`, and its HEAD points to what we expect to be in production, now comparing is simply getting the SHA of the HEAD commit of that ref and comparing it to our `./well-known/deployment-meta.json`. If they match, the environment is in the expected state. If not, it is unhealthy.

Let's extend on this a bit; we can add a scheduled task that checks the monitor. If it is unhealthy, it retriggers a deployment and, if that fails, raises the alarm - So even if a deployment failed and no one noticed it yet, it will get auto-corrected the next time our simple reconciler runs. This can be done simply using something like a GitHub workflow.

You could also go all in and write a crossplane controller and use the actual Kubernetes reconciler to ensure your environments are in a healty state - Go as creazy as you like, just remember to make the tool work for you, not the other way around.

So, now we have a setup where Git tracks the expected state, and we can easily compare the expected state and the actual state. Lastly, we have a reconciliation loop that tries to rectify any discrepancy.



