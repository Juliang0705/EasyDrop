/**
 * Created by Juliang on 5/12/16.
 */

var buckets = require('buckets-js');
var fs = require('fs');
var moment = require('moment');

function Table(){
    this.completedSessionTable = new buckets.Dictionary();
}

Table.prototype.add = function(sessionID,file){
    var timeNow = moment();
    this.completedSessionTable.set(sessionID,{file: file,time: timeNow});
};

Table.prototype.hasSession = function(sessionID){
  return this.completedSessionTable.containsKey(sessionID);
};

Table.prototype.getFileWithSessionID = function(sessionID){
  return this.completedSessionTable.get(sessionID).file;
};

Table.prototype.removeSession = function (sessionID) {
    var removedFile = this.completedSessionTable.remove(sessionID);
    if (removedFile){
        fs.unlink(removedFile.file.path,function(err){
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

Table.prototype.cleanUp = function(timeInSeconds){
    var self = this;
    var timeNow = moment();
    self.completedSessionTable.forEach(function(id,fileTimePair){
        var secondsDiff = timeNow.diff(fileTimePair.time, 'seconds')
        if (secondsDiff > timeInSeconds){
            self.removeSession(id);
        }
    });
};

module.exports = Table;