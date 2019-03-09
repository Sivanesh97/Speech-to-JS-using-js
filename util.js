function Function(name, type) {
    this.name = name
    this.body = []
    this.arguments = []
    this.type = type
    this.builder = function () {
        this.body = this.body.map(item => `    ${item}`)
        this.body.unshift(`function ${this.name} (${this.arguments.join(", ")}) {`)
        this.body.push(`}`)
        return this.toString()
    }
}

Function.prototype.toString = function() {
    return this.body.join("\n")
}

function For() {
    this.condition = ``
    this.body = []
    this.builder = function() {
        this.body.unshift(`for(${this.condition}) {`)
        this.body.push(`}`)
        return this.toString()
    }
}

For.prototype.toString = function () {
    return this.body.join("\n")
}

function List() {
    this.name = ''
    this.body = []
    this.builder = function() {
        this.body = `[${this.body.toString()}]`
        this.body = this.body.replace(/,/g, ', ')
    }
}

List.prototype.toString = function () {
    return this.body
}

function Obj() {
    this.name = ''
    this.body = []
    this.keyValuePair = function(key, value) {
        key = key.split(" ").join("_")
        value = typeDefiner(value)
        this.body.push(`${key}: ${value}`)
    }

    this.builder = function() {
        this.body = this.body.map(item => `    ${item}`)
        this.body = `{\n ${this.body.join(", \n")}\n}`
        return this.toString()
    }
}

Obj.prototype.toString = function() {
    return this.body
}

function MultiLineComment() {
    this.body = []
    this.builder = function() {
        this.body = `/*
    ${this.body.join("\n")}
*/`
        return this.toString()
    }
}

MultiLineComment.prototype.toString = function() {
    return this.body
}