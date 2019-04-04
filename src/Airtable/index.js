"use strict";

var Connection = require("airtable");

class Airtable {
  constructor(Config) {
    this.Config = Config;

    // convenience variables
    this.defaultApiKey = this.Config.get("airtable").defaultApiKey;
    this.defaultBaseId = this.Config.get("airtable").defaultBaseId;

    // keeping connections in an object allows multiple to exist simultaneously
    this.bases = {};

    // set up default connection
    this.getOrConnect(this.defaultBaseId, this.defaultApiKey, true);
  }

  /*
   *    This method will check in the `this.bases` object to see if a connection to the
   *    baseId already exists. If it does exist, it will return that connection and
   *    if it does not it will open a new connection and return that
   */
  getOrConnect(
    baseId = this.defaultBaseId,
    apiKey = this.defaultApiKey,
    sendWarning = false
  ) {
    let connection;
    if (baseId == null || apiKey == null) {
      if (sendWarning === true) {
        console.log(
          "warning, no airtable apikey or baseid set, no connection will be openened"
        );
      }
      return;
    } else if (this.bases[baseId] != null) {
      return this.bases[baseId];
    } else {
      console.log("opening new airtable connection");
      connection = new Connection({ apiKey: apiKey }).base(baseId);
      this.bases[baseId] = connection;
      return connection;
    }
  }

  /*
   *    If not using the default connection defined through adonis configuration
   *    (config/airtable.js), then baseId and apiKey are required
   */
  getTable(table, baseId = this.defaultBaseId, apiKey = this.defaultApiKey) {
    // ensure existence of airtable connection to base
    const base = this.getOrConnect(baseId, apiKey);
    if (base == null) {
      return;
    }

    let response = [];
    return base(table)
      .select()
      .eachPage(function page(records, fetchNextPage) {
        // This function (`page`) will get called for each page of records.
        records.forEach(function(record) {
          // attach json array with record fields and id to response
          record.fields.id = record.id;
          response.push(record.fields);
        });
        fetchNextPage();
      })
      .then(() => {
        return response;
      });
  }

  /*
   *    This method will need to be written when designing tests (IE insert a record,
   *    find it, delete it, try to find it expecting fail, etc)
   */
  findRecord(
    table,
    recordId,
    baseId = this.defaultBaseId,
    apiKey = this.defaultApiKey
  ) {}

  /*
   *    Add a new record and return its airtable ID - ID will likely need to be
   *    written to your local db if you want to be able to edit the record
   *    later
   */
  insertRecord(
    table,
    recordToInsert,
    baseId = this.defaultBaseId,
    apiKey = this.defaultApiKey
  ) {
    //console.log("inserting airtable record");
    const base = this.getOrConnect(baseId, apiKey);
    if (base == null) {
      return;
    }

    return base(table)
      .create({
        ...recordToInsert
      })
      .then(record => {
        return record.getId();
      })
      .catch(err => {
        console.log("error: ", err);
        return;
      });
  }

  /*
   *Update a record by its table and airtable ID - this is why you need to
   *store the airtable ID locally
   */
  updateRecord(
    table,
    recordId,
    recordDetails,
    baseId = this.defaultBaseId,
    apiKey = this.defaultApiKey
  ) {
    //console.log("updating record: ", recordId);
    const base = this.getOrConnect(baseId, apiKey);
    if (base == null) {
      return;
    }

    return base(table)
      .update(recordId, recordDetails)
      .then(record => {
        return record.fields;
      })
      .catch(err => {
        console.log("error: ", err);
        return;
      });
  }

  /*
   *Useful for writing transactions to delete records when something fails on
   *your local db
   */
  deleteRecord(
    table,
    recordId,
    baseId = this.defaultBaseId,
    apiKey = this.defaultApiKey
  ) {
    //console.log("deleting record: ", recordId);
    const base = this.getOrConnect(baseId, apiKey);
    if (base == null) {
      return;
    }

    return base(table)
      .destroy(recordId)
      .then(record => {
        return record.id;
      })
      .catch(err => {
        console.log("error: ", err);
        return;
      });
  }
}

module.exports = Airtable;
