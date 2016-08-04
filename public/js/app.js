/**
 * Snakes and Ladders game
 * Version: 0.0.0
 */

let Player = (function() {
	'use strict';

	function Player(name) {
		// enforces new
		if (!(this instanceof Player)) {
			return new Player(name);
		}
		// constructor body
		this.name = name;
		var _position = 0;
		var _nThrows = 0;
		var _sixCount = 0;
		var _nLaddersClimbed = 0;
		var _nSnakeEncountered = 0;
		this.setPosition = function(position){
			_position = position;
		};
		this.getPosition = function() {
			return _position;
		};
		this.incrementThrowCount = function(){
			_nThrows++;
		};
		this.getThrowCount = function(){
			return _nThrows;
		};
		this.incrementSixCount = function(){
			_sixCount++;
		};
		this.getSixCount = function(){
			return _sixCount;
		};
		this.incrementLadderClimbedCount = function(){
			_nLaddersClimbed++;
		};
		this.getLadderClimbedCount = function(){
			return _nLaddersClimbed;
		};
		this.incrementSnakeEncounterCount = function(){
			_nSnakeEncountered++;
		};
		this.getSnakeEncounterCount = function(){
			return _nSnakeEncountered;
		};
	}

	return Player;
}());

let Snake = (function() {
	'use strict';
	function Snake(head, tail) {
		// enforces new
		if (!(this instanceof Snake)) {
			return new Snake(head, tail);
		}
		// constructor body
		if(head >= 100 || head <= 1) throw Error("Invalid placement of snake's head");
		if(tail >= 100 || tail <= 0) throw Error("Invalid placement of snake's tail");

		if (head <= tail) throw Error("Snake's head should be at higher position than tail");

		let _head = head;
		let _tail = tail;

		this.getHead = function() {
			return _head;
		}

		this.getTail = function() {
			return _tail;
		}
	}
		
	Snake.prototype.eat = function(player) {
		if (player instanceof Player) {
			if (this.getHead() != player.getPosition()) throw Error("Position mismatch");

			console.log("Snake bit %s", player.name);
			console.log(player.name," moving down to: ", this.getTail());
			player.setPosition(this.getTail());
			player.incrementSnakeEncounterCount();
		} else {
			throw Error("Snake only eats Player");
		}
	};

	return Snake;
}());

let Ladder = (function() {
	'use strict';

	function Ladder(bottom,top) {
		// enforces new
		if (!(this instanceof Ladder)) {
			return new Ladder(bottom,top);
		}
		// constructor body
		if(bottom >= 100 || bottom <= 1) throw Error("Invalid placement of ladder's bottom");
		if(top > 100 || top <= 0) throw Error("Invalid placement of ladder's top");

		if (top <= bottom) throw Error("Ladder's top should be greater than bottom");

		let _bottom = bottom;
		let _top = top;

		this.getBottom = function() {
			return _bottom;
		}

		this.getTop = function() {
			return _top;
		}
	}

	Ladder.prototype.letClimb = function(player) {
		if (player instanceof Player) {
			if (this.getBottom() != player.getPosition()) throw Error("Position mismatch");

			console.log("Player %s got ladder", player.name);
			console.log(player.name," moving up to: ", this.getTop());
			player.setPosition(this.getTop());
			player.incrementLadderClimbedCount();
		} else {
			throw Error("Ladder only lets Player to climb");
		}
	};

	return Ladder;
}());

let snakes = new Array();
snakes.push(new Snake(16,6));
snakes.push(new Snake(46,25));
snakes.push(new Snake(49,11));
snakes.push(new Snake(62,19));
snakes.push(new Snake(64,60));
snakes.push(new Snake(74,53));
snakes.push(new Snake(89,68));
snakes.push(new Snake(92,88));
snakes.push(new Snake(95,75));
snakes.push(new Snake(99,80));

let ladders = new Array();
ladders.push(new Ladder(2,38));
ladders.push(new Ladder(7,14));
ladders.push(new Ladder(8,31));
ladders.push(new Ladder(15,26));
ladders.push(new Ladder(21,42));
ladders.push(new Ladder(28,84));
ladders.push(new Ladder(36,44));
ladders.push(new Ladder(51,67));
ladders.push(new Ladder(71,91));
ladders.push(new Ladder(78,98));
ladders.push(new Ladder(87,94));
	
