import express from "express"

const app  = express();
const port = 3000;

const today = new Date();
const day = today.getDay();
console.log (day);
 
app.get("/", (req, res)=>{
    if (day > 0 && day < 6)
    { 
    res.render("index.ejs", {
        dataType: "a Week day", 
        advice: "work hard"
    });
    }
    else
    {
        res.render("index.ejs", {
            dataType: "a Week end", 
            advice: " chill"
        });

    }
});

app.listen(port, () =>{
    console.log(`server running on ${port}.`);
})