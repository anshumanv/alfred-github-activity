const alfy = require('alfy');

determineArg = (event) => {
	if (event.payload.action === 'created' || event.type === 'CommitCommentEvent') {
		return event.payload.comment.html_url
	}	else if (['opened', 'closed', 'published'].includes(event.payload.action)) {
		return (event.payload.pull_request || event.payload.issue || event.payload.release)['html_url']
	} else if (['WatchEvent', 'DeleteEvent', 'CreateEvent', 'PublicEvent'].includes(event.type)) {
		return `https://github.com/${event.repo.name}`
	} else if (event.type === 'ForkEvent') {
		return event.payload.forkee.html_url
	} else if (event.type === 'PushEvent') {
		return `https://github.com/${event.repo.name}/commits/${event.payload.head}`
	} else {
		// Temporary
		return event.actor.url
	}
}

determineAction = event => {
	const { payload } = event
	if (event.type === 'PushEvent') {
		return payload.ref
	} else if (event.type === 'ForkEvent') {
		return 'Forked at'
	} else if (['CreateEvent', 'DeleteEvent'].includes(event.type)) {
		return `${payload.ref_type} - ${payload.ref}`
	} else return payload.action
}

(async () => {

	const data = await alfy.fetch(`https://api.github.com/users/${alfy.input}/events?access_token=${process.env.access_token}`)
	const items =	data.map(event => {
		// Determine the URL to open

		const arg = determineArg(event)
		const preSub = determineAction(event)
		const actionTimestamp = new Date(event.created_at)

		return {
			title: `${event.type} - ${event.repo.name}`,
			subtitle: `${preSub} - ${actionTimestamp}`,
			arg
		}});

		// console.log(process.env.access_token)
		// console.log(alfy.input, items)
		alfy.output(items)
	})();
