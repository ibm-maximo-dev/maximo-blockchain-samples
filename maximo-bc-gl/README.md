# Maximo Blockchain GL Participant Application

You can use the General Ledger Query application to query general ledger transactions that are stored in the digital ledger. Unlike the Service Request Review application, this application has a relatively sparse UI and focuses on interacting with the IBM Watson IoT Platform on Blockchain APIs.

## Prerequisites
1. Install the Polymer CLI by using the following command: npm install -g polymer-cli

## Installation
1. Clone the repository
2. Run `bower install`

## Configuration
The maximo-bc-gl-app.html file contains one function that contains the following request header and body information:

```
this.$.ajax.method = 'POST'
let pass = "API-KEY"
let header = `Basic ${btoa("use-token-auth:"+ pass)}`

this.$.ajax.headers = {
  Authorization: header
}
this.url = "https://alphacluster.us-south.containers.mybluemix.net/api/v1/ixe4p/q/Maximo/PLUSBMXGLTXNus/executequery"
```

The following properties must be changed to enable this application:
```javascript
        const pass = "<Your API Key>"
        const root = '<Your Bluemix Hostname>/api/v1'
        const org = '<Your ORG ID>'
        const appname = 'Maximo'
        const asset = 'PLUSBMXGLTXN'
        const region = 'us'
```

## Usage
1. Run the `polymer serve` command.
2. Access the application UI at the following location: http://localhost:8081/
3. Specify a start date.
4. Specify an end date.
5. Specify a type.
6. Select `GET TRANSACTIONS`

A list of transactions matching the specified criteria display. 

## Security Note
This application is intended to be run only from localhost or the filesystem. To run this application on a publicly accessible web server (eg. centrally hosted), you must take measures to secure the organization API key that is used to connect to Watson IoT Platform on Blockchain.