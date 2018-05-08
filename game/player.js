function ClassPlayer(io, gameid, playerid, nickname, color, posX, posY, direction, socket, socketid,lives) {
    this.io = io;
    this.gameid = gameid;
    this.playerid = playerid;
    this.nickname = nickname;
    this.color = color;
    this.posX = posX;
    this.posY = posY;
    this.direction = direction;
    this.socket = socket;
    this.socketid = socketid;
    this.lives = lives;
    this.out = false;
   

    this.portalsused = 0;
    this.pillActive = false;
    this.isAlive = true;
    this.newDirection = direction;
    this.oldDirection = direction;
    this.score = 0;
    this.pillCount = 0;
    if(Games[this.gameid].gamemode == "Competitive"){
        for(pill in Games[this.gameid].pills){
            if(Games[this.gameid].pills[pill].id %2 == Games[this.gameid].players.length%2){
                this.pillCount+=1;
            }
        }
    }
}

ClassPlayer.prototype.setNewDirection = function(newDirection) {
    this.newDirection = newDirection;
}

ClassPlayer.prototype.move = function() {
    if(this.isAlive) {
        var oldPos = {
            x:this.posX,
            y:this.posY
        }

        this.oldDirection = this.direction;

        var newPos
        switch(this.direction) {
            case 0:
                newPos = {x:this.posX, y:this.posY - 0.25 };     
                break;
            case 1:
                newPos = {x:this.posX + 0.25, y:this.posY}
                break;
            case 2:
                newPos = {x:this.posX,y:this.posY + 0.25}
                break;
            case 3:
                newPos = {x:this.posX - 0.25, y:this.posY}
                break;
            default:
                this.direction  = this.oldDirection;
                newPos = oldPos;
            }
        if(newPos.y < 0){
            this.direction = 0;
            this.posY = Games[this.gameid].mapHeight-1;
            this.io.to(this.gameid).emit("redrawTile",oldPos);
            return;
        } else if (newPos.y >= Games[this.gameid].mapHeight) {
            this.direction = 2;
            this.posY = 0;
            this.io.to(this.gameid).emit("redrawTile",oldPos);
            return;
        }
        if(newPos.x <= 0){
            console.log("Test1");
            this.direction = 3;
            this.posX = Games[this.gameid].mapWidth-1;
            console.log(oldPos)
            this.io.to(this.gameid).emit("redrawTile",oldPos);
            return;
        } else if (newPos.x >= Games[this.gameid].mapWidth-1) {
            console.log("Test2");
            console.log(oldPos)
            this.direction = 1;
            this.posX = 1;
            this.io.to(this.gameid).emit("redrawTile",oldPos);
            return;
        }


        if(oldPos.x % 1 == 0 && oldPos.y % 1 == 0) {
            switch(this.oldDirection) {
                case 0:
                    if(Games[this.gameid].usedMap[oldPos.x][Math.floor(oldPos.y-0.25)] == 0){
                        this.direction = this.newDirection;
                        return;
                    }
                    break;
                case 1:
                    if(Games[this.gameid].usedMap[Math.floor(oldPos.x+1.25)][Math.floor(oldPos.y)] == 0){
                        this.direction = this.newDirection;
                        return;
                    }
                    break;
                case 2:
                    if(Games[this.gameid].usedMap[oldPos.x][Math.floor(oldPos.y+1.25)] == 0){
                        this.direction = this.newDirection
                        return;
                    }
                    break;
                case 3:
                    if(Games[this.gameid].usedMap[Math.floor(oldPos.x-0.25)][Math.floor(oldPos.y)] == 0){
                        this.direction = this.newDirection;
                        return;
                    }
                    break;
                default:
                    this.direction  = this.oldDirection;
                
            }
        } else if(newPos.x % 1 == 0 && newPos.y % 1 == 0) {
            var neighbours = [];
                neighbours.push(Games[this.gameid].usedMap[newPos.x][newPos.y-1]);
                neighbours.push(Games[this.gameid].usedMap[newPos.x+1][newPos.y]);
                neighbours.push(Games[this.gameid].usedMap[newPos.x][newPos.y+1]);
                neighbours.push(Games[this.gameid].usedMap[newPos.x-1][newPos.y]);
            
            switch(this.newDirection){
                case 0:
                    if(neighbours[0] != 0){
                        this.direction = this.newDirection;
                    }
                    break;
                case 1:
                    if(neighbours[1] != 0){
                        this.direction = this.newDirection;
                    }
                    break;
                case 2:
                    if(neighbours[2] != 0){
                        this.direction = this.newDirection;
                    }
                    break;
                case 3:
                    if(neighbours[3] != 0){
                        this.direction = this.newDirection;
                    }
                    break;
                default:
                    this.direction = this.newDirection;
                    break;
            }
        } 
        if(this.direction >= 4){
            this.direction = this.newDirection;
        }
        this.posX = newPos.x;
        this.posY = newPos.y;
    } else {
        this.direction = 4;
    }

}

module.exports = ClassPlayer;