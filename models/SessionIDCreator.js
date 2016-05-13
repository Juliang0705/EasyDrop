/**
 * Created by Juliang on 5/12/16.
 */
var buckets = require('buckets-js');

function randomIntFromInterval(min,max)
{
    return Math.floor(Math.random()*(max-min+1)+min);
}

function Creator(){
    this.sessionIDSet = new buckets.Set();
}

Creator.prototype.getNewSessionID = function(){
    return (function recursiveGetNewID(creator) {
        var id = randomIntFromInterval(1000, 10000);
        if (creator.sessionIDSet.contains(id))
            recursiveGetNewID();
        else{
            creator.sessionIDSet.add(id);
            return id;
        }
    })(this);
};

Creator.prototype.size = function(){
    return this.sessionIDSet.size();
};

Creator.prototype.contains = function(id){
    return this.sessionIDSet.contains(id);
};

Creator.prototype.remove = function(id){
    return this.sessionIDSet.remove(id);
};

module.exports = Creator;