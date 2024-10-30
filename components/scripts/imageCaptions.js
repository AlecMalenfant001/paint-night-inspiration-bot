// This script is responsible for getting the AI description of the reference image
//import { ImageAnalysisClient } from "@azure-rest/ai-vision-image-analysis";
import createClient from "@azure-rest/ai-vision-image-analysis";
import { AzureKeyCredential } from "@azure/core-auth";

/**
 * AUTHENTICATE
 * This single client is used for all examples.
 */
//import keys from environment variables
const key = import.meta.env.VITE_AZURE_VISION_KEY;
const endpoint = import.meta.env.VITE_AZURE_VISION_ENDPOINT;

// create a new client object
const credential = new AzureKeyCredential(key);
const client = createClient(endpoint, credential);

// specify which image analysis features to use
const features = ["Caption"];

class ImageCaptions {
  constructor(imgURL) {
    this.imgURL = imgURL;
    this.descriptionText = "";
    this.descriptionConfidence = 0.0;
  }

  async captionImage() {
    // Get a description of the uploaded image to azure

    try {
      const result = await client.path("/imageanalysis:analyze").post({
        body: {
          url: this.imgURL,
        },
        queryParameters: {
          features: features,
        },
        contentType: "application/json",
      });

      const iaResult = result.body; // image analysis result

      if (iaResult.captionResult) {
        console.log(
          `Caption: ${iaResult.captionResult.text} (confidence: ${iaResult.captionResult.confidence})`
        );
        this.descriptionText = iaResult.captionResult.text;
        this.descriptionConfidence = iaResult.captionResult.confidence;
      }
    } catch (error) {
      console.error("Erorr describing image: ", error);
    }
  }
}

export default ImageCaptions;
