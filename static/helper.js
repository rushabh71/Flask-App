function custom_slice(array, step = 1){
	arr = [];
	for(var i=0; i<array.length; i++){
		if(i%step==0){
			arr.push(array[i]);
		}
	}
	return arr;
}

function formatNumber(num) {
	return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
}
