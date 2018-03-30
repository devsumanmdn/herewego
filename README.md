# HereWeGo

> Backend Task

#### Features

* Authentication
* JSON patching
* Image Thumbnail Generation

#### Installation

    npm install

#### Starting the server

    npm start

#### Testing

    npm test

### Notes

    `/login` route accepts json data with two fields `username` and `password`.

    `/patchrequest` route accepts two json fields namely `obj` with the base object and `patches`.

    `/thumbnail` route takes the `url` field from `req.body` and respond with a thumbnail.
