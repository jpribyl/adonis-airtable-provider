# Writing an Adonis provider

Adonis uses providers to connect with third party tools - the docs on this are
really great so start there if you have never done it before.  Basically you
will wind up creating an npm package, hosting it on github and adding it to the project. 

- Start by creating a public github repo with a descriptive name (IE
  jpribyl/adonis-airtable-provider)

- Link this repo to the directory which will hold your npm package

- When initializing the npm project, Make sure to give it a name that begins
  with @adonisjs/

`npm init`

- After initializing, you can build out the directory structure suggested in
  the adonis docs (or copy it from this jpribyl/adonis-airtable-provider)

- Once you have pushed this up to github, you can npm install it into your
  project

- The source code will show up in node_modules/@adonisjs/<your repo name>

- Now you can add the provider as explained in the docs and edit the source
  directly in the node_modules directory.

- Once you are done editing, push the changes up to github and you're all set!
