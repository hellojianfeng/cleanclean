// channels-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;

  const orgObjSchema = new Schema({
    path: String,
    org_path: String
  })

  const scopeSchema = new Schema({
    operation: orgObjSchema,
    page: { name: String },
    roles:[ orgObjSchema ],
    permissions: [ orgObjSchema ],
    users:{ oid: Schema.Types.ObjectId, email: String },
    data: { type: Schema.Types.Mixed }
  });

  const channels = new Schema({
    name: { type: String},
    path: { type: String},
    channel_id: { type: String, unique: true },
    description: { type: String },
    to_scope:[ scopeSchema ],
    from_scope: scopeSchema,
    to_hash:{ type: String, required: true },
    from_hash:{ type: String, required: true },
    data: { type: Schema.Types.Mixed }
  }, {
    timestamps: true
  });

  return mongooseClient.model('channels', channels);
};
