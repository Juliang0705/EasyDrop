/**
 * Created by Juliang on 5/12/16.
 */
var buckets = require('buckets-js');
var moment = require('moment');

function randomIntFromInterval(min,max)
{
    return Math.floor(Math.random()*(max-min+1)+min);
}

function Creator(){
    this.sessionIDSet = new buckets.Dictionary();
}

Creator.prototype.getNewSessionID = function(){
    var id;
    do{
        id = randomIntFromInterval(1000, 10000);
        if (this.sessionIDSet.containsKey(id))
            continue;
        else{
            var timeNow = moment();
            this.sessionIDSet.set(id,timeNow);
            return id;
        }
    }while(true);
};

Creator.prototype.size = function(){
    return this.sessionIDSet.size();
};

Creator.prototype.contains = function(id){
    return this.sessionIDSet.containsKey(id);
};

Creator.prototype.remove = function(id){
    return this.sessionIDSet.remove(id);
};

Creator.prototype.cleanUp = function(timeInSeconds){
    var self = this;
    var timeNow = moment();
    self.sessionIDSet.forEach(function(id,time){
        var secondsDiff = timeNow.diff(time, 'seconds')
        if (secondsDiff > timeInSeconds){
            self.remove(id);
        }
    });
};
module.exports = Creator;