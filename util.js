function Function(name, type) {
	this.name = name;
	this.body = [];
	this.arguments = [];
	this.type = 'function';
	// this.builder = function () {
	//     this.body = this.body.map(item => `    ${item}`)
	//     this.body.unshift(`function ${this.name} (${this.arguments.join(", ")}) {`)
	//     this.body.push(`}`)
	//     return this.toString()
	// }
}

Function.prototype.toString = function() {
	let output = `
function ${this.name} (${this.arguments}) {
    ${this.body.map((item) => '    ' + item).join('\n')}
}
`;
	return output;
};

function List(data_type, variable, is_inside_object) {
	this.data_type = data_type;
	this.name = variable;
	this.body = [];
	this.type = 'list';
	this.is_inside_object = is_inside_object;
	// this.builder = function() {
	// 	this.body = `[${this.body.toString()}]`;
	// 	this.body = this.body.replace(/,/g, ', ');
	// };
}

List.prototype.toString = function() {
	let output = [];
	if (this.is_inside_object) {
		output.push('\n');
	}
	this.data_type && output.push(this.data_type);
	this.name && output.push(this.name);
	if (this.is_inside_object) {
		output.push(':');
	} else {
		if (this.data_type || this.name) output.push('=');
	}
	output.push(`[ ${this.body} ]`);
	return output.join(' ');
};

function Obj(data_type, variable, is_inside_object) {
	this.type = 'object';
	this.name = variable;
	this.data_type = data_type;
	this.is_inside_object = is_inside_object;
	this.body = [];
}

Obj.prototype.toString = function() {
	let output = [];
	if (this.is_inside_object) {
		output.push('\n');
	}

	if (this.data_type) {
		output.push(this.data_type);
	}

	output.push(this.name);

	if (this.is_inside_object) {
		output.push(':');
	} else {
		if (this.name) output.push('=');
	}
	output.push('{');
	output.push(this.body);
	output.push('\n}');
	return output.join(' ');
};

function ArrowFunction(data_type, variable, is_inside_object) {
	// alert(`{arrowFunction} data = ${data_type}; varaible = ${variable}; is_inside_object = ${is_inside_object}`);
	this.name = variable;
	this.data_type = data_type;
	this.is_inside_object = is_inside_object;
	this.body = [];
	this.arguments = [];
	this.type = 'function';
}

ArrowFunction.prototype.toString = function() {
	let output = [];

	if (this.is_inside_object) {
		output.push('\n');
	}

	if (this.data_type) {
		output.push(this.data_type);
	}

	output.push(this.name);

	if (this.is_inside_object) {
		output.push(':');
	} else {
		if (this.name) output.push('=');
	}

	output.push(`(${this.arguments}) => {
		${this.body.join('\n')}
	}`);
	return output.join(' ');
};

function MultiLineComment() {
	this.body = [];
	this.type = 'comment';
}

MultiLineComment.prototype.toString = function() {
	return `/*
${this.body.join('\n')}
*/`;
};

function Condition(type, condition) {
	this.name = '';
	this.type = type;
	this.methodName = '';
	this.arguments = condition; // conditions
	this.body = [];
}

Condition.prototype.toString = function() {
	if (this.type.startsWith('if')) {
		return `if(${this.arguments}) {` + '\n' + `${this.body.join('\n')}` + '\n      }';
	} else if (this.type.startsWith('else if')) {
		return `else if(${this.arguments}) {` + '\n' + `${this.body.join('\n')}` + '\n     }';
	} else if (this.type.startsWith('else')) {
		return `else {` + '\n' + `${this.body.join('\n')}` + '\n }';
	} else if (this.type.startsWith('while')) {
		return `while(${this.arguments}) {` + '\n' + `${this.body.join('\n')}` + '\n       }';
	} else if (this.type.startsWith('do while')) {
		return 'do{\n' + `${this.body.join('\n')}` + '\n      }' + `while(${this.arguments})`;
	} else if (this.type.startsWith('switch')) {
		return `switch(${this.arguments}) {` + '\n' + `${this.body.join('\n')}` + '\n        }';
	} else if (this.type.startsWith('case')) {
		return `case ${this.arguments} : ` + '\n' + `${this.body.join('\n')}` + '\n ';
	} else if (this.type.startsWith('default')) {
		return `default ${this.arguments} : ` + '\n' + `${this.body.join('\n')}` + '\n ';
	}
};
