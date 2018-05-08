var express = require('express');
var app = express();
var fs = require('fs');
var glob = require("glob");
var bodyParser = require('body-parser')
var device = require('express-device');
var path = require('path');
var uaparser = require('ua-parser-js');
var async = require('async')

var GAME_CONFIG = require('./config.json');

const ClassGame = require('./game/game.js');

var https = require('http').Server(app);
var io = require('socket.io')(https);

var pool = require('./db');

var sql = fs.readFileSync('db.sql').toString();

pool.connect(function(err, client, done) {
    if(err) {
        console.error('ERROR #001: DB connection could not be established, check DB connection.', err);
        process.exit(1);
        return;
    }
    client.query(sql, function(err, result){
        done();
        if(err){
            console.log('ERROR #002: could not init db', err);
            process.exit(1);
        }
    });
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(device.capture());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

index = require('./routes/imprint')
app.use('/', index);
app.use('/screen', require('./routes/screen'));
app.use('/games', require('./routes/games'));
app.use('/imprint', index);
app.use('/controller', require('./routes/controller'));


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;

var ConnectedOverviews = [];

io.on('connection', function(socket){
    
    socket.on("connectOverview", function(data,callback) {
        socket.join(socket.id);
        ConnectedOverviews.push(socket.id);
    });
    
    socket.on("connectScreen", function(data,callback) {
        console.log("New screen connected to game ID: " + data.gameid + " screen ID: " + data.screenid);
        if (Games[data.gameid] != null){
            Games[data.gameid].connectedScreens.push(socket);
            socket.join(data.gameid);
            callback({gamemode: Games[data.gameid].gamemode});
        } else {
            //callback(false);
            console.error("ERROR #015: game is null");
       }
    });
    
    socket.on("connectController", function(data, callback) {
        console.log("A new controller connecting to game ID: " + data.gameid)
        if(Games[data.gameid].players.length >= Games[data.gameid].maxPlayers){
        	callback(-1)
        	return
        }
        if (Games[data.gameid] != null){
            var ua = uaparser(data.useragent);
            
            var currentGame = Games[data.gameid];

            if(currentGame.gamemode != "TeamCompetitive"){
                if (currentGame.players.length == 0){
                    var newColor = [255,0,255];
                } else if (currentGame.players.length == 1){
                    var newColor = [255,255,0];
                } else {
                    var newColor = currentGame.getPlayerColor();
                }
            }else{
                /*
                if(currentGame.team1.length > currentGame.team2.length){
                    var newColor = GAME_CONFIG.TEAM_2_COLOR;
                }else{
                    var newColor = GAME_CONFIG.TEAM_1_COLOR;
                }
                */
               var newColor = currentGame.getPredefinedPlayerColor();
            }

            pool.connect(function(err, client, done) {
                if(err) {
                    return console.error('ERROR #010: fetching client from pool', err);
                } else {
                    client.query('INSERT INTO controller(color, model, type, nickname, resolution) VALUES($1, $2, $3, $4, $5) RETURNING ID', [newColor, ua.device.model, ua.device.type, data.nickname, data.resolution], function(err, result) {
                        done(err);
                        if(err) {
                            return console.error('ERROR #011: running query',err);
                        } else {
                            playerid = result.rows[0].id
                            console.log("playerid", playerid);
                            socket.join(playerid);
                            //Add players
                            if(currentGame.gamemode == "Competitive"){
                                currentGame.addPlayer(playerid, data.nickname, newColor, socket, socket.id);
                                socket.to(playerid).emit("resetLife",{life:GAME_CONFIG.GAME_LIFE_COUNT});
                            } else{
                                currentGame.addPlayer(playerid, data.nickname, newColor, socket, socket.id);
                            }
                            //Perform callbacks
                            if(currentGame.gamemode == "Competitive"){
                                callback({playerid : playerid, color : newColor, life : GAME_CONFIG.GAME_LIFE_COUNT});
                            } else if(currentGame.gamemode == "Collaborative") {
                                callback({playerid : playerid, color : newColor});
                            } else if(currentGame.gamemode == "TeamCompetitive"){
                                if(getPlayerTeam(playerid, currentGame) == "team1"){
                                    callback({playerid : playerid, color : newColor, life : currentGame.team1lives, teamColor : GAME_CONFIG.TEAM_1_COLOR});
                                }else{
                                    callback({playerid : playerid, color : newColor, life : currentGame.team2lives, teamColor : GAME_CONFIG.TEAM_2_COLOR});
                                }
                            }
                        }
                    });
                }
            });
        } else {
            console.error("ERROR #012: not a valid game " + data.gameid);
        }
    });

    socket.on("updateRequest", function(data) {
        if (Games[data] != null){
            Games[data].runGame = true;
        } else {
            console.error("ERROR #009: not a valid game " + data);
        }
    });

    socket.on("testEmit",function () {
        console.log("Done");
    });

    socket.on("oldGameConnected", function(data){
        var gameid = data.gameid;
        socket.join(gameid);
        socket.emit("gameData", data= {
            usedMap: Games[gameid].usedMap,
            players: Games[gameid].players,
            ghosts: Games[gameid].ghosts
        });
    });   

    socket.on("pillused", function(data){
        if (Games[data.gameid] != null){
            var players = Games[data.gameid].players;
            for (i = 0; i < players.length; i++) {
                if(players[i].playerid == data.playerid) {
                    players[i].pillActive = true;
                    setTimeout(function(player) {player.pillActive = false}, 3000, players[i])
                    pool.connect(function(err, client, done) {
                        if(err) {
                            return console.error('ERROR #007: fetching client from pool', err);
                        } else {
                            client.query('INSERT INTO player_action(game_id, controller_id, player_actiontype, action_data) VALUES($1, $2, $3, $4)',[data.gameid, data.playerid, 4, "1"], function(err, result) {
                                done(err);
                                if(err) {
                                    return console.error('ERROR #006: running query',err);
                                }
                            });
                        }
                    });
                    break;
                }
            }
        } else {
        console.error("ERROR #008: not a valid game " + data.gameid);
        }
    });

    socket.on("changeDirection", function(data){
        if (Games[data.gameid] != null){
            var players = Games[data.gameid].players;
            for (i=0; i < players.length;i++) {
                if(players[i].playerid == data.playerid) {
                    players[i].setNewDirection(data.newDirection);
                    X = players[i].posX;
                    Y = players[i].posY;
                    pool.connect(function(err, client, done) {
                        console.log("Player move:", data);
                        if(err) {
                            return console.error('ERROR #005: fetching client from pool', err);
                        } else {
                            client.query('INSERT INTO player_action(game_id, controller_id, player_actiontype, action_data) VALUES($1, $2, $3, $4)',[data.gameid, data.playerid, 1, {"direction":data.newDirection,"X":X,"Y":Y}], function(err, result) {
                                done(err);
                                if(err) {
                                    return console.error('ERROR #004: running query', err);
                                }
                            });
                        }
                    });
                    return;
                }
            }
            console.error("ERROR #003: not a valid player " + data.playerid);
        } else {
            console.error("ERROR #002: not a valid game " + data.gameid);
        }
    });

    socket.on("restartGame",function(data) {
        if (Games[data.gameid] != null){
            Games[data.gameid].restart();
        } else {
            console.error("ERROR #026: not a valid game " + data.gameid);
        }
    });

    socket.on("deleteGame",function(data) {
        delete Games[data.gameid];
        });
    
    socket.on("rejoin",function(data,callback) {
        console.log("A controller rejoined!")
        if (Games[data.gameid] != null){
            socket.join(data.playerid);
            
            Games[data.gameid].addPlayer(data.playerid, data.nickname, data.color, socket,
            data.socketid);
            io.to(data.playerid).emit("updateControllerColor",{color:data.color});
            if (Games[data.gameid].gamemode == "Competitive"){
                callback({life:GAME_CONFIG.GAME_LIFE_COUNT})
            }else if(Games[data.gameid].gamemode = "TeamCompetitive"){
                var tc;
                if(getPlayerTeam(data.playerid, Games[data.gameid]) == "team1"){
                    tc = GAME_CONFIG.TEAM_1_COLOR;
                }else{
                    tc = GAME_CONFIG.TEAM_2_COLOR;
                }
                callback({teamColor: tc})
            }
        } else {
          console.error("ERROR #025: not a valid game " + data.gameid);
        }
    });
    
    socket.on('disconnect', function() {
        console.log("Disconnect by ID:", socket.id);
        for(key in Games){
            game = Games[key]
            screenIndex = game.connectedScreens.indexOf(socket);
            if (screenIndex != -1){
                game.connectedScreens.splice(screenIndex, 1);
                console.log("...Screen disconnected");
                return;
            }
            
            for(i=0; i < game.players.length; i++){
                if(game.players[i].socket == socket){
                    data = {'x': game.players[i].posX,'y': game.players[i].posY};
                    socket.to(game.gameid).emit("redrawTile", data);
                    game.players.splice(i,1);
                    console.log("...Player disconnected");
                    return; 
                }
            }
        }
    });

    socket.on("createNewGame", function(data,callback){
        console.log("creating new Game")
        pool.connect(function(err, client, done) {
            if(err) {
                return console.error('ERROR #013: fetching client from pool', err);
            } else{
                client.query('INSERT INTO games(name, map, location,gamemode) VALUES($1, $2, $3, $4) RETURNING ID',[data.name, data.map, data.place, data.gamemode], function(err, result) {
                    done(err);
                    if(err) {
                        return console.error('ERROR #014: running query',err);
                    } else {
                        gameid = result.rows[0].id
                        
                        showQRCode = ~~data.showQRCode;
                        if (showQRCode != 1)
                            showQRCode = 0;
                        
                        showHighScore = ~~data.showHighScore;
                        if (showHighScore != 1)
                            showHighScore = 0;
                        
                        console.log("Game Created ID: " + gameid);
                        mapFile = "map_"+ data.map.replace('/', '_') + ".js";
                        Games[gameid] = new ClassGame(io, mapFile, gameid, data.name, data.place, data.gamemode, showQRCode, showHighScore,data.maxPlayers,data.portalPairs,data.pillsPerPlayer);
                        Games[gameid].init();
                        console.log(gameid +" " +data.splits);
                        callback("/screen?gameid=" + gameid+"&splits="+data.splits+"&splitscreen=0");
                    }
                });
            }
        });
    })

});

var port = GAME_CONFIG.CONFIG_PORT;
https.listen(port, function () {
    console.log('listening on *:'+port);
});

function updateGames(){
    async.eachSeries(Object.keys(Games), function (key, callback) {
        Games[key].updateGame();
        callback();
    }, function (err) {
        if (err) {
            console.error('ERROR #024: ', err);
        }
    });
}

Games = {};

setInterval(updateGames,50);

function updateOverview(){
    data = []
    Object.keys(Games).forEach(function(key) {
        g = Games[key]
        data.push({gameid: g.gameid, name: g.name, loc:g.location, map:g.mapData.file, payercount:g.players.length, maxPlayers: g.maxPlayers});
    });
    async.eachSeries(ConnectedOverviews, function (overviewId, callback) {
        io.to(overviewId).emit("runningGames", data=data);
        callback();
    }, function (err) {
        if (err) {
            console.error('ERROR #027: ', err);
        }
    });
}

setInterval(updateOverview,1000);

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