function myFunction()
{
  document.getElementById("myDropdown").classList.toggle("show");
}
window.onclick = function(e)
{
	if (!e.target.matches('#Person'))
	{
		var myDropdown = document.getElementById("myDropdown");
		if (myDropdown.classList.contains('show'))
		{
			myDropdown.classList.remove('show');
		}
	}
}

var modal = document.getElementById("myModal");
var btn = document.getElementById("tournament");
var span = document.getElementsByClassName("close")[0];

btn.onclick = function() {
	modal.style.display = "block";
	// -webkit-scrollbar.style.display = "block";
}
span.onclick = function() {
	modal.style.display = "none";
}
window.onclick = function(event) {
	if (event.target == modal) {
		modal.style.display = "none";
	}
}