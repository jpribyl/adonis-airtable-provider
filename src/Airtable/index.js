"use strict";

class Airtable {
  constructor(Config) {
    this.Config = Config;
  }

  get() {
    /**
     * Read configuration using Config
     * provider
     */
    const config = this.Config.get(`airtable`);
    console.log(config.apiKey);

    /**
     * If there is an instance of queue already, then return it
     */
    //if (this._queuesPool[name]) {
    //return this._queuesPool[name]
    //}

    /**
     * Create a new queue instance and save it's
     * reference
     */
    //this._queuesPool[name] = new BeeQueue(name, config)

    /**
     * Return the instance back
     */
    //return this._queuesPool[name]
    //}
  }
}

module.exports = Airtable;
