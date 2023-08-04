var randomNumber1 = Math.floor((Math.random() * 6) + 1);
var randomNumber2 = Math.floor((Math.random() * 6) + 1);
var img1 = ("images/dice" + randomNumber1 + ".png");
var img2 = ("images/dice" + randomNumber2 + ".png");

console.log(randomNumber1);
console.log(img1);
document.querySelector(".img1").src = img1;
document.querySelector(".img2").src = img2;
var message = document.querySelector(".container h1");
if (randomNumber1 > randomNumber2)
{
    message.innerText = "Player 1 Wins"
}
else if (randomNumber1 < randomNumber2)
{
    message.innerText = "Player 2 Wins"
}
else
{
    message.innerText = "Draw"
}
console.log(message);