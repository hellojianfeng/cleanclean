// operations-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const { ProgressSchema } = require('./schemas')(app);
  const operationStage = new Schema({
    name: { type: String }, //for example, ready, start, end, ....
    display_name: { type: String },
    seq: { type: Number }, //seq no of stage,
    start: { type: Schema.Types.Mixed }, //usually it is a expression for start
    end: { type: Schema.Types.Mixed },//usually it is a expression for start
    expire: { type: Schema.Types.Mixed },//usually it is a expression for start
    data: { type: Schema.Types.Mixed }
  });

  /** operation role define role to allow run operation, children(parent) means children(parent) 
   * role can also run operation, if specify recursive as true, means recursive children(parent) is 
   * allowed to run operation, if not specify recursive, means recursive is false 
   * if want to exclude one or its children(parent) from all children(parent), exclude property is 
   * used for that purpose
   */
  const operationRole = new Schema({
    oid: { type: Schema.Types.ObjectId },
    include: {
      children: { recursive: Boolean },
      parent: { recursive: Boolean },
    },
    exclude: {
      children: [{ path: { type: String }, recursive: { type: Boolean } }],
      parent: [{ path: { type: String }, recursive: { type: Boolean } }],
    },
    data: { type: Schema.Types.Mixed }
  });

  const operations = new Schema({
    name: { type: String, required: true },
    path: { type: String, required: true },//dot seperate name of operation, unique in app
    display_name: { type: String },
    data: { type: Schema.Types.Mixed },
    app: { type: String, default: 'default' },
    org: { type: Schema.Types.ObjectId, required: true  },
    roles: [ operationRole ],
    stages: [ operationStage ],
    concurrent: { 
      allow: { type: Number },
      current: { type: Number }
    },
  }, {
    timestamps: true
  });

  operations.index({ path: 1, org: 1, app: 1 },  { unique: true });

  return mongooseClient.model('operations', operations);
};
