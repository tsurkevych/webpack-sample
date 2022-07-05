
export default (price: number) => {
	price = Math.ceil(price);
	const p = Number((Number(price)).toFixed(2)) / Number((Number(price)).toFixed(0)) !== 1 ? (Number(price)).toFixed(2) : Number((Number(price)).toFixed(2));
	const arr = p.toString().split('.');
	const int = arr[0];
	const dec = (arr[1] ? `.${arr[1]}` : '');

	return int.replace(/(\d)(?=(\d{3})+$)/g, '$1 ') + dec;
};
