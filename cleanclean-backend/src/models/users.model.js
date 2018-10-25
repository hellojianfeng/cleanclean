// users-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const userRoleSchema = new Schema(
    {
      role: { 
        oid: {type: Schema.Types.ObjectId }
      },
      org: { 
        oid: { type: Schema.Types.ObjectId },
        name: { type: String }
      },
      data: {type: Schema.Types.Mixed}
    }
  );
  
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
    roles: [ userRoleSchema ],
    data: {type: Schema.Types.Mixed}
  }, {
    timestamps: true
  });

  return mongooseClient.model('users', users);
};
