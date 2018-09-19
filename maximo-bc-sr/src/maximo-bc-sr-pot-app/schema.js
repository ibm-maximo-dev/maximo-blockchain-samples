/*
 * Copyright (c) 2018-present, IBM CORP.
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 * Initial Contribution: Alex Nguyen <nguyenal@us.ibm.com>
 */

export default {
  "title": "SR",
  "$schema": "http:\/\/json-schema.org\/draft-04\/schema#",
  "description": "Blockchain SR",
  "resource": "BCSR",
  "$ref": "http:\/\/localhost\/maximo\/oslc\/jsonschemas\/bcsr",
  "properties": {
    "actualstart": {
      "title": "actualstart",
      "persistent": true,
      "subType": "DATETIME",
      "searchType": "EXACT",
      "type": "string",
      "label": "Start Date",
      "readonly": false
    },
    "description": {
      "title": "description",
      "maxLength": 100,
      "persistent": true,
      "subType": "ALN",
      "searchType": "TEXT",
      "type": "string",
      "label": "Description",
      "readonly": true
    },
    "description_longdescription": {
      "title": "description_longdescription",
      "maxLength": 32000,
      "subType": "LONGALN",
      "searchType": "TEXT",
      "type": "string",
      "label": "Long Description",
      "readonly": false
    },
    "location": {
      "title": "location",
      "maxLength": 12,
      "persistent": true,
      "subType": "UPPER",
      "searchType": "WILDCARD",
      "type": "string",
      "label": "Location",
      "readonly": true
    },
    "status": {
      "title": "status",
      "maxLength": 10,
      "persistent": true,
      "subType": "UPPER",
      "enum": ["WORKCOMP", "HISTEDIT", "NEW", "CLOSED", "QUEUED", "RESOLVED", "REWORK", "REVIEW", "REVCOMP", "PENDING", "INPROG", "BLOCKCHAIN"],
      "searchType": "WILDCARD",
      "type": "string",
      "label": "Status",
      "readonly": false
    },
    "targetfinish": {
      "title": "targetfinish",
      //"maxLength": 10,
      "persistent": true,
      "subType": "DATETIME",
      "searchType": "EXACT",
      "type": "string",
      "label": "Target Finish Date",
      "readonly": false
    },
    "ticketid": {
      "title": "ticketid",
      "default": "&AUTOKEY&",
      "maxLength": 10,
      "persistent": true,
      "subType": "UPPER",
      "searchType": "WILDCARD",
      "type": "string",
      "label": "Service Request Number",
      "readonly": true
    },
    "_id": {
      "title": "_id",
      "type": "string",
      "label": "_id",
      "readonly": true
    },						
    "href": {
      "type": "string",
      "hidden": true
    },
  },
  "trackSender": true,
  "rules": null,
  "pk": "_id",
  "type": "PLUSBSR",
  "shortname": "SR",
  "name": "SR",
	"namespace": "org.poc.maximo",
  "version": "0.0.1",
  "resource": "PLUSBSR"
}