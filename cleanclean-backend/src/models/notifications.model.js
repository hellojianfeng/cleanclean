// notifications-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;

  const messageSchema = new Schema({
    name: { type: String },
    path: { type: String }, 
    tags: { type: String },
    description: { type: String },
    contents: [{ type: String }],
    data: { type: Schema.Types.Mixed }
  });
  const notifications = new Schema({
    name: { type: String },
    description: { type: String },
    path: { type: String, required: true },
    messages: [ messageSchema ],
    tags: { type: String },
    to_scope: [ { type: Schema.Types.ObjectId } ],
    from_scope: { type: Schema.Types.ObjectId, required: true },
    data: { type: Schema.Types.Mixed }
  }, {
    timestamps: true
  });

  return mongooseClient.model('notifications', notifications);
};
