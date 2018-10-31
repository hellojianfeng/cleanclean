const fs = require('fs');

return module.exports = {
    getTailFileInDotFolder: function(tailPath, fileName, seperator = "."){

        let isLoop = true;
        let lastPath = tailPath.slice(tailPath.lastIndexOf("/"));
        const prePath = tailPath.slice(0,tailPath.indexOf(lastPath));
        let path = null;

        while(isLoop) {
            if (fs.existsSync(prePath + lastPath + '/' + fileName)) {
                path = prePath + lastPath + '/' + fileName;
                isLoop = false;
            } else if (lastPath.lastIndexOf(seperator)!== -1 ){
                lastPath = lastPath.slice(0, lastPath.lastIndexOf(seperator));
            } else {
                isLoop = false;
            }
          } 
        return path;
    },
  };