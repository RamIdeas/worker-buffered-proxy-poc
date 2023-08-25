export default {
    fetch(request, env, ctx) {
        return new Response("hello @ " + new Date().toISOString(), {
            headers: { "Content-Type": "text/html" },
        });
    },
};
