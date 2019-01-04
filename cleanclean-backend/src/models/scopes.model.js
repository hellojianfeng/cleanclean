// scopes-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const scopes = new Schema({
    name: { type: String },
    description: { type: String },
    path: { type: String, required: true },
    data: { type: Schema.Types.Mixed },
    include_all: [{ oid: {type: Schema.Types.ObjectId}, path: {type: String}, org_id: {type: Schema.Types.ObjectId}, org_path: {type: String} }],
    include_any: [{ oid: {type: Schema.Types.ObjectId}, path: {type: String}, org_id: {type: Schema.Types.ObjectId}, org_path: {type: String} }],
    exclude_all: [{ oid: {type: Schema.Types.ObjectId}, path: {type: String}, org_id: {type: Schema.Types.ObjectId}, org_path: {type: String} }],
    exclude_any: [{ oid: {type: Schema.Types.ObjectId}, path: {type: String}, org_id: {type: Schema.Types.ObjectId}, org_path: {type: String} }]
  }, {
    timestamps: true
  });

  return mongooseClient.model('scopes', scopes);
};
