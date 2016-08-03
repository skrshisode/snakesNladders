/*
 * Issues: The only issues is that the player still survives even after snake bite :P
 *
 * j = 9 - parseInt((position-1)/10); i = (j%2==0)? 9-((position-1)-(9-j)*10):(position-1)-(9-j)*10;
 * 
 * Ideas: 
 * 1. Initially load some form elemtns to select the mode : single/multiplayer
 * 2. Then setState({multiplayer:----})
 * 3. Notification bar to get some info
 * 4. 
 */
'use strict';

(function() {

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
			if (head <= tail) throw Error("Snake's head should be at higher position than tail");

			this.head = head;
			this.tail = tail;
		}

		Snake.prototype.eat = function(player) {
			if (player instanceof Player) {
				if (this.head != player.getPosition()) throw Error("Position mismatch");

				console.log("Snake bit %s", player.name);
				console.log(player.name, " moving down to: %d", this.tail);
				player.setPosition(this.tail);
			} else {
				throw Error("Snake only eats Player");
			}
		};

		return Snake;
	}());

	let Ladder = (function() {
		'use strict';

		function Ladder(top, bottom) {
			// enforces new
			if (!(this instanceof Ladder)) {
				return new Ladder(top, bottom);
			}
			// constructor body
			if (top <= bottom) throw Error("Ladder's top should be greater than bottom");

			this.top = top;
			this.bottom = bottom;
		}

		Ladder.prototype.letClimb = function(player) {
			if (player instanceof Player) {
				if (this.bottom != player.getPosition()) throw Error("Position mismatch");

				console.log("Player %s got ladder", player.name);
				console.log(player.name, " moving up to: %d", this.top);
				player.setPosition(this.top);
			} else {
				throw Error("Ladder only lets Player to climb");
			}
		};

		return Ladder;
	}());


	const Peg = React.createClass({
		render: function() {
			const types = ["peg__red","peg__green","peg__blue","peg__yellow"];
			const pegNumber = this.props.pegNumber;
			return(
				<div className={!isNaN(pegNumber)? "peg "+types[pegNumber]:"peg"}></div>
			);
		},
	});

	// How to handle overlapping pegs in a Cell?
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
				num_of_players: 2,
				multiplayer: false,
				dice: '?',
				pegs: [0,0],
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
					num_of_players: 4,
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
			let positions = this.state.pegs;
			positions[0] =  positions[0]+movement;
			this.setState({
				pegs: positions
			});
			this.updateGame();
		},
		updateGame: function(){

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

})();
 