function getSVGIcon(type) {
	let successfill =
		"M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z";
	let infofill =
		"M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z";
	let warningfill =
		"M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z";
	switch (type) {
		case "success":
			return successfill;
		case "warning":
			return warningfill;
		default:
			return infofill;
	}
}

function timedAlert(
	message,
	alerttype = "warning",
	timeout = 3000,
	icon = null,
	alertplaceholder = "liveAlertPlaceholder",
	alertdivID = "alertdiv"
) {
	if (icon == null) icon = alerttype;

	alertDivID = alertdivID + Math.floor(Math.random() * 1000000);
	// remove old alerts

	// alert body
	let alertDiv = document.createElement("div");
	alertDiv.id = alertdivID;
	alertDiv.className =
		"alert " + "alert-" + alerttype + " alert-dismissible fade show";
	alertDiv.setAttribute("role", "alert");
	alertDiv.setAttribute("style", "opacity: 100%;");

	//creat the close button of the alert
	let closebutton = document.createElement("button");
	closebutton.type = "button";
	closebutton.className = "btn-close";
	closebutton.setAttribute("data-bs-dismiss", "alert");
	closebutton.setAttribute("aria-label", "Close");

	// Create the icon element using SVG
	let iconSVG = document.createElementNS("http://www.w3.org/2000/svg", "svg");
	iconSVG.setAttribute("class", "bi flex-shrink-0 me-2");
	iconSVG.setAttribute("width", "24");
	iconSVG.setAttribute("height", "16");
	iconSVG.setAttribute("role", "img");
	iconSVG.setAttribute("aria-label", "exclamation-triangle-fill" + " Icon");

	// Create the path element for the icon
	let path = document.createElementNS("http://www.w3.org/2000/svg", "path");
	path.setAttribute("d", getSVGIcon(alerttype));
	iconSVG.appendChild(path);

	// Append the progress bar to the alert
	alertDiv.appendChild(iconSVG);
	alertDiv.appendChild(closebutton);
	alertDiv.appendChild(document.createTextNode(message));
	alertplaceholder = document.getElementById(alertplaceholder);
	if (alertplaceholder == null) {
		alertplaceholder = document.createElement("div");
		alertplaceholder.id = "liveAlertPlaceholder";
		document.body.appendChild(alertplaceholder);
	}
	alertplaceholder.appendChild(alertDiv);

	// Set an interval to update the progress bar every second
	let startTime = Date.now();
	let intervalId = setInterval(function () {
		let ellapsedtTime = Date.now() - startTime;
		if (ellapsedtTime > timeout / 3.0)
		{
			let prec = ellapsedtTime / (timeout);
			let opacity = 1 - prec + 0.333;
			alertDiv.setAttribute("style", "opacity: " + opacity + ";");
		}

		if (ellapsedtTime >= timeout) {
			clearInterval(intervalId); // Stop the interval once the timeout has been reached
			let alertelement = document.getElementById(alertdivID);
			if (alertelement) alertelement.remove();
		}
	}, 100);
}
