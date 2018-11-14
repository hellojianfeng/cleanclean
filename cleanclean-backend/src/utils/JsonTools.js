const fs = require('fs');

return module.exports = {
    
  getJsonsFromPathFiles: function(startPath, jsonFile, seperator = '.', nestedJson = []){

    if (!fs.existsSync(startPath.replace('..','src')+'/'+jsonFile)){
      return nestedJson.reverse();
    }
    const fileName = startPath + '/' + jsonFile;
    const resolvePath = require.resolve(fileName);
    if(require.cache[resolvePath]){
      delete require.cache[resolvePath];
    }
    const startJson = require(fileName);

    nestedJson.push(startJson);

    if (startJson.merge_parent) {
      const startPath2 = startPath.slice(0,startPath.lastIndexOf(seperator));
      if (startPath !== startPath2){
        nestedJson = this.getJsonsFromPathFiles(startPath2, jsonFile, seperator, nestedJson);
      }
    }

    nestedJson = nestedJson.reverse();
    return nestedJson;
  },

  mergeObject: function(object1, object2, depth = 1, startDepth = 0){

    startDepth++;

    if (startDepth > depth){
      return object2;
    }

    for(const key in object2){
      if (!object1[key]){
        object1[key] = object2[key];
      } else {
        if (typeof(!object2[key]) === 'object' && typeof(object1[key])=== 'object'){
          object1[key] = this.mergeObject(object1[key],object2[key],depth,startDepth);
        } 
        else {
          object1[key] = object2[key];
        }
      }
    }

    return object1;
        
  },

  mergeObjects: function(depth = 1, ...args){
    let lastObj = {};
    args.map( o => {
      lastObj = this.mergeObject(lastObj,o,depth);
    });
    return lastObj;
  },

  mergeObjectInArray: function(args, depth = 1){
    let lastObj = {};
    args.map( o => {
      lastObj = this.mergeObject(lastObj,o,depth);
    });
    return lastObj;
  }
};