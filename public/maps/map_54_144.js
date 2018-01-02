var GHOST_COUNT = 20;
var MAX_NUMBER_OF_EATEN = 1820;
var POSITIONS_USERS = [{"x": 270, "y": 120}, {"x": 1230, "y": 140}, {"x": 1150, "y": 450},
                          {"x": 270, "y": 360}, {"x": 840, "y": 290}]
var POSITIONS_GHOSTS = [{"x": 11, "y": 28},{"x":35 , "y": 28},{"x": 28, "y": 85},{"x": 44, "y": 116},{"x": 13, "y": 124}]
var TUNNEL_POS = 260;

var GHOST_START_DIRECTION = 1;

var URL_POSITION = {"x": 9, "y": 13};
var URL_SIZE = 1.3;
var URL_LINE_DISTANCE = 1.5;

var URL_PARAM1 = 2.7;
var URL_PARAM2 = 12;
var URL_PARAM3 = 3;

var TOTAL_LIFE_COUNT = 20;

var mapOriginal = [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,0,1,1,1,1,1,1,1,1,0,1,4,1,1,1,1,1,1,0,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,4,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,2,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,0,1,1,1,1,0],
[0,4,0,0,1,0,0,0,1,0,1,0,0,0,1,0,0,1,0,4,0,0,1,0,0,0,1,0,1,0,0,0,1,0,0,4,0,1,0,1,0,0,1,0,1,0,1,0,0,0,0,1,0,1,0,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,0,1,0,1,0,0,1,0,0,0,0,0,0,0,1,0,1,0,0,1,0,1,0,0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,1,0,0,1,0,1,0,0,1,0,0,4,0,1,0,1,0,0,1,0,1,0,0,1,0],
[0,1,0,0,1,0,0,0,1,0,1,0,0,0,1,0,0,1,0,1,0,0,1,0,0,0,1,0,1,0,0,0,1,0,0,1,0,1,1,1,0,0,1,0,1,0,1,0,0,0,0,1,0,1,0,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,0,1,0,1,0,0,1,0,2,2,2,2,2,0,1,0,1,1,1,1,0,1,1,1,1,1,1,1,0,2,0,1,1,1,1,1,0,2,0,1,0,2,0,1,0,1,0,0,1,0,1,0,0,1,0,0,1,0,1,1,1,0,0,1,0,1,0,1,1,0],
[0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,1,0,0,1,0,1,0,4,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,0,0,1,0,4,0,0,1,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,1,0,0,0,1,0,2,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,1,1,1,1,0,1,1,1,1,1,1,1,0,0,0,1,0,0,1,0,1,0,4,0,0],
[0,1,0,0,1,0,1,0,0,0,0,0,1,0,1,0,0,1,0,1,0,0,0,0,1,0,0,0,0,0,1,0,1,0,0,1,1,1,1,1,0,0,1,0,1,0,0,0,1,0,0,1,0,1,0,0,1,0,0,0,1,0,0,0,0,0,1,0,1,0,0,0,1,0,0,1,0,1,0,0,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,4,1,1,1,1,1,0,1,0,0,1,0,1,0,0,1,0,0,1,0,1,1,1,0,0,1,0,1,0,1,1,0],
[0,1,1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,1,1,1,1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,1,0,1,0,1,1,1,1,1,1,1,1,1,1,0,0,1,0,1,0,0,1,1,1,0,1,1,1,1,1,1,1,0,1,1,1,0,1,1,1,1,1,1,1,1,1,0,0,1,0,1,0,0,1,0,1,0,0,0,0,0,1,0,1,0,0,1,1,1,1,1,0,0,0,0,1,0,0,0,1,0,0,1,0,1,1,1,1,0,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,0,0,1,0],
[0,1,0,0,1,0,0,0,1,0,1,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,1,0,1,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,1,0,1,0,1,1,1,1,0,1,0,0,1,0,1,0,1,0,0,0,1,0,1,0,1,0,1,0,1,0,1,0,0,0,1,0,1,1,1,1,0,1,1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,1,0,1,0,1,1,1,1,0,1,1,1,1,1,0,0,1,0,1,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,1,1,1,1,0],
[0,1,1,1,1,0,1,1,1,1,1,1,1,0,1,0,2,2,2,2,2,0,1,0,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,0,1,0,1,0,1,0,0,1,1,1,1,1,1,0,1,1,1,0,2,0,1,0,1,1,1,0,1,1,1,0,1,0,2,0,1,0,1,0,0,0,0,0,0,0,1,0,0,0,1,0,1,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,1,0,1,0,1,1,1,1,0,1,0,2,2,2,2,2,0,1,1,1,1,1,1,1,1,1,1,1,0,1,0,1,0,0],
[0,0,0,0,1,0,1,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0,1,0,1,0,0,2,0,0,1,0,1,0,0,0,0,1,0,1,0,0,1,1,1,0,1,0,1,0,0,1,0,0,0,0,1,0,0,0,1,0,2,0,1,0,0,0,1,0,0,0,1,1,1,0,2,0,1,0,1,0,2,2,2,2,2,0,1,0,1,1,1,1,1,1,1,0,1,1,1,1,1,1,0,1,1,1,1,0,1,0,1,0,1,0,0,1,0,1,0,0,0,0,0,0,0,1,0,1,0,0,1,0,1,0,0,1,1,1,0,1,0,0],
[0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,2,2,2,0,1,1,1,1,1,1,1,1,0,1,1,1,1,0,1,1,1,0,1,1,1,1,1,1,1,1,1,0,1,1,1,0,2,0,1,0,1,1,1,0,1,1,1,0,1,0,2,0,1,0,1,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,1,0,1,0,0,0,0,1,1,1,0,0,1,1,1,0,1,0,1,0,0,1,0,1,1,1,1,1,1,1,1,1,0,1,1,1,1,0,1,1,1,1,0,1,1,1,0,0],
[0,1,0,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,1,0,1,0,1,0,0,1,0,0,0,0,1,0,1,0,1,0,1,0,0,0,0,1,0,0,1,0,1,0,1,0,0,0,1,0,1,0,1,0,1,0,1,0,1,0,2,0,1,0,1,1,1,1,1,1,1,1,1,1,1,0,2,2,2,0,1,1,1,0,1,1,1,1,0,1,1,1,1,0,1,1,1,0,1,1,1,1,1,1,0,0,0,2,0,0,0,1,0,1,0,0,1,0,0,0,0,1,0,1,0,1,0,0],
[0,1,1,1,1,0,1,0,2,2,2,2,2,2,2,2,2,2,2,2,2,0,1,0,1,1,1,1,1,1,1,0,1,0,1,0,0,1,1,1,1,1,1,1,1,0,1,0,1,0,2,2,0,1,0,0,1,1,1,0,1,1,1,1,1,1,1,0,1,1,1,0,1,0,1,0,2,0,1,0,1,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,1,0,1,0,1,0,0,1,0,0,0,0,1,0,1,0,1,0,1,0,0,0,0,1,0,2,2,2,2,2,0,1,0,1,1,1,1,1,1,1,1,1,1,1,0,1,0,0],
[0,1,0,0,1,0,1,0,2,2,2,2,2,2,2,2,2,2,2,2,2,0,1,0,1,0,0,0,0,0,1,0,1,0,1,0,0,1,0,0,0,1,0,0,1,0,1,1,1,0,0,0,0,1,0,0,1,0,0,0,0,0,1,0,0,0,1,0,1,0,0,0,1,0,1,0,0,0,1,0,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,0,1,0,1,1,1,1,1,1,1,1,1,1,1,0,1,0,1,0,2,2,0,1,0,0,0,0,0,0,0,1,0,1,0,0,1,0,0,0,1,0,0,1,0,1,1,0],
[0,1,1,1,1,1,1,0,2,2,2,2,2,2,2,2,2,2,2,2,2,0,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,1,0,1,0,1,0,0,1,0,0,0,1,0,0,1,0,1,1,1,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,0,0,1,0],
[0,1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,1,0,0,0,1,0,0,1,0,1,0,1,0,1,1,1,1,0,1,1,1,0,0,0,0,1,0,0,1,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,1,0,1,0,1,0,0,0,1,1,1,1,0,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,0,1,0,0,0,0,1,0,1,0,1,1,1,1,0,1,1,0],
[0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,4,0,1,0,1,0,1,0,0,1,0,1,0,1,0,2,2,0,1,0,0,1,0,1,0,2,0,1,0,2,0,1,0,1,1,1,0,1,0,1,0,1,0,2,0,1,0,0,1,0,1,0,0,1,0,0,0,1,0,1,0,0,0,1,0,0,1,0,1,0,1,0,1,1,1,1,0,1,1,1,0,0,0,0,1,1,1,1,1,1,1,1,1,0,1,4,1,1,0,1,0,1,0,0,1,0,1,0,0],
[0,1,0,0,1,0,1,0,0,0,0,0,1,0,1,0,1,0,0,0,1,0,1,0,1,0,0,0,0,0,1,0,1,0,1,0,0,1,0,1,0,1,0,0,1,0,1,0,1,0,0,0,0,1,1,1,1,1,1,0,0,0,1,0,2,0,1,1,4,0,1,1,1,0,1,0,1,0,2,0,1,0,1,4,0,1,1,0,1,1,1,1,1,1,1,1,1,1,1,0,1,4,0,1,0,1,0,1,0,0,1,0,1,0,1,0,2,2,0,1,0,1,0,0,0,1,0,1,0,1,0,0,1,0,1,0,1,0,0,1,0,1,0,0],
[0,1,1,1,1,0,1,1,1,0,1,1,1,0,1,0,4,1,0,1,1,0,1,0,1,1,1,0,1,1,1,0,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,0,1,1,1,1,1,1,0,0,0,0,1,1,1,1,1,0,2,0,0,0,0,0,0,0,1,0,1,1,1,0,2,0,1,0,1,0,0,0,1,0,1,0,1,0,0,0,0,0,1,0,1,0,1,0,0,1,0,1,0,1,0,0,1,0,1,0,1,0,0,0,0,1,0,1,0,0,0,1,0,1,0,1,0,0,1,0,1,0,1,1,1,1,1,1,0,0],
[0,1,0,0,0,0,0,0,1,0,1,0,0,0,1,0,0,1,0,1,0,0,1,0,0,0,1,0,1,0,0,0,1,0,0,0,0,1,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,1,4,1,1,1,1,0,0,0,1,0,2,0,1,1,1,0,1,1,1,0,1,0,1,0,2,0,1,1,1,1,0,1,1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,1,0,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,0,0,0,0],
[0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,0,1,0,0,1,0,1,0,2,0,1,0,2,0,1,0,1,1,1,0,1,0,1,0,1,0,2,0,1,0,0,1,0,1,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,1,0,1,0,0,0,1,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,0,1,0,0,1,0,0,1,1,1,1,0],
[0,1,0,0,1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,1,0,1,0,1,0,1,0,1,0,0,1,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,1,0,1,0,1,0,0,0,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,0,4,1,1,0,1,1,1,1,1,0,1,1,1,1,1,1,1,0,1,1,1,1,1,0,0,1,0],
[0,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,0,1,0,1,0,1,0,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,0,0,1,0,1,0,0,0,0,1,0,0,1,0,1,0,1,0,1,0,1,1,1,0,1,0,1,0,1,0,0,0,1,0,1,0,1,0,0,0,1,1,1,1,0],
[0,0,0,0,1,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,1,0,0,1,0,0,0,1,0,1,0,0,0,1,0,0,1,0,0,1,1,1,1,1,1,1,1,1,0,1,0,0,1,0,0,0,0,0,1,0,0,0,1,0,1,0,0,0,1,0,1,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,0,1,0,0,1,0,1,0,1,0,1,0,0,0,1,0,1,0,1,1,1,0,2,0,1,0,1,1,1,1,1,1,1,0,0,0,0],
[2,2,2,0,1,0,1,0,2,0,1,0,2,0,1,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,1,0,1,0,0,4,0,0,1,0,0,0,1,0,0,0,1,0,1,0,0,1,1,1,0,1,1,1,1,1,1,1,0,1,1,1,0,1,0,1,1,1,0,1,1,1,0,0,0,1,0,0,0,1,0,1,0,0,1,0,0,0,1,0,1,0,0,0,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,0,0,0,1,0,2,0,1,0,0,0,1,0,1,0,1,0,2,2,2],
[0,0,0,0,1,1,1,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,1,0,0,1,0,1,0,1,0,0,0,0,0,1,1,1,1,1,1,1,1,1,0,2,0,1,1,1,1,1,0,1,0,0,1,0,1,0,1,0,0,0,1,0,1,0,1,0,1,0,1,0,1,0,1,1,1,0,1,1,1,1,1,1,1,1,1,0,4,1,0,1,1,1,1,1,1,1,1,1,1,1,0,0,4,0,0,1,0,0,0,1,0,0,0,1,0,1,0,0,0,1,0,1,1,1,0,2,0,1,0,1,1,1,0,1,0,1,0,0,0,0],
[2,2,2,2,1,0,1,1,1,1,1,1,1,1,1,0,2,2,2,2,2,0,1,0,1,1,1,1,0,1,1,1,1,1,1,1,0,0,0,1,0,1,0,1,0,2,0,1,0,1,0,1,1,1,1,1,1,0,1,1,1,0,2,0,1,0,1,1,1,0,1,1,1,0,1,0,0,0,1,0,1,0,0,0,2,0,0,0,1,0,0,1,0,1,0,1,0,0,0,0,0,1,0,1,0,0,1,0,0,1,0,2,0,1,1,1,1,1,0,1,1,1,0,1,0,1,0,1,0,0,0,1,0,1,0,1,0,1,1,1,2,2,2,2],
[0,0,0,0,1,0,1,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,1,0,0,0,1,0,2,0,1,0,1,0,1,0,0,0,1,0,1,0,1,0,0,0,0,1,0,0,0,1,0,2,0,1,0,0,0,1,0,0,0,1,1,1,1,1,1,1,0,1,0,2,2,2,2,2,0,1,0,1,1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,1,0,0,1,0,2,0,1,0,0,0,1,0,1,0,1,0,1,1,1,0,1,1,1,1,1,1,1,0,1,1,1,0,1,0,0,0,0],
[2,2,2,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,0,2,0,1,0,1,1,1,0,1,1,1,0,1,0,1,0,0,0,1,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,1,0,0,1,0,0,0,1,0,0,0,1,1,1,0,1,1,1,0,0,0,0,0,1,0,0,0,1,0,1,0,0,0,1,0,2,2,2],
[0,0,0,0,1,0,1,0,0,0,0,0,1,0,1,0,0,1,4,1,0,0,1,0,1,0,0,0,0,0,1,0,1,0,0,1,1,1,1,1,0,0,1,0,1,0,0,0,1,0,0,1,0,1,0,0,1,0,1,0,1,0,0,0,1,0,1,0,1,0,1,0,1,0,1,0,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0],
[0,1,1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,1,0,1,1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,1,0,1,0,1,1,1,1,0,1,1,1,1,1,0,0,1,0,1,1,1,1,1,1,0,1,1,1,1,1,1,1,0,1,1,4,0,1,0,1,0,1,0,1,0,1,0,0,0,1,0,0,1,0,0,0,1,0,0,1,0,1,0,4,0,1,0,0,0,1,0,1,0,0,0,0,0,1,0,0,0,0,1,1,1,0,1,0,1,0,1,0,1,0,0,0,0,0,1,0,0,0,1,0,1,1,1,1,0],
[0,1,0,0,1,0,0,0,1,0,1,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,1,0,1,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,1,0,1,0,1,1,1,1,0,1,0,0,1,0,0,0,0,0,1,0,0,0,1,0,1,0,0,0,1,1,1,1,1,0,1,1,1,0,2,0,1,0,0,1,1,1,0,1,0,0,1,0,1,0,1,0,1,0,2,0,1,0,1,1,1,1,1,0,1,0,2,2,0,1,0,1,0,1,0,1,0,1,0,1,0,1,1,1,1,1,0,1,1,1,0,0,0,0,1,0],
[0,1,1,1,1,1,1,1,1,1,1,1,1,0,1,0,2,2,2,2,2,0,1,0,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,0,1,0,1,0,1,0,0,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,0,0,0,1,0,0,0,1,0,2,0,1,1,1,1,0,1,1,1,1,1,1,0,1,0,1,0,1,0,2,0,1,0,1,0,0,0,1,0,1,0,2,2,0,1,0,1,1,1,1,1,1,1,0,1,0,1,0,0,0,1,1,4,0,1,1,1,1,1,1,0],
[0,0,0,0,0,1,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0,1,0,1,0,0,2,0,0,1,0,1,0,0,0,0,1,0,1,0,0,1,1,1,0,1,0,1,0,0,1,0,1,0,0,1,0,1,0,1,0,1,0,0,0,1,0,0,0,1,0,1,0,1,1,1,0,1,1,1,0,2,0,1,0,0,0,0,1,0,0,0,0,1,0,1,1,1,1,1,0,2,0,1,0,1,1,1,0,1,1,1,0,2,2,0,1,0,0,1,0,0,0,1,0,0,1,0,1,0,0,0,1,0,0,0,0,1,0,0,0,1,0],
[0,1,1,1,1,1,0,2,2,2,2,0,1,1,1,1,1,1,1,1,1,1,1,1,1,0,2,2,2,0,1,1,1,1,1,1,1,1,0,1,1,1,1,0,1,1,1,0,1,1,1,1,1,1,0,0,1,0,1,0,1,0,1,1,1,1,1,0,1,1,1,0,1,0,1,0,1,0,1,0,1,0,2,0,1,1,1,1,1,1,0,1,1,1,1,0,1,0,1,0,1,0,2,0,1,0,1,0,1,0,0,0,1,0,0,0,0,1,1,1,1,0,2,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
[0,1,0,1,0,1,0,0,0,0,0,0,1,0,1,0,0,0,1,0,0,0,1,0,1,0,0,0,0,0,1,0,1,0,1,0,0,1,0,0,0,0,1,0,1,0,1,0,1,0,0,0,0,1,4,1,1,1,1,0,1,0,1,0,1,0,1,1,4,0,1,1,1,0,1,0,1,1,1,0,1,0,0,0,1,0,0,0,0,1,0,1,0,0,1,1,1,0,1,0,1,0,0,0,1,0,1,0,1,1,1,1,1,1,1,1,1,1,0,0,1,0,0,0,1,0,0,1,0,0,0,1,0,1,0,0,0,1,0,1,0,0,1,0],
[0,1,0,1,0,1,1,1,1,1,1,1,1,0,1,0,2,0,1,0,2,0,1,0,1,1,1,1,1,1,1,0,1,0,1,1,1,1,1,1,1,1,1,1,1,0,1,0,1,0,2,2,0,1,0,0,0,0,0,0,1,0,1,0,1,0,1,0,0,0,0,0,1,0,1,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,0,1,0,1,0,1,1,1,1,1,0,1,0,1,0,0,0,0,1,0,0,0,1,0,0,1,1,1,1,1,1,0,1,1,1,0,1,0,1,1,1,1,1,0,1,0,0,1,0],
[0,1,1,1,0,1,0,0,0,0,0,0,1,0,1,0,0,0,1,0,0,0,1,0,1,0,0,0,0,0,1,0,1,0,1,0,0,1,0,0,0,1,0,0,1,0,1,1,1,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,1,0,0,0,1,0,0,1,0,0,0,0,1,0,1,0,1,0,1,0,0,0,0,0,1,0,1,0,1,1,1,1,1,1,1,1,1,4,1,0,0,1,0,1,0,1,0,1,0,1,0,1,0,0,0,0,0,1,1,1,1,0],
[0,1,0,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,0,0,0,1,1,1,1,1,1,0,0,0,0,1,0,1,0,0,0,1,0,1,0,0,0,1,0,1,0,1,0,1,0,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,0,0,0,0,0,1,0,1,0,0,1,0,1,0,1,0,1,0,1,1,1,1,1,1,1,1,1,0,0,1,0],
[0,1,0,1,0,0,0,0,1,0,1,0,0,0,1,0,0,1,0,1,0,0,1,0,0,0,1,0,1,0,0,0,1,0,0,1,0,1,0,1,0,1,1,1,1,0,1,1,1,0,0,0,0,1,1,1,1,1,1,0,1,1,1,0,1,0,1,1,1,1,1,0,1,0,1,0,1,0,1,0,1,0,1,0,0,1,0,1,0,0,0,1,0,0,0,1,0,1,0,1,0,1,0,0,0,0,0,0,0,1,0,0,1,1,1,1,1,1,1,0,1,0,0,1,1,1,1,1,1,1,1,1,0,0,1,0,0,1,0,1,0,0,1,0],
[0,1,0,1,1,1,1,1,1,1,1,1,1,1,1,0,1,4,0,1,1,0,1,1,1,1,1,1,1,1,1,1,1,0,1,4,0,1,0,1,0,1,0,0,1,0,1,0,1,0,2,2,0,1,0,0,0,0,1,0,1,0,1,0,1,0,1,0,0,0,0,0,1,0,1,1,1,1,1,1,1,0,1,0,0,1,0,1,0,2,0,1,0,2,0,1,0,4,0,1,0,1,0,2,2,2,2,2,0,1,1,1,1,0,0,1,0,0,1,1,1,1,1,1,0,0,0,0,1,0,0,1,0,0,1,0,0,1,0,1,1,1,1,0],
[0,1,0,1,0,1,0,0,0,0,0,0,1,0,1,0,1,0,0,0,1,0,1,0,1,0,0,0,0,0,1,0,1,0,1,0,0,1,0,1,0,1,0,0,1,0,1,0,1,0,0,0,0,1,0,0,0,0,1,0,1,0,1,0,1,1,1,1,1,1,1,1,1,0,0,1,0,0,0,0,1,0,1,1,1,1,1,1,0,2,0,1,0,0,0,1,1,1,1,1,1,1,0,0,0,0,0,0,0,1,0,0,1,1,1,1,1,1,1,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,0,0,1,0],
[0,1,1,1,0,1,1,1,1,0,1,1,1,0,1,1,1,1,0,1,1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,1,0,1,1,1,0,1,1,1,1,0,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,0,0,1,0,1,1,1,1,0,0,0,0,1,0,1,0,0,0,0,0,0,2,0,1,1,1,1,1,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,2,0,0,1,0,2,2,0,1,0,1,0,0,0,1,0,0,0,0,0,0,0,1,0,1,0,0,1,0],
[0,1,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,1,0,1,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,1,0,0,1,1,1,1,1,1,0,1,1,1,1,1,1,0,2,0,1,0,0,0,1,1,1,0,1,1,1,0,0,1,0,1,0,0,1,0,0,1,0,2,2,2,0,1,0,0,0,0,1,0,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,0],
[0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,0,0,1,0,0,0,0,1,0,1,0,0,1,0,1,0,2,0,1,0,2,0,1,0,1,1,1,0,1,0,1,4,0,1,1,0,1,1,1,1,0,0,0,0,0,1,1,1,1,1,1,0,1,0,0,0,0,0,0,1,0,1,0,0,0,1,0,0,0,1,0],
[0,1,0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,1,0,1,0,1,0,1,0,1,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,1,0,1,1,1,1,0,2,2,0,1,1,1,1,0,1,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,1,0,1,0,0,0,1,0,1,0,0,1,1,1,1,1,1,1,0,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
[0,1,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,0,1,0,0,1,0,1,0,1,0,1,0,1,1,1,4,0,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,0,0,1,0,0,0,0,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,0,1,1,1,1,1,0,1,0,0,1,0,0,1,0,1,0,0,1,0,0,1,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,1,0],
[0,1,1,1,1,1,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,1,0,0,1,0,0,0,1,0,1,0,0,0,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,0,1,0,0,0,0,0,0,1,0,1,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,1,0,1,0,1,0,1,0,0,0,0,1,0,0,1,0,0,1,0,1,0,0,0,1,1,1,1,1,1,0,0,1,0,1,0,0,1,0,0,1,0,0,1,0,2,0,1,0,2,0,1,0,2,2,0,1,0],
[0,1,0,0,0,0,1,0,2,0,1,0,2,0,1,1,1,1,1,1,1,1,1,0,4,1,0,1,1,1,1,1,1,1,1,1,1,1,0,0,4,0,0,1,0,0,0,0,0,0,0,1,0,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,0,0,1,0,1,0,0,0,1,0,1,0,2,0,1,0,1,0,1,0,1,0,2,2,0,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,2,0,1,0,2,0,1,0,2,2,0,1,0],
[0,1,0,2,2,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,1,0,1,0,1,0,0,0,0,0,1,0,1,0,0,1,0,0,1,0,2,0,1,1,1,1,1,0,1,1,1,1,0,0,0,0,0,1,0,1,0,0,0,0,0,1,1,1,4,1,1,0,1,0,2,0,1,0,1,0,2,0,1,0,1,1,1,1,1,0,2,2,0,1,0,0,0,1,0,1,0,0,0,0,0,1,0,2,2,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,1,0],
[0,1,0,2,2,0,1,1,1,1,1,1,1,1,1,0,2,0,1,0,2,0,1,0,1,1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,1,0,0,1,0,2,0,1,0,0,0,1,0,1,0,0,1,0,2,2,2,0,1,0,1,1,1,1,1,0,1,0,0,0,0,1,0,1,0,2,0,1,0,1,0,2,0,1,0,1,0,1,0,1,0,2,2,0,1,0,2,0,1,0,1,0,2,2,2,0,1,0,2,2,0,1,1,1,1,1,1,4,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
[0,1,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,1,0,1,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,1,0,0,1,0,0,0,1,0,0,0,1,0,1,0,0,1,0,0,0,0,0,1,0,0,0,0,0,1,0,1,0,0,0,0,1,0,1,0,0,0,1,0,1,0,0,0,1,0,1,0,1,0,1,0,0,0,0,1,0,0,0,1,0,1,0,0,0,0,0,1,0,0,0,0,1,0,1,0,0,0,1,1,1,0,0,0,0,0,0,0,0,1,0,1,0,0,0,1,0,0,0,1,0],
[0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]];

if (typeof exports !== 'undefined') {
    exports.mapData = function() {
        return data = {"usedMap" : mapOriginal,"POSITIONS_GHOSTS":POSITIONS_GHOSTS,"GHOST_COUNT":GHOST_COUNT, "file":"map_54_144.js","GHOST_START_DIRECTION":GHOST_START_DIRECTION}
    }
}