socket.on('test', function(data){
    console.log(data.text);
});

socket.on('PillEaten',function(){
    pillReady = true;
    //drawController();
});

socket.on('color',function(data){
    controllerInfo.color = data.pacmanColor;
    //drawController();
});

socket.on('gameOverPlayer', function(){
    $("#overlayWait").css('visibility', 'hidden');
    $("#nippleBox").css('visibility', 'hidden');
    $("#overlayRejoin").css('visibility', 'visible');
});

socket.on('gameWonPlayer', function(){
    $("#overlayWait").css('visibility', 'hidden');
    $("#nippleBox").css('visibility', 'hidden');
    $("#overlayRejoin").css('visibility', 'visible');
});

socket.on('lifeDrain', function() {
    controllerInfo.life -=1;
});

socket.on("waitForOtherPlayers", function (data) {
    $("#overlayWait").css('visibility', 'visible');
});

socket.on("resetLife", function (data) {
    controllerInfo.life = data.life;
});

socket.on("updateControllerColor", function(data){
    controllerInfo.color = data.color;
    //drawController();
});

socket.on('updateScores', function(data) {
    players = [];
    for (chunk in data){
        inserted = false;
        if(data[chunk] && data[chunk] != 0){
            if(!players || players.length == 0){
                players = [data[chunk]]
            } else {
                for(player in players){
                    if(players[player].score <= data[chunk].score){
                        players.splice(player,0,data[chunk]);
                        inserted = true;
                        break;
                    }
                }
                if(!inserted) {
                    players.push(data[chunk]);
                }
            }
        }
    }
    //drawController();
});

window.onbeforeunload = function(e) {
    socket.emit('disconnected');
};

function clickJoin(){
    controllerInfo.nickname = document.getElementById("nickname").value;

    if (controllerInfo.nickname == ""){
        $("#join").addClass("has-error");
    } else {
        $("#overlayJoin").css('visibility', 'hidden');
        $("#nippleBox").css('visibility', 'visible');
        socket.emit("connectController", controllerInfo, function (callback) {
            if(callback == -1){
                window.alert("This game is full. Try again later.").
                exit(-1)
            }
            console.log(callback);
            controllerInfo.playerid = callback.playerid;
            controllerInfo.color = callback.color;
            controllerInfo.life = callback.life;
            $("#nippleBox").css('background', rgb(controllerInfo.color));
            if(callback.teamColor){
                $("#nippleBox").css('border-color', rgb(callback.teamColor));
            }
            //drawController();

            createNipple();
        });
    }

}

function rejoind(){
    $("#overlayRejoin").css('visibility', 'hidden');
    $("#nippleBox").css('visibility', 'visible');
    socket.emit("rejoin", controllerInfo, function (callback) {
        if(callback.life){
            controllerInfo.life = callback.life;
        }
        if(callback.teamColor){
            $("#nippleBox").css('border-color', rgb(callback.teamColor));
        }
    });
}

function rgb(values) {
    return 'rgb(' + values.join(', ') + ')';
}


function createNipple() {
    console.log(document.getElementById("nippleBox"));

    var options = {
        zone: document.getElementById("nippleBox"),
        mode: 'dynamic',
        restOpacity: 0.8
    }
    
    var manager = nipplejs.create(options); 

    manager.on('dir:up', function(){
        console.log("going up");
        changeDirection(0);
    });
    manager.on('dir:right', function(){
        console.log("going right");
        changeDirection(1);
    });
    manager.on('dir:down', function(){
        console.log("going down");
        changeDirection(2);
    });
    manager.on('dir:left', function(){
        console.log("going left");
        changeDirection(3);
    });

};

function changeDirection(dir){
    data = {
        gameid: controllerInfo.gameid,
        playerid: controllerInfo.playerid,
        newDirection: dir
    }

    socket.emit("changeDirection", data);
}
