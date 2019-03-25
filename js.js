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
		assignment = strArray.slice(strArray.indexOf('=') + 1);
		predefined_assignment = predefinedAssignments(assignment);
		if (assignment === predefined_assignment) {
			alert('goes inside');
			assignment = operationsHandler(assignment.join(' '));
		} else {
			assignment = predefined_assignment;
		}
		console.log('[JS] declaration: assignment', assignment);
	} else {
		variable = strArray;
	}
	variable = variable.join('_');
	scopeAssigner(`${type} ${variable} = ${assignment}`);
	// code.push(`${type} ${variable} = ${assignment}`)
	// printCode()
}

function predefinedAssignments(strArray) {
	let string = strArray.join(' ');
	switch (true) {
		case string.startsWith('list'):
			return listCreator(strArray.slice(1));
		case string.startsWith('object'):
			return objectCreator(strArray.slice(1));
		case string.startsWith('function'):
			return functionCreator(strArray.slice(1));
		case string.startsWith('arrow function'):
			return arrowFunctionCreator(strArray.slice(2));
		default:
			return strArray;
	}
}

function typeDefiner(data) {
	console.log(typeof data, data);
	if (typeof data === 'string' && data.startsWith('list')) {
		data = data.split(' ');
		alert(`TypeDefiner: ${data}`);
		return listCreator(data.slice(1));
	} else if (data.startsWith('string')) {
		return `'${data.split(' ').slice(1).join(' ')}'`;
	} else if (!isNaN(parseInt(data))) {
		return Number(data);
	} else if (data === 'true' || data === 'false') {
		return data;
	}
	if (data.startsWith('object')) {
		return objectCreator(data.split(' ').slice(1).join(' '));
	} else {
		return data.split(' ').join('_');
	}
}

function normalAssignment(string) {
	let assignment_split = string.split('=');
	let variable = assignment_split[0];
	let assignment = assignment_split[1].trim();
	variable = variable.trim().split(' ').join('_');
	assignment = operationsHandler(assignment);
	console.log('[JS] NormalAssignMent: assignment', assignment);
	alert(variable);
	alert(assignment);
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
		let args = strArray.join(' ').split('next');
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
		if (scope[i].constructor.name == 'Function') {
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
		if (scope[scope.length - 1].type != 'function') {
			return;
		}
		let function_data = scope.pop();
		console.log('[JS] ScopeRemover: ', function_data);
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
