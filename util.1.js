function BuiltInMethod(name, methodName, type) {
	this.name = name;
	this.methodName = methodName;
	this.type = type;
	this.arguments = [];
	this.body = [];
	this.builder = () => {
		return this.toString();
	};
}

BuiltInMethod.prototype.toString = function() {
	console.log(`${this.name}.${this.methodName}(${this.arguments.join(', ')})`);
	return `${this.name}.${this.methodName}(${this.arguments.join(', ')})`;
};

function For(type) {
	this.name = '';
	this.type = type;
	this.init = '';
	this.condition = [];
	this.incre = [];
	this.body = [];
	this.builder = () => {
		return this.toString();
	};
}

For.prototype.toString = function() {
	return (
		`for(${this.init}` +
		';' +
		`${this.condition.join(' ')}` +
		';' +
		`${this.incre.join(' ')}) {` +
		'\n' +
		`${this.body.join('\n')}` +
		'\n }'
	);
};

function ConditionalWithArgs(type) {
	this.name = '';
	this.type = type;
	this.methodName = '';
	this.arguments = []; // conditions
	this.body = [];
	this.builder = function() {
		return this.toString();
	};
}

ConditionalWithArgs.prototype.toString = function() {
	if (this.type.startsWith('if')) {
		return (
			`if(${this.arguments.join(' ')}) {` +
			'\n' +
			`${this.body
				.map((data) => {
					if (typeof data == 'object') {
						return '				' + data.builder();
					} else {
						return '				' + data;
					}
				})
				.join('\n')}` +
			'\n      }'
		);
	} else if (this.type.startsWith('else if')) {
		return (
			`else if(${this.arguments.join(' ')}) {` +
			'\n' +
			`${this.body
				.map((data) => {
					if (typeof data == 'object') {
						return '				' + data.builder();
					} else {
						return '				' + data;
					}
				})
				.join('\n')}` +
			'\n     }'
		);
	} else if (this.type.startsWith('else')) {
		return (
			`else {` +
			'\n' +
			`${this.body
				.map((data) => {
					if (typeof data == 'object') {
						return '				' + data.builder();
					} else {
						return '				' + data;
					}
				})
				.join('\n')}` +
			'\n }'
		);
	} else if (this.type.startsWith('while')) {
		return (
			`while(${this.arguments.join(' ')}) {` +
			'\n' +
			`${this.body
				.map((data) => {
					if (typeof data == 'object') {
						return '				' + data.builder();
					} else {
						return '				' + data;
					}
				})
				.join('\n')}` +
			'\n       }'
		);
	} else if (this.type.startsWith('do while')) {
		return (
			'do{\n' +
			`${this.body
				.map((data) => {
					if (typeof data == 'object') {
						return '				' + data.builder();
					} else {
						return '				' + data;
					}
				})
				.join('\n')}` +
			'\n      }' +
			`while(${this.arguments.join(' ')})`
		);
	} else if (this.type.startsWith('switch')) {
		return (
			`switch(${this.arguments.join(' ')}) {` +
			'\n' +
			`${this.body
				.map((data) => {
					if (typeof data == 'object') {
						return '				' + data.builder();
					} else {
						return '				' + data;
					}
				})
				.join('\n')}` +
			'\n        }'
		);
	} else if (this.type.startsWith('case')) {
		return (
			`case ${this.arguments.join(' ')} : ` +
			'\n' +
			`${this.body
				.map((data) => {
					if (typeof data == 'object') {
						return '				' + data.builder();
					} else {
						return '				' + data;
					}
				})
				.join('\n')}` +
			'\n '
		);
	} else if (this.type.startsWith('default')) {
		return (
			`default ${this.arguments.join(' ')} : ` +
			'\n' +
			`${this.body
				.map((data) => {
					if (typeof data == 'object') {
						return '				' + data.builder();
					} else {
						return '				' + data;
					}
				})
				.join('\n')}` +
			'\n '
		);
	}
};

function Function(name, type) {
	this.name = name;
	this.type = type;
	this.methodName = '';
	this.body = [];
	this.arguments = [];
	this.builder = function() {
		return this.toString();
	};
}

Function.prototype.toString = function() {
	return (
		`function ${this.name}(${this.arguments.join(', ')}) {` +
		'\n' +
		`${this.body
			.map((data) => {
				if (typeof data == 'object') {
					return '				' + data.builder();
				} else {
					return '				' + data;
				}
			})
			.join('\n')}` +
		'\n               }'
	);
};

function List(name, type) {
	this.name = name;
	this.type = type;
	this.methodName = '';
	this.arguments = [];
	this.body = [];
	this.builder = function() {
		return this.toString();
	};
}

List.prototype.toString = function() {
	return `${this.name} [ ${this.body.join(', ')} ]` + '\n';
};

function Obj(name, type) {
	this.name = name;
	this.type = type;
	this.methodName = '';
	this.body = [];
	this.arguments = [];
	this.builder = function() {
		return this.toString();
	};
}

Obj.prototype.toString = function() {
	return (
		`${this.name} { ` +
		'\n' +
		`${this.body
			.map((data) => {
				if (typeof data == 'object') {
					return '				' + data.builder();
				} else {
					return '				' + data;
				}
			})
			.join(',\n')}` +
		'\n  }'
	);
};
function Arrow(name, type) {
	this.name = name;
	this.type = type;
	this.methodName = '';
	this.body = [];
	this.arguments = [];
	this.builder = function() {
		return this.toString();
	};
}

Arrow.prototype.toString = function() {
	return (
		`${this.name}` +
		`(${this.arguments.join(', ')}) => { ` +
		' \n' +
		`${this.body
			.map((data) => {
				if (typeof data == 'object') {
					return '				' + data.builder();
				} else {
					return '				' + data;
				}
			})
			.join('\n')}` +
		'\n               }'
	);
};

function Console(methodName, type) {
	this.name = '';
	this.methodName = methodName;
	this.type = type;
	this.arguments = [];
	this.body = [];
	this.builder = () => {
		return this.toString();
	};
}

Console.prototype.toString = function() {
	if (this.type.startsWith('console')) {
		if (this.methodName.startsWith('log'))
			return `console.${this.methodName}(${this.body
				.map((data) => {
					if (typeof data == 'object') {
						return data.builder();
					} else {
						return data;
					}
				})
				.join(' ')})`;
	} else if (this.type.startsWith('call')) {
		return `${this.methodName}(${this.arguments.join(',')})`;
	}
};

function SingleLineComment(type) {
	this.name = '';
	this.methodName = '';
	this.type = type;
	this.arguments = [];
	this.body = [];
	this.builder = () => {
		return this.toString();
	};
}

SingleLineComment.prototype.toString = function() {
	return (
		'//' +
		`${this.body
			.map((data) => {
				return data;
			})
			.join('\n')}`
	);
};

function MultiLineComment(type) {
	this.name = '';
	this.methodName = '';
	this.type = type;
	this.arguments = [];
	this.body = [];
	this.builder = () => {
		return this.toString();
	};
}

MultiLineComment.prototype.toString = function() {
	return (
		'/* \n' +
		`${this.body
			.map((data) => {
				if (typeof data == 'object') {
					return '                ' + data.builder();
				} else {
					return '                 ' + data;
				}
			})
			.join('\n')}` +
		'\n*/ \n'
	);
};
