let paused = false; // in-memory state, true means wait for targetIsActive to resolve before proxying the request
let targetIsActive = createDeferredPromise();
targetIsActive.resolve();

function togglePause() {
	paused = !paused;

	if (paused) targetIsActive = createDeferredPromise();
	else targetIsActive.resolve();

	console.log({ paused });
}

export default {
	fetch(request, env, ctx) {
		if (request.url.endsWith('/toggle')) {
			togglePause();

			return Response.json({ paused });
		}

		return targetIsActive.promise.then(() => processRequest(request));
	},
};

function createDeferredPromise() {
	let resolve, reject;
	const promise = new Promise((_resolve, _reject) => {
		resolve = _resolve;
		reject = _reject;
	});

	return { promise, resolve, reject };
}

function isHtmlResponse(res) {
	return res.headers.get('content-type')?.startsWith('text/html') ?? false;
}

function processRequest(request) {
	const url = new URL(request.url);

	// override url parts for proxying
	url.host = 'localhost:7777';

	return globalThis['fetch'](url, request) // TODO: check if redirect: manual is needed
		.then((res) => {
			// if (isHtmlResponse(res)) {
			// 	res = insertLiveReloadScript(res);
			// }

			return res;
		})
		.catch((error) => {
			// errors here are network errors or from response post-processing
			// to catch only network errors, use the 2nd param of the fetch.then()
		});
}

// function insertLiveReloadScript(response) {
// 	const htmlRewriter = new HTMLRewriter();

// 	htmlRewriter.onDocument({
// 		end(end) {
// 			end.append(`<script>/* live reload script */</script>`, { html: true });
// 		},
// 	});

// 	return htmlRewriter.transform(response);
// }
