import { Elysia } from 'elysia';
import { vite } from 'elysia-vite-server';

const app = new Elysia()
	.use(
		vite({
			static: {
				assets: '.',
				alwaysStatic: false,
				noCache: true,
			},
		})
	)
	.all('*', async ({ vite, request, set }) => {
		console.log('SSR')
		if (!vite) return;

		try {
			const template = await Bun.file('./index.html').text();

			const indexHtml = await vite.transformIndexHtml(
				request.url,
				template
			);
			const render = (await vite.ssrLoadModule('./src/entry-server.ts'))
				.render;

			const rendered = await render(request.url);

			const html = indexHtml
				.replace('<!--app-head-->', rendered.head ?? '')
				.replace('<!--app-html-->', rendered.html ?? '');

			return new Response(html, {
				headers: {
					'Content-Type': 'text/html',
				},
			});
		} catch (e) {
			if (e instanceof Error) {
				vite?.ssrFixStacktrace(e);
				console.log(e, e.stack);
				set.status = 500;

				return e.stack;
			} else console.log('error', e);
		}
	})
	.get('/', () => 'Hello Elysia')
	.listen(3030);

console.log(
	`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
