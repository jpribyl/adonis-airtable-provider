const { ServiceProvider } = require('@adonisjs/fold')

class AirtableProvider extends ServiceProvider {
  register () {
    this.app.singleton('Adonis/Addons/Airtable', () => {
      const Config = this.app.use('Adonis/Src/Config')
      return new (require('../src/Airtable/'))(Config)
    })
  }
}

module.exports = AirtableProvider
