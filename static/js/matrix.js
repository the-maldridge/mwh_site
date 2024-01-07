var c = document.getElementById("matrix-rain");
var ctx = c.getContext("2d");

var rainChars = "ムタ二コク1234567890シモラキリエスハヌトユABCDEF";
//converting the string into an array of single characters
rainChars= rainChars.split("");

var fontSize = 10;
var columns=0;
var drops=[];

function resize() {
    //size the canvas
    c.height = window.innerHeight;
    c.width = window.innerWidth;

    columns = c.width/fontSize; //number of columns for the rain
    //an array of drops - one per column
    drops = [];
    //x below is the x coordinate
    //1 = y co-ordinate of the drop(same for every drop initially)
    for(var x = 0; x < columns; x++) {
        drops[x] = 1;
    }
}

//drawing the characters
function draw() {
    //Black BG for the canvas
    //translucent BG to show trail
    ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
    ctx.fillRect(0, 0, c.width, c.height);

    ctx.fillStyle = "#007500"; //Green text
    ctx.font = fontSize + "px monospace";
    //looping over drops
    for(var i = 0; i < drops.length; i++)
    {
        //a random chinese character to print
        var text = rainChars[Math.floor(Math.random()*rainChars.length)];
        //x = i*fontSize, y = value of drops[i]*fontSize
        ctx.fillText(text, i*fontSize, drops[i]*fontSize);

        //sending the drop back to the top randomly after it has crossed the screen
        //adding a randomness to the reset to make the drops scattered on the Y axis
        if(drops[i]*fontSize > c.height && Math.random() > 0.975)
            drops[i] = 0;

        //incrementing Y coordinate
        drops[i]++;
    }
}

function drawConstantRain(interval=33) {
    resize();
    setInterval(draw,interval);
}

// For leading the first (singular) shower of rain on load, with a massive, distracting cloudBurst with CRT scanline effect
function drawCloudBurst(burstIntervalMs = 1000) {
    resize();
    var drawCloudBurst = setInterval(draw, 10);
    setTimeout(function(){
        clearInterval(drawCloudBurst);
    }, burstIntervalMs);
}

// Wrapper function that co-ordinates the series of animations
function rainOfDeception() {
    resize();
    // This singular shower of rain makes for smoother transition between cloudBurst and constantRain
    draw();
    fontSize = 10;
    if (window.matchMedia("(max-width: 567px)").matches) {
        fontSize = 12; // Bigger rain droplets on smaller screens (less animation, and better detail)
        draw(); // another 'blast' of slower rain to follow the cloudburst, to give smoother transition
        drawCloudBurst(1250);
    } else if (window.matchMedia("(min-width: 1200px)").matches) {
        draw();
        drawCloudBurst();
    }    else {
        draw();
        drawCloudBurst(1500); // longer cloudBurst due to wider (and presumably, taller) screen.
    }
}

// Bring the rain!!
window.onload = function(){
    rainOfDeception();
    // start raining .. continually (only call this here on page load)
    drawConstantRain();
}

// Then, pull the same cloudBurst-stunt on resize
window.addEventListener("resize", function(){
    rainOfDeception();
});