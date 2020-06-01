import express from 'express';

const app = express();

app.get('/users', (req, res)=>{
    console.log('Listagem de usuários');
    res.json({Status:'OK'})
});


app.listen(3333);
