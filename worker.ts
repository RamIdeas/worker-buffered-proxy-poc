type BufferedRequest = {
    request: Request;
    promise: DeferredPromise<Response>;
};
type ProxyData = {
    pause: boolean;
    destinationURL?: Partial<URL>;
    destinationInspectorURL?: Partial<URL>;
    headers?: Record<string, string>;
};

const buffer = new Map<Request, BufferedRequest>();

let proxyData: ProxyData;

interface Env {}

export default {
    fetch(request, env) {
        if (isRequestFromProxyController(request)) {
            proxyData = request.cf?.proxyData as ProxyData;

            processBufferedRequests();

            return new Response(null, { status: 204 });
        }

        const promise = createDeferredPromise<Response>();
        buffer.set(request, { request, promise });

        processBufferedRequests();

        return promise;
    },
};

type DeferredPromise<T> = Promise<T> & {
    resolve: (_: Response) => void;
    reject: (_: Error) => void;
};
const createDeferredPromise = <T>(): DeferredPromise<T> => {
    let resolve, reject;
    const promise = new Promise<T>((_resolve, _reject) => {
        resolve = _resolve;
        reject = _reject;
    });

    return Object.assign(promise, {
        resolve,
        reject,
    } as unknown) as DeferredPromise<T>;
};

const isRequestFromProxyController = (req: Request) => !!req.cf;

function processBufferedRequests() {
    if (proxyData.destinationURL === undefined) return;

    for (const [request, { promise }] of buffer) {
        buffer.delete(request);

        const url = new URL(request.url);

        // override url parts for proxying
        Object.assign(url, proxyData.destinationURL);

        fetch(url, request).then(
            (res) => {
                promise.resolve(res);
            },
            (err) => {
                console.error(err);
            }
        );
    }
}
