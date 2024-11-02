# Paint Night Inspiration Bot

by Alec Malenfant
and Nadeem Mahommed

# User Experience

For this application, users will either upload an existing image file and/or upload a picture taken from the device’s camera. These images can be uploaded into two categories : reference and inspiration. As long as one image is uploaded, the program can run. Next, the user will have the option to add any inspiration keywords to a text input box.

After hitting the “generate” button, the program will return a description or the uploaded image along with a confidence score. A new image will then be generated from the reference image, inspiration image(s), and any inspiration keywords. The image generation model will be encouraged to be similar to the reference image. This makes it more likely that the output image will be something useful that the artist can actually add to their canvas. However, the model will also be encouraged to add unexpected elements to bring something different that the amateur artist can enjoy. Paint-Night-Inspiration-Bot is designed to make wacky and bold images that bring something new to the canvas with every image generated.

# Current State of Development

With this update the uploaded reference image is now sent to the image description API. The state of the description component now updates to match the returned description. Currently, there is a file size limit of 4MB.

## Next Steps

The next steps are to:

- Pass image description + keywords to gemini api
- Pass gemini output to get-img api
- Store generated images for logged in users
- About Page
- Deploy

# Quick Start

## Front End Dependencies

Install the needed dependencies by running these commands in the terminal :

```
  npm install
  npm install @google/generative-ai
  npm install @azure/cognitiveservices-computervision
  npm install @azure-rest/ai-vision-image-analysis
  npm install async
  npm install react-slick --save
  npm install slick-carousel --save
  npm install @mui/material @emotion/react @emotion/styled
  npm install @mui/icons-material
  npm install @fontsource/roboto
  npm install @clerk/clerk-react
  npm install @azure/storage-blob
  npm install axios
  npm install multer
```

- react-slick and slick-carousel allow the program to use a slick image carousel to display generated images
- mui is a component library called 'Material UI'
- azure/storage-blob is used to store reference images
- axios is an HTTP client for node.js
- multer is middleware to help with form data

## /server/server.js

This server's repsonsibiliteis include

- uploading images to the azure storage server

## Back End Dependencies

These are the dependencies for server.js. Navigate to the /server directory before running the install commands

```
npm install express
npm install --save-dev nodemon
npm install cors
```

- express : server side framework
- nodemon : automatically restarts the node application when file changes in the directory are detected
- cors : Cross Origin Resource Sharing

More info can about the server can be found at /paint-night-inspiration-bot/server/readme.md

## API Key Environment Variables

### Front End

The API keys are stored as environment variables in a ".env.local" file in the root directory.
If no such file exist, create that file and create value-key pairs with the following values :

```
VITE_GEMINI_API_KEY="YOUR-KEY"
VITE_AZURE_VISION_KEY="YOUR-KEY"
VITE_AZURE_VISION_ENDPOINT="YOUR-ENDPOINT"
```

### Back End

A connection string is used to connect to the azure storage server. Create a file called '.env' and add this value :

```
AZURE_STORAGE_CONNECTION_STRING=YourConnectionString
MONGO_URL = mongodb+srv://Nadeem:Jaffer@cluster0.ewb4t.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
```

Do not put quotes around the string or the azure server will not read it correctly

## Start Development Server(s)

### Front End

```
 paint-night-inspiration-bot> npm run dev
```

### Back End

```
paint-night-inspiration-bot/server> npm run dev
```
