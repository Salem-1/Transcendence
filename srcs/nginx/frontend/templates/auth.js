function auth() {
	return `
		<div class="loader"></div>
		<h1 data-i18n="loading">Loading...</h1>
		<p data-i18n="please wait">Please wait while we immerse you in the gaming experience!</p>
		${genModal()};
	`;
}
