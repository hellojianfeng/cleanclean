// run-operation-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const { ProgressSchema } = require("./schemas")(app);
  const runOperation = new Schema({
    operation: { 
      oid: { type: Schema.Types.ObjectId },
      data: { type: Schema.Types.Mixed }
    },
    user: {
      oid: { type: Schema.Types.ObjectId },
      data: { type: Schema.Types.Mixed }
    },
    progress: { 
      current: { ProgressSchema },
      history: [ ProgressSchema ]
    },
    data: { type: Schema.Types.Mixed }
  }, {
    timestamps: true
  });

  return mongooseClient.model('runOperation', runOperation);
};
