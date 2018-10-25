
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
    const mongooseClient = app.get('mongooseClient');
    const { Schema } = mongooseClient;
    
    const progressSchema = new Schema({
      percentage: Number,
      data: {
        type: Schema.Types.Mixed
      }
    });

    const typeSchema = new Schema({
        name: { type: String },
        display_name: { type: String },
        path: { type: String }, // dot sperated string, for example, company.softwareCompany, default is same as name
        data: {
            type: Schema.Types.Mixed
        }
    });
  
    return { progressSchema, typeSchema }
  };
  