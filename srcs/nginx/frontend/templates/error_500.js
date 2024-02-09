function error_500() {
	return `
	<div class="container">
    <h1>404 NOT FOUND</h1>
    <p>Uh-oh! Looks like you're lost in the game.</p>
    <p>Level not found! Try a different path.</p>
	<button class="btn btn-warning mt-3"  onclick="callRoute('/home')">Go Home</button>
  </div>
		`;
}
