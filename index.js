const alfy = require('alfy');

determineArg = (event) => {
	if (event.payload.action === 'created' || event.type === 'CommitCommentEvent') {
		return event.payload.comment.html_url
	}	else if (['opened', 'closed'].includes(event.payload.action)) {
		return (event.payload.pull_request || event.payload.issue)['html_url']
	} else if (event.type === 'WatchEvent') {
		return event.repo.url
	} else if (event.type === 'ForkEvent') {
		return event.payload.forkee.html_url
	} else if (event.type === 'PushEvent') {
		return event.payload.commits.url
	} else {
		// Temporary
		return event.actor.url
	}
}

(async () => {

	const data = await alfy.fetch(`https://api.github.com/users/${alfy.input}/events?access_token=${process.env.access_token}`)
	const items =	data.map(event => {
		// Determine the URL to open

		const arg = determineArg(event)

		return {
			title: `${event.type} - ${event.repo.name}`,
			subtitle: `${event.payload.action} - ${event.created_at}`,
			arg
		}});

		// console.log(process.env.access_token)
		// console.log(alfy.input, items)
		alfy.output(items)
	})();
