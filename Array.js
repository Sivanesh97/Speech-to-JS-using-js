function listCreator(data) {
	let list = new List();
	alert(data);
	data = data.join(' ').split('next');
	alert(data);
	// data = data.trim().split(" ")
	data = data.map((item) => {
		return typeDefiner(item.trim());
	});
	list.body.push(data);
	return list;
}
