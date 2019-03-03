function Function(name) {
    this.name = name
    this.body = []
    this.arguments = []
    this.builder = function () {
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