/**
 * Created by Juliang on 5/12/16.
 */
var buckets = require('buckets-js')

function randomIntFromInterval(min,max)
{
    return Math.floor(Math.random()*(max-min+1)+min)
}

function Creator(){
    this.sharedIDSet = new buckets.Set()
}

Creator.prototype.getNewID = function(){
    return (function recursiveGetNewID(creator) {
        var id = randomIntFromInterval(1000, 10000)
        if (creator.sharedIDSet.contains(id))
            recursiveGetNewID()
        else{
            creator.sharedIDSet.add(id)
            return id
        }
    })(this)
}

Creator.prototype.size = function(){
    return this.sharedIDSet.size()
}

Creator.prototype.contains = function(id){
    return this.sharedIDSet.contains(id)
}

Creator.prototype.remove = function(id){
    return this.sharedIDSet.remove(id)
}

module.exports = Creator