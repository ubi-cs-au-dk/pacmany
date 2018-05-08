var pool = require('../db');

var GAME_CONFIG = require('../config.json');
var ClassGhost = require('./ghost.js');
var ClassPlayer = require('./player.js');
var ClassPill = require('./pill.js');
var ClassWormhole = require('./wormhole.js');

GAME_GAME_OVER = 0;
GAME_GAME_WON = 1;
GAME_COUNT_DOWN = 2;
GAME_RUNNING = 3;
GAME_IDLE = 4;

function ClassGame(io, mapFile, gameid, name, pLocation, gamemode, showQRCode, showHighScore, maxPlayers, portalPairs, pillsPerPlayer) {
    this.time = new Date().getTime();

    this.io = io;
    
    this.mapFile = mapFile;
    this.gamemode = gamemode;
    this.showQRCode = showQRCode;
    this.showHighScore = showHighScore;
    this.gameid = gameid;
    this.name = name;
    this.location = pLocation;
    this.maxPlayers = maxPlayers;
    this.portalPairs = portalPairs;
    this.pillsPerPlayer = pillsPerPlayer;

    this.lives = 5;
    this.gameScore = 0;
    this.portalsused = 0;
    
    this.players = [];
    this.ghosts = [];
    this.pills = [];
    this.connectedScreens = [];
    this.wormholes = [];

    this.team1 = [];
    this.team2 = [];
    this.team1lives = GAME_CONFIG.GAME_LIFE_COUNT;
    this.team2lives = GAME_CONFIG.GAME_LIFE_COUNT;
    this.team1score = 0;
    this.team2score = 0;
    //https://flatuicolors.com/palette/nl
    this.predefinedColors = [
        [234, 32, 39], //Red
        [247, 159, 31], //Orange
        [6, 82, 221], //Blue
        [163, 203, 56], //Lightgreen
        [0, 148, 50], //DarkGreen
        [18, 203, 196] //Cyan
    ];
    
    this.gameState = GAME_IDLE;
}

ClassGame.prototype.getGhostPositon = function() {
    return this.mapData.POSITIONS_GHOSTS[Math.floor(Math.random()*this.mapData.POSITIONS_GHOSTS.length)];
}

ClassGame.prototype.gameStep = function() {
    for(i=0;i<this.ghosts.length;i++) {
        this.ghosts[i].move();
    }
    for(i=0;i<this.players.length;i++) {
        this.players[i].move();
    }
    this.collision();
}

ClassGame.prototype.addPlayer = function(playerid,  nickname, color, socket, socketid) {
    if (this.gameState == GAME_IDLE)
        this.switchGameState(GAME_COUNT_DOWN);
    
    if (this.gamemode  == "Competitive"){
        var life = GAME_CONFIG.GAME_LIFE_COUNT;
    }
    
    position = this.getRandPos();
    player = new ClassPlayer(this.io, this.gameid, playerid, nickname, color, position.x, position.y, this.getRandDirection(), socket, socketid, life);
    this.players.push(player);
    
    if (this.gamemode == "TeamCompetitive"){
        if(this.team1.length > this.team2.length){
            this.team2.push(player);
        }else{
            this.team1.push(player);
        }
    }

    pool.connect(function(err, client, done) {
        if(err) {
            return console.error('Error #016: fetching client from pool', err);
        }
        client.query('INSERT INTO player_action(game_id, controller_id, player_actiontype, action_data) VALUES($1, $2, $3, $4)',[this.gameid, playerid, 0, {"x":position.x,"y":position.y}], function(err, result) {
            done(err);
            if(err) {
            return console.error('Error #017: running query',err);
            }
        });
    });
}

ClassGame.prototype.getPredefinedPlayerColor = function() {
    if(this.predefinedColors.length > 0){
        return this.predefinedColors.shift();
    }else{
        return this.getPlayerColor();
    }
}

