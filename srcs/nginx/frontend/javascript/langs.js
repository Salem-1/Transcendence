// Function to update content based on selected language
function updateContent(langData) {
	document.querySelectorAll("[data-i18n]").forEach((element) => {
		const key = element.getAttribute("data-i18n");
		// element.textContent = langData[key];
		element.innerText = langData[key];
		if (element.getAttribute("placeholder"))
			element.setAttribute("placeholder", langData[key]);
	});
}

// Function to set the language preference
function setLanguagePreference(lang) {
	localStorage.setItem("language", lang);
}

// Function to fetch language data
async function fetchLanguageData(lang) {
	const response = await fetch(`languages/${lang}.json`);
	return response.json();
}

// Function to change language
async function changeLanguage(lang) {
	await setLanguagePreference(lang);

	const langData = await fetchLanguageData(lang);
	document.documentElement.setAttribute("lang", lang);
	updateContent(langData);
}

//Function to get translation
async function getTranslation(key) {
	const lang = localStorage.getItem("language") || "en";
	const langData = await fetchLanguageData(lang);
	return langData[key];
}

// Function to make alert in any language
async function alertInLang(key) {
	message = await await getTranslation(key);
	alert(message);
}

// // Call updateContent() on page load
// window.addEventListener("DOMContentLoaded", async () => {
// 	const userPreferredLanguage = localStorage.getItem("language") || "en";
// 	const langData = await fetchLanguageData(userPreferredLanguage);
// 	updateContent(langData);
// 	document.documentElement.setAttribute("lang", userPreferredLanguage);
// });
