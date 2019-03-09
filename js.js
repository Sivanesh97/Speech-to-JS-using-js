let code = []
let scope = []




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
        assignment = typeDefiner(assignment.join(" "))
    } else {
        variable = strArray
    }
    variable = variable.join("_")
    scopeAssigner(`${type} ${variable} = ${assignment}`)
    // code.push(`${type} ${variable} = ${assignment}`)
    // printCode()
}

function typeDefiner(data) {
    console.log(typeof data, data)
    if(typeof data === 'string' && data.startsWith('list')) {
        data = data.split(" ")
        return listCreator(data.slice(1))
    } else if(data.startsWith('string')) {
        return `'${data.split(" ").slice(1).join(" ")}'`
    } else if (!isNaN(data)) {
        return Number(data)
    } else if (data === "true" || data === "false") {
        return data
    } else {
        return data.split(" ").join("_")
    }
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
        let args = strArray.join(" ").split("next")
        args = args.map(item => item.trim().split(" ").join("_"))
        scope[scope.length - 1].arguments.push(args)
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
        return item.replace(/not_a_number/g, 'NaN')
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
            scopeAssigner(`console.log(${typeDefiner(strArray.slice(1).join(" "))})`)
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