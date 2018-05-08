function ClassPill(position,id, color) {
    this.position = position;
    this.color = color;
    this.id = id;
    this.ready = true;
}

ClassPill.prototype.eaten = function(){
    ready = false;
}

module.exports = ClassPill;