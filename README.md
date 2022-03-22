# 🚀 Borneo Coding Assessment

Text based file searching using dropbox-api

## Features

-   Sign in via Dropbox.
-   Search for any document just by typing the searh term in the search bar and hitting enter. It will list out all the files maching the search term in a dropnow.
    From the dropdown list select the file that you want to open. It will open the file in a separate window redierc
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
-   Elastic Search
-   Apache Tika

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
-   Pull and run the latest Apache Tika Server docker image using the commands down below

```
    docker pull apache/tika:<version>
    docker run -d -p 9998:9998 apache/tika:<version>
```

-   Pull and run the latest Elastic Search docker image using the commands down below

```
    docker pull docker.elastic.co/elasticsearch/elasticsearch:8.1.1
    $ docker run -p 9200:9200 -p 9300:9300 -e "discovery.type=single-node" docker.elastic.co/elasticsearch/elasticsearch:7.15.2
```

-   To start the frontend run

```
    $ cd client
    $ npm start
```

-   To start the backend server run

```
    $ cd server
    $ npm run dev
```

-   Your app is up and running, happy searching!
