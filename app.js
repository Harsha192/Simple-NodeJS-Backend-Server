const Joi = require('joi');
const mongojs = require('mongojs')
const db = mongojs('mongodb://<username>:<password>@ds219532.mlab.com:19532/task-list', ['express']);
const bodyParser = require('body-parser');
const express = require('express');
const app = express();


app.use(bodyParser.json());

app.get('/', (req, res)=>{
    res.send('Helloo...')
})
app.get('/api/customers', (req, res)=>{
    db.express.find().sort({name:1, age:1},function (err, docs) {
        if(err){
            res.send(err);
        }else{
            res.send(docs)
        }
    })
});

app.get('/api/customers/:id', (req, res)=>{
    db.express.findOne({_id:mongojs.ObjectID(req.params.id)},(err, doc)=>{
        if(err){
            res.send(err);
        }else{
            if(!doc){
                res.status(404).send('Not Found.');
            }else{
                res.send(doc);
            }
            
        }
    })
});

app.post('/api/customers', (req, res, next)=>{
    const customer = req.body;
    const schema = {
        name: Joi.string().min(1).required(),
        age: Joi.number().integer().min(1).max(100).required(),
        home_town: Joi.string().min(1).required(),
        sex: Joi.string().required()
    }
    const result = Joi.validate(customer,schema);
    console.log(result);
    // res.json(customer);
    if(result.error){
        res.status(400).send(result.error.details[0].message);
    }else{
        db.express.save(customer, (err, doc)=>{
            if(err){
                res.send(err);
            }else{
                res.send(doc);
            }
        })
    }
});

app.put('/api/customers/:id', (req, res)=>{
    const customer = req.body;
    const schema = {
        name: Joi.string().min(1).required(),
        age: Joi.number().integer().min(1).max(100).required(),
        home_town: Joi.string().min(1).required(),
        sex: Joi.string().required()
    }
    const result = Joi.validate(customer,schema);
    db.express.findOne({_id: mongojs.ObjectID(req.params.id)}, (err, doc)=>{
        if(err){
            res.send(err);
        }else{
            if(!doc){
                res.status(404).send('Not Found');
            }else{
                if(result.error){
                    res.status(400).send(result.error.details[0].message);
                }else{
                    db.express.update({_id:mongojs.ObjectID(req.params.id)},customer, (err, doc)=>{
                        if(err){
                            res.send(err);
                        }else{
                            res.send(doc);
                        }
                    })
                }
            }
        }
    });
});

app.delete('/api/customers/:id', (req, res)=>{
    db.express.findOne({_id:mongojs.ObjectID(req.params.id)}, (err, doc)=>{
        if(err){
            res.send(err);
        }else{
            if(!doc){
                res.status(404).send('Not Found');
            }else{
                db.express.remove({_id:mongojs.ObjectID(req.params.id)}, (err,doc)=>{
                    if(err){
                        res.send(err);
                    }else{
                        res.send(doc);
                    }
                });
            }
        }
    })
        
    
})

const port = process.env.PORT || 4000;
app.listen(port, ()=>{
    console.log(`Listening on port ${port}...`);
});