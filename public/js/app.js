(function(){

	const Cell = React.createClass({
		render: function() {
			return (
				<div className="cell">

				</div>
			);
		},
	});

	const Row = React.createClass({
		render: function() {
			return (
				<div className="row">

				</div>
			);
		},
	});

	const GameBoard = React.createClass({
		render: function(){
			return (
				<p>Game</p>
			);
		},
	});

	ReactDOM.render(
		<Cell />,
		document.getElementById('app')
	);

})();