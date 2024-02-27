
function isAllowedLang(lang) {
	const allowedlangs = ["en", "es", "pt", "ar"];
	return allowedlangs.includes(lang);
}

function updateContent(langData) {
	document.querySelectorAll("[data-i18n]").forEach((element) => {
		const key = element.getAttribute("data-i18n");
		// element.textContent = langData[key];
		element.innerText = langData[key];
		if (element.getAttribute("placeholder"))
			element.setAttribute("placeholder", langData[key]);
	});
}

function setLanguagePreference(lang) {
	// get jwt token from cookie
	const jwt = document.cookie.includes("Authorization");
	if (jwt) {
		try{
			
		fetch(`${window.location.origin}/api/setLanguagePreference/`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include", // Add this line
			body: JSON.stringify({ language: lang }),
		});
		}
		catch (e){
			localStorage.setItem("language", lang);
			return ;
		}
	}
	localStorage.setItem("language", lang);
}

async function getLanguageData(lang) {
	const response = await fetch(`/languages/${lang}.json`);
	return response.json();
}

async function changeLanguage(lang) {
	if (!isAllowedLang(lang))
		return;
	await setLanguagePreference(lang);

	const langData = await getLanguageData(lang);
	document.documentElement.setAttribute("lang", lang);
	updateContent(langData);
}

async function getTranslation(key) {
	let lang = localStorage.getItem("language") || "en";
	if (!isAllowedLang(lang)) lang = "en";
	const langData = await getLanguageData(lang);
	return langData[key];
}
