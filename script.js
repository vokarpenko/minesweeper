const n = 10,
	difficulty = 0.15;
var bombCount = 0,
	maxBombCount = 10,
	remainFlags = maxBombCount,
	gameIsStarted = false;

var gameMatrix,
	revealed,
	body,
	table,
	flags;


function tableCreate(){
    var tbl  = document.createElement('table');
    tbl.classList.add('main-table-game');
    tbl.style.borderSpacing = '0';
    for(var i = 0; i < n; i++){
        var tr = tbl.insertRow();
        for(var j = 0; j < n; j++){
                var td = tr.insertCell();
                td.classList.add('cell');
                td.classList.add('closed');
                if (gameMatrix[i][j]==1) {
              		//БОМБЫ
              		//td.classList.add('bomb');
                }
                if (i%2==1)
                	if (j%2==0)
                		td.classList.add('light-green');
                	else
                		td.classList.add('dark-green');
                else
                	if (j%2==1)
                		td.classList.add('light-green');
                	else
                		td.classList.add('dark-green');
        }
    }
    return document.getElementsByClassName('main-table')[0].appendChild(tbl);
}

function clickCell (e) {
	let loseText = 'К сожалению вы проиграли, попробуйте еще раз';
	var winText = 'Поздарвляем, вы пробедили за ';
	let target = e.target || e.srcElement;
	if(target.nodeName=='TD'){
		if (!gameIsStarted){
			console.log(gameIsStarted)
			gameIsStarted=true;
			activateTimer();
		}
		let	i = target.parentNode.rowIndex,
			j = target.cellIndex;
		if (e.which===1){
			if(!flags[i][j]){
				if(gameMatrix[i][j]==1){
					deactivateTimer();
					target.classList.add('boom');
					showBomb(i,j);
					showModalWindow(loseText);
					//newGame();
			}
			else{
				let nearMines = calcNear(i,j);
				console.log(nearMines);
				reveal(i,j,target)
				if (nearMines!=0) {
					target.innerHTML=nearMines;
				}
			}
			}
		}
		if (e.which===3){
			if (!revealed[i][j]) {
				flags[i][j] = !flags[i][j];
				if (flags[i][j]){
					remainFlags-=1;
					target.classList.add('flag')
				}
				else {
					remainFlags+=1;
					target.classList.remove('flag')
				}
				setRemainFlags(remainFlags);
			}
		}
		if(checkWin()){
			deactivateTimer();
			showModalWindow(winText+timeFromStartGame+' с');
		}
	}
	return;
}

function setRemainFlags (count) {
	document.getElementsByClassName('flag-counter')[0].innerHTML=count;
}

function activateTimer () {
	var timerElement = document.getElementsByClassName('time-counter')[0];
	timeFromStartGame = parseInt(timerElement.innerHTML)+1;
	timerElement.innerHTML =  timeFromStartGame;
	timer = setTimeout(activateTimer, 1000);
}

function deactivateTimer () {
	clearTimeout(timer);
}
function showBomb(x,y){
	for (var i = gameMatrix.length - 1; i >= 0; i--) {
		for (var j = gameMatrix.length - 1; j >= 0; j--) {
			if(gameMatrix[i][j]==1 && !(x==i&&y==j))
				getNodeByXY(i,j).classList.add('bomb');
		}
	}
}
function checkWin(){
	for (var i = 0; i < n; i++) {
		for (var j = 0; j < n; j++) {
			if ((gameMatrix[i][j]==1) && (flags[i][j]==false)||
				(gameMatrix[i][j]==0) && (flags[i][j]==true)){
				return false;
			}
		}
	}
	return true;
}

function outBounds(x,y){
  return x<0||y<0||x>=n||y>=n;
}
 
function calcNear(x, y) {
  if(outBounds(x,y)) return 0;
  i=0;
  for (offsetX=-1; offsetX<=1; offsetX++) {
    for (offsetY=-1; offsetY<=1; offsetY++) {
      if (outBounds(offsetX+x, offsetY+y)) continue;
      i+=gameMatrix[offsetX+x][offsetY+y];
    }
  }
  return i;
}

function reveal(x, y){
	if(outBounds(x,y)) return;
	if(revealed[x][y]) return;
	revealed[x][y]=true;
	if (paintRevealed(x,y)) return;
	reveal(x-1, y-1);
	reveal(x-1, y+1);
	reveal(x+1, y-1);
	reveal(x+1, y+1);
	reveal(x-1, y);
	reveal(x+1, y);
	reveal(x, y-1);
	reveal(x, y+1);
}

function setCountOfMines (node,countMines) {
	node.innerHTML=countMines;
	switch (countMines) {
		case 1:
			node.classList.add('one-mine');
			break;
		case 2:
			node.classList.add('two-mine');
			break;
		case 3:
			node.classList.add('three-mine');
			break;
		case 4:
			node.classList.add('four-mine');
			break;
		default:
			node.classList.add('five-or-more-mine');
			break;
	}
}

function paintRevealed (x,y) {
	let currentNode = getNodeByXY(x,y)
	if(flags[x][y]){
		currentNode.classList.remove('flag');
	}
	currentNode.classList.remove('closed');
	if (x%2==1)
		if (y%2==0)
            currentNode.classList.add('light-revealed');
        else
            currentNode.classList.add('dark-revealed');
    else
        if (y%2==1)
            currentNode.classList.add('light-revealed');
        else
            currentNode.classList.add('dark-revealed');
	if(calcNear(x,y)!=0){
		setCountOfMines(currentNode,calcNear(x,y));
		return true;
	}
	return false;
}

function getNodeByXY (x,y) {
	return table.children[0].children[x].children[y];
}

function buttonNewGameClick () {
	//newGame();
}

function createMatrix () {
	var matrix = new Array(n);
	for (var i = 0; i < n; i++) {
		matrix[i] = new Array(n);
	}
	for (var i = 0; i < n; i++) {
		for (var j = 0; j < n; j++) {
			 if(Math.random()<difficulty&&bombCount<maxBombCount){
			 	matrix[i][j]= 1;
			 	bombCount+=1;
			 }
			 else {
			 	matrix[i][j]= 0;
			 }
		}
	}
	return matrix;
}

function createRevealedMatrix () {
	let revealed = new Array(n);
	for (var i = 0; i < revealed.length; i++) {
		revealed[i] = new Array(n);
		for(var j = 0; j < revealed[i].length; j++){
			revealed[i][j]=false;
		}
	}
	return revealed;
}

function createFlags () {
		let flags = new Array(n);
	for (var i = 0; i < flags.length; i++) {
		flags[i] = new Array(n);
		for(var j = 0; j < flags[i].length; j++){
			flags[i][j]=false;
		}
	}
	return flags;
}

function newGame () {
	initGame();
}

function initGame(){
	var timer;
	var timeFromStartGame;
	gameMatrix = createMatrix();
	revealed = createRevealedMatrix();
	body = document.body;
	table = tableCreate();
//	buttonNewGame = createButtonClear();
	flags = createFlags();
	table.addEventListener('mousedown', clickCell);
	table.addEventListener('contextmenu', event => event.preventDefault());
//	buttonNewGame.addEventListener('click', buttonNewGameClick());
}

initGame();


// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal


// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal 
function showModalWindow (text) {
	document.getElementsByClassName("modal-header-label")[0].innerHTML=text;
	modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
// window.onclick = function(event) {
//   if (event.target == modal) {
//     modal.style.display = "none";
//   }
// }