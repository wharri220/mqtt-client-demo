console.log("PUBLISHER Client starting up...");

var mqtt = require('mqtt'),
    md5 = require('MD5');

var DEVICE_ID = "demo_device";
var USERNAME = DEVICE_ID;
var PASSWORD = "secret";

var client = "test_client";

$( document ).ready( function(){
    initClient();

    $("#btn_send").click(function(){
        var topic = $("#tb_topic").val();
        var payload = $("#tb_payload").val();
        //alert("Topic: " + topic + "\nPayload: " + payload);
        publish(topic, payload);
    });
});

//---------------------------------------------------------------

function initClient(){
    //By creating a client, a connection will automatically be established.
    var options = { //See: https://github.com/mqttjs/MQTT.js/wiki/connection
        clientId: DEVICE_ID,    //Must be globally unique
        protocolVersion: 3,     //Protocol version, usually 3. number
        clean:false,            //the 'clean start' flag. 'False' to receive offline messages on connect.
        //protocolId:           //Protocol ID, usually MQIsdp. string
        //keepalive: 30,         //keepalive period in seconds. number
        //useSSL: true,		    //Set useSSL to true if you're licensed for SSL
        username: USERNAME,     //username for protocol v3.1. string
        password: PASSWORD,      //password for protocol v3.1. string
        will: {
            topic: '/hello/world',
            payload: "test"
        }          //client's will message options (see documentation)
    };

    client = mqtt.connect('tcp://173.230.129.36:1883', options);
    //client = mqtt.createClient(1883, "localhst", options); //deprecated

    client.on('connect', function(){
        _log('_______________________Connected as '+options.clientId+'___________________________');
        client.subscribe("devices/cc3200/0000000", {qos:1}, function(err, granted){
            if(err) _error("Subscribe error: " + err);
            else _log("Subscribed: " + JSON.stringify(granted));
        });
    });

    client.on('message', function(topic, payload){
        _log('Message received on ' + topic + ': ' + payload);
    });

    client.on('error', function(err){ //Not sure if this is a real event?
        _error("Client error: " + err);
    });

}
//---------------------------------------------------------------

function publish(topic, payload){
    if(client == null) {_error("Client is null!"); return;}
    client.publish(topic, payload, {qos:1}, function(err, rslt){
        if(err) _error("Publish err: " + err);
        else _log("Publish rslt: " + JSON.stringify(rslt));
    });
    _log("Published Topic["+topic+"] Payload[" + payload + "]");
}

//---------------------------------------------------------------
function _log(msg){
    console.log(msg);
    $("#console").append("<p>"+msg+"</p>");
    scrollConsole();
}

function _error(msg){
    console.error(msg);
    $("#console").append("<p class='redtext'>"+msg+"</p>");
    scrollConsole();
}

function scrollConsole(){
    var d = $('#console');
    d.scrollTop(d.prop("scrollHeight"));
}