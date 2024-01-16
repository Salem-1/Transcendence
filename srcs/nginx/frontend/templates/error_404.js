
function error_404(){
		return (`
	<style>
		body {
			font-family: Arial, sans-serif;
			background-color: #654444;
			text-align: center;
			margin: 0;
			padding: 0;
		}
	
		h1 {
			color: #e4a8a8;
			margin-top: 2rem;
		}
	
		.image-container {
			margin-top: 3rem;
		}
	
		img {
			max-width: 100%;
			height: auto;
		}
	
		#funFact {
			font-size: 1.2rem;
			color: #333;
			margin-top: 1.5rem;
			display: none;
		}
	
		#funFactBtn {
			padding: 10px 20px;
			font-size: 1rem;
			color: #fff;
			background-color: #4caf50;
			border: none;
			border-radius: 4px;
			cursor: pointer;
			transition: background-color 0.3s ease;
		}
	
		#funFactBtn:hover {
			background-color: #45a049;
		}
	
		footer {
			background-color: #654444;
			padding: 10px;
			position: fixed;
			bottom: 0;
			left: 0;
			width: 100%;
		}
	</style>
	<h1>Oops! It seems you are Lost</h1>
	<div class="image-container">
		<img
			src="https://images.pond5.com/file-not-found-error-unsuccessful-footage-084512874_prevstill.jpeg"
			alt="File not found"
		/>
	</div>
	<footer>
		<button type="button" onclick="callRoute('/')">Go Home</button>
	</footer>
		`)
}