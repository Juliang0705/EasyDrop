/**
 * Created by Juliang on 5/12/16.
 */

var buckets = require('buckets-js');
var fs = require('fs');

function Table(){
    this.completedSessionTable = new buckets.Dictionary();
}

Table.prototype.add = function(sessionID,file){
  this.completedSessionTable.set(sessionID,file);
};

Table.prototype.hasSession = function(sessionID){
  return this.completedSessionTable.containsKey(sessionID);
};

Table.prototype.getFileWithSessionID = function(sessionID){
  return this.completedSessionTable.get(sessionID);
};

Table.prototype.removeSession = function (sessionID) {
    var removedFile = this.completedSessionTable.remove(sessionID);
    if (removedFile){
        fs.unlink(removedFile.path,function(err){
            if (err)
                console.log(err);
            else
                console.log("Removed file");
        });
        return true;
    }else{
        return false;
    }

};

Table.prototype.size = function(){
    return this.completedSessionTable.size();
};

module.exports = Table;