// permissions-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const theSchema = new Schema({
    oid: { type: Schema.Types.ObjectId },
    path: { type: String }, 
    data: { type: Schema.Types.Mixed }
  });
  const permissions = new Schema({
    name: { type: String, required: true },
    display_name: { type: String },
    description: { type: String },
    path: { type: String, required: true }, // dot sperated string, for example, company1#department1#office1, default is same as name
    org: { type: Schema.Types.ObjectId, required: true  },
    operations: [ theSchema ],
    data: { type: Schema.Types.Mixed }
  }, {
    timestamps: true
  });

  permissions.index({ path: 1, org: 1 },  { unique: true });

  return mongooseClient.model('permissions', permissions);
};
