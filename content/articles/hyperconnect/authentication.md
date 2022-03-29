we will need a way for our devices to identify with one and another, and since we might not have access to any particular node in the system at the time of authentication, this needs to work without a trusted third party at the time of connection.

The best way I can think of here is to use a signing authority.

Our authentication will consist of two main concept; a passport and a passport authority.

Each device will create a passport, which contains some various information but most important is a public key coresponding to a private key stored on the device. A device then has to go through a "claim process" where a user assign it as their device. this happens by that uses passport authority uses a private key to sign the device's passport, and giving it the authorities public key.

Now our device has a signed passport, and the oublic key of the authority, so when two devices needs to connect they can now go through an authentication process to verify each others passport. If both devices verifies the other device's passport as valid the connection can be established.

