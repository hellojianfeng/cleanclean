// roles-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const roles = new Schema({
    name: { type: String },
    display_name: { type: String },
    path: { type: String, unique: true }, // dot sperated string, for example, company1#department1#office1, default is same as name
    data: { type: Schema.Types.Mixed }
  }, {
    timestamps: true
  });

  return mongooseClient.model('roles', roles);
};
