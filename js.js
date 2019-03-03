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
            functionProcessing(strArray.slice(1))
            break
        case `close`: 
            scopeRemover()
            break
    }
}

function declaration(type, strArray) {
    let equalsIndex = strArray.indexOf(`=`)
    let variable, assignment
    if (equalsIndex != -1) {
        variable = strArray.slice(0, strArray.indexOf('='))
        assignment = strArray.slice(strArray.indexOf("=") + 1)
        assignment = Number(assignment)
    } else {
        variable = strArray
    }
    variable = variable.join("_")
    scopeAssigner(`${type} ${variable} = ${assignment}\n`)
    // code.push(`${type} ${variable} = ${assignment}\n`)
    printCode()
}

function functionProcessing(strArray) {
    let functionName = methodNameCreator(strArray)
    let method = new Function(functionName)
    // scope.push(method)

    // After body is closed by Speaker
    method.builder()
    code.push(method)
    printCode()
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

function scopeRemover() {
    console.warn(`Scope Remover Works`)
    code.push(scope.pop().builder())
    printCode()
}