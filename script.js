var canvas = document.getElementById("canvas");
var contxt = canvas.getContext("2d");
var left = false;
var right = false;
var gameOver = true;
var score = 0;
var lives = 3;
var track = 0;
var enemy = 0;
var level = 1;


document.addEventListener("keydown", keysDown, false);
document.addEventListener("keyup", keysUp, false);


function openWin() {
  myWindow = window.open("", "", "width=300, height=300, ");
  myWindow.document.write("<p>    HELLO!   TO PLAY THIS GAME YOU HAVE TO MOVE THE DUCK BACK AND FORTH TO FEED IT PROPERLY  </p>")
  myWindow.document.write("<p>    COLLECT AS MANY RED,BLUE, YELLOW FOOD AS YOU CAN,  </p>")
  myWindow.document.write("<p>    BUT BE CARE TO AVOID ALL THE OTHER FOOD COLORS!   </p>")
  myWindow.document.write("<p>     EACH LEVEL GETS TOUGHER AS YOU GO ALONG.    </p>")
  myWindow.document.write("<p> SO GOOD LUCK!     </p>")
  myWindow.moveTo(500, 100);
  myWindow.focus();

}

// when key is pressed down, move
function keysDown(e) {
	if(e.keyCode == 39){
		right = true;
	}
	else if(e.keyCode == 37){
		left = true;
	}
	else if(e.keyCode == 32 && gameOver){
		playAgain();
	}
}
// when key is released, stop moving
function keysUp(e) {
	if(e.keyCode == 39){
		right = false;
	}
	else if(e.keyCode == 37){
		left = false;
	}
	
}

// player specs
var player = {
	size: 90,
	x: (canvas.width -70)/ 2,
	y: canvas.height - 70,
	color: "blue"
    
};

// specs for balls you want to collect
var goodFood = {
	x:[],
	y:[],
	speed: 2,
	color: ["red","blue","yellow"],
	state: []
};
var redNum = 0;

// specs for balls you want to avoid
var badFood = {
	x:[],
	y:[],
	speed: 2,
	color: ["green", "purple", "#003300", "#663300", "white"]

};
var blackNum = 0;
var rad = 10;

// adds value to x property of goodFood
function drawNewGood(){
	if(Math.random() < .02){
		goodFood.x.push(Math.random() * canvas.width);
		goodFood.y.push(0);
		goodFood.state.push(true);

	}
	redNum = goodFood.x.length;
}

//adds values to x property of badFood
function drawNewBad() {
	if(score < 30){
		if(Math.random() < .05){
			badFood.x.push(Math.random() * canvas.width);
			badFood.y.push(0);
		}
	}
	else if(score < 50){
		if(Math.random() < .1){
			badFood.x.push(Math.random() * canvas.width);
			badFood.y.push(0);
		}
	}
	else{
		if(Math.random() < .2){
			badFood.x.push(Math.random() * canvas.width);
			badFood.y.push(0);
		}
	}
	blackNum = badFood.x.length;
}

// draws red and blue balls
function drawRedBall() {
	for(var i = 0; i < redNum; i++){
		if(goodFood.state[i] == true){
			//Keeps track of position in color array with changing redNum size
			var trackCol = (i + track);
		
			contxt.beginPath();
			contxt.arc(goodFood.x[i], goodFood.y[i], rad, 0, Math.PI * 2);
			contxt.fillStyle = goodFood.color[trackCol % 3];
			contxt.fill();
			contxt.closePath();
		}
	}
}

// draws black ball to avoid
function drawBlackBall() {
	for(var i = 0; i < blackNum; i++){
		//Keeps track of position in color array with changing blackNum size
		var badCol = (i + enemy);
		
		contxt.beginPath();
		contxt.arc(badFood.x[i], badFood.y[i], rad, 0, Math.PI * 2);
		contxt.fillStyle = badFood.color[badCol % 5];
		contxt.fill();
		contxt.closePath();
	}
}










