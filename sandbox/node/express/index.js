import express from 'express';

const app = express();

app.get('/', (req, res) => {
    res.send("hello from express server");
})
app.post('/form', (req, res) => {
    res.send(200);
})
app.put('/form', (req, res) => {
    res.send(200);
})
app.patch('/form', (req, res) => {
    res.send(200);
})
app.listen(3000, () => {
    console.log('Server listening on port 3000');
    });