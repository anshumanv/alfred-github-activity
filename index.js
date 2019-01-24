const alfy = require('alfy');

// Determine the URL to open on selection of an output item.
determineArg = (event) => {
	const { payload: { action, comment, issue, pull_request, forkee, release }, type, repo, payload : { head} , actor } = event;
	if (event.payload.action === 'created' || event.type === 'CommitCommentEvent') {
		return comment.html_url
	}	else if (['opened', 'closed', 'published'].includes(action)) {
		return (pull_request || issue || release)['html_url']
	} else if (['WatchEvent', 'DeleteEvent', 'CreateEvent', 'PublicEvent'].includes(type)) {
		return `https://github.com/${repo.name}`
	} else if (type === 'ForkEvent') {
		return forkee.html_url
	} else if (type === 'PushEvent') {
		return `https://github.com/${repo.name}/commit/${head}`
	} else {
		// Temporary
		return actor.url
	}
}


// Determine the action of the event
determineAction = event => {
	const { payload: {ref, ref_type, action}, type } = event
	if (type === 'PushEvent') {
		return ref
	} else if (type === 'ForkEvent') {
		return 'Forked at'
	} else if (['CreateEvent', 'DeleteEvent'].includes(type)) {
		return `${ref_type} - ${ref}`
	} else return action || ''
}

// Script to run on changing input
(async () => {
	const { access_token } = process.env
	const data = await alfy.fetch(`https://api.github.com/users/${alfy.input}/events${access_token ? '?access_token=' + access_token : ''}`)
	const items =	data.map(event => {
		// Determine the URL to open
		const arg = determineArg(event)

		// Determine initial of subtitle
		const preSub = determineAction(event)

		// New date object for the action time
		const actionTimestamp = new Date(event.created_at)

		// Output items
		return {
			title: `${event.type} - ${event.repo.name}`,
			subtitle: `${preSub} - ${actionTimestamp}`,
			arg,
			quicklookUrl: arg,	// This is saikou
		}});

		// Throw the final list of items
		alfy.output(items)
})();
