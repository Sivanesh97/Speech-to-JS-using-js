let code = [];
let scope = [];
let temp = [];

/* async function tester() {
    await dictated.forEach(item => {
        console.log(item)
        processing(item)
    })
    printCode()    
}

tester()

*/
// The if chain

/* differenciate args for input (arg0 arg1)  and pass (arg0, arg1 ) 
   for
   do while
   obj
   list
   align tthe data

*/
function processing(string) {
	string = string.toLowerCase();
	string = string.replace('.', ' dot '); // var_name.method_name => var_name dot method_name
	string = string.replace(/equals/g, `=`);
	string = string.replace(/value/g, `:`); // name value string santhosh  => name : 'santhosh'
	let strArray = string.split(' ');
	//strArray = strArray.map( data => { return operationHandler(data) })
	switch (true) {
		case string.startsWith('arguments'): // string santhosh kumar next 0 next 5 next temp
			assignArguments(strArray.slice(1)); // [string,santhosh,kumar,next,0,next,5,next,temp]
			break;
		case strArray.indexOf(`=`) != -1:
			variableDeclaration(string, strArray);
			break;
		case strArray.indexOf(`:`) != -1:
			variableDeclaration(string, strArray);
			break;
		case string.split('dot').length == 2:
			builtInMethods(string);
			break;
		case string.startsWith('function'):
			functionCreator(strArray.slice(1));
			break;
		case string.startsWith('call'):
			call(methodNameCreator(strArray.slice(1)));
			break;
		case string.startsWith('if'):
			conditionalCreator(`if`);
			break;
		case string.startsWith('else if'):
			conditionalCreator(`else if`);
			break;
		case string.startsWith('else'):
			conditionalCreator(`else`);
			break;
		case string.startsWith('while'):
			conditionalCreator(`while`);
			break;
		case string.startsWith('do while'):
			conditionalCreator(`do while`);
			break;
		case string.startsWith('switch'):
			conditionalCreator(`switch`);
			break;
		case string.startsWith('case'):
			conditionalCreator(`case`);
			break;
		case string.startsWith(`default`):
			conditionalCreator(`default`);
			break;
		case string.startsWith('close'):
			scopeRemover();
			break;
		case string.startsWith('undo'):
			undo();
			break;
		case string.startsWith('clear'):
			clear();
			break;
		case string.startsWith('return'):
			returnToFunction(strArray.slice(1));
			break;
		case string.startsWith('comment paragraph'):
			commentCreator();
			break;
		case string.startsWith('comment'):
			comment(strArray.slice(1));
			break;
		case string.startsWith('print'):
			return printer(strArray.slice(1));
		default:
			simpleWordConversions(strArray);
	}
}

function variableDeclaration(type, strArray) {
	switch (true) {
		case strArray.slice(strArray.indexOf(`=`) + 1).join(' ').startsWith('object'):
			objectCreator(type, strArray.slice(0, strArray.indexOf(`=`)));
			break;
		case strArray.slice(strArray.indexOf(`:`) + 1).join(' ').startsWith('object'):
			objectCreator(type, strArray.slice(0, strArray.indexOf(`:`)));
			break;
		case strArray.slice(strArray.indexOf(`=`) + 1).join(' ').startsWith('list'):
			listCreator(type, strArray.slice(0, strArray.indexOf('=')));
			break;
		case strArray.slice(strArray.indexOf(`:`) + 1).join(' ').startsWith('list'):
			listCreator(type, strArray.slice(0, strArray.indexOf(`:`)));
			break;
		case strArray.slice(strArray.indexOf(`=`) + 1).join(' ').startsWith('arrow function'):
			arrowFunctionCreator(type, strArray.slice(0, strArray.indexOf('=')));
			break;
		case strArray.slice(strArray.indexOf(`:`) + 1).join(' ').startsWith('arrow function'):
			arrowFunctionCreator(type, strArray.slice(0, strArray.indexOf(`:`)));
			break;
		case strArray.indexOf(`:`) != -1:
			let assignment = strArray.slice(strArray.indexOf(':') + 1);
			if (assignment.join(' ').startsWith('operation'))
				assignment = assignment
					.slice(1)
					.join(' ')
					.split('next')
					.map((data) => {
						return operationCheck(data.trim());
					})
					.join(' '); // operation first data next plus next b next type data
			else
				assignment = assignment
					.join(' ')
					.split('next')
					.map((data) => {
						return typeDefiner(data.trim());
					})
					.join(' ');
			dataFeeder(strArray.slice(0, strArray.indexOf(`:`)).join('_') + ' : ' + assignment); //key : value
			//scopeAssigner( strArray.slice(0,strArray.indexOf(`:`)).map(data => {return operationCheck(data) }).join(" ") + " : " + strArray.slice(strArray.indexOf(`:`)+1).map(data => {return operationCheck(data) }).join(" ") ) //key : value
			break;
		case type.startsWith('let'):
			declaration(strArray.shift(), strArray);
			break;
		case type.startsWith('constant'):
			declaration('const', strArray.slice(1));
			break;
		case type.startsWith('variable'):
			declaration('var', strArray.slice(1));
			break;
		default:
			declaration('', strArray);
	}
}