ClassGame.prototype.getPlayerColor = function() {
     do {
        difference = false;
        var rgb = Math.floor(Math.random()*3);
        if(rgb == 0) {
            color = [Math.floor(Math.random()*100+155), Math.floor(Math.random()*155), Math.floor(Math.random()*55)];
        } else if(rgb == 1) {
            color = [Math.floor(Math.random()*155), Math.floor(Math.random()*100+155), Math.floor(Math.random()*155)];
        } else {
            color = [Math.floor(Math.random()*155), Math.floor(Math.random()*55), Math.floor(Math.random()*100+155)];
        }
        for(player in this.players) {
            if(this.colorDistance(color, this.players[player].color) < 150){
                difference = true;
            }
        }
    } while(difference);
    console.log("Color: " + color);
    return color;
}

ClassGame.prototype.colorDistance = function(color1,color2){
    return Math.sqrt(Math.pow(color1[0]-color2[0],2)+Math.pow(color1[1]-color2[1],2)+Math.pow(color1[2]-color2[2],2));
}

ClassGame.prototype.notifyPlayer = function(players,message,data) {
    for(i = 0; i < this.players.length;i++) {
        this.io.to(this.players[i].playerid).emit(message,data);
    }
}


ClassGame.prototype.getRandDirection = function(){
    return Math.floor(Math.random()*4);
}

ClassGame.prototype.getRandPos = function(){
        
        x = Math.floor(Math.random()*this.mapWidth);
        y = Math.floor(Math.random()*this.mapHeight);

    while(this.usedMap[x][y] != 1) {
        x = Math.floor(Math.random()*this.mapWidth);
        y = Math.floor(Math.random()*this.mapHeight);
        }
    return {x:x,y:y};
    
}

ClassGame.prototype.updateScreens = function(){    
    var playerList = [];
    for (p in this.players){
        if(!this.players[p].out){
            var currPlayer = {
                nickname : this.players[p].nickname, 
                score : this.players[p].score, 
                color : this.players[p].color, 
                posX : this.players[p].posX, 
                posY : this.players[p].posY, 
                pillActive: this.players[p].pillActive, 
                direction: this.players[p].direction,
                team: getPlayerTeam(this.players[p].playerid, this)
            };
            playerList.push(currPlayer);
        }
    }
    var wormholeList =[];
    for (w in this.wormholes){
        vecX = this.wormholes[w].destination.posX-this.wormholes[w].posX;
        vecY = this.wormholes[w].destination.posY-this.wormholes[w].posY;
        vecLen = Math.sqrt(Math.pow(Math.abs(vecX),2)+Math.pow(Math.abs(vecY),2));
        nvecX = vecX/(vecLen*2)
        nvecY = vecY/(vecLen*2)
        wormholeList.push({x:this.wormholes[w].posX,y:this.wormholes[w].posY,ready:this.wormholes[w].ready,destX :nvecX,destY:nvecY});
    } 
    data = {players:playerList, ghosts:this.ghosts, score:this.gameScore, maxScore:this.maxScore, lives:this.lives, pills:this.pills, wormholes:wormholeList, gamemode: this.gamemode}
    if(this.gamemode == "TeamCompetitive"){
        data.team1lives = this.team1lives;
        data.team2lives = this.team2lives;
        data.team1score = this.team1score;
        data.team2score = this.team2score;
    }
    this.io.to(this.gameid).emit("updateScreens",data);
    this.emitScores();
}


