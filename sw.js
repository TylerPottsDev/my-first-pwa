const cache_name = "V1";

self.addEventListener('install', async function () {
	const cache = await caches.open(cache_name);
	cache.addAll([
		'/index.html',
		'/main.css',
		'/main.js'
	]);
});

self.addEventListener('fetch', event => {
	event.respondWith(
		caches.match(event.request)
			.then(response => {
				if (response) {
					return response;
				}
				return fetch(event.request)
					.then(response => {
						return caches.open(cache_name)
							.then(cache => {
								cache.put(event.request.url, response.clone());
								return response;
							});
					});
			}).catch(error => {
				fetch(event.request)
					.then(response => {
						return caches.open(cache_name)
							.then(cache => {
								cache.put(event.request.url, response.clone());
								return response;
							});
					});
			})
	)
})