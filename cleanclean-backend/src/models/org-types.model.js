// org-types-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const orgTypes = new Schema({
    name: { type: String, required: true},
    display_name: { type: String },
    path: { type: String, unique: true }, // dot sperated string, for example, company.department, default is same as name
    data: { type: Schema.Types.Mixed }
  }, {
    timestamps: true
  });

  return mongooseClient.model('orgTypes', orgTypes);
};
