

window.onload = function(){
//quand la fenetre est chargée
    //Structures
    let canvasWidth = 900;
    let canvasHeight = 600;
    let blockSize = 30;
    let ctx;
    let delay = 50;
    let snaky;
    let apple;
    let widthInBlocks = canvasWidth/blockSize;
    let heightInBlocks = canvasHeight/blockSize;
    let score;
    let timeout;
    let snakeSkin = new Image();
    snakeSkin.src = 'snake.jpg';
    let appleSkin = new Image();
    appleSkin.src = "pomme.png";
    //Gestion score
    let bestScore = localStorage.getItem('bestScore') || 0;
    const resetButton = document.getElementById('resetButton');
    //Gestion des sons
    const audioMusic = document.createElement("audio");
    audioMusic.src = "DJVI - Cycles.mp3"; 
    audioMusic.loop = true; 
    audioMusic.volume = 0.015;
    const audioGameOver = document.createElement("audio");
    audioGameOver.src = "GameOver.mp3";
    audioGameOver.volume = 0.02;
    document.body.appendChild(audioMusic);


    initGame();
    initControls();

    // Dessine le canvas du jeu
    function initGame(){ 
        let canvas = document.createElement('canvas');
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        canvas.style.border = "20px solid green";
        canvas.style.margin = "50px auto 10px auto";
        canvas.style.backgroundColor = "rgba(129, 201, 90, 0.82)";
        canvas.style.display = 'block';
        // back ground du canvas
        // Titre du jeu
        ctx = canvas.getContext('2d');
        ctx.font = "bold 140px sans-serif";
        ctx.fillStyle = "green";
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        ctx.strokeStyle = "black";
        ctx.lineWidth = "20";
        ctx.strokeText("SNAKY", (canvasWidth/2), (canvasHeight/2)-160);
        ctx.fillText("SNAKY", (canvasWidth/2), (canvasHeight/2)-159); 
        // Press enter to play
        ctx.font = "bold 50px sans-serif";
        ctx.fillStyle = "black"; 
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        ctx.strokeStyle = "white";
        ctx.lineWidth = "5";
        ctx.strokeText("Appuyer sur ESPACE pour jouer", (canvasWidth/2), (canvasHeight/2)+20);
        ctx.fillText("Appuyer sur ESPACE pour jouer", (canvasWidth/2), (canvasHeight/2)+20); 
        document.body.appendChild(canvas);
    };

    function initControls(){
        // reset button
        const resetButton = document.createElement('button');
        resetButton.id = 'resetButton';
        resetButton.textContent = 'Rénitialiser Meilleur Score';
        resetButton.style.margin = '5px auto';
        resetButton.style.display = 'block';
        resetButton.style.backgroundColor = 'green';
        resetButton.style.fontSize = '20px';
        resetButton.style.color = 'black';
        resetButton.style.border = '3px solid black';
        resetButton.style.borderRadius = '5px'
        resetButton.addEventListener('mouseenter', () => {
            resetButton.style.backgroundColor = 'lightgreen';
        });
    
        resetButton.addEventListener('mouseleave', () => {
            resetButton.style.backgroundColor = 'green';
        });
        resetButton.addEventListener('click', () => {
            localStorage.removeItem('bestScore');
            bestScore = 0;
            alert('Au prochain lancement votre meilleur score sera rénitialisé à 0 !');
            });
        // Mute music
        const muteButton = document.createElement('button');
        muteButton.id ='muteButton';
        muteButton.textContent = "Activer/Désactiver la musique";
        muteButton.style.margin = '5px auto';
        muteButton.style.display = 'block';
        muteButton.style.backgroundColor = 'green';
        muteButton.style.fontSize = '20px';
        muteButton.style.color = 'black';
        muteButton.style.border = '3px solid black';
        muteButton.style.borderRadius = '5px'
        muteButton.addEventListener('mouseenter', () => {
            muteButton.style.backgroundColor = 'lightgreen';
        });
    
        muteButton.addEventListener('mouseleave', () => {
            muteButton.style.backgroundColor = 'green';
        });
        muteButton.addEventListener('click', () => {
            Mute()
            });
            // Règles
        const PopRules = document.createElement('button');
        PopRules.id = 'resetButton';
        PopRules.textContent = 'Règles';
        PopRules.style.margin = '5px auto';
        PopRules.style.display = 'block';
        PopRules.style.backgroundColor = 'green';
        PopRules.style.fontSize = '20px';
        PopRules.style.color = 'black';
        PopRules.style.border = '3px solid black';
        PopRules.style.borderRadius = '5px'
        PopRules.addEventListener('mouseenter', () => {
            PopRules.style.backgroundColor = 'lightgreen';
        });
    
        PopRules.addEventListener('mouseleave', () => {
            PopRules.style.backgroundColor = 'green';
        });
        PopRules.addEventListener('click', () => {
            alert('Aidez Snaky à devenir le plus gros possible en mangeant les pommes avec les flèches directionnelles. Attention à ne pas se prendre de mur ou se manger la queue !');
            });
        document.body.appendChild(PopRules);
        document.body.appendChild(muteButton);
        document.body.appendChild(resetButton);
    }


    // quand on appuie sur entrée
    function start(){
        snaky = new Snake([[6,4],[5,4],[4,4],[3,4],[2,4],[1,4]], "right")
        apple = new Apple([Math.round(Math.random() * (widthInBlocks - 1)),Math.round(Math.random() * (heightInBlocks - 1))])
        audioMusic.currentTime = 0;
        audioMusic.play();
        score = 0;
        clearTimeout(timeout);
        refreshCanvas();
    }


    function refreshCanvas(){
        snaky.move();
        if(snaky.checkCollision()){
            if(bestScore < score)
            {
                bestScore = score;
                localStorage.setItem('bestScore', bestScore); // Store bestScore in localStorage
            }
            audioMusic.pause();  
            gameOver();
        }else{
            // dessiner le serpent à l'intérieur du canvas avec ctx
            if(snaky.isEatingApple(apple)){
                score ++;
                do{
                    snaky.ateApple = true;
                    apple.newApplePosition();
                }while(apple.isOnSnake(snaky))
            }
            ctx.clearRect(0,0, canvasWidth, canvasHeight);
            drawScore();
            snaky.draw();
            apple.draw();
            timeout = setTimeout(refreshCanvas, delay)
        }
    };


    function drawBlock(ctx, position){
        let x = position[0] * blockSize;
        let y = position[1] * blockSize;
        ctx.drawImage(snakeSkin, x, y, blockSize, blockSize);
        // rectangle(x,y,largeur,longueur)
        ctx.strokeStyle = "rgba(0,0,0, 0.9)";
        ctx.lineWidth = "1";
        ctx.strokeRect(x, y, blockSize, blockSize);
        
    };

    function gameOver(){
        audioGameOver.play();
        ctx.save();
        // Game over text
        ctx.font = "bold 50px sans-serif"; 
        ctx.fillStyle = "black"; 
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        ctx.strokeStyle = "white";
        ctx.lineWidth = "5";
        ctx.strokeText("Game Over", (canvasWidth/2), (canvasHeight/2)-200);
        ctx.fillText("Game Over", (canvasWidth/2), (canvasHeight/2)-200); //texte à écrire, x, y du canvas
        // Replay text
        ctx.font = "bold 30px sans-serif"; 
        ctx.strokeText("Appuyer sur ESPACE pour rejouer !", (canvasWidth/2), (canvasHeight/2)-140);
        ctx.fillText("Appuyer sur ESPACE pour rejouer !", (canvasWidth/2), (canvasHeight/2)-140);
        // Best score
        ctx.font = "bold 30px sans-serif"; 
        ctx.strokeText("Votre meilleur score : " + bestScore.toString(), (canvasWidth/2), (canvasHeight/2)+130);
        ctx.fillText("Votre meilleur score : " + bestScore.toString(), (canvasWidth/2), (canvasHeight/2)+130);

        ctx.restore();
    }




    function drawScore(){
        ctx.save();
        ctx.font = "bold 200px sans-serif"; // police
        ctx.fillStyle = "rgba(0,128,0, 0.6)"; // couleur
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.strokeStyle = "rgba(0,256,0, 0.3)";
        ctx.lineWidth = "2";
        ctx.strokeText(score.toString(), (canvasWidth/2), (canvasHeight/2));
        ctx.fillText(score.toString(), (canvasWidth/2), (canvasHeight/2)); 
        ctx.restore();
    }

    function Mute() {
        if (audioMusic.volume === 0 || audioGameOver.volume === 0) {
            audioMusic.volume = 0.02;
            audioGameOver.volume = 0.02; // Unmute, set the volume to a non-zero value
            
        } else {
            audioMusic.volume = 0;
            audioGameOver.volume = 0; // Mute, set the volume to 0
        }
    }
    document.onkeydown = function HandleKeyDown(event){
        let key = event.key;
        let newDirection;
        switch(key){
            case "ArrowRight":
                newDirection = "right"
            break;
            case "ArrowLeft":
                newDirection = "left"
            break;
            case "ArrowUp":
                newDirection = "up"
            break;
            case "ArrowDown":
                newDirection = "down"
            break;
            case " ":
                start();
                return;
            case "m":
            case "M":
                Mute()
                return;
            default:
                return;
            
        }
        snaky.setDirection(newDirection);
    }




    // ----------------- Fonction prototype du serpent ---------------------------
    function Snake(body, direction){
        this.body = body;
        this.direction = direction;
        this.ateApple = false;
        this.draw = function(){
                ctx.save();
                
                for(let i = 0; i<this.body.length; i++){
                    drawBlock(ctx, this.body[i]);

                }
                ctx.restore();
            };
        
        this.move = function(){
            let nextPosition = this.body[0].slice();
            //copie le premier élément du body (tête)
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
                default:
                    throw("Invalid Direction");
                }
            this.body.unshift(nextPosition); //premier élément de la tete+1
            if(!this.ateApple){
                this.body.pop();
            }else{
                this.ateApple=false;
            }  
        };

        this.setDirection = function(newDirection){
            let allowDirections;
            switch(this.direction){
                case "left":
                case "right":
                    allowDirections =["up", "down"];
                    break;
                case "down":
                case "up":
                    allowDirections =["left", "right"];
                    break;
                default:
                    throw("Invalid Direction");
            }
            if(allowDirections.indexOf(newDirection) > -1){
                this.direction = newDirection;
            }
        }
        this.checkCollision = function(){
            let wallCollision = false;
            let snakeCollision = false;
            let head = this.body[0];
            let restBody = this.body.slice(1); // tout sauf 0, donc la tête
            let headX = head[0];
            let headY = head[1];
            let minX = 0;
            let minY = 0;
            let maxX = widthInBlocks - 1;
            let maxY = heightInBlocks -1;
            let notBetweenHorizontalWalls = headX < minX || headX > maxX;
            let notBetweenVerticalWalls = headY < minY || headY > maxY;
            if (notBetweenHorizontalWalls || notBetweenVerticalWalls){
                wallCollision = true;
            }
            for(let i = 0; i < restBody.length ; i++){
                if(headX === restBody[i][0] && headY === restBody[i][1]){
                    snakeCollision = true;
                }; // on vérifie si la tête n'est pas sur même x et y (même case)
            }
            return wallCollision || snakeCollision;
        }
        this.isEatingApple = function(appleToEat){
            let head = this.body[0];
            if (head[0] === appleToEat.position[0] && head[1] === appleToEat.position[1])
                return true;
            else
                return false;
        }
    }


    // ----------------- Fonction prototype de la pomme ---------------------------
    function Apple(position){
        this.position = position;
        this.draw = function(){
            ctx.save();
            let x = this.position[0] * blockSize;
            let y = this.position[1] * blockSize;
            ctx.drawImage(appleSkin, x, y, blockSize, blockSize);
            ctx.restore();
        };
        this.newApplePosition = function(){
            let newX = Math.round(Math.random() * (widthInBlocks - 1));
            let newY = Math.round(Math.random() * (heightInBlocks - 1));
            this.position = [newX, newY];
        };
        // Empecher que la nvle pomme apparaisse sur le body du snake
        this.isOnSnake = function(checkSnakeBody){
            let isOnSnake = false;
            for(let i = 0; i < checkSnakeBody.body.length; i++){
                if(this.position[0] === checkSnakeBody.body[i][0] && this.position[1] === checkSnakeBody.body[i][1]){
                    isOnSnake = true;
                }
            }
            return isOnSnake;
        }
    }
}