function arrowFunctionCreator(string, strArray) {
	switch (true) {
		case string.startsWith('let'):
			dataFeeder(new Arrow('let ' + strArray.slice(1).join('_') + ' = ', 'arrow function'));
			break;
		case string.startsWith('constant'):
			dataFeeder(new Arrow('const ' + strArray.slice(1).join('_') + ' = ', 'arrow function'));
			break;
		case string.startsWith('variable'):
			dataFeeder(new Arrow('variable ' + strArray.slice(1).join('_') + ' = ', 'arrow function'));
			break;
		case string.split(' ').indexOf(`:`) != -1:
			dataFeeder(new Arrow(strArray.slice(0).join('_') + ' : ', 'arrow function'));
			break;
		default:
			dataFeeder(new Arrow(strArray.slice(0).join('_') + ' = ', 'arrow function')); // say value for colon
	}
}

function listCreator(string, strArray) {
	switch (true) {
		case string.startsWith('let'):
			dataFeeder(new List('let ' + strArray.slice(1).join('_') + ' = ', 'list'));
			break;
		case string.startsWith('constant'):
			dataFeeder(new List('const ' + strArray.slice(1).join('_') + ' = ', 'list'));
			break;
		case string.startsWith('variable'):
			dataFeeder(new List('variable ' + strArray.slice(1).join('_') + ' = ', 'list'));
			break;
		case string.split(' ').indexOf(`:`) != -1:
			dataFeeder(new List(strArray.slice(0).join('_') + ' : ', 'list'));
			break;
		default:
			dataFeeder(new List(strArray.slice(0).join('_') + ' = ', 'list'));
	}
}

function objectCreator(string, strArray) {
	switch (true) {
		case string.startsWith('let'):
			dataFeeder(new Obj('let ' + strArray.slice(1).join('_') + ' = ', 'object'));
			break;
		case string.startsWith('constant'):
			dataFeeder(new Obj('const ' + strArray.slice(1).join('_') + ' = ', 'object'));
			break;
		case string.startsWith('variable'):
			dataFeeder(new Obj('variable ' + strArray.slice(1).join('_') + ' = ', 'object'));
			break;
		case string.split(' ').indexOf(`=`) != -1:
			dataFeeder(new Obj(strArray.slice(0).join('_') + ' = ', 'object'));
			break;
		default:
			dataFeeder(new Obj(strArray.slice(0).join('_') + ' : ', 'object'));
	}
}

function dataFeeder(scp) {
	if (scope.length > 0) {
		scopeAssigner(scp);
	} else if (typeof scp === 'object') {
		scope.push(scp);
		code.push(scope[scope.length - 1].builder());
	} else {
		code.push(scp);
	}
	printCode();
}