const Peg = React.createClass({
	render: function() {
		const types = ["peg__red","peg__green","peg__blue","peg__yellow"];
		const pegNumber = this.props.pegNumber;
		return(
			<div className={!isNaN(pegNumber)? "peg "+types[pegNumber]:"peg"}></div>
		);
	},
});

const Cell = React.createClass({
	render: function() {
		const col = this.props.colId;
		const row = this.props.rowId;
		const size = this.props.size;
		const pegs = this.props.pegs;
		const position = (row%2 == 0) ? (size-1-row)*10+(size-1-col)+1 : (size-1-row)*10+col+1;
		let renderPegs = [];
		let positionDuplicates = [];
		let i;
		for (i = 0; i < pegs.length; i++) {
			if(pegs[i].getPosition()==position){
				positionDuplicates.push(i);
			}
		}
		let j=0;
		positionDuplicates.forEach(function(peg){
			renderPegs.push(<Peg key={j} pegNumber={positionDuplicates[j]}/>);
			j++;
		});

		return pegs.map(function(p){return p.getPosition()}).includes(position) ? (<div className="cell">{renderPegs}</div>):(<div className="cell"></div>);	
	},
});

const Row = React.createClass({
	render: function() {
		var row = [];
		for (var i = 0; i < this.props.size; i++) {
			row.push(<Cell key={i} rowId={this.props.rowId} colId={i} size={this.props.size} pegs={this.props.pegs}/>);
		}
		return (
			<div className = "row">
				{row}
			</div>
		);
	},
});

const Grid = React.createClass({
	render: function() {
		var rows = [];
		for (var i = 0; i < this.props.size; i++) {
			rows.push(<Row key={i} rowId={i} size={this.props.size} pegs={this.props.pegs} />);
		}
		return (
			<div className="grid">
				{rows}
			</div>
		);
	},
});

const Dice = React.createClass({
	handleClick: function() {
		this.props.throwDice();
	},
	render: function() {
		return(
			<div className="dice">
				<p style={{textAlign:'center'}}>{this.props.value}</p>
				<button type="button" style={{margin:'auto',width:'50px',display:'block'}} onClick={this.handleClick}>Throw</button>
			</div>
		);	
	},
});

