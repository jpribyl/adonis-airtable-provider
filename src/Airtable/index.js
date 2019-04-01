"use strict";

var Connection = require("airtable");

class Airtable {
  constructor(Config) {
    this.Config = Config;
    this.defaultApiKey = this.Config.get("airtable").defaultApiKey;
    this.defaultBaseId = this.Config.get("airtable").defaultBaseId;
    //allow for multiple connections to exist
    this.bases = {};

    //set up default connection
    this.connect();
  }

  connect(baseId = this.defaultBaseId, apiKey = this.defaultApiKey) {
    let connection;
    if (this.bases[baseId] != null) {
      console.log("connection already exists, exiting");
      return this.bases[baseId];
    } else {
      console.log("opening new airtable connection");
      connection = new Connection({ apiKey: apiKey }).base(baseId);
      this.bases[baseId] = connection;
      return connection;
    }
  }

  getTable(table, baseId = this.defaultBaseId, apiKey = this.defaultApiKey) {
    /**
     * If not using the default connection defined through adonis configuration,
     * then baseId and apiKey are required
     */
    const config = this.Config.get(`airtable`);

    // ensure existence of airtable connection to base
    let base = this.bases[baseId];
    if (base == null) {
      base = this.connect(baseId, apiKey);
    }

    let response = [];
    return base(table)
      .select()
      .eachPage(function page(records, fetchNextPage) {
        // This function (`page`) will get called for each page of records.
        records.forEach(function(record) {
          //attach id to response
          record.fields.id = record.id;
          response.push(record.fields);
        });
        fetchNextPage();
      })
      .then(() => {
        return response;
      });
  }

  findRecord(table) {}

  insertRow(table, row) {
    console.log("inserting row: ", row);
  }
}

module.exports = Airtable;
