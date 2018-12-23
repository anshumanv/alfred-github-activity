const alfy = require('alfy');

(async () => {

	const data = await alfy.fetch(`https://api.github.com/users/${alfy.input}/events?access_token=${process.env.access_token}`)
	const items =	data.map(event => {
		const arg;
		if(event.payload.action == 'created') {
			arg = event.payload.comment.html_url
		}	else {
			arg = event.payload.actor.url
		}
		return {
			title: `${event.type} - ${event.repo.name}`,
			subtitle: `${event.payload.action} - ${event.created_at}`,
			arg: event.actor.url
		}});

		// console.log(process.env.access_token)
		// console.log(alfy.input, items, data)
		alfy.output(items)
	})();
