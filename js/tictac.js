$(document).ready(function(){
	//variables
	var board = Array(10).fill('');
	var userChar;
	var compChar;
	var turn;
	var comp_score = 0;
	var ties_score = 0;
	var player_score = 0;

	//draw initial scores
	drawScores(comp_score, ties_score, player_score);


	//Events & gameplay

	//user chooses 'O'
	$('div.red.char').on('click', function(){
		userChar = 'O';
		compChar = 'X'
		turn = whoFirst();
			
		$('div#welcome').hide();
		$('div#gameboard').removeClass('hidden');
		// if computer plays
		if (turn === 'computer'){
			AIplay();
		}
		else {
			$('p#message').text('Your turn!');
		} 
	});

	//user chooses 'X'
	$('div.gray.char').on('click', function(){
		userChar = 'X';
		compChar = 'O'
		turn = whoFirst();
		
		$('div#welcome').hide();
		$('div#gameboard').removeClass('hidden');
		if (turn === 'computer'){
			AIplay();
		}
		else {
			$('p#message').text('Your turn!');
		}
	});

	// user clicks on a cell on the board
	$('div.cell').on('click', function(){
		if (turn === 'player') {
			var id = $(this).attr('id');
			var index = id.charAt(id.length - 1);
			var canmove = isCellFree(board, index);
			if (canmove) {
				boardUpdate(index, userChar);
				drawChar(index, userChar);

				var win = isWinner2(board, compChar);
				
				if (win.length === 3) {
					higlightWin(win);
					$('p#message').text('Your win!');
					//update scores
					updateScores(0, 0, 1);
					drawScores(comp_score, ties_score, player_score);
					setTimeout(playAgain, 2*1000);
				}
				else if (isTie()) {
					$('p#message').text('A tie!');
					//update scores
					updateScores(0, 1, 0);
					drawScores(comp_score, ties_score, player_score);
					setTimeout(playAgain, 2*1000);
				}
				else {
					turn = 'computer'
					AIplay();	
				}
			}
			else {
				$('p#message').text('Try again!');
			}
		}				
	});
		
	
	// play again event listeners
	$('#yes').on('click', function(){
		$('p#message').text('New game');
		//update board
		board = Array(10).fill('');
		turn = whoFirst();
			
		$('div#pagain').addClass('hidden');
		$('div#gameboard').removeClass('hidden');
		// if computer plays
		if (turn === 'computer'){
			AIplay();
		}
		else {
			$('p#message').text('Your turn!');
		}
	});

	$('#no').on('click', function(){
		$('div#yes-no').addClass('hidden');
		$('div#pagain').css({'height': 'auto'});
		$('div#pagain h2').css({'font-size': '3em'});
		$('div#pagain h2').text('See you again!');
		
	});

	//HELPERS

	//computer plays
	function AIplay(){
		var next = computerPlays(compChar);
		boardUpdate(next, compChar);
		drawChar(next, compChar);
		
		var win = isWinner2(board, compChar);
		
		if (win.length === 3) {
			higlightWin(win);
			$('p#message').text('Computer wins!');
			//update scores
			updateScores(1, 0, 0);
			drawScores(comp_score, ties_score, player_score);
			setTimeout(playAgain, 2*1000);
		}
		else if (isTie()) {
			$('p#message').text('A tie!');
			//update scores
			updateScores(0, 1, 0);
			drawScores(comp_score, ties_score, player_score);
			setTimeout(playAgain, 2*1000);
		}
		else {
			$('p#message').text('Your turn');
			turn = 'player';
		}
	}


	//random choice who goes first
	function whoFirst(){
		var randNum = Math.floor(Math.random() * 2);
		return randNum === 0 ? 'computer' : 'player'; 
	}
	
	//check for win
	function isWinner(bo, char) {
		return (bo[7] === char && bo[8] === char && bo[9] === char) || //top row
			(bo[4] === char && bo[5] === char && bo[6] === char) ||    // middle row
			(bo[1] === char && bo[2] === char && bo[3] === char) ||	   // bottom row
			(bo[7] === char && bo[4] === char && bo[1] === char) ||		//left col
			(bo[8] === char && bo[5] === char && bo[2] === char) ||		// middle col
			(bo[9] === char && bo[6] === char && bo[3] === char) ||		//right col
			(bo[7] === char && bo[5] === char && bo[3] === char) ||		// diagonal
			(bo[9] === char && bo[5] === char && bo[1] === char);		// diagonal
	}

	// check for win version 2 -> return empty array or array of indexes of won cells
	function isWinner2(bo, char) {
		var winArr = [];
		if (bo[7] === char && bo[8] === char && bo[9] === char) {		//top row
			return winArr = [7,8,9];										 
		}
		else if (bo[4] === char && bo[5] === char && bo[6] === char){		//middle row
			return winArr = [4,5,6];										
		} 
		else if (bo[1] === char && bo[2] === char && bo[3] === char){ 	    //bottom row
			return winArr = [1,2,3];		
		}	
		else if (bo[7] === char && bo[4] === char && bo[1] === char){ 		//left col
			return winArr = [7,4,1];	
		}	
		else if (bo[8] === char && bo[5] === char && bo[2] === char){		//middle col
			return winArr = [8,5,2];
		} 		
		else if (bo[9] === char && bo[6] === char && bo[3] === char){		//right col
			return winArr = [9,6,3];
		}	
		else if (bo[7] === char && bo[5] === char && bo[3] === char){		//diagonal
			return winArr = [7,5,3];	
		}	
		else if (bo[9] === char && bo[5] === char && bo[1] === char){		//diagonal
			return winArr = [9,5,1];
		}
		else {
			return winArr;
		}
	}

	// ask to play again
	function playAgain(){
		$('div.cell').empty();
		$('div.cell.highlighted').removeClass('highlighted');
		$('div#gameboard').addClass('hidden');
		$('div#pagain').removeClass('hidden');
	}

	//check if bord is full
	function isTie(){
		return board.slice(1).every(function(elem){
			return elem !== ''; 
		});
	}

	// check if a choosen cell is free
	function isCellFree(bo, move){
		return bo[move] === '';
	}

	//randomly choose elem from list of numbers + 
	//check if the cell with this number is free
	function chooseRandom(bo, list){
		var possibleMoves = [];
		list.forEach(function(elem){
			if (isCellFree(bo, elem)){
				possibleMoves.push(elem);
			}
		});
		if (possibleMoves.length !== 0) {
			var randomIndex = Math.floor(Math.random() * possibleMoves.length);
			return possibleMoves[randomIndex];
		}
		else {
			return null;
		}
	}

	//draw characters on the board
	function drawChar(index, char) {
		var target = 'div#cell-'+index;
		
		if (char === 'O') {
			$(target).html('<div class="red">' + char + '</div>');
		}
		else {
			$(target).html('<div class="gray">X</div>');
		}
	}

	//upadate board
	function boardUpdate(index, char){
		board[index] = char;
	}

	//AI algorithm, returns index of next move cell
	function computerPlays(char){
		//check if comp can win in 1 move
		for (var i = 1; i < board.length; i++){
			copy = board.slice();
			if (isCellFree(copy, i)){
				copy[i] = char;
				if (isWinner(copy, char)){
					return i;
				}
			}
		}
		//check if player can win on the next step and block him/her
		for (var i = 1; i < board.length; i++){
			copy = board.slice();
			if (isCellFree(copy, i)){
				copy[i] = userChar;
				if (isWinner(copy, userChar)){
					return i;
				}
			}
		}
		//try corners if they are free
		var move = chooseRandom(board, [1,3,7,9]);
			if (move !== null){
				return move;
			}
		//try center
		if (isCellFree(board, 5)){
			return 5;
		}
		//move on the one of sides
		return chooseRandom(board, [2,4,6,8]);
	}

	//update scores
	function updateScores(comp, tie, player){
		comp_score += comp;
		ties_score += tie;
		player_score += player;
	}

	//draw scores on the top of the board
	function drawScores(comp, tie, player){
		$('p#computer span').text(comp);
		$('p#ties span').text(tie);
		$('p#player span').text(player);
	}

	function higlightWin(arr){
		arr.forEach(function(elem){
			var name = '#cell-' + elem;
			$(name).addClass('highlighted');
		});
	}

});