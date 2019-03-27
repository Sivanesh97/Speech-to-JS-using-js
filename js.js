let code = [];
let scope = [];

async function tester() {
	await dictated.forEach((item) => {
		console.log(item);
		processing(item);
	});
	printCode();
}

tester();

// The if chain
function processing(string) {
	string = string.toLowerCase();
	string = string.replace(/equals/g, '=');
	let strArray = string.split(' ');

	if (scope.length !== 0 && string !== 'close') {
		if (scope.slice(-1)[0].type === 'list') {
			let args = string.split('comma');
			args = args.map((item) => typeDefiner(item.trim(), undefined, false));
			if (args != '') {
				scopeAssigner(args);
			}
			return;
		}

		if (scope.slice(-1)[0].type === 'object') {
			strArray = string.split('value');
			if (strArray.length <= 1) {
				console.warn('Inside object value must be given as <key> "Value" <value>');
				return;
			}
			let variable = strArray[0].trim().split(' ').join('_');
			let assignment = typeDefiner(strArray[1].trim(), variable, true);
			if (!assignment) {
				return null;
			}
			if (assignment && assignment.type === 'object') {
				return;
			}
			let key_val = `\n${variable}: ${assignment}`;
			scopeAssigner(key_val);

			return;
		}
	}

	switch (true) {
		case string.startsWith('let'):
			declaration(strArray.shift(), strArray);
			break;
		case string.startsWith('constant'):
			declaration('const', strArray.slice(1));
			break;
		case string.startsWith('variable'):
			declaration('var', strArray.slice(1));
			break;
		case string.indexOf('=') > 0:
			normalAssignment(string);
			break;
		case string.startsWith('function'):
			functionCreator(strArray.slice(1));
			break;
		case string.startsWith('arguments'):
			assignArguments(strArray.slice(1));
			break;
		case string.startsWith('close'):
			scopeRemover();
			break;
		case string.startsWith('undo'):
			undo();
			break;
		case string.startsWith('return'):
			returnToFunction(strArray.slice(1));
			break;
		case string.startsWith('operation'):
			operationsParser(strArray.slice(1));
			break;
		case string.startsWith('comment paragraph'):
			commentCreator(strArray.slice(2));
			break;
		case string.startsWith('comment'):
			comment(strArray.slice(1));
			break;
		case string.startsWith('object'):
			objectCreator(strArray.slice(1));
			break;
		case string.startsWith('undo') || string.startsWith('revert'):
			undo();
			break;
		case string.startsWith('clear'):
			clear();
			break;
		default:
			simpleWordConversions(strArray);
	}
}

function declaration(type, strArray) {
	let equalsIndex = strArray.indexOf(`=`);
	let variable, assignment, predefined_assignment;
	if (equalsIndex != -1) {
		variable = strArray.slice(0, strArray.indexOf('='));
		variable = variable.join('_');
		assignment = strArray.slice(strArray.indexOf('=') + 1);
		predefined_assignment = predefinedAssignments(type, variable, assignment);
		if (assignment === predefined_assignment) {
			assignment = operationsHandler(assignment.join(' '));
		} else {
			// assignment = predefined_assignment;
			return;
		}
		console.log('[JS] declaration: assignment', assignment);
	} else {
		variable = strArray;
		variable = variable.join('_');
	}
	scopeAssigner(`${type} ${variable} = ${assignment}`);
	// code.push(`${type} ${variable} = ${assignment}`)
	// printCode()
}

function predefinedAssignments(type, variable, assignment) {
	let string = assignment.join(' ');
	switch (true) {
		case string.startsWith('list'):
			return listCreator(type, variable, assignment.slice(1));
		case string.startsWith('object'):
			return objectCreator(type, variable, assignment.slice(1));
		case string.startsWith('function'):
			return functionCreator(assignment.slice(1));
		case string.startsWith('arrow function'):
			return arrowFunctionCreator(type, variable, assignment.slice(2), false);
		default:
			return assignment;
	}
}

function listCreator(type, variable, assignment, is_inside_object) {
	let list = new List(type, variable, is_inside_object);
	scopeAssigner(list);
	scope.push(list);

	if (assignment && assignment != '') {
		processing(assignment.join(' '));
	}
}