const GameBoard = React.createClass({
	getInitialState: function() {
		return {
			status: 0, 	//0-Init,1-Started,2-Finished
			notification: "Game is about to start",
			nPlayers: 2,
			multiplayer: false,
			dice: 'Play!',
			pegs: [new Player("Player"),new Player("CPU")],
			activePlayer: 0,
			sixRepeated: 0,
		};
	},
	startGame: function(e) {
		e.preventDefault();
		let radios = document.getElementsByName('gameMode');
		let flag = false;
		let gameMode = "";
		for (var i = radios.length - 1; i >= 0; i--) {
			if(radios[i].checked){
				flag = true;
				gameMode = radios[i].value;
			}
		}

		if (!flag) {
			alert("Please select the mode!")
		}else if(gameMode==="multiPlayer"){
			this.setState({
				status: 2,
				notification: "Multiplayer game started",
				nPlayers: 4,
				multiplayer: true,
				pegs: [new Player("Player 1"),new Player("Player 2"),new Player("Player 3"),new Player("Player 4")],
			});
		}else{
			this.setState({
				status: 1,
				notification: "Single player game started",
			});
		}
	},
	updateDice: function() {
		const number = Math.round((Math.random() * 5)) + 1;
		this.setState({
			dice: number,
		});
		this.updatePegPosition(number);
	},
	updatePegPosition: function(movement) {
		const i = this.state.activePlayer;
		let pegs = this.state.pegs;
		const difference = 100-pegs[i].getPosition();

		pegs[i].incrementThrowCount();
		if(movement==6){
			pegs[i].incrementSixCount();
		}

		// Position should not exceed 100
		// e.g. If reach 95, then throw 5
		if(difference <= 6){
			if(difference==movement){
				pegs[i].setPosition(pegs[i].getPosition()+movement);
				this.setState({
					pegs: pegs,
					status: 2,
				});
			}else{
			 	/* Issue: Bad practice. Alternative: Implement queue for notification to support multiple messages*/
			 	alert(pegs[i].name+" should throw "+difference+" to win the game");
			}
		}else{
			pegs[i].setPosition(pegs[i].getPosition()+movement);
			this.setState({
				pegs: pegs
			});
		}
		this.updateGame(movement);
	},
	updateGame: function(dice){
		const N = this.state.nPlayers;
		const mode  = this.state.multiplayer;

		let pegs = this.state.pegs;
		let i = this.state.activePlayer;
		let sixR = this.state.sixRepeated;

		snakes.forEach(function(snake) {
			// if(snake.getHead() == pegs[i].getPosition()) pegs[i].setPosition(snake.getTail());
			if(snake.getHead() == pegs[i].getPosition()) snake.eat(pegs[i]);
		});

		ladders.forEach(function(ladder) {
			// if(ladder.getBottom() == pegs[i].getPosition()) pegs[i].setPosition(ladder.getTop());
			if(ladder.getBottom() == pegs[i].getPosition()) ladder.letClimb(pegs[i]);
		});

		if(dice==6 && sixR < 3){
			sixR++;
			this.setState({
				notification: pegs[i].name+' got extra chance',
				pegs: pegs,
				sixRepeated: sixR
			})
		}else{
			i = ++i%N; // Round robin
			let info = pegs[i].name+"'s turn";
			if(pegs[i].name==="CPU"){
				info += ". Please wait...";
			}
			this.setState({
				notification: info,
				pegs: pegs,
				activePlayer: i,
				sixRepeated: 0
			});
		}

		// Simulate CPU's turn
		if(i==1 && !mode){
			let self = this;
			setTimeout(function() {
				self.updateDice();
			},3000);
		}
	},
	render: function() {
		const status = this.state.status;
		const pegs = this.state.pegs;

		if(status===0){
			return (
				<div className="intro">
					<p style={{textAlign:'center'}}>
						Select the mode: <br/>
					</p>
					<form onSubmit={this.startGame}>
						<p style={{textAlign:'center'}}>
							<input type="radio" name="gameMode" value="singlePlayer"/>Single Player (with CPU)<br/>
							<input type="radio" name="gameMode" value="multiPlayer"/>Multiplayer<br/>
							<input type="submit" style={{margin:'auto',marginTop:'25px',width:'100px',display:'block'}} value="Start Game"/>
						</p>
					</form>
				</div>
			);
		}

		if(status===2){
			let scorecards = [];
			pegs.forEach(function(peg){
				scorecards.push(
							<div key={peg.name} className="scorecard">
								<h5 style={{textAlign:'center'}}>{peg.name} ( Score: {peg.getPosition()})</h5>
								<p style={{textAlign:'center'}}>
									Throws: {peg.getThrowCount()} <br/>
									Sixers: {peg.getSixCount()} <br/>
									Ladders climbed: {peg.getLadderClimbedCount()} <br/>
									Snakes encountered: {peg.getSnakeEncounterCount()}
								</p>
							</div>
						);
			});
			return (
				<div className="scoreboard">
					<p>Who is winner? Hit refresh to restart the game!</p>
					{scorecards}
				</div>
			);
		}

		let pegsType = [];
		pegs.forEach(function(peg){
			pegsType.push(<div key={pegs.indexOf(peg)} className="display__peg__type"> <Peg pegNumber={pegs.indexOf(peg)}/> : {peg.name} ({peg.getPosition()})</div>);
		});

		return (
			<div className="gameboard">
				<p style={{textAlign:'center'}}>{this.state.notification}</p>
				<Grid size={10} pegs={this.state.pegs} />
				<Dice value={this.state.dice} throwDice={this.updateDice}/>
				<div className="indicators__block">
					<p> Pegs - <br/> {pegsType} </p>
				</div>
			</div>
		);
	},
});

ReactDOM.render( <GameBoard /> ,
	document.getElementById('app')
);

/*
 * Reverse mapping:
 *
 * j = 9 - parseInt((position-1)/10); i = (j%2==0)? 9-((position-1)-(9-j)*10):(position-1)-(9-j)*10;
 *
 * <p style={{textAlign:'center'}}>{pegs[pegs.map(function(p){return p.getPosition()}).indexOf(100)].name} won the game! </p>
 * 
 */
 