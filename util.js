function Function(name) {
    this.name = name
    this.body = []
    this.arguments = []
    this.builder = function () {
        this.body.unshift(`function ${this.name} (${this.arguments.join(", ")}) {`)
        this.body.push(`}`)
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
    }
}

For.prototype.toString = function () {
    return this.body.join("\n")
}

// const animationFunction = new Function('animation')
// animationFunction.body.push(`concatenated`)
// animationFunction.body.push(`once again`)
// // animationFunction.for = new For()

// // Creation of a for Loop
// let forLoop2 = new For()
// forLoop2.body.push(`let a = 12`)
// forLoop2.body.push(`console.log()`)

// console.log(forLoop2)

// // Assigning for loop to Function
// animationFunction.body.push(forLoop2)

// console.log(animationFunction)



// const forLoop = new For()
// forLoop.body.push(`let b = 23`)
// forLoop.body.push(`console.log(a)`)

// // console.log(`` + forLoop)


// // for(i in animationFunction) {
// //     console.log(i)
// // }