ClassGame.prototype.emitScores = function() {
    var playerData = [];
    if(this.gamemode == "Competitive"){
        for (player in this.players ){
            playerData.push(
                {
                    nickname: this.players[player].nickname, 
                    score: this.players[player].score, 
                    id : this.players[player].playerid, 
                    color : this.players[player].color, 
                    pillCount:this.players[player].pillCount,
                    portalsused:this.players[player].portalsused
                }
            );
        }
    } else if(this.gamemode == "Collaborative") {
        pc = 0;
        for(pill in this.pills){
            if(this.pills[pill].ready) {
                pc += 1;
            }
        }
        playerData.push({nickname: "Score", score: this.gameScore, id : this.gameid, pillCount: pc, portalsused: this.portalsused});
    } else if(this.gamemode == "TeamCompetitive"){
        team1score = 0;
        team2score = 0;
        team1pc = 0;
        team2pc = 0;
        team1portalsused = 0;
        team2portalsused = 0;
        for(player in this.team1){
            team1score += this.team1[player].score;
            team1pc += this.team1[player].pillCount;
            team1portalsused += this.team1[player].portalsused;
        }
        for(player in this.team2){
            team2score += this.team2[player].score;
            team2pc += this.team2[player].pillCount;
            team2portalsused += this.team2[player].portalsused;
        }
        playerData.push(
            {
                nickname: "Team 1", 
                score: team1score, 
                id: this.gameid, 
                color: GAME_CONFIG.TEAM_1_COLOR,
                pillCount: team1pc,
                portalsused: team1portalsused
            }
        );
        playerData.push(
            {
                nickname: "Team 2", 
                score: team2score, 
                id: this.gameid, 
                color: GAME_CONFIG.TEAM_2_COLOR,
                pillCount: team2pc,
                portalsused: team2portalsused
            }
        );
    }
    this.notifyPlayer(this.players,"updateScores", playerData);
}
    
