var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var box = document.getElementById("function");
var abeginBox = document.getElementById("abegin");
var aendBox = document.getElementById("aend");
var incrementBox = document.getElementById("increment");
var fpsBox = document.getElementById("fps");

var encoder;
var drawTempVars = {};
var interval;
var state = "canvas";
drawAxis();

function writeFunctionOnCanvas(){
    var prev = ctx.fillStyle;
    ctx.fillStyle = "#000000";
    ctx.fillText("y = " + box.value, 20, 20, 200);
    ctx.fillStyle = prev;
}

function beginDrawGif(){
    document.getElementById("img").style.display = "none";
    canvas.style.display = "inline";

    clearInterval(interval);
    state = "gifdrawing";

    drawTempVars.count = parseFloat(abeginBox.value);
    drawTempVars.first = true;
    drawTempVars.endVal = parseFloat(aendBox.value);
    drawTempVars.stepSize = parseFloat(incrementBox.value);
    drawTempVars.fps = parseInt(fpsBox.value);

    interval = setInterval(drawGif, 0);
}

function beginDrawCanvas(){
    document.getElementById("img").style.display = "none";
    canvas.style.display = "inline";

    clearInterval(interval);
    state = "canvas";

    interval = setInterval(drawCanvas, 1000/parseFloat(document.getElementById("fps").value));
}

function drawGif(){
    var count = drawTempVars.count;
    var first = drawTempVars.first;
    var endVal = drawTempVars.endVal;
    var stepSize = drawTempVars.stepSize;
    var fps = drawTempVars.fps;

    if(first){
        encoder = new GIFEncoder();
        encoder.setRepeat(0);
        encoder.setFrameRate(fps);
        encoder.start();
        drawTempVars.first = false;
    }
    var expr = Parser.parse(box.value);
    var fun = function(xVal){
        return expr.evaluate({a: count, x: xVal});
    }
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, 300, 300);
    drawAxis();
    writeFunctionOnCanvas();
    ctx.fillStyle = "#FF2626";
    var prev = fun((0 - 150.0)/30.0); //caches prev y2 val for efficiency
    for(var i = 0; i<300; i++){
        //First find the x
        //Assume graph is from -5 -> +5
        var x = (i - 150.0)/30.0;

        var y1 = fun(x);
        var y2 = fun(x+(1/30));
        if(isNaN(y1) || isNaN(y2))
            continue;
        var ypixel1 = (y1 * 30) + 150;
        var ypixel2 = (y2 * 30) + 150;

        var point = Math.max(ypixel1, ypixel2);
        var height = Math.abs(ypixel1-ypixel2)+1;

        if(point > 300 && height > 300){ //We passed an asymptote, don't draw this part
            continue;
        }

        ctx.fillRect(i, 300 - point, 1, height);
    }
    encoder.addFrame(ctx);
    if(count < endVal){
        drawTempVars.count += stepSize;
    }else{
        clearInterval(interval);
        state="donegif";
        encoder.finish();
        var binary_gif = encoder.stream().getData();
        var data_url = 'data:image/gif;base64,'+encode64(binary_gif);

        var img = document.getElementById("img");
        img.setAttribute("src", data_url);
        img.style.display = "inline";
        canvas.style.display = "none";
    }
}

function drawCanvas(){
    if(state != "canvas"){
        console.log("Unexpected error, breaking");
        return;
    }

    var expr = Parser.parse(box.value);
    var fun = function(xVal){
        return expr.evaluate({a: drawTempVars.count, x: xVal});
    }
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, 300, 300);
    drawAxis();
    writeFunctionOnCanvas();
    ctx.fillStyle = "#FF2626";
    var prev = fun((0 - 150.0)/30.0); //caches prev y2 val for efficiency
    for(var i = 0; i<300; i++){
        //First find the x
        //Assume graph is from -5 -> +5
        var x = (i - 150.0)/30.0;

        var y1 = fun(x);
        var y2 = fun(x+(1/30));
        if(isNaN(y1) || isNaN(y2))
            continue;
        var ypixel1 = (y1 * 30) + 150;
        var ypixel2 = (y2 * 30) + 150;

        var point = Math.max(ypixel1, ypixel2);
        var height = Math.abs(ypixel1-ypixel2)+1;

        if(point > 300 && height > 300){ //We passed an asymptote, don't draw this part
            continue;
        }
        ctx.fillRect(i, 300 - point, 1, height);
    }
    if(drawTempVars.count < parseFloat(document.getElementById("aend").value)){
        drawTempVars.count += parseFloat(document.getElementById("increment").value);
    }else{
        drawTempVars.count = parseFloat(document.getElementById("abegin").value);
    }
}

function uploadToServer(){
    if(state != "donegif"){
        alert("Please generate a gif before creating a permanent link!");
        return;
    }
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("POST", "mathgifs/new", true);
    var params = "gif=" + document.getElementById("img").getAttribute("src");
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            window.prompt("Press Ctrl+C to copy!", "http://nwoodthorpe.com/gifs/" + xmlhttp.responseText + ".gif");
        }
    }

    xmlhttp.send(params);
}
beginDrawCanvas();
