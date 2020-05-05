
# Capstone ADP Fido2 Authentication Project

## Introduction
This project focuses on server authentication using the FIDO2 protocol. Allowing users to register and login into a website without using a static password. The FIDO2 standard allows users more flexibility to be able to login and access their accounts using a variety of options. 

## General Setup
The project can be hosted both in an online and offline environment to accommodate different needs. With cloud deployment Microsoft Azure was chosen, but due to credit issues it was discontinued and moved to an offline environment. A recommended amount 4 GB of ram is required in order to run the FIDO2 Server. 

## Communications Setup
In order for the the front to connect with the backend a proxy file is necessary for communications. The two applications run on different ports, you have to either enable CORS (Cross-Origin Resource Sharing) in the Spring Boot application or create a proxy file in the client application to redirect requests. 

- [File](https://github.com/swapnilphanse/fido2/blob/master/frontend/proxy.conf.json)

## FIDO2 Server 
The authentication server is based on a predefined/existing server found here [Server](https://github.com/Yubico/java-webauthn-server) allowing us to authenticate to pre-existing FIDO standards. You can look through the server architecture to gain the general grasp of how communications work between back-end components. This back-end server was adapted to current needs. 
