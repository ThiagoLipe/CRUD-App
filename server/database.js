const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/test', {useNewUrlParser: true});

const Todos = mongoose.model('Todos', {
	title: String,
	time: String,
	description: String,
	completed: Boolean
});

module.exports = Todos;