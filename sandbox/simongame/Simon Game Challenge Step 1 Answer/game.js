alert("hello");
document.querySelector("body").addEventListener("keypress", function(event){
    console.log(event.key); 
    $("h1").text(event.key);
});
