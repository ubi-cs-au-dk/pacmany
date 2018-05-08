var pool = require('../db');

function ClassGhost(gameid, ghostid, position, direction){
    this.gameid = gameid;
    this.id = ghostid;
    this.posX = position.x;
    this.posY = position.y;
    this.direction = direction;
    this.color = this.getRandColor();
    
    pool.connect(function(err, client, done) {
        if(err) {
            console.error('Error #020: fetching client from pool', err);
            return;
        } else {
            client.query('INSERT INTO ghost_movement(game_id, ghost_id, ghost_actiontype, action_data) VALUES($1, $2, $3, $4)',[gameid, ghostid, 0, {"x":position.x, "y":position.y}], function(err, result) {
                done(err);
                if(err) {
                    console.error('Error #021: running query', err);
                    return;
                }
            });
        }
    });
}

ClassGhost.prototype.move = function() {

    var oldPos = {x:this.posX, y:this.posY}
    var oldDirection = this.direction;

    switch(this.direction) {
        case 0:
            var newPos = { x:this.posX, y:this.posY - 0.25};
            break;
        case 1:
            var newPos = {x:this.posX + 0.25, y:this.posY}
            break;
        case 2:
            var newPos = {x:this.posX, y:this.posY + 0.25}
            break;
        case 3:
            var newPos = {x:this.posX - 0.25, y:this.posY}
            break;
        default:
            console.error("ERROR #051: Ghost wrong direction");
            return;
    }
    
    if (Games[this.gameid] == null){
        console.error("ERROR #028: game is null, game id " + this.gameid);
        return;
    }
            
    
    if(newPos.y < 0){
        this.direction = 0;
        this.posY = Games[this.gameid].mapHeight-1;
        return;
    } else if (newPos.y >= Games[this.gameid].mapHeight) {
        this.direction = 2;
        this.posY = 0;
        return;
    }

    if(newPos.x <= 0){
        this.direction = 3;
        this.posX = Games[this.gameid].mapWidth-1;
        return;
    } else if (newPos.x >= Games[this.gameid].mapWidth) {
        this.direction = 1;
        this.posX = 1;
        return;
    }


    if(oldPos.x % 1 == 0 && oldPos.y % 1 == 0) {
        switch(oldDirection) {
            case 0:
                if(Games[this.gameid].usedMap[oldPos.x][Math.floor(oldPos.y-0.25)] == 0){
                    while(this.direction == oldDirection || this.direction == (oldDirection +2 )%4){
                        randomValue = Math.floor(Math.random()*2);
                        if(randomValue == 0){
                            this.direction = 1;
                        }else if (randomValue == 1) {
                            this.direction = 3;
                        }
                    }
                    return;
                }
                break;
            case 1:
                if(Games[this.gameid].usedMap[Math.floor(oldPos.x+1.25)][Math.floor(oldPos.y)] == 0){
                    while(this.direction == oldDirection || this.direction == (oldDirection +2 )%4){
                       randomValue = Math.floor(Math.random()*2);
                       if(randomValue == 0){
                            this.direction = 0;
                        }else if (randomValue == 1) {
                            this.direction = 2;
                        }
                    }
                    return;
                }
                break;
            case 2:
                if(Games[this.gameid].usedMap[oldPos.x][Math.floor(oldPos.y+1.25)] == 0){
                    while(this.direction == oldDirection || this.direction == (oldDirection +2 )%4){
                        randomValue = Math.floor(Math.random()*2);
                        if(randomValue == 0){
                            this.direction = 1;
                        }else if (randomValue == 1) {
                            this.direction = 3;
                        }
                    }
                    return;
                }
                break;
            case 3:
                if(Games[this.gameid].usedMap[Math.floor(oldPos.x-0.25)][Math.floor(oldPos.y)] == 0){
                    randomValue = Math.floor(Math.random()*2);
                   if(randomValue == 0){
                        this.direction = 0;
                    }else if (randomValue == 1) {
                        this.direction = 2;
                    }
                    return;
                }
                break;
            default:
                this.direction  = oldDirection;
                return;
        }
    }else if(newPos.x % 1 == 0 && newPos.y % 1 == 0) {
        var neighbours = [];
        neighbours.push(Games[this.gameid].usedMap[newPos.x][newPos.y-1]);
        neighbours.push(Games[this.gameid].usedMap[newPos.x+1][newPos.y]);
        neighbours.push(Games[this.gameid].usedMap[newPos.x][newPos.y+1]);
        neighbours.push(Games[this.gameid].usedMap[newPos.x-1][newPos.y]);
        if(this.direction == 0 || this.direction ==2) {
            if(neighbours[1] != 0 && neighbours[3] !=0 && neighbours[1] != 2 && neighbours[3] !=2) {
                randomValue = Math.floor(Math.random()*3);
                if(randomValue == 0){
                    this.direction = 1;
                }else if (randomValue == 1){
                    this.direction = 3;
                } else {
                    this.direction = oldDirection;
                } 
            } else if(neighbours[1] != 0 && neighbours[1] != 2){
                if(neighbours[this.direction] == 0){
                    this.direction = 1;
                } else {
                    randomValue = Math.floor(Math.random()*2);
                    if(randomValue == 0){
                        this.direction = 1;
                    }
                }
            } else if(neighbours[3] != 0 && neighbours[3] != 2){
                if(neighbours[this.direction] == 0){
                    this.direction = 3;
                } else {
                    randomValue = Math.floor(Math.random()*2);
                    if(randomValue == 0){
                        this.direction = 3;
                    }
                }
            }
        } else if(this.direction == 1 || this.direction ==3) {
            if(neighbours[0] != 0 && neighbours[2] !=0 && neighbours[0] != 2 && neighbours[2] != 2){
                randomValue = Math.floor(Math.random()*3);
                if(randomValue == 0){
                    this.direction = 0;
                }else if (randomValue == 1) {
                    this.direction = 2;
                } else {
                    this.direction = oldDirection;
                }
            } else if(neighbours[0] != 0 && neighbours[0] != 2){
                if(neighbours[this.direction] == 0){
                    this.direction = 0;
                } else {
                    randomValue = Math.floor(Math.random()*2);
                    if(randomValue == 0){
                        this.direction = 0;
                    }
                }
            } else if(neighbours[2] != 0 && neighbours[2] != 2){
                if(neighbours[this.direction] == 0){
                    this.direction = 2;
                } else {
                    randomValue = Math.floor(Math.random()*2);
                    if(randomValue == 0){
                        this.direction = 2;
                    }
                }
            }
        }
    } 
    if(this.direction == (oldDirection+2)%4){
        this.direction = oldDirection;
        return;
    }
    switch(this.direction) {
        case 0:
            if(Games[this.gameid].usedMap[newPos.x][Math.floor(newPos.y-1)] == 2){
                this.direction = oldDirection;
            }
            break;
        case 1:
            if(Games[this.gameid].usedMap[Math.floor(newPos.x+1)][newPos.y] == 2){
                this.direction = oldDirection;
            }
            break;
        case 2:
            if(Games[this.gameid].usedMap[newPos.x][Math.floor(newPos.y+1)] == 2){
                this.direction = oldDirection;
            }
            break;
        case 3:
            if(Games[this.gameid].usedMap[Math.floor(newPos.x+1)][newPos.y] == 2){
                this.direction = oldDirection;
            }
            break;
        default:
            break;
    }
    if (this.direction != oldDirection) {
        
        log = [this.gameid, this.id, 1, this.direction]
        /*pool.connect(function(err, client, done) {
            if(err) {
                return console.error('Error #022: fetching client from pool', err);
            } else {
                client.query('INSERT INTO ghost_movement (game_id, ghost_id, ghost_actiontype, action_data) VALUES($1, $2, $3, $4)',log , function(err, result) {
                    done(err);
                    if(err) {
                        return console.error('Error #023: running query', log);
                    }
                });
            }
        });*/
    }
    this.posX = newPos.x;
    this.posY = newPos.y;
}

ClassGhost.prototype.getRandDirection = function(){
    return Math.floor(Math.random()*4);

}

ClassGhost.prototype.getRandColor = function() {
    return [Math.floor(Math.random()*155+100), Math.floor(Math.random()*100), 0];
}

module.exports = ClassGhost;