function objectCreator(type, variable, assignment, is_inside_object) {
	let obj = new Obj(type, variable, is_inside_object);
	scopeAssigner(obj);
	scope.push(obj);
	if (assignment && assignment != '') {
		processing(assignment.join(' '));
	}
	// return obj;
}

function arrowFunctionCreator(type, variable, assignment, is_inside_object) {
	// alert(
	// 	`{arrowFunctionCreator} type=${type}; variable = ${variable}; assignment = ${assignment}; is_inside = ${is_inside_object}`
	// );
	let arrow_function = new ArrowFunction(type, variable, is_inside_object);
	scopeAssigner(arrow_function);
	scope.push(arrow_function);
}

function typeDefiner(data, variable, is_inside_object) {
	alert(`{typeDefiner} data = ${data}; variable = ${variable}; is_inside = ${is_inside_object}`);
	console.log(typeof data, data);
	if (typeof data === 'string' && data.startsWith('list')) {
		data = data.split(' ');
		return listCreator(null, variable, data.slice(1), data.slice(1));
	} else if (data.startsWith('string')) {
		return `'${data.split(' ').slice(1).join(' ')}'`;
	} else if (!isNaN(parseInt(data))) {
		return Number(data);
	} else if (data === 'true' || data === 'false') {
		return data;
	}
	if (data.startsWith('object')) {
		if (typeof data == 'string') {
			data = null;
		} else {
			data = data.slice(1);
		}
		return objectCreator(undefined, variable, data, is_inside_object);
	} else if (data.startsWith('arrow function')) {
		// TODO check and validate data and send to further arguments
		return arrowFunctionCreator(undefined, variable, undefined, is_inside_object);
	} else {
		return data.split(' ').join('_');
	}
}

function normalAssignment(string) {
	let assignment_split = string.split('=');
	let variable = assignment_split[0];
	variable = variable.trim().split(' ').join('_');
	let assignment = assignment_split[1].trim();
	let predefined_assignment = predefinedAssignments(null, variable, assignment.split(' '));
	if (predefined_assignment && predefined_assignment.join(' ') === assignment) {
		assignment = predefined_assignment;
	} else {
		return;
	}
	alert('taada normalAssignment ' + assignment);
	assignment = operationsHandler(assignment.join(' '));
	console.log('[JS] NormalAssignMent: assignment', assignment);
	scopeAssigner(`${variable} = ${assignment}`);
	printCode();
}

function functionCreator(strArray) {
	console.log(strArray);
	let functionName = methodNameCreator(strArray);
	let method = new Function(functionName, `function`);
	console.log('[JS] functionCreator', method);
	scopeAssigner(method);
	scope.push(method);
	console.log(scope, code);
	printCode();
}

function methodNameCreator(strArray) {
	return strArray
		.map((name, index) => {
			if (index != 0) {
				return name[0].toUpperCase() + name.slice(1);
			}
			return name;
		})
		.join('');
}

function assignArguments(strArray) {
	if (scope.length != 0) {
		let args = strArray.join(' ').split('comma');
		args = args.map((item) => item.trim().split(' ').join('_'));
		scope[scope.length - 1].arguments.push(args);
		console.log('[JS] AssignArguments:', args);
	} else {
		console.error('Already in global scope');
	}
	printCode();
}

function returnToFunction(strArray) {
	if (scope.length == 0) {
		console.error("You are in Global scope and can't return anything from there");
		return;
	}

	let i;
	for (i = scope.length - 1; i >= 0; i--) {
		if (scope[i].type == 'function') {
			scopeAssigner('return ' + strArray.join('_'));
			return;
		}
	}

	console.error("You are in Global scope and can't return anything from there");
}

function printCode() {
	// console.clear()
	console.log('[JS] PrintCode: called');
	// NaNParser();
	console.log(`code`, code, scope);
	console.log(code.join('\n'));
	document.querySelector('#code').innerHTML = code.join('\n');
}

function NaNParser() {
	code = code.map((item) => {
		item = String(item);
		return item.replace(/not_a_number/g, 'NaN');
	});
}

