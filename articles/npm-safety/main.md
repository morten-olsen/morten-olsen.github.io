The NPM eco system has hade a long list of stories about major dependencies turning evil lately, either by direct involvment from the package maintainer or due to the maintainer being compromised. What ever the reason, it does bring in to focus the dangers of package managers!

The threat landscaoe being what it is it is tine that we as developers start ti apply a little extra operational security to mitigate some of the risk that comes from installing unaudited oackages, which are in essence just arbitrary executing code which can conceil a viper virus or a remote access token as easily as a random email attachment.

So what can we do to protect ourselfs? we can split the attacks into to groups, one which attacks the users of our application and one that attacks our selves and our CI/CD pipelines

Combating the former is hard and here the only thing short of manually auditing every change in every depebdebcy is to set up monitoring of dependencies with vulnerabilities and freeze dependencies versions to known good versions

The later attack type is the one this article is going to focus on.

A NPM oackage has the ability to run post install hooks, which essentially allow it to execute any code as the current user upon installing the dependency. This allows a malicius oackage to infect your system upon installation by also installing malware or running malicious commands. This can be mitigated by disable install hooks, but some packages have legitinate use cases for these install hooks.

