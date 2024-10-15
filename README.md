# Paint Night Inspiration Bot

by Alec Malenfant
and Nadeem Mahommed

# User Experience

For this application, users will either upload an existing image file and/or upload a picture taken from the device’s camera. These images can be uploaded into two categories : reference and inspiration. As long as one image is uploaded, the program can run. Next, the user will have the option to add any inspiration keywords to a text input box.

After hitting the “generate” button, the program will return a description or the uploaded image along with a confidence score. A new image will then be generated from the reference image, inspiration image(s), and any inspiration keywords. The image generation model will be encouraged to be similar to the reference image. This makes it more likely that the output image will be something useful that the artist can actually add to their canvas. However, the model will also be encouraged to add unexpected elements to bring something different that the amateur artist can enjoy. Paint-Night-Inspiration-Bot is designed to make wacky and bold images that bring something new to the canvas with every image generated.

# Current State of Development

I have been slowly but surely chugging away at UI development. The page and it's components are responsive to change in screen size.

<br/>These are the buttons that **do** work :

- Upload image button
- Generate image
- Add keyword button

These are the buttons that **do not** work :

- Upload image
- Login

You'll notice that Upload image is on both of these lists. This is because right now we have no way of sending a locally uploaded file to
the Azure image description API. First we need to setup the databse, then store the file, and send the API the link to that file. However,
the upload image button still causes the image description and confidence to render. Also, because the Azure API is still hard coded to a single image
url, the description and confidence will be the same every time.

Also, the prompt for the generate image button is still "a cat in a hat"

## Next Steps

The next steps are to:

- Integrate Nadeem's clerk code into this project
- Store ALL uploaded images so we can have a URL to send to Azure
- Delete all uploaded images after a short amount of time for privacy
- Turn the image description + keywords into a prompt for Gemini
- Feed Gemini output to Getimg api
- Store Generated Images for logged in users
- About Page
- Deploy

# Quick Start

## Dependencies

Install the needed dependencies by running these commands in the terminal :

```
  npm install
  npm install @google/generative-ai
  npm install @azure/cognitiveservices-computervision
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

## API Key Environment Variables

The API keys are stored as environment variables in a ".env.local" file in the root directory.
If no such file exist, create that file and create value-key pairs with the following values :

```
VITE_GEMINI_API_KEY="YOUR-KEY"
VITE_AZURE_VISION_KEY="YOUR-KEY"
VITE_AZURE_VISION_ENDPOINT="YOUR-ENDPOINT"
```

## Start Development Server

```
 npm run dev
```
