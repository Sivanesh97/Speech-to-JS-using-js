function objectCreator(data) {
    let obj = new Obj()
    let key_val_arr = data.split("next")
    key_val_arr = key_val_arr.map(item => {
        let key, value
        key = item.slice(0, item.indexOf('=')).trim()
        value = item.slice(item.indexOf('=') + 1).trim()
        key = key.split(" ").join("_")
        value = typeDefiner(value)
        return { key, value }
    })

    
    console.log(key_val_arr)
}