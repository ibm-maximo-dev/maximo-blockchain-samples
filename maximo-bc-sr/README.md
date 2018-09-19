# Service Request Review application

## Prerequisites
1. Node v6 or later is installed locally

## Setup
From the root directory of this project, complete the following steps:

1. Install Polymer CLI by using the following command: `npm install -g polymer-cli`
2. Install Bower by using the following command: `npm install -g bower`
3. Install Dependencies by using the following command: `bower install`
4. Set the BC_API_KEY environment variable to the API Key for your IBM Cloud Organization
    - Windows: set BC_API_KEY=`key_here`
    - Linux: export BC_API_KEY=`key_here`
5. Run Webpack Dev Server by using the following command: `npm start`
6. Open the app at `http://localhost:9000/`

Alternatively, if you would like a self contained version of this sample app that can be run from the filesystem:
1. Do steps 1-4 from the steps before
2. Go to the docs folder
3. Open index.html

## Security Note
This app is intended only to be run from localhost or the filesystem. If you intend to run this application on a publicly accessible web server (eg. centrally hosted), you must take measures to secure the organization API key used to connect to IoT Blockchain Service.

## Configuration
You must configure the `config.js` file for the application before you can use the application.

To configure the `config.js` file, complete the following steps. The `config.js` file is used to define the endpoints for your IoT Blockchain Service configuration.

To configure the application properly, you must specify the appropriate values for the variables at the top of the `config.js` file.
```
//YOUR APP CONFIGURATION HERE
const root = 'https://alphacluster.us-south.containers.mybluemix.net/api/v1'
const org = 'ixe4p'
const appname = 'Maximo'
const region = 'us'

const user = "use-token-auth"

//BC_API_KEY environment variable
const pass = process.env.BC_API_KEY
```

## Schema

The implementation of the main form in the UI is generic and is dynamically generated according to the properties that are found in the `schema.js` file. As such, any property that appears in the Maximo schema also displays on the form unless it has the property hidden: true defined on the attribute. The basic premise of this implementation is true even if the schema is completely different. In this case, you must modify the code that generates the UI to correctly parse the new schema.

The `schema.js` file is a copy of SR from the Maximo JSON schema. If you want to modify the schema, modify the `schema.js` file that is found in the ./src/maximo-bc-sr-pot-app directory. Some things to note:

* The `label` property is added in order to show a human readable version of the attribute.
* The `readonly` property is added in order to set some properties as readonly on the UI side.

## Setting up the WebSocket proxy

The IoT adapter does not support a native WebSocket connection. However, an HTTP to WS proxy is utilized for the Service Request Review application to receive an HTTP POST call from the IoT Adapter and send the call to client applications as a WebSocket message.

