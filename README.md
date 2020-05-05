
# Capstone ADP Fido2 Authentication Project

## Introduction
This project focuses on server authentication using the FIDO2 protocol. Allowing users to register and login into a website without using a static password. The FIDO2 standard allows users more flexibility to be able to login and access their accounts using a variety of options. 

## General Setup
The project can be hosted both in an online and offline environment to accommodate different needs. With cloud deployment Microsoft Azure was chosen, but due to credit issues it was discontinued and moved to an offline environment. A recommended amount 4 GB of ram is required in order to run the FIDO2 Server. 

## Communications Setup
In order for the the front to connect with the backend a proxy file is necessary for communications. The two applications run on different ports, you have to either enable CORS (Cross-Origin Resource Sharing) in the Spring Boot application or create a proxy file in the client application to redirect requests. 

- [File](https://github.com/swapnilphanse/fido2/blob/master/frontend/proxy.conf.json)

## FIDO2 Server 
The authentication server is based on a predefined/existing server found here [Server](https://github.com/Yubico/java-webauthn-server) allowing us to authenticate to pre-existing FIDO standards. You can look through the server architecture to gain the general grasp of how communications work between back-end components. This back-end server was adapted to current needs. Additional library references were used from the [WebAuth Demo](https://github.com/ralscha/webauthn-demo). 

### LocalHosting
- For running the backend server you can use Maven, which is a build automation tool used primarily for Java projects. Running these commands into your local terminal `mvn clean install` then will allow installation of Maven `mvn spring-boot:run` will run the framework. 

- Running it on Eclipse is an alternative solution. If running on eclipse select maven build option and in the popup enter spring-boot:run in the goals value.

## Frontend Access
Ensure you are in the directory of the project once it is compiled. In a terminal enter the command `npm install`. Additionally install `angular cli` alongside `node` to ensure everything will be accessible. Once completed the command `ng serve --open --port 8100` will open the website through your local browser automatically. Connection to the frontend once the backend is up can be done through port 8100. If there are any issues ensure port 8100 is available and not being used by another process.  

## Database

Storing information on the database is done through MySQL Database. Where once registered the user information will be stored in different fields. Allowing access to general information. 

![alt text](https://github.com/swapnilphanse/fido2/blob/master/Photos/PHOTO1.jpg)
