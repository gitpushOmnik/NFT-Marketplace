const https = require("https");

// Project credentials for Infura
const projectId = "e494c2a6d5db46bb8b5c95aca98e49d5";
const projectSecret = "8N9igPKM59uTbcg3qfLTLZBhKZuJIG58dIbfxnZ0Sxk5D36Vu4RiBw";

// Options for the HTTPS request
const options = {
  host: "ipfs.infura.io",
  port: 5001,
  path: "/api/v0/pin/add?arg=e494c2a6d5db46bb8b5c95aca98e49d5",
  method: "POST",
  auth: projectId + ":" + projectSecret,
};

/**
 * @description Makes a POST request to Infura's IPFS API to pin a file.
 */
let req = https.request(options, (res) => {
  let body = "";

  // Event listener for data chunks
  res.on("data", function (chunk) {
    body += chunk;
  });

  // Event listener for the end of the response
  res.on("end", function () {
    console.log(body);
  });
});

// End the request
req.end();