var thumbImg = document.createElement('img');
thumbImg.src = 'imageedit__8803707195.png';
thumbImg.onload = function() {
    contxt.save();
    contxt.beginPath();
    contxt.arc(player.x, player.y, player.size, player.size, Math.PI * 2, true);
    contxt.closePath();
    contxt.clip();

    contxt.drawImage(thumbImg, player.x, player.y, player.size, player.size);

    contxt.beginPath();
    contxt.arc(player.x, player.y, player.size, player.size, Math.PI * 2, true);
    contxt.clip();
    contxt.closePath();
    contxt.restore();
};


// moves objects in play
function playUpdate() {
	
	if(left && player.x > 0){
		player.x -= 7;
	}
	if(right && player.x + player.size < canvas.width) {
		player.x += 7;
	}
	for(var i = 0; i < redNum; i++){
		goodFood.y[i] += goodFood.speed;
	}
	for(var i = 0; i < blackNum; i++){
		badFood.y[i] += badFood.speed;
	}
	
	// collision detection
	for(var i = 0; i < redNum; i++){
		// Only counts collision once
		if(goodFood.state[i]){
			if(player.x < goodFood.x[i] + rad && player.x + 30 + rad> goodFood.x[i] && player.y < goodFood.y[i] + rad && player.y + 30 > goodFood.y[i]){
				score++
				// Cycles through good food's color array
				player.color = goodFood.color[(i + track) % 3];
				goodFood.state[i] = false;
			}
		}
		// Removes circles from array that are no longer in play
		if(goodFood.y[i] + rad > canvas.height){
			goodFood.x.shift();
			goodFood.y.shift();
			goodFood.state.shift();
			track++;
		}
	}
	for(var i = 0; i < blackNum; i++){
		if(player.x < badFood.x[i] + rad && player.x + 30 + rad > badFood.x[i] && player.y < badFood.y[i] + rad && player.y + 30 > badFood.y[i]){
			lives--;
			player.color = badFood.color[(i+enemy)%5];
			badFood.y[i] = 0;
			if(lives <= 0){
				gamesOver();
			}
		}
		// Removes circles from x and y arrays that are no longer in play
		if(badFood.y[i] + rad > canvas.height){
			badFood.x.shift();
			badFood.y.shift();
			enemy++;
		}
	}
	switch(score){
		case 20:
			badFood.speed = 3;
			goodFood.speed = 3;
			level = 2;
			break;
		case 30:
			level = 3;
			break;
		case 40: 
			goodFood.speed = 4;
			level = 4;
			break;
		case 50:
			level = 5;
			break;
	}

}
//signals end of game and resets x, y, and state arrays for food
function gamesOver(){
	goodFood.x = [];
	badFood.x = [];
	goodFood.y = [];
	badFood.y = [];
	goodFood.state = [];
	gameOver = true;
}

//resets game, life, and score counters
function playAgain() {
	gameOver = false;
	player.color = "blue";
	level = 1;
	score = 0;
	lives = 3;
	badFood.speed = 2;
	goodFood.speed = 2;
}
function draw(){
	contxt.clearRect(0, 0, canvas.width, canvas.height);
	if(!gameOver){
        
		thumbImg.onload();
		drawBlackBall();
		drawRedBall();
		playUpdate();
		drawNewGood();
		drawNewBad();
			
		//score
		contxt.fillStyle = "black";
		contxt.font = "20px Helvetica";
		contxt.textAlign = "left";
		contxt.fillText("Score: " + score, 10, 25);
	
		//lives
		contxt.textAlign = "right";
		contxt.fillText("Lives: " + lives, 500, 25);
	}
	else{
		contxt.fillStyle = "Green";
		contxt.font = "25px Verdana";
		contxt.textAlign = "center";
		contxt.fillText("GAME OVER!", canvas.width/2, 175);
		
		contxt.font = "20px Helvetica";
		contxt.fillText("PRESS SPACE TO PLAY", canvas.width/2, 475);
		
		contxt.fillText("FINAL SCORE: " + score, canvas.width/2, 230);
	}
	document.getElementById("level").innerHTML = "Level: " + level;
	requestAnimationFrame(draw);
}



draw();