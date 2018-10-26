// operations-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const { ProgressSchema } = require("./schemas")(app);
  const operationStage = new Schema({
    name: { type: String }, //for example, ready, start, end, ....
    display_name: { type: String },
    start: { type: Schema.Types.Mixed }, //usually it is a expression for start
    end: { type: Schema.Types.Mixed },//usually it is a expression for start
    expire: { type: Schema.Types.Mixed },//usually it is a expression for start
    data: { type: Schema.Types.Mixed }
  });

  const operationRole = new Schema({
    oid: { type: Schema.Types.ObjectId },
    include: {
      roles: [ { type: String } ],//array of role path
      recursive_roles: [ { type: String } ],//array of role path
      children: { type: String, enum: ['recursive','true','false'] },
      parent: { type: String, enum: ['recursive','true','false'] },
    },
    exclude: {
      roles: [ { type: String } ],//array of role path
      recursive_roles: [ { type: String } ],//array of role path
      children: { type: String, enum: ['recursive','true','false'] },
      parent: { type: String, enum: ['recursive','true','false'] },
    },
    data: { type: Schema.Types.Mixed }
  });

  const operations = new Schema({
    name: { type: String, required: true },
    path: { type: String, required: true },//dot seperate name of operation, unique in app
    display_name: { type: String },
    data: { type: Schema.Types.Mixed },
    app: { 
      oid: { type: Schema.Types.ObjectId, required: true },
      data: { type: Schema.Types.Mixed } 
     },
    org: { 
      oid: { type: Schema.Types.ObjectId, required: true  },
      data: { type: Schema.Types.Mixed  }
    },
    roles: [ operationRole ],
    stage: {
      definitions: [ operationStage ],
      current: {
        name: { type: String },
        progress: { ProgressSchema }
      }
    },
    concurrent: { 
      allow: { type: Number },
      current: { type: Number }
    },
  }, {
    timestamps: true
  });

  return mongooseClient.model('operations', operations);
};
