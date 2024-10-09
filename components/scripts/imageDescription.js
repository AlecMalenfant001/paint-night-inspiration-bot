/* This class will send an imge to the Azure image description
API and will return the generated image description and the accompanying 
description confidence level
*/
import { ComputerVisionClient } from "@azure/cognitiveservices-computervision";
import { ApiKeyCredentials } from "@azure/ms-rest-js";
import async from "async";

/**
 * AUTHENTICATE
 * This single client is used for all examples.
 */
//import keys from environment variables
const key = import.meta.env.VITE_AZURE_VISION_KEY;
const endpoint = import.meta.env.VITE_AZURE_VISION_ENDPOINT;

//create a new instance of the ComputerVisionClient class
const computerVisionClient = new ComputerVisionClient(
  new ApiKeyCredentials({ inHeader: { "Ocp-Apim-Subscription-Key": key } }),
  endpoint
);
/**
 * END - Authenticate
 */

class ImageDescription {
  constructor(imgURL) {
    this.imgURL = imgURL;
    this.descriptionText = "";
    this.descriptionConfidence = 0.0;
  }

  async describeImage() {
    try {
      console.log("Calling Azure API");
      const description = (
        await computerVisionClient.analyzeImage(this.imgURL, {
          visualFeatures: ["Description"],
        })
      ).description;

      console.log("Description : " + description.captions[0].text);
      console.log("Confidence : " + description.captions[0].confidence);

      this.descriptionText = description.captions[0].text;
      this.descriptionConfidence = description.captions[0].confidence;
    } catch (err) {
      console.error("Error describing image:", err);
    }
  }

  getDescriptionText() {
    return this.descriptionText;
  }

  getDescriptionConfidence() {
    return this.descriptionConfidence;
  }
}

export default ImageDescription;
