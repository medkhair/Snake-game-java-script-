window.onload = function(){
    var canvasWidth = 900;
    var canvasHeight = 600;
    var blockSize = 30;
    var ctx;
    var delay = 100;
    var snakee;
    var applee;
    var widthinblocks = canvasWidth/blockSize;
    var heightinblocks = canvasHeight/blockSize;
    var score;
    var timeout;
    init();
    function init(){
        canvas = document.createElement('canvas');
        canvas.width = canvasWidth ;
        canvas.height = canvasHeight;
        canvas.style.border = "30px solid gray";
        canvas.style.margin = "50px auto";
        canvas.style.display = "block";
        canvas.style.backgroundColor = "#ddd";
        document.body.appendChild(canvas);
        ctx = canvas.getContext('2d');
        snakee = new Snake([[6,4], [5,4], [4,4],[3,4],[2,4],"right"]);
        applee = new apple([10,10]);
        score = 0;
        refresh();
    }
    function refresh(){
        snakee.advance();
        if (snakee.checkcollision()) {
            gameover();
        }
        else{
            
        if (snakee.iseatingapple(applee)) {
            score ++;
            snakee.ateapple = true;
            do {
                applee.setnewposition();
            } while (applee.isonsnake(snakee));
            
        }
        ctx.clearRect(0,0,canvasWidth ,canvasHeight);
        drawscore();
        snakee.draw();
        applee.draw();
        
        timeout = setTimeout(refresh,delay);
        }
        
    }
    function gameover(){
        ctx.save();
        ctx.font = "bold 70px sans-serif";
        ctx.fillStyle = "#000";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.strokeStyle = "white";
        ctx.lineWidth = 5;
        var centreX = canvasWidth /2;
        var centreY = canvasHeight /2;
        ctx.strokeText("Game Over", centreX, centreY-180 );
        ctx.fillText("Game Over", centreX, centreY-180 );
        ctx.font = "bold 30px sans-serif";
        ctx.strokeText("Appuyer sur espace", centreX, centreY-120 );
        ctx.fillText("Appuyer sur espace",centreX, centreY-120);
        
        ctx.restore();
    }
    function restart(){
        snakee = new Snake([[6,4], [5,4], [4,4],[3,4],[2,4],"right"]);
        applee = new apple([10,10]);
        score = 0;
        clearTimeout(timeout);
        refresh();
    }
    function drawscore(){
        ctx.save();
        ctx.font = "bold 200px sans-serif";
        ctx.fillStyle = "gray";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        var centreX = canvasWidth /2;
        var centreY = canvasHeight /2;
        ctx.fillText(score.toString(), centreX, centreY );
        ctx.restore();
    }
    function drawBlock(ctx, position){
        var x = position[0] * blockSize;
        var y = position[1] * blockSize;
        ctx.fillRect(x,y,blockSize,blockSize);
    }
    function Snake(body,direction){
        this.body = body;
        this.direction = body[body.length - 1];
        this.ateapple = false;
        this.draw = function(){
            ctx.save();
            ctx.fillStyle = "#ff0000";
            for(var i = 0;i<this.body.length; i++){
                drawBlock(ctx, this.body[i]);
            }
            ctx.restore();
        };
        this.advance = function(){
            var nextPosition = this.body[0].slice();
            switch(this.direction){
                case "left":
                    nextPosition[0] -= 1;
                    break;
                case "right":
                    nextPosition[0] += 1;
                    break;
                case "down":
                    nextPosition[1] += 1;
                    break;
                case "up":
                    nextPosition[1] -= 1;
                    break;
                default :
                    throw("invalid direction");
            }
            this.body.unshift(nextPosition);
            if(!this.ateapple){
                this.body.pop();
            } else {
                this.ateapple = false;
            }
                
        };
        this.setDirection = function(newDirection){
            var allowedDirection;
            switch(this.direction){
                case "left":
                case "right":
                    allowedDirection = ["up","down"];
                    break;
                case "down":
                case "up":
                    allowedDirection = ["left","right"];
                    break;
                default :
                    throw("invalid direction");
            }
            if(allowedDirection.indexOf(newDirection) > -1){
                this.direction = newDirection;
            }
        };
        this.checkcollision = function(){
            var wallcollision = false;
            var snakecollision = false;
            var head = this.body[0];
            var rest = this.body.slice(1);
            var SnakeX = head[0];
            var SnakeY = head[1];
            var minX = 0;
            var minY = 0;
            var maxX = widthinblocks - 1;
            var maxY = heightinblocks - 1;
            var isnotbetweenhorizontalwalls = SnakeX < minX || SnakeX > maxX;
            var isnotbetweenverticalwalls = SnakeY < minY || SnakeY > maxY;
            if(isnotbetweenhorizontalwalls || isnotbetweenverticalwalls){
                wallcollision = true;
            }
            for (var i = 0; i < rest.length; i++) {
                if (SnakeX === rest[i][0] && SnakeY === rest[i][1] ) {
                    snakecollision = true;
                }
                
            }
            return wallcollision || snakecollision;

        };
        this.iseatingapple = function(appletoeat){
            var head = this.body[0];
            if (head[0] === appletoeat.position[0] && head[1] === appletoeat.position[1]) {
                return true;
            }else{
                return false;
            }
        };
    }

    function apple(position){
        this.position = position;
        this.draw = function(){
            ctx.save();
            ctx.fillStyle = "#00FF00";
            ctx.beginPath();
            var radius = blockSize/2;
            var x = this.position[0] * blockSize + radius;
            var y = this.position[1] * blockSize + radius;
            ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
            ctx.fill();
            ctx.restore();
        };
        this.setnewposition = function () {
            var newX = Math.round(Math.random() * (widthinblocks - 1));
            var newY = Math.round(Math.random() * (heightinblocks - 1));
            this.position = [newX, newY];
        };
        this.isonsnake = function(snaketocheck){
            var isonsnake = false;
            for (var i = 0; i < snaketocheck.body.length; i++) {
                if (this.position[0] === snaketocheck.body[i][0] && this.position[1] === snaketocheck.body[i][1]) {
                    isonsnake = true;
                }
            }
            return isonsnake;
        };
    }
    
    this.document.onkeydown = function handleKeyDown(e){
        var key = e.keyCode;
        var newDirection;
        switch(key){
            case 37:
                newDirection = "left";
                break;
            case 38:
                newDirection = "up";
                break;
            case 39:
                newDirection = "right";
                break;
            case 40:
                newDirection = "down";
                break;
            case 32:
                restart();
                return;
            default :
                return;
        }
        snakee.setDirection(newDirection);
    }    
}