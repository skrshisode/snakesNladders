/**
 * Issues: The only issues is that the player still survives even after snake bite :P
 * 
 * Ideas: 
 * 1. Initially load some form elemtns to select the mode : single/multiplayer
 * 2. Then setState({multiplayer:----})
 * 3. Notification bar to get some info
 * 4. 
 */

(function() {

	let Player = (function() {
		'use strict';

		function Player(name) {
			// enforces new
			if (!(this instanceof Player)) {
				return new Player(name);
			}
			// constructor body
			this.name = name;
			_position = 0;
		}

		// Player.prototype.throwDice = function() {
		// 	return Math.round((Math.random() * 5)) + 1;
		// };

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
			if (head <= tail) throw Error("head should be at higher position than tail");

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
			if (top <= bottom) throw Error("top should be greater than bottom");

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
			const pegColor = this.props.pegColor;
			return(
				<div className={!!pegColor? "peg "+pegColor:"peg"}></div>
			);
		},
	});

	const Cell = React.createClass({
		render: function() {
			const col = this.props.colId;
			const row = this.props.rowId;
			const size = this.props.size;
			const position = (row%2 == 0) ? (size-1-row)*10+(size-1-col)+1 : (size-1-row)*10+col+1;
			return (
				<div className="cell">
					
				</div>
			);	
		},
	});

	const Row = React.createClass({
		render: function() {
			var row = [];
			for (var i = 0; i < this.props.size; i++) {
				row.push(<Cell key={i} rowId={this.props.rowId} colId={i} size={this.props.size}/>);
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
				rows.push(<Row key={i} rowId={i} size={this.props.size} />);
			}
			return (
				<div className="grid">
					{rows}
				</div>
			);
		},
	});

	const GameBoard = React.createClass({
		getInitialState: function() {
			return {
				num_of_players: 2,
				multiplayer: false,
				
			};
		},
		render: function() {
			return (
				<p>Game</p>
			);
		},
	});

	ReactDOM.render( <Grid size={10} /> ,
		document.getElementById('app')
	);

})();