function objectCreator(data) {
    let obj = new Obj()
    scope.push(obj)
    if(data == '') return 
    let key_val_arr = data.split("next")
    key_val_arr = key_val_arr.map(item => {
        let key, value
        key = item.slice(0, item.indexOf('=')).trim()
        value = item.slice(item.indexOf('=') + 1).trim()
        key = key.split(" ").join("_")
        return { key, value }
    })

    key_val_arr.forEach(item => {
        let { key, value } = item
        obj.keyValuePair(key, value)
    })
}