/*
 * Copyright (c) 2018-present, IBM CORP.
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 * Initial Contribution: Alex Nguyen <nguyenal@us.ibm.com>
 */
  
import schema from './schema'

//YOUR APP CONFIGURATION HERE
const root = 'https://alphacluster.us-south.containers.mybluemix.net/api/v1'
const org = 'ixe4p'
const appname = 'Maximo'
const asset = schema.type//asset taken from schema
const region = 'us'
//namespace provided by the contract (OS level or maximo.property) mxe.plusb.plusbnamespace
const namespace = schema.namespace//namespace taken from schema

//TODO move this to environment variables
const user = "use-token-auth"

//BC_API_KEY environment variable
const pass = process.env.BC_API_KEY

export default {
    //if present, will use this as unique id instead of &AUTOKEY&
    uniqueId: "_id", 
    url: { 
            websocket: "wss://httptows-tired-bushbuck.mybluemix.net/",
            attachments: "/doclinks?_lid=maxadmin&_lpwd=maxadmin&lean=1"
        },
        headers:{
            Authorization: `Basic ${btoa(user + ":"+ pass)}` 
        },
    //MODIFY PARTICIPANT ROUTES HERE
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
    ],
    urlFn: {
        //creates the getAssets URL by substituting the route into the URL
        //document - route can be put anywhere
        getAssets : function(route) {
            return `${root}/${org}/q/${appname}/${asset}${region}${route}/${namespace}.${asset}`            
        },
        updateAsset: function(route){
            return `${root}/${org}/tx/${appname}/UNUSED/${asset}${region}${route}`
        },
        getAssetHistory: function(route){
            return `${root}/${org}/q/${appname}/${asset}${region}${route}/executequery`
        },
        getLog: function(){
            return `${root}/${org}/logs/`
        }
    },
    doclinks:{
        headers: {            
            "x-document-meta": "FILE/Attachments"
        },
        auth: "_lid=maxadmin&_lpwd=maxadmin&lean=1"
    },
    ui: {
        navTitle: "Service Requests",
        appTitle: "Service Request Review application"
    },
    history: {
        uniqueId: "ticketid_time",
        //theres are prop names from the contract payload
        eventProp: "evt",
        assetType: "inspection",
        eventType: "$class",
        eventId: "eventId",
        createdEvent: "org.poc.maximo.InspectionCreatedEvent"
    }
}