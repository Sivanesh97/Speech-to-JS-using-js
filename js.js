let code = []
let scope = []

let dictated = [
    // `variable person count = 2000` // After let until equals all are concatenated. equals => = type
    `let is Animating = 3`,
    `let exception = not a number`,
    `variable code = #include<iostream.h>`,
    `operation 5 plus 10 plus 15`,
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
    `let is Animating = 3`,
    `let is number = not a number`,
    `variable code = #include<iostream.h>`,
    `constant pi = 3.14`,
    `return 1`,
    `close`,
    `operation plus minus into by percentage increment decrement equals`,
    `operation plus equals 12 minus equals 36 into equals by equals percentage equals`,
    `operation equal to triple equals not equal to not triple equals greater than less than greater than equals less than equals`,
    `operation and or not`,
    `operation bitwise and bitwise or bitwise not left shift right shift`
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
        case string.startsWith('operation'):
            operationHandler(strArray.slice(1))
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
        assignment = typeDefiner(assignment)
    } else {
        variable = strArray
    }
    variable = variable.join("_")
    scopeAssigner(`${type} ${variable} = ${assignment}`)
    // code.push(`${type} ${variable} = ${assignment}`)
    // printCode()
}

function typeDefiner(data) {
    if (!isNaN(data)) {
        data = Number(data)
    } else {
        if (!(data === "true" || data === "false")) {
            // Then it will be String right now
            data = `'${data.join(" ")}'`
        }
    }
    return data
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
    
    console.error('You are in Global scope and can\'t return anything from there')  
}

function printCode() {
    // console.clear()
    NaNParser()
    console.log(code.join("\n"))
    console.log(`code`, code)
    document.querySelector("#code").innerHTML = code.join("\n")
}

function NaNParser() {
    code = code.map(item => { 
        console.log('item = ', item, typeof item)
        return item.replace(/not a number/g, 'NaN')
    })
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
    let string = strArray.join(" ")
    switch(true) {
        case string.startsWith('console'):
            consoling(strArray.slice(1))
            break
        default: 
            // the original default
            scopeAssigner(string)
    }
}

function consoling(strArray) {
    switch(true) {
        case strArray.join(" ").startsWith('log'):
            scopeAssigner('console.log(`' + strArray.slice(1).join(" ") + '`)')
    }
}

function operationHandler(operation) {
    let str = operation.join(" ")
    
    str = str.replace(/bitwise and/g, '&')
    str = str.replace(/bitwise or/g, '|')
    str = str.replace(/bitwise not/g, '~')
    str = str.replace(/left shift/g, '<<')
    str = str.replace(/right shift/g, '>>')

    str = str.replace(/and/g, '&&')
    str = str.replace(/or/g, '||')
    str = str.replace(/not/g, '!')


    str = str.replace(/not triple equals/g, '!==')
    str = str.replace(/not equal to/g, '!=')
    str = str.replace(/equal to/g, '==')
    str = str.replace(/triple equals/g, '===')
    str = str.replace(/greater than/g, '>')
    str = str.replace(/less than/g, '<')
    str = str.replace(/greater than equals/g, '>=')
    str = str.replace(/less than equals/g, '<=')




    str = str.replace(/plus equals/g, '+=')
    str = str.replace(/minus equals/g, '-=')
    str = str.replace(/into equals/g, '*=')
    str = str.replace(/by equals/g, '/=')
    str = str.replace(/percentage equals/g, '%=')
    str = str.replace(/plus/g, '+')
    str = str.replace(/minus/g, '-')
    str = str.replace(/into/g, '*')
    str = str.replace(/by/g, '/')
    str = str.replace(/equals/g, '=')
    str = str.replace(/increment/g, '++')
    str = str.replace(/decrement/g, '--')
    str = str.replace(/percentage/g, '%')

    scopeAssigner(str)
}   