To complete an automatic setup of the WebSocket proxy, complete the following steps: 
1. Click the following button to provision your own instance of this proxy to IBM Cloud:

    [![Deploy to Bluemix](https://bluemix.net/deploy/button.png)](https://bluemix.net/deploy?repository=https://github.com/ibm-maximo-dev/http-to-ws-proxy)

2. After selecting Deploy to IBM Cloud, select deploy, and the default toolchain for IBM Cloud is set up. 
3. After set up completes, select `Delivery Pipeline` and then select the play button on the `Build Stage` card. A build and deploy is initialized, which will result in a URL. This URL is to your provisioned proxy.

You can then add the URL to the callback fabric via a POST to the IoT Blockchain Service. The Service Request Review application can simply connect to the same URL but via the WebSocket (ws) protocol to listen for messages.

To manually deploy WebSocket to IBM Cloud, complete the steps for deploying a node.js application. The steps are similar to deploying WebSocket. The steps are found here: https://console.bluemix.net/docs/runtimes/nodejs/getting-started.html#getting-started-tutorial, 

The repository to use for manual deployment is: https://github.com/ibm-maximo-dev/http-to-ws-proxy

## Configuring Participants

Participants are defined in `config.js` in the participants property:
```
    participants: [
        {
            name: "Inspector(Bill)",
            route: "_inspectorBill"
        },
        {
            name: "Engineer(Mike)",
            route: "_engineerMike"
        },
        {
            name: "Regulator(Joe)",
            route: "_regulatorJoe"
        }
    ]
```

This route is created when the participant route is created through the IoT Blockchain Service. Each participant will need their own route. Feel free to customize this if you have a different number possible participants.

### Notes
The Service Request Review application uses webpack rather than the standard polymer serve command from the polymer cli. This is because the application must import standard npm modules, and the default loader does not allow that. For more information, review the following information: http://robdodson.me/how-to-use-polymer-with-webpack/

## Documentation
This section describes the implementation instructions for each major component of the Service Request Review application.

### Populating the SR Side Navigation

In the application, a list of service requests and descriptions in secondary text appear on the side of the application. When a transaction is in progress for a service request, a progress icon displays next to the associated service request in the side navigation. If an error has occurred during the transaction, such as a validation error, a warning icon displays next to the service request to indicate that the user must return to that service request to address the issues.

The API endpoint used for the side navigation is:
`GET ${root}/${org}/q/${appname}/${asset}${region}${route}/${namespace}.${asset}`

This API endpoint returns the current state of all assets in the current fabric in an array. In the case of this application, this API endpoint returns a list of the service requests, which populate the side navigation.

### Submitting Transactions

After the user edits a service request, they select the `SUBMIT` button to submit a transaction request to the adapter.

The API endpoint used for this is:
`POST ${root}/${org}/tx/${appname}/UNUSED/${asset}${region}${route}`

If the adapter receives a well-formed POST request, a `STATUS 200` along with a `trxId` is immediately returned. However, this does not mean the transaction is validated and put into the digital ledger. The transaction must be validated by IBM Blockchain Platform peers before it can be committed. The amount of time that this validation takes is indefinite. It might be a few seconds, a few minutes, or even longer. To deal with this, the adapter is polled to determine if a transaction is put into the digital ledger. The logging endpoint is checked for specific text that indicates a transaction's status. Use the `trxId` that is returned from the previous response to receive only the logs for that transaction ID. 

The API endpoint for this is:
`GET ${root}/${org}/logs/<trxId>`

This API endpoint returns an array of log messages that you can parse on the client side to determine the current status of the transaction. In the implementation for the Service Request Review application UI, a poll is completed every 2 seconds to determine the status of a transaction.

### Transaction History

In the main form for a service request, the user can inspect the transaction history for a service request. The transaction history is pulled from the digital ledger as a source of reference for what has happened to the asset.

The API endpoint for retrieving the transaction history for an asset is:
`POST ${root}/${org}/q/${appname}/${asset}${region}${route}/executequery`

The following is an example of the request body:
```javascript
    var payload = {
        query: "readSRHistory",
        parameters: {
          "_id_time_start_incl": this.currentAsset[config.uniqueId] + "~",
          "_id_time_end_excl": this.currentAsset[config.uniqueId] + "~ZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ"    
        }
      }
```

The `query` property is the name of a query that is defined at the smart contract level. The `parameters` property is also specified in the smart contract. In this case, a starting time inclusive and an end time exclusive is required. To retrieve the whole transaction history for an asset, set _ at the end of the `_id_time_start_incl` property and `_ZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ` at the end of the `_id_time_end_excl` property. The comparison is done lexigraphically, so this approach retrieves all times.- 

The response body contains an array of the transaction history, sorted ascending and chronologically.

### Using doclinks for attachments

The Service Request Review application can display attachments in any format that is supported by the Maximo doclinks implementation. Any service or implementation can be used to store the actual binary data, since the digital ledger is only used to keep track of the URL or href of a file.

The following headers are required when attaching a doclinks file:

```javascript
        xhr.setRequestHeader('slug',slug(files[0].name))
        xhr.setRequestHeader('x-document-meta','Attachments')
        xhr.setRequestHeader('Content-Type',file.type)
```

- `slug` is the slug representation of a filename. For the Service Request Review application, use the slug library to convert a filename to the correct slug format.
- `x-document-meta` must be `'Attachments'`
- `Content-Type` must be the file type. This is found by using the standard File interface.

Doclinks expects a raw binary file as the payload, so the represented file is sent as a blob: `xhr.send(new Blob([file]))`