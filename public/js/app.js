/**
 * Snakes and Ladders game
 * Author: Sushilkumar Shisode
 * Version: 0.0.0
 */

/*	
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
			this.setPosition = function(position){
				_position = position;
			};
			this.getPosition = function() {
				return _position;
			};
		}

		return Player;
	}());
*/

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

/*		
	Snake.prototype.eat = function(player) {
		if (player instanceof Player) {
			if (this._head != player.getPosition()) throw Error("Position mismatch");

			console.log("Snake bit %s", player.name);
			console.log(player.name, " moving down to: %d", this._tail);
			player.setPosition(this._tail);
		} else {
			throw Error("Snake only eats Player");
		}
	};
*/

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

/*		
	Ladder.prototype.letClimb = function(player) {
		if (player instanceof Player) {
			if (this._bottom != player.getPosition()) throw Error("Position mismatch");

			console.log("Player %s got ladder", player.name);
			console.log(player.name, " moving up to: %d", this._top);
			player.setPosition(this._top);
		} else {
			throw Error("Ladder only lets Player to climb");
		}
	};
*/

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

// Issue: How to handle overlapping pegs in a Cell? i.e. duplicates in pegs array
const Cell = React.createClass({
	render: function() {
		const col = this.props.colId;
		const row = this.props.rowId;
		const size = this.props.size;
		const pegs = this.props.pegs;
		const position = (row%2 == 0) ? (size-1-row)*10+(size-1-col)+1 : (size-1-row)*10+col+1;
		return pegs.includes(position) ? (<div className="cell"><Peg pegNumber={pegs.indexOf(position)}/></div>):(<div className="cell"></div>);	
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
			dice: '?',
			pegs: [0,0],
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
				status: 1,
				notification: "Multiplayer game started",
				nPlayers: 4,
				multiplayer: true,
				pegs: [0,0,0,0],
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
			notification: "Dice thrown",
			dice: number,
		});
		this.updatePegPosition(number);
	},
	updatePegPosition: function(movement) {
		const i = this.state.activePlayer;
		let positions = this.state.pegs;
		positions[i] =  positions[i]+movement;

		// Position should not exceed 100
		// If reach 95, then throw 5

		// if(movement==6){

		// }else{

		// }
		this.setState({
			pegs: positions
		});
		this.updateGame();
	},
	updateGame: function(){
		const N = this.state.nPlayers;
		const mode  = this.state.multiplayer;
		const dice = this.state.dice;
		let pegs = this.state.pegs;
		let i = this.state.activePlayer;
		let sixR = this.state.sixRepeated;

		snakes.forEach(function(snake) {
			if(snake.getHead() == pegs[i]) pegs[i] = snake.getTail();
		});

		ladders.forEach(function(ladder) {
			if(ladder.getBottom() == pegs[i]) pegs[i] = ladder.getTop();
		});

		if(dice==6 && sixR < 3){
			sixR++;
			this.setState({
				notification: 'Player '+i+' got extra chance',
				pegs: pegs,
				sixRepeated: sixR
			})
		}else{
			i = ++i%N; // Round robin
			this.setState({
				notification: 'Player '+i+' gets the chance',
				pegs: pegs,
				activePlayer: i,
				sixRepeated: 0
			})
		}
	},
	render: function() {
		if(this.state.status===0){
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

		return (
			<div className="gameboard">
				<p style={{textAlign:'center'}}>{this.state.notification}</p>
				<Grid size={10} pegs={this.state.pegs} />
				<Dice value={this.state.dice} throwDice={this.updateDice}/>
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
 */
 