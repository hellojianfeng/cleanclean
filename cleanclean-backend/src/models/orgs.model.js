// orgs-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;

  const orgProfile = new Schema({
    name: { type: String }, //profile name, for example, vedios, icons, description and so on
    display_name: { type: String },
    data: { type: Schema.Types.Mixed }
  });

  const orgs = new Schema({
    name: { type: String },
    display_name: { type: String },
    description: { type: String },
    type: { 
      oid: { type: Schema.Types.ObjectId },
      data: { type: Schema.Types.Mixed }
    }, //object id of org-types
    path: { type: String, unique: true }, // # sperated string, for example, company1#department1#office1, default is same as name
    tags: { type: String },
    profiles: [ orgProfile ],
    data: { type: Schema.Types.Mixed }
  }, {
    timestamps: true
  });

  return mongooseClient.model('orgs', orgs);
};
