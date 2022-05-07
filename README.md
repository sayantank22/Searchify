# 🚀 Text Based File Search Service

Text based file searching using dropbox-api

## Features

-   Sign in via Dropbox.
-   Use the search bar to search for the documents based on the text content that you entered on the input search bar.
    In order to view the document click on the file name from the dropdown list and it will open the target file in a
    separate window.
-   Logout of the system using logout button.

## Screenshots

### Login Page

<img src="/screenshots/login.png" />

### Landing page

<img src="/screenshots/search.png" />

## Table of contents

-   [General info](#general-info)
-   [Technologies](#technologies)
-   [Usage and Setup](#usage-and-setup)

## General info

A basic web-based file search service that can search documents from cloud storage like Dropbox based on the content inside the document.

## Technologies

Project is created primarily with:

-   React JS
-   Node Js

## Usage and Setup

To run this project locally, follow the steps below:

-   Clone this repo.
-   Go into the client folder and run `npm install` to install the dependencies.
-   Go into the server folder and run `npm install` to install the dependencies.
-   Login to your Dropbox account and create an OAuth app and provide a `RedirectURI` e.g http://localhost:3000/login
-   Create a .env file in the root folder and set these variables:

    ```
    CLIENT_ID=Your Client ID from Dropbbox
    CLIENT_SECRET=Your Client Secret from Dropbbox
    REDIRECT_URI=http://localhost:3000/login
    PORT=5000
    ```

-   To start the frontend run

```
    cd client
    npm start
```

-   To start the backend server run

```
    cd server
    sudo docker-compose up
    npm run dev
```

-   Your app is up and running, happy searching!
