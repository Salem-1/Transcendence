function error_template(code, message) {
	return `
	<div class="container">
    <h1>` + code + `</h1>
    <p>` + message + `</p>
	<button class="btn btn-warning mt-3"  onclick="callRoute('/home')">Go Home</button>
  </div>
		`;
}
