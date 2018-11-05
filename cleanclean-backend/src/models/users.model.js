// users-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;

  const roleSchema = new Schema({
    oid: { type: Schema.Types.ObjectId },
    path: { type: String }, // dot sperated string, for example, default is same as name
    org: { 
      oid: { type: Schema.Types.ObjectId },
      path: { type: String }
    },
    data: { type: Schema.Types.Mixed }
  });
  
  const users = new mongooseClient.Schema({
    mobile: {type: String, unique: true},
    email: {type: String, unique: true, lowercase: true},
    username:{type: String, unique: true, lowercase: true},
    fullname: { 
      surname: { type: String },
      familyname: { type: String },
      middlename: { type: String }
    },
    verified: {
      mobile: { type: Boolean },
      email: { type: Boolean },
      data: { type: Schema.Types.Mixed }
    },
    password: { type: String },
    roles: [ roleSchema ],
    current_org: { type: Schema.Types.ObjectId },
    data: {type: Schema.Types.Mixed}
  }, {
    timestamps: true
  });

  return mongooseClient.model('users', users);
};
