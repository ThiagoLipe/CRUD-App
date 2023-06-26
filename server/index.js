var express = require('express');
var bodyParser = require('body-parser');
var todosModel  = require('./database');

var app = express();

const port = 8080;

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

var router = express.Router();

router.use((rep, res, next) => {
	console.log("Requisicao enviada!");
	next();
});

router.get('/', (req, res) =>{
  res.json({message: "To-do API."});
});

router.route('/todos').post((req, res) => {
	
	if(Object.keys(req.body).length === 4) {
		const {title, time, description, completed} = req.body;
		var todos = new todosModel({title, time, description, completed});
		todos.save(err => {
			err ? res.send(err) : res.json({message: 'To-do criado!'});
		});	
	} else{
		res.json({error: "Body esta vazio em alguma dessas chaves requisitadas. Chaves requisitadas: Title, Time, Description, Completed."});
	}
	
})
.get((req, res) => {
	todosModel.find((err, todos) => {
		err ? res.send(err) : res.json(todos);
	});
});

router.route('/todos/:todoID').put((req, res) => {
	todosModel.findById(req.params.todoID, (err, todo) => {
		if(err){
			res.send(err);
		}
		const {title, time, description, completed} = req.body;
		todo.title = title;
		todo.time = time;
		todo.description = description;
		todo.completed = completed;
		
		todo.save(err => {
			err ? res.send(err) : res.json({message: 'To-do atualizado!'});
		});
	});
})
.delete((req,res) => {
	todosModel.remove({_id:req.params.todoID}, (err, todo) => {
		err ? res.send(err) : res.json({message: 'To-do excluido com sucesso!'});
	})
});

app.use('/api', router);



app.listen(port);