function builtInMethods(string) {
	// first name dot methodName
	let name = string.split('dot')[0].trim().split(' ').join('_'); //  first_name
	let methodName = string.split('dot')[1].trim().split(' ').join(''); // methodName

	switch (true) {
		case string.startsWith('console'): // say => console.log
			consoling(methodName);
			break;
		case methodName.startsWith('substr'): // methodName_built in methods
			builtInCreator(name, `substr`);
			break;
		case methodName.startsWith('index'):
			builtInCreator(name, `indexOf`);
			break;
		case methodName.startsWith('last'):
			builtInCreator(name, `last`);
			break;
		case methodName.startsWith('search'):
			builtInCreator(name, `search`);
			break;
		case methodName.startsWith('slice'):
			builtInCreator(name, `slice`);
			break;
		case methodName.startsWith('replace'):
			builtInCreator(name, `replace`);
			break;
		case methodName.startsWith('upper'):
			builtInCreator(name, `toUpperCase`);
			break;
		case methodName.startsWith('lower'):
			builtInCreator(name, `toLowerCase`);
		case methodName.startsWith('concatenate'):
			builtInCreator(name, `concat`);
			break;
		case methodName.startsWith('trim'):
			builtInCreator(name, `trim`);
			break;
		case methodName.startsWith('character'):
			builtInCreator(name, `charAt`);
			break;
		case methodName.startsWith('split'):
			builtInCreator(name, `split`);
			break;
		case methodName.startsWith('starts'):
			builtInCreator(name, `startsWith`);
			break;
		case methodName.startsWith('ends'):
			builtInCreator(name, `endsWith`);
			break;
		case methodName.startsWith('value'):
			builtInCreator(name, `valueOf`);
		case methodName.startsWith('includes'):
			builtInCreator(name, `includes`);
			break;
		case methodName.startsWith('match'):
			builtInCreator(name, `match`);
			break;
		case methodName.startsWith('repeat'):
			builtInCreator(name, `repeat`);
			break;
		case methodName.startsWith('compare'):
			builtInCreator(name, `localeCompare`);
			break;
		case methodName.startsWith('tostring'):
			builtInCreator(name, `toString`);
			break;
		case methodName.startsWith('length'): // methodName_built in propertys     note
			builtInProperty(name, `length`);
			break;
		case methodName.startsWith('exponential'): // number_built in Methods
			builtInCreator(name, `toExponential`);
			break;
		case methodName.startsWith('fixed'):
			builtInCreator(name, `toFixed`);
			break;
		case methodName.startsWith('precision'):
			builtInCreator(name, `toPrecision`);
			break;

		//here user will say number.max and it will generate Number.MAX_VALUE for an indivitual recognition

		/*  case methodName.startsWith("max"):   // methodName_built in propertys   
            builtInProperty(`Number`,`MAX_VALUE`)   
			break
       case methodName.startsWith("min"):   // methodName_built in propertys
            builtInProperty(`Number`,`MIN_VALUE`)   
            break			
   */

		case methodName.startsWith('join'): // array_built in methods
			builtInCreator(name, `join`);
			break;
		case methodName.startsWith('push'):
			builtInCreator(name, `push`);
			break;
		case methodName.startsWith('pop'):
			builtInCreator(name, `pop`);
			break;
		case methodName.startsWith('shift'):
			builtInCreator(name, `shift`);
			break;
		case methodName.startsWith('unshift'):
			builtInCreator(name, `unshift`);
			break;
		case methodName.startsWith('splice'):
			builtInCreator(name, `splice`);
			break;
		case methodName.startsWith('concat'):
			builtInCreator(name, `concat`);
			break;
		case methodName.startsWith('split'): // array_built in methods
			builtInCreator(name, `split`);
			break;
		default:
			simpleWordConversions(string.split(' '));
			break;
		// builtInCreator(name, MethodName)
	}
}

function builtInProperty(name, propertyName) {
	code.push(`${name}.${propertyName}`);
	printCode();
}

function builtInCreator(name, methodName) {
	let scp = new BuiltInMethod(name, methodName, `builtIn`);
	if (scope.length > 0) {
		scopeAssigner(scp);
	} else {
		scope.push(scp);
		code.push(scope[scope.length - 1].builder());
	}
	printCode();
}

function declaration(type, strArray) {
	strArray = strArray.join(' ').replace(/equals/g, `=`).split(' '); // "variable name = string hello" => [variable, name, =, string ]
	let equalsIndex = strArray.indexOf(`=`);
	let variable, assignment;
	if (equalsIndex != -1) {
		variable = strArray.slice(0, strArray.indexOf('='));
		assignment = strArray.slice(strArray.indexOf('=') + 1);
		if (assignment.join(' ').startsWith('operation'))
			assignment = assignment
				.slice(1)
				.join(' ')
				.split('next')
				.map((data) => {
					return operationCheck(data.trim());
				})
				.join(' '); // operation first data next plus next b next string data
		else
			assignment = assignment
				.join(' ')
				.split('next')
				.map((data) => {
					return typeDefiner(data.trim());
				})
				.join(' ');
	} else {
		variable = strArray;
	}
	variable = variable.join('_');
	scopeAssigner(`${type} ${variable} = ${assignment}`);
}

function operationCheck(data) {
	if (data.startsWith('string')) return typeDefiner(data);
	return typeDefiner(operationHandler(data.trim()).trim()); // [a,plus,to be]
}

function typeDefiner(data) {
	console.log(typeof data, data);
	if (data.startsWith('string')) {
		return `'${data.split(' ').slice(1).join(' ')}'`;
	} else if (!isNaN(data)) {
		return Number(data);
	} else if (data === 'true' || data === 'false') {
		return data;
	} else {
		return data.split(' ').join('_');
	}
}

