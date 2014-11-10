'use strict';
/*global Cycle */

var ViewInterface = [
	'newTodoKeyUp$',
	'toggleAllClicks$',
	'todoToggleClicks$',
	'todoDestroyClicks$'
];

var ENTER_KEY = 13;
var ESC_KEY = 27;

function getParentTodo(element) {
	if (element.tagName.toLowerCase() === 'li' &&
		element.classList.contains('todo'))
	{
		return element;
	} else if (element.tagName.toLowerCase() === 'body') {
		return null;
	} else {
		return getParentTodo(element.parentNode);
	}
}

function getParentTodoId(event) {
	var todoEl = getParentTodo(event.target);
	return Number(todoEl.attributes['data-todo-id'].value);
}

var TodosIntent = Cycle.defineIntent(ViewInterface, function (view) {
	return {
		insertTodo$: view.newTodoKeyUp$
			.filter(function (ev) {
				var trimmedVal = String(ev.target.value).trim();
				return ev.keyCode === ENTER_KEY && trimmedVal;
			})
			.map(function (ev) {
				return String(ev.target.value).trim();
			}),
		deleteTodo$: view.todoDestroyClicks$.map(getParentTodoId),
		toggleTodo$: view.todoToggleClicks$.map(getParentTodoId),
		toggleAll$: view.toggleAllClicks$.map(function () { return '';}),
		clearInput$: view.newTodoKeyUp$
			.filter(function (ev) { return ev.keyCode === ESC_KEY; })
			.map(function () { return ''; })
	}
});
