function listCreator(data) {
    let list = new List()
    data = data.join(" ").split("next")
    // data = data.trim().split(" ")
    data = data.map(item => typeDefiner(item.trim()))
    list.body.push(data)
    list.builder()
    return list
}