function functionCreator(strArray) {
	console.log(strArray);
	let functionName = methodNameCreator(strArray);
	let method = new Function(functionName, `function`);
	if (scope.length > 0) {
		scopeAssigner(method);
	} else {
		scope.push(method);
		code.push(scope[scope.length - 1].builder());
	}
	printCode();
}

function call(methodName) {
	let scp = new Console(methodName, `call`);
	if (scope.length > 0) {
		scopeAssigner(scp);
	} else {
		scope.push(scp);
		code.push(scope[scope.length - 1].builder());
	}
	printCode();
}

function conditionalCreator(type) {
	let scp = new ConditionalWithArgs(type);
	if (scope.length > 0) {
		scopeAssigner(scp);
	} else {
		scope.push(scp);
		code.push(scope[scope.length - 1].builder());
	}
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

function argPreparation(strArray) {
	let args = strArray.join(' ').split('next'); // after split by "next" => ["string santhosh kumar ", " 0 ", " 5 "," temp "]
	args = args.map((item) => {
		return typeDefiner(item.trim());
	}); // ["santhosh kumar",0,5,temp]
	console.log(args.join(','));
	args = args.map((item) => {
		if (isNaN(item)) return operationHandler(item.trim());
		return item;
	});
	return args;
}

// strArray = [string,santhosh,kumar,next,0,next,5,next,temp]
function assignArguments(strArray) {
	let args = argPreparation(strArray);
	if (scope.length > 0) {
		// after joining strArray by " " => "string santhosh kumar next 0 next 5 next temp"
		expand(scope[scope.length - 1]).arguments = args;
		code.pop();
		code.push(scope[scope.length - 1].builder());
		printCode();
	} else {
		console.error('Already in global scope');
	}
}

// note this

function returnToFunction(strArray) {
	if (scope.length > 0) {
		// after joining strArray by " " => "string santhosh kumar next 0 next 5 next temp"
		let args = strArray.join(' ').split('next'); // after split by "next" => ["string santhosh kumar ", " 0 ", " 5 "," temp "]
		args = args.map((item) => {
			return typeDefiner(item.trim());
		}); // ["santhosh kumar",0,5,temp]
		console.log(args.join(','));
		args = args.map((item) => {
			if (isNaN(item)) return operationHandler(item);
			return item;
		});
		scopeAssigner(`return ${args.join(' ')}`);
	} else {
		console.error("You are in Global scope and can't return anything from there");
		return;
	}
}

function printCode() {
	// NaNParser()
	console.log(code.join('\n'));
	console.log(`code`, code);
	// this.state.code = code.join("\n")
	document.querySelector('.language-js').innerHTML = code.join('\n');
}

function clear() {
	code = [];
	scope = [];
	printCode();
}

function NaNParser() {
	code = code.map((item) => {
		return item.replace(/not_a_number/g, 'NaN');
	});
}

function expand(obj) {
	for (let i = 0; i < obj.body.length; i++) if (typeof obj.body[i] == 'object') return expand(obj.body[i]);
	return obj;
}

function scopeAssigner(data) {
	if (scope.length > 0) {
		let scp = expand(scope[scope.length - 1]);
		if (
			scp.type.startsWith('builtIn') ||
			scp.type.startsWith('call') ||
			(scp.type.startsWith('comment') && scp.body.length > 0)
		) {
			scopeRemover();
			dataFeeder(data);
		} else {
			scp.body.push(data);
			code.pop();
			code.push(scope[scope.length - 1].builder());
		}
	} else {
		code.push(data);
	}
	printCode();
	return code;
}

function undo() {
	if (scope.length > 0) {
		let scp = expand(scope[scope.length - 1]);
		if (scp.body.length > 0) {
			scp.body.pop();
			code.pop();
			code.push(scope[scope.length - 1].builder());
		} else {
			let inner = false;
			let outscp = close(scope[scope.length - 1], scope[scope.length - 1]);
			for (let i = 0; i < outscp.body.length; i++) {
				if (typeof outscp.body[i] == 'object') {
					code.pop();
					console.log('inscp ' + outscp.body.pop().builder());
					code.push(scope[scope.length - 1].builder());
					inner = true;
					break;
				}
			}
			if (!inner) {
				code.pop();
				scope.pop();
			}
		}
	} else {
		code.pop();
	}
	printCode();
}

function close(obj, prev) {
	for (let i = 0; i < obj.body.length; i++) {
		if (typeof obj.body[i] == 'object') {
			prev = obj;
			return close(obj.body[i], prev);
		}
	}
	return prev;
}

function scopeRemover() {
	if (scope.length > 0) {
		code.pop();
		console.log('before close ' + scope[scope.length - 1].builder());
		let no_inner = true;
		let outscp = close(scope[scope.length - 1], scope[scope.length - 1]);
		for (let i = 0; i < outscp.body.length; i++) {
			if (typeof outscp.body[i] == 'object') {
				let inscp = outscp.body.pop();
				console.log('inscp ' + inscp.builder());
				console.error('closed scope ' + inscp.type + '\n');
				outscp.body.push(inscp.builder());
				code.push(scope[scope.length - 1].builder());
				no_inner = false;
				break;
			}
		}
		if (no_inner) {
			console.error('closed scope ' + scope[scope.length - 1].type + '\n');
			code.push(scope.pop().builder());
		}
	} else {
		console.error('Already in Global scope');
	}
	printCode();
}

function simpleWordConversions(strArray) {
	console.log(strArray.join(' '));
	if (scope.length > 0 && expand(scope[scope.length - 1]).type === 'list') {
		strArray = strArray
			.join(' ')
			.split('next')
			.map((data) => {
				return typeDefiner(data.trim());
			})
			.join(', '); // first data next plus next b next string data
	} else if (strArray.join(' ').startsWith('operation')) {
		strArray = strArray
			.slice(1)
			.join(' ')
			.split('next')
			.map((data) => {
				return operationCheck(data.trim());
			})
			.join(' '); // operation first data next plus next b next string data
	} else {
		strArray = strArray
			.join(' ')
			.split('next')
			.map((data) => {
				return typeDefiner(data.trim());
			})
			.join(' ');
	}
	dataFeeder(strArray);
}

function consoling(methodName) {
	console.log(methodName);
	let scp;
	switch (true) {
		case methodName.startsWith('log'):
			scp = new Console('log', 'console');
			break;
		case methodName.startsWith('error'):
			scp = new Console('error', 'console');
			break;
		default:
			scp = new Console(methodName, 'console');
			break;
	}
	if (scope.length > 0) {
		scopeAssigner(scp);
	} else {
		scope.push(scp);
		code.push(scope[scope.length - 1].builder());
	}
	printCode();
}

function operationHandler(operation) {
	let str = operation;

	str = str.replace(/not a number/g, `NaN`);
	str = str.replace(/not triple equal/g, `!==`);
	str = str.replace(/not equal to/g, `!=`);
	str = str.replace(/equal to/g, `==`);
	str = str.replace(/triple equal/g, `===`);
	str = str.replace(/greater/g, `>`);
	str = str.replace(/less/g, `<`);
	str = str.replace(/greater than equal/g, `>=`);
	str = str.replace(/less than equal/g, `<=`);
	str = str.replace(/mod/g, `%`);

	str = str.replace(/plus equal/g, `+=`);
	str = str.replace(/minus equal/g, `-=`);
	str = str.replace(/into equal/g, `*=`);
	str = str.replace(/by equal/g, `/=`);
	str = str.replace(/percentage equal/g, `%=`);
	str = str.replace(/plus/g, `+`);
	str = str.replace(/minus/g, `-`);
	str = str.replace(/into/g, `*`);
	str = str.replace(/by/g, `/`);
	str = str.replace(/equals/g, `=`);
	str = str.replace(/increment/g, `++`);
	str = str.replace(/decrement/g, `--`);
	str = str.replace(/percentage/g, `%`);

	str = str.replace(/bitwise and/g, `&`);
	str = str.replace(/bitwise or/g, `|`);
	str = str.replace(/bitwise not/g, `~`);
	str = str.replace(/left shift/g, `<<`);
	str = str.replace(/right shift/g, `>>`);

	str = str.replace(/and/g, `&&`);
	str = str.replace(/or/g, `||`);
	str = str.replace(/not/g, `!`);

	//let greater =

	str = str.replace(/space/g, ' ');
	str = str.replace(/new line/g, '\n');
	str = str.replace(/underscore/g, '_');
	str = str.replace(/hyphen/g, '-');

	return str;
}

function comment() {
	let Comment = new SingleLineComment('comment');
	dataFeeder(Comment);
}

function commentCreator() {
	let multiLineComment = new MultiLineComment('multiline comment');
	dataFeeder(multiLineComment);
}

function printer(strArray) {
	let data = typeDefiner(strArray.join(' '));
	return scopeAssigner(`document.write(${data}); \ndocument.write('<br />')`);
}
