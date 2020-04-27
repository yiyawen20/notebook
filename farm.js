var express = require("express");
var app = express();
var login = require("./login");

app.get("/index.html", function(req, res){
    res.sendFile( __dirname + "/" + "index.html" );
});

app.all('*',function(req, res, next){
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Headers","X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered","3.2.1");
    res.header("Content-Type","application/json;charset=utf-8");
    next();
});

app.get("/tian", function(req, res){
    var response = new Object();
    response.result = 1000;
    response.list = new Array();
    for(var i = 0; i < 12; i++){
        var arr = new Object();
        arr = {
            landId: i+1,//v3的landId 9,10；10万购买 landid 11,12；田的位置
            isPlant: i < 8 ? (Math.random()>.4 ? 0 : 1) : -1,// -1:未开启，0：未种植, 1:已种植的
            giftSn: 1,// 种植的种子编号
            growth: Math.random()>.4 ? 0 : 1,// 0：种子状态，1：成熟状态
            care: Math.random()>.4 ? 0 : 1, // 0：未照料，1：已照料
            recv: Math.random()>.4 ? 0 : 1,// 0： 不可收集， 1：可以收集         
            dieTime: "2020-20-01 00:00:00"//最后枯萎时间
        }
        response.list[i] = arr;
    }
    res.end(JSON.stringify(response));
});

app.get("/exchange", function(req, res){
    var response = new Object();
    response.result = 1000;
    response.list = new Array();
    for(var i = 0; i < 12; i++){
        var arr = new Object();
        arr = {
            giftId: 1312,    //兑换的礼物ID
            needSn: 1001,   //需要的碎片ID
            needNum: 2,    //需要的碎片数量
            hadNum: 10,     //用户拥有的该碎片数量
            needVip: parseInt(Math.random()*10)
        }
        response.list[i] = arr;
    }
    res.end(JSON.stringify(response));
});

var server = app.listen("8081", function(){
    var host = server.address().address
    var port = server.address().port
    
    console.log("应用实例，访问地址为 http://%s:%s", host, port)
});