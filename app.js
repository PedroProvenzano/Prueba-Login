require('dotenv/config');
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const bcrypt = require('bcrypt');
const cors = require('cors');

app.use(cors());
app.use(express.json());

const users = [
    {
        username: 'Jim',
        password: '12345'
    },
    {
        username: 'Pedro',
        password: '123'
    }
]

/* 
    Anotaciones

*/

app.get('/users', (req, res) => {
    res.json(users)
});

app.post('/users', async (req, res) => {
    try {
        // Check si ya existe el usuario que quieren crear
        let userCheck = users.find(user => user.username == req.body.username);
        if(userCheck == null){
            userCheck = { username: "boop boop", password: "baap baap"};
        }
        if (req.body.username == userCheck.username){
            res.json({ msg: `Usuario ${req.body.username} ya existe`, sts: false });
            return
        }
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = { username: req.body.username, password: hashedPassword };
        users.push(user);
        res.status(201).json({ msg: `Exito creando usuario ${req.body.username}`, sts: true });
    } catch(err) {
        res.status(500).json({ msg: err, sts: false });
        console.log(err)
    }
});

app.post('/users/login', async (req, res) => {
    const user = users.find(user => user.username == req.body.username);
    if (user == null) {
        return res.status(400).json( { msg:"No se encontró usuario", sts: false } );
    }
    try{
        if(await bcrypt.compare(req.body.password, user.password)){
        
          res.json( { msg:"Login exitoso", sts: true } );      
        }else {
            res.json( { msg:"Contraseña incorrecta", sts: false } );
        };
    } catch (err){
        res.status(500).json( { msg: err, sts: false } );
    }
})

// Auth 

app.get('/login', (req, res) => {

})

app.listen(port, () => {
 console.log(`Servidor funcionando en puerto ${process.env.PORT}`);
});