function ClassWormhole(posX,posY){
    this.posX = posX;
    this.posY = posY;
    this.destination;
    this.ready = true;
}

ClassWormhole.prototype.addDestination = function(destination){
    this.destination = destination;
}

module.exports = ClassWormhole;