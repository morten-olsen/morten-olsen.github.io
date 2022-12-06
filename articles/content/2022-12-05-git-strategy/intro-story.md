Let me start with a (semi) fictional story; It is Friday, and you and your team have spent the last five weeks working on this excellent new feature. You have written a bunch of unit tests to ensure that you maintain your project's impressive 100% test coverage, and both you, your product owner and the QA testers have all verified that everything is tip-top and ready to go for the launch!
You hit the big "Deploy" button.
3-2-1
Success! it is released to production, and everyone gets their glass of Champagne!

You go home for the weekend satisfied with the great job you did.

On Monday, you open your email to find it flooded with customers screaming that nothing is working! Oh no, you must have made a mistake!!! So you set about debugging and quickly locate the error message in your monitoring, so you checkout the code from Git and start investigating. But the error that happens isn't even possible. So you spend the entire day debugging, again and again, coming to the same conclusion; This is not possible.

So finally, you decide to go and read the deployment log line-by-painstakingly-line, and there, on line 13.318, you see it! One of your 12 microservices failed deployment! The deployment used a script with a pipe in it. Unfortunately, the script did not have pipefail configured. The script, therefore, did not generate a non-zero exit code, so the deployment just kept humming along, deploying the remaining 11 with success. This chain of events resulted in a broken infrastructure state and unhappy customers, and you spend the entire Monday debugging and potentially the ENTIRE EXISTANCE coming to an end!