ClassGame.prototype.collision = function() {
    for (player in this.players ){
        if(!this.players[player].out){
            var playerX = this.players[player].posX;
            var playerY = this.players[player].posY;
            if(playerX % 1 == 0 && playerY % 1 == 0) {
                if(this.usedMap[playerX][playerY] == 1){
                    this.players[player].score +=1;
                    if(this.gamemode == "TeamCompetitive"){
                        if(getPlayerTeam(this.players[player].playerid, this) == "team1"){
                            this.team1score += 1;
                        }else{
                            this.team2score += 1;
                        }
                    }
                    this.gameScore +=1;               
                    this.usedMap[playerX][playerY] = 3;
                    this.io.to(this.gameid).emit("updateMap", data = {x:playerX,y:playerY,value:3})
                }
            }
            for(wormhole in this.wormholes) {
                if(playerX == this.wormholes[wormhole].posX && playerY == this.wormholes[wormhole].posY&& this.wormholes[wormhole].ready){
                    this.players[player].posX = this.wormholes[wormhole].destination.posX;
                    this.players[player].posY = this.wormholes[wormhole].destination.posY;
                    this.players[player].portalsused +=1;
                    this.wormholes[wormhole].ready = false;
                    this.wormholes[wormhole].destination.ready = false;
                    this.portalsused += 1;
                    setTimeout(function(wormhole) {wormhole.ready = true}, 5000, this.wormholes[wormhole]);
                    setTimeout(function(wormhole) {wormhole.ready = true}, 5000, this.wormholes[wormhole].destination);
                    switch(this.players[player].direction){
                        case 0:
                            this.io.to(this.gameid).emit("redrawTile",{x:playerX,y:playerY+1});
                            break;
                        case 1:
                            this.io.to(this.gameid).emit("redrawTile",{x:playerX-1,y:playerY});
                            break;
                        case 2:
                            this.io.to(this.gameid).emit("redrawTile",{x:playerX,y:playerY-1});
                            break;
                        case 3:
                            this.io.to(this.gameid).emit("redrawTile",{x:playerX+1,y:playerY});
                            break;
                        default:
                            break;
                    }
                }
            }
            pid = this.players[player].playerid;
            for(p in this.pills){
                pill = this.pills[p];
                if(pill.ready){
                    if(pill.position.x == playerX && pill.position.y == playerY) {
                        
                        if(this.gamemode == "Collaborative" || (
                        this.players[player].color[0] == pill.color[0] &&
                        this.players[player].color[1] == pill.color[1] &&
                        this.players[player].color[2] == pill.color[2])) {
                            if(this.gamemode == "Competitive"){
                                this.players[player].pillCount -= 1;
                            }
                            pill.ready = false;
                            this.players[player].score += 5;
                            this.gameScore +=5;
                            this.io.to(this.players[player].playerid).emit("PillEaten");
                        }
                    }
                }
            }
            if(this.players[player].isAlive){
                for(ghost in this.ghosts){
                    if(!this.players[player].pillActive && Math.sqrt(Math.pow(playerX-this.ghosts[ghost].posX,2)+Math.pow(playerY-this.ghosts[ghost].posY,2)) <= 1){
                        this.players[player].isAlive = false;
                        this.players[player].pillActive = true;
                        setTimeout(function(player) {player.pillActive = false},5000,this.players[player])
                        pool.connect(function(err, client, done) {
                            if(err) {
                                return console.error('Error #018: fetching client from pool', err);
                            }
                            client.query('INSERT INTO player_action(game_id, controller_id, player_actiontype, action_data) VALUES($1, $2, $3, $4)',[this.gameid, pid, 2, "0"], function(err, result) {
                                done(err);
                                if(err) {
                                    return console.error('Error #019: running query',err);
                                }
                            });
                        });
                        if(this.gamemode == "Competitive"){
                            this.players[player].lives -= 1;
                            this.io.to(this.players[player].playerid).emit("lifeDrain");
                            if(this.players[player].lives == 0){
                                out = this.players[player]
                                this.io.to(this.gameid).emit("redrawTile", {x:out.posX,y:out.posY});
                                this.io.to(out.playerid).emit("waitForOtherPlayers");
                                out.out = true;
                            }
                        } else if(this.gamemode == "Collaborative"){
                            this.lives -= 1;
                        }else if(this.gamemode == "TeamCompetitive"){
                            if(getPlayerTeam(this.players[player].playerid, this) == "team1"){
                                this.team1lives -= 1;
                                for(teamplayer in this.team1){
                                    this.io.to(this.team1[teamplayer].playerid).emit("lifeDrain");
                                }
                            }else{
                                this.team2lives -= 1;
                                for(teamplayer in this.team2){
                                    this.io.to(this.team2[teamplayer].playerid).emit("lifeDrain");
                                }
                            }
                        }
                        try {
                            setTimeout(function(player,s) {s.setAlive(player,s)},3000,player,this);
                        } catch (e) {
                            if (e instanceof TypeError){
                                console.log("TypeError, Player or Game no longer exists.");
                            }
                        } 
                    }
                }
            }
        }
    }
}

ClassGame.prototype.setAlive = function(player,s){
    try {
        s.players[player].isAlive = true;
        s.players[player].direction = s.players[player].oldDirection;
    } catch (e) {
        if (e instanceof TypeError){
            console.error("TypeError");
        }
    }
}

ClassGame.prototype.restart = function(){
    this.switchGameState(GAME_GAME_OVER);
}

