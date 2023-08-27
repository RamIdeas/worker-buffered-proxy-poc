export default {
	fetch(request, env, ctx) {
		const url = new URL(request.url);

		return new Response('hello @ ' + new Date().toISOString(), {
			headers: { 'Content-Type': 'text/html' },
		});
	},
};
