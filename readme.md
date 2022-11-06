# Time table for time tabling purposes

## How to Run 

1) Clone Repository and go to ./Serber/
2) run npm install to get required dependencies 
3) run `node server.js` (Server Part)
4) install [serve](https://www.npmjs.com/package/serve) package using npm
5) Navigate to root folder of repository 
6) run `serve UI`
7) Go to hosted url (usually http://localhost:5000/)

## Screenshots from the application:

![](https://media.discordapp.net/attachments/752540780966576318/1038803205028593804/image.png?width=1253&height=669)

![](https://media.discordapp.net/attachments/752540780966576318/1038803562462969917/image.png?width=1321&height=670)

## General information

The UI is made using Vanilla HTML/JS/CSS with fonts from google fonts. The table is dynamically generated based on a JSON object it receives from the server.

The server is a simple NodeJS-Express server which returns a JSON file on receiving a GET request.