ClassGame.prototype.init = function(){
    this.mapData = require("../public/maps/" + this.mapFile).mapData();
    this.usedMap = JSON.parse(JSON.stringify(this.mapData.usedMap));
    this.mapWidth = this.mapData.usedMap.length;
    this.mapHeight = this.mapData.usedMap[0].length;
    this.maxScore = getMaxScore(this.mapData.usedMap);
    this.lives = GAME_CONFIG.GAME_LIFE_COUNT;
    this.team1lives = GAME_CONFIG.GAME_LIFE_COUNT;
    this.team2lives = GAME_CONFIG.GAME_LIFE_COUNT;
    this.team1score = 0;
    this.team2score = 0;
    this.gameScore = 0;
    this.portalsused = 0;

    //reset Player life
    for(player in this.players){
        this.players[player].lives = GAME_CONFIG.GAME_LIFE_COUNT;
    }
    for (i=0;i<this.portalPairs;i++){
        pos1 = this.getRandPos();
        pos2 = this.getRandPos();
        while (Math.abs(pos1.x-pos2.x) < this.mapWidth/3){
            pos2 = this.getRandPos();
        }
        hole1 = new ClassWormhole(pos1.x,pos1.y);
        hole2 = new ClassWormhole(pos2.x,pos2.y);
        hole1.addDestination(hole2);
        hole2.addDestination(hole1);
        this.wormholes.push(hole1);
        this.wormholes.push(hole2);
        this.usedMap[pos1.x][pos1.y] = 3;
        this.io.to(this.gameid).emit("updateMap", data = {x:pos1.x,y:pos1.y,value:3})
        this.usedMap[pos2.x][pos2.y] = 3;
        this.io.to(this.gameid).emit("updateMap", data = {x:pos2.x,y:pos2.y,value:3})
    }
    // reset pills
    this.pills = [];
    pillCount = 0;
    if(this.gamemode != "TeamCompetitive"){
        for (i = 0; i < this.mapWidth; i++) {
            for(j=0; j < this.mapHeight; j++ ){
                if (this.usedMap[i][j] == 4){
                    if (this.gamemode == "Collaborative"){
                        this.pills.push(new ClassPill({x:i, y:j},0,255));
                    } else {
                        if(pillCount % 2 == 0){
                            this.pills.push(new ClassPill({x:i, y:j},1,[255,0,255]));
                        } else {
                            this.pills.push(new ClassPill({x:i, y:j},2,[255,255,0]));
                        }
                        pillCount = pillCount +1;
                    }
                }
            }
        }
    }
    
    this.ghosts = [];
    for(i = 1; i <= this.mapData.GHOST_COUNT; i++) {
        this.ghosts.push(new ClassGhost(this.gameid, i, this.getRandPos(), this.mapData.GHOST_START_DIRECTION));
    }
}

ClassGame.prototype.switchGameState = function(new_GameState){
    if(new_GameState == GAME_IDLE) {
        this.io.to(this.gameid).emit("toIdle", {map: this.mapData.file});
    } else if (new_GameState == GAME_GAME_OVER){
        this.time = new Date().getTime();
        this.io.to(this.gameid).emit("gameOver", {});
        this.notifyPlayer(this.players, 'gameOverPlayer', data = {})
        this.players = [];
        this.team1 = [];
        this.team2 = [];
    } else if (new_GameState == GAME_GAME_WON){
        this.time = new Date().getTime();
        if(this.gamemode == "Competitive"){
            for(player in this.players){
                if(this.players[player].pillCount==0){
                    this.io.to(this.gameid).emit("gameWon", {winner : this.players[player].nickname});
                }
            }
        } else {
            this.io.to(this.gameid).emit("gameWon", {});
        }
        this.notifyPlayer(this.players,'gameWonPlayer',data = {})
        this.players = [];
        this.team1 = [];
        this.team2 = [];
    } else if (new_GameState == GAME_COUNT_DOWN){
        this.time = new Date().getTime();
        this.init();
        this.io.to(this.gameid).emit("resetMap", data = {mapFile:this.mapData.file})
        
    }
    
    this.gameState = new_GameState;
}

