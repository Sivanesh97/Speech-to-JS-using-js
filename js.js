let code = []
let scope = []

let dictated =
    // `variable person count = 2000` // After let until equals all are concatenated. equals => = type
    `function is Animating of`


// The if chain
function processing(string) {
    string = string.toLowerCase()
    let strArray = string.split(" ")
    switch (strArray[0]) {
        case 'let':
            declaration(strArray.shift(), strArray)
            break
        case 'constant':
            declaration('const', strArray.slice(1))
            break
        case 'variable':
            declaration('var', strArray.slice(1))
            break
        case `function`:
            functionCreator(strArray.slice(1))
            break
        case `close`: 
            scopeRemover()
            break
        case `undo`: 
            undo()
            break

    }
}

function declaration(type, strArray) {
    let equalsIndex = strArray.indexOf(`=`)
    let variable, assignment
    if (equalsIndex != -1) {
        variable = strArray.slice(0, strArray.indexOf('='))
        assignment = strArray.slice(strArray.indexOf("=") + 1)
        if(!isNaN(assignment)) {
            assignment = Number(assignment)
        } else {
            if(!(assignment === "true" || assignment === "false")) {
                // Then it will be String right now
                assignment = `'${assignment.join(" ")}'`
            }
        }
    } else {
        variable = strArray
    }
    variable = variable.join("_")
    scopeAssigner(`${type} ${variable} = ${assignment}\n`)
    // code.push(`${type} ${variable} = ${assignment}\n`)
    printCode()
}

function functionCreator(strArray) {
    let functionName = methodNameCreator(strArray)
    let method = new Function(functionName)
    scope.push(method)
}

function methodNameCreator(strArray) {
    return strArray.map((name, index) => {
        if (index != 0) {
            return name[0].toUpperCase() + name.slice(1)
        }
        return name
    }).join("")
}

function printCode() {
    console.log(code.join("\n"))
    console.log(`code`, code)
}

function scopeAssigner(data) {
    if (scope.length > 0) {
        scope[scope.length - 1].body.push(data)
    } else {
        code.push(data)
    }

    console.log(code.join("\n"))
}

function undo() {
    if(scope.length > 0) {
        scope[scope.length - 1].body.pop()
    } else {
        code.pop()
    }
    printCode()
}

function scopeRemover() {
    console.warn(`Scope Remover Works`)
    code.push(scope.pop().builder())
    printCode()
}