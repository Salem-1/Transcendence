error_404 = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>404 NOT FOUND</title>
    <link
			href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css"
			rel="stylesheet"
			integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN"
			crossorigin="anonymous"
		/>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Press+Start+2P">
    <style>
        body {
	background: linear-gradient(45deg, #212121, #2c3e50, #212121, #2c3e50);
	background-size: 400% 400%;
	color: #f5f5f5;
	text-align: center;
	font-family: 'Press Start 2P', cursive;
	margin: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	height: 100vh;
	animation: fadeIn 2s ease-in-out, gradientMovement 10s infinite alternate;
  }

.container {
	max-width: 600px;
}

h1 {
	font-size: 4em;
	margin: 0;
	line-height: 1em;
	animation: bounce 1s infinite alternate;
}

p {
	font-size: 1.5em;
}


@keyframes bounce {
	to {
		transform: translateY(-10px);
	}
}

@keyframes fadeIn {
	from {
		opacity: 0;
	}
	to {
		opacity: 1;
	}
}

@keyframes gradientMovement {
	0% {
		background-position: 0% 0%;
	}
	100% {
		background-position: 100% 100%;
	}
}
    </style>
</head>
<body>
    <div class="container">
        <h1>404 GAME OVER</h1>
        <p>Uh-oh! It seems like you've ventured into uncharted territory.</p>
        <p>This level is off the map! Try a different path.</p>
    </div>
</body>
<script
		src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"
		integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL"
		crossorigin="anonymous"
></script>
</html>"""


error_500 = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>500 INTERNAL SERVER ERROR</title>
    <link
			href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css"
			rel="stylesheet"
			integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN"
			crossorigin="anonymous"
		/>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Press+Start+2P">
    <style>
        body {
	background: linear-gradient(45deg, #212121, #2c3e50, #212121, #2c3e50);
	background-size: 400% 400%;
	color: #f5f5f5;
	text-align: center;
	font-family: 'Press Start 2P', cursive;
	margin: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	height: 100vh;
	animation: fadeIn 2s ease-in-out, gradientMovement 10s infinite alternate;
  }

.container {
	max-width: 600px;
}

h1 {
	font-size: 4em;
	margin: 0;
	line-height: 1em;
	animation: bounce 1s infinite alternate;
}

p {
	font-size: 1.5em;
}


@keyframes bounce {
	to {
		transform: translateY(-10px);
	}
}

@keyframes fadeIn {
	from {
		opacity: 0;
	}
	to {
		opacity: 1;
	}
}

@keyframes gradientMovement {
	0% {
		background-position: 0% 0%;
	}
	100% {
		background-position: 100% 100%;
	}
}
    </style>
</head>
<body>
    <div class="container">
		<h1>500 INTERNAL SERVER ERROR</h1>
		<p>Oh no! Something went wrong in the game's server room.</p>
		<p>The developers are on it. Please be patient or restart your adventure.</p>		
    </div>
</body>
<script
		src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"
		integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL"
		crossorigin="anonymous"
></script>
</html>
"""