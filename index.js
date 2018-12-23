const alfy = require('alfy');

alfy.fetch(`https://api.github.com/users/${alfy.input}/events?access_token=${process.env.access_token}`).then(data => {
	const items =	data.map(x => ({
			title: x.created_at,
			subtitle: x.type,
			arg: x.id
		}));
		// console.log(process.env.access_token)
		console.log(items)
});