ClassGame.prototype.updateGame = function(){
    //try{
        if (this.connectedScreens.length == 0 && this.played == true){
            console.log("removed game");
            delete Games[this.gameid];
            return true;
        } else if(this.gameState == GAME_RUNNING){
            this.gameStep();
            this.updateScreens();
            
            // Is Game over? Is game won?
            if(this.gamemode == "Competitive"){
                var allDead = true;
                for(var player in this.players){
                    if(this.players[player].lives > 0){
                        allDead =false;
                    }
                    if(this.players[player].pillCount == 0 && this.players[player].score> 200 && this.players[player].portalsused > 6){
                    this.switchGameState(GAME_GAME_WON);
                    }
                }
                if(allDead && this.players.length > 0) {
                    this.switchGameState(GAME_GAME_OVER);
                }
                if(this.gameScore >= this.maxScore){
                    this.switchGameState(GAME_GAME_WON);
                }
            } else if(this.gamemode == "Collaborative"){
                var allPillsEaten = true;
                for(pill in this.pills){
                    if(this.pills[pill].ready){
                        allPillsEaten = false;
                    }
                }
                if(allPillsEaten && this.gameScore > 400 && this.portalsused > 12) {
                    this.switchGameState(GAME_GAME_WON);
                }
                if(this.lives <= 0) {
                    this.switchGameState(GAME_GAME_OVER);
                } else if(this.gameScore >= this.maxScore){
                    this.switchGameState(GAME_GAME_WON);
                }
            } else if(this.gamemode == "TeamCompetitive"){
                var gameOver = (this.team1lives <= 0 || this.team2lives <= 0);
                if(gameOver){
                    this.switchGameState(GAME_GAME_OVER);
                }
            } else {
                if(this.lives <= 0) {
                    this.switchGameState(GAME_GAME_OVER);
                } else if(this.gameScore >= this.maxScore){
                    this.switchGameState(GAME_GAME_WON);
                }
            }
        } else if(this.gameState == GAME_COUNT_DOWN){
            timeleft = new Date().getTime() - this.time;
            
            if (this.ghosts.length == 0){
                for(i=1; i <= this.mapData.GHOST_COUNT;i++) {
                    this.ghosts.push(new ClassGhost(this.gameid, i, this.getGhostPositon(), this.mapData.GHOST_START_DIRECTION));
                }
            }
            
            // to show joining players
            this.updateScreens();
            
            if (timeleft <= GAME_CONFIG.GAME_COUNT_DOWN_TIME * 1000){
                this.io.to(this.gameid).emit("gameCountDown", data = {time : GAME_CONFIG.GAME_COUNT_DOWN_TIME * 1000 - timeleft});
            } else {
                this.switchGameState(GAME_RUNNING);
                this.time = new Date().getTime()
            }
            
        } else if(this.gameState == GAME_GAME_OVER) {
            if (new Date().getTime() - this.time >  GAME_CONFIG.GAME_DELAY_AFTER_GAME * 1000){
                this.switchGameState(GAME_IDLE);
            }
        } else if(this.gameState == GAME_GAME_WON) {
            if (new Date().getTime() - this.time > GAME_CONFIG.GAME_DELAY_AFTER_GAME * 1000){
                this.switchGameState(GAME_IDLE);
            }
        } else if(this.gameState == GAME_IDLE) {
            if (this.ghosts.length == 0){
                
                for(i=1; i <= this.mapData.GHOST_COUNT;i++) {
                    this.ghosts.push(new ClassGhost(this.gameid, i, this.getGhostPositon(), this.mapData.GHOST_START_DIRECTION));
                }
            }

            this.gameStep();
            this.updateScreens();
            
            if(this.players.length > 0){
                this.switchGameState(GAME_COUNT_DOWN);
            }
        } else {
            console.log('Nothing to do');
        }
    /*} catch (err) {
        console.log(err.message);
    }*/
    return true;
}

/*** HELPER METHODS ***/
function getPlayerTeam(playerid, game) {
    var i;
    var list = game.team1;
    for (i = 0; i < list.length; i++) {
        if (list[i].playerid === playerid) {
            return "team1";
        }
    }

    return "team2";
}

function getMaxScore(usedMap){
    mScore = 0;
    for (var x = 0; x<usedMap.length;x++) {
        for (var y = 0;y < usedMap[0].length;y++) {
            if(usedMap[x][y] == 1) {
                mScore +=1
            } else if(usedMap[x][y] == 4){
                mScore += 5;
            }
        }
    }
    return mScore;
}

module.exports = ClassGame;