
cs = 66
function init(){
	canvas = document.getElementById("mycanva");
	W = H = canvas.width = canvas.height = 1000;
	pen = canvas.getContext('2d')
	game_over = false;
	score = 0;

	trophy = new Image()
	trophy.src  = "assets/trophy.png"
	food_img = new Image()
	food_img.src = "assets/apple.png"
	fruit_eat = new Audio("assets/fruit_eat.mp3")
	game_over_sound = new Audio("assets/gameover.mp3")
	food = getRandomFood();
	console.log(food.x, food.y)
	snake = {
		init_size: 5,
		color: "blue",
		cells:[],
		speed: 200,
		direction: "right",

		createCells:function(){
			for(var i = this.init_size; i>0;--i){
				this.cells.push({ x:i, y:0});
			}
		},

		drawSnake:function(){
			for(var i = 0; i< this.init_size; ++i){
				pen.fillStyle = this.color
				pen.fillRect(this.cells[i].x*cs, this.cells[i].y*cs, cs-3, cs-3)
			}
		},
		updateSnake:function(){
			headx = this.cells[0].x;
			heady = this.cells[0].y;
			
			// here we will check if the snake has eaten the food, if yes then increase the size of snake
			if(headx == food.x && heady==food.y){
				console.log("Food Eaten");
				fruit_eat.play();
				food = getRandomFood();
				this.init_size++;
				this.speed -=5;
				clearInterval(f)
				f = setInterval(gameloop, this.speed)
				score++;
			}
			else{
				this.cells.pop();
			}
			var nextx, nexty;
			if(this.direction == "right"){
				nextx = headx + 1;
				nexty = heady;
			}
			else if(this.direction == "left"){
				nextx = headx - 1;
				nexty = heady;
			}
			else if(this.direction == "up"){
				nextx = headx;
				nexty = heady - 1;
			}
			else if(this.direction == "down"){
				nextx = headx;
				nexty = heady + 1;
			}
			
			
			this.cells.unshift({x:nextx, y:nexty})
			// logic that prevents snake from going out
			for(var i = 1;i<this.init_size;++i){
				if(this.cells[i].x == this.cells[0].x && this.cells[i].y== this.cells[0].y){
					game_over = true;
					return
				}
			}
			
			var endx = Math.round(W/cs)-1;
			var endy = Math.round(H/cs)-1;
			if(nextx<0 || nextx> endx || nexty<0 || nexty>endy){
				game_over = true;
			}
		}
	};
	snake.createCells();
	function keyPressed(e){
		// check for previous key stroke
		
		if(e.key == "ArrowRight" && snake.direction!="left"){
			snake.direction = "right";
		}
		else if(e.key == "ArrowDown" && snake.direction!="up"){
			snake.direction = "down";
		}
		else if(e.key == "ArrowUp" && snake.direction!="down"){
			snake.direction = "up";
		}
		else if(e.key == "ArrowLeft" && snake.direction!="right"){
			snake.direction = "left";
		}
		console.log(snake.direction)
	}
	document.addEventListener('keydown', keyPressed)
};

function draw(){
	pen.clearRect(0,0,W,H)
	snake.drawSnake();
	pen.drawImage(food_img,food.x*cs, food.y*cs, cs, cs);

	pen.drawImage(trophy,28,18,cs,cs)
	pen.fillStyle = "blue"
	pen.font = "25px Roboto"
	pen.fillText(score, 50, 50)
};


function getRandomFood(){
	foodx = Math.round(Math.random()*(W-cs)/cs);
	foody = Math.round(Math.random()*(H-cs)/cs);


	var food = {
		x:foodx,
		y:foody,
		color: "red",
	}
	return food;

}
function update(){
	snake.updateSnake()
};

function gameloop(){
	if(game_over == true){
		game_over_sound.play()
		clearInterval(f)
		alert("Game Over!!! Final Score " + score)
		return
	}
	draw()
	update()
};

init();
f = setInterval(gameloop, snake.speed);
//f=setInterval(gameloop, 100)


