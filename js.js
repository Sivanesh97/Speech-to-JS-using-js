let code = []
let scope = []

let dictated = [
    // `variable person count = 2000` // After let until equals all are concatenated. equals => = type
    `let is Animating = 3`,
    `variable code = #include<iostream.h>`,
    `constant pi = 3.14`,
    `let is clock present = true`,
    `function color change`,
    `arguments name id object`,
    `constant pi = 3.14`,
    `let is clock present = true`,
    `close`,
    `console log hello world`,
    `close`,
    `function is animating`,
    `return 1`,
    `close`,
    `return 5`
]



async function tester() {
    await dictated.forEach(item => {
        console.log(item)
        processing(item)
    })
    printCode()    
}

tester()


// The if chain
function processing(string) {
    string = string.toLowerCase()
    let strArray = string.split(" ")
    switch (true) {
        case string.startsWith('let'):
            declaration(strArray.shift(), strArray)
            break
        case string.startsWith('constant'):
            declaration('const', strArray.slice(1))
            break
        case string.startsWith('variable'):
            declaration('var', strArray.slice(1))
            break
        case string.startsWith('function'):
            functionCreator(strArray.slice(1))
            break
        case string.startsWith('arguments'):
            assignArguments(strArray.slice(1))
            break
        case string.startsWith('close'):
            scopeRemover()
            break
        case string.startsWith('undo'):
            undo()
            break
        case string.startsWith('return'):
            returnToFunction(strArray.slice(1))
            break
        default: 
            simpleWordConversions(strArray) 
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
    // printCode()
}

function functionCreator(strArray) {
    console.log(strArray)
    let functionName = methodNameCreator(strArray)
    let method = new Function(functionName, `classic`)
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

function assignArguments(strArray) {
    if(scope.length != 0) {
        scope[scope.length - 1].arguments.push(...strArray)
    } else {
        console.error('Already in global scope')
    }
}

function returnToFunction(strArray) {
    if(scope.length == 0) {
        alert('prompted')
        console.error('You are in Global scope and can\'t return anything from there')
        return
    }

    let i 
    for(i = scope.length - 1; i >= 0; i--) {
        if(scope[i].constructor.name == 'Function') {
            scopeAssigner('return ' + strArray.join("_"))
            return
        }
    }
    
    alert('prompted')
    console.error('You are in Global scope and can\'t return anything from there')  
}

function printCode() {
    // console.clear()
    console.log(code.join("\n"))
    console.log(`code`, code)
    document.querySelector("#code").innerHTML = code.join("<br />")
}

function scopeAssigner(data) {
    if (scope.length > 0) {
        scope[scope.length - 1].body.push(data)
    } else {
        code.push(data)
    }

    printCode()
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
    if(scope.length != 0) {
        code.push(scope.pop().builder())
    } else {
        console.error('Already in Global scope')
    }
    printCode()
}

function simpleWordConversions(strArray) {
    switch(true) {
        case strArray.join(" ").startsWith('console'):
            consoling(strArray.slice(1))
            break
    }
}

function consoling(strArray) {
    switch(true) {
        case strArray.join(" ").startsWith('log'):
            scopeAssigner('console.log(`' + strArray.slice(1).join(" ") + '`)')
    }
}