function scopeAssigner(data) {
	if (scope.length > 0) {
		scope[scope.length - 1].body.push(data);
	} else {
		code.push(data);
	}

	console.log(`[JS] SCOPE ASSIGNER`, data);

	printCode();
}

function undo() {
	if (scope.length > 0) {
		scope[scope.length - 1].body.pop();
	} else {
		code.pop();
	}
	printCode();
}

function scopeRemover() {
	if (scope.length > 0) {
		// if (scope[scope.length - 1].type != 'function') {
		// 	scope.pop();
		// 	return;
		// }
		// let function_data = scope.pop();
		// console.log('[JS] ScopeRemover: ', function_data);
		scope.pop();
	} else {
		console.error('Already in Global scope');
	}
	printCode();
}

function simpleWordConversions(strArray) {
	let string = strArray.join(' ');
	switch (true) {
		case string.startsWith('console'):
			consoling(strArray.slice(1));
			break;
		default:
			// the original default
			scopeAssigner(string);
	}
}

function consoling(strArray) {
	switch (true) {
		case strArray.join(' ').startsWith('log'):
			scopeAssigner(`console.log(${typeDefiner(strArray.slice(1).join(' '))})`);
	}
}

function operationsHandler(string) {
	let operation_arr = string.split(' ');
	let variable_stack = [];
	let final_output = [];
	operation_arr.forEach((item) => {
		let operator = operationsParser([ item ]);
		// If some other variable cause troubles in converting through Speech API put those edge cases here.
		if (item != operator || item === '+' || item === '-') {
			if (variable_stack !== 0) {
				final_output.push(typeDefiner(variable_stack.join(' ')));
				variable_stack = [];
			}
			final_output.push(operator);
		} else if (isNaN(item)) {
			if (item === 'true' || item === 'false') {
				final_output.push(item); // Boolean
			} else {
				variable_stack.push(item); // String
			}
		} else {
			if (variable_stack !== 0) {
				final_output.push(typeDefiner(variable_stack.join(' ')));
				variable_stack = [];
			}
			final_output.push(item);
		}
	});
	if (variable_stack.length !== 0) {
		final_output.push(typeDefiner(variable_stack.join(' ')));
	}
	return final_output.join(' ');
}

function operationsParser(operation) {
	let str = operation.join(' ');

	str = str.replace(/^bitwise and$/g, '&');
	str = str.replace(/^bitwise or$/g, '|');
	str = str.replace(/^bitwise not$/g, '~');
	str = str.replace(/^left shift$/g, '<<');
	str = str.replace(/^right shift$/g, '>>');

	str = str.replace(/^and$/g, '&&');
	str = str.replace(/^or$/g, '||');
	str = str.replace(/^not$/g, '!');

	str = str.replace(/^not triple equals$/g, '!==');
	str = str.replace(/^not equal to$/g, '!=');
	str = str.replace(/^equal to$/g, '==');
	str = str.replace(/^triple equals$/g, '===');
	str = str.replace(/^greater than$/g, '>');
	str = str.replace(/^less than$/g, '<');
	str = str.replace(/^greater than equals$/g, '>=');
	str = str.replace(/^less than equals$/g, '<=');

	str = str.replace(/^plus equals$/g, '+=');
	str = str.replace(/^minus equals$/g, '-=');
	str = str.replace(/^into equals$/g, '*=');
	str = str.replace(/^by equals$/g, '/=');
	str = str.replace(/^percentage equals$/g, '%=');
	str = str.replace(/^plus$/g, '+');
	str = str.replace(/^minus$/g, '-');
	str = str.replace(/^into$/g, '*');
	str = str.replace(/^by$/g, '/');
	str = str.replace(/^equals$/g, '=');
	str = str.replace(/^increment$/g, '++');
	str = str.replace(/^decrement$/g, '--');
	str = str.replace(/^percentage$/g, '%');

	return str;
}

function comment(data) {
	scopeAssigner('// ' + data.join(' '));
}

function commentCreator(data) {
	let comment = new MultiLineComment();
	scope.push(comment);
	data.forEach((item) => {
		scopeAssigner(item);
	});
}

function clear() {
	code = [];
	scope = [];
	console.clear();
	printCode();
}
