import debug from 'debug';

// If DEBUG is not set by the caller, enable `api` and `ui` by default
if (!process.env.DEBUG) {
	process.env.DEBUG = 'api,ui';
}

type LogFn = (...args: any[]) => void;

const createLogger = (namespace: string): LogFn => {
	const dbg = debug(namespace);
	return (...args: any[]) => {
		const timestamp = new Date().toISOString();

		if (process.env.LOG_FORMAT === 'json') {
			const messageParts = args.map((a) => {
				if (a instanceof Error) return a.message;
				if (typeof a === 'object') {
					try {
						return JSON.stringify(a);
					} catch {
						return String(a);
					}
				}
				return String(a);
			});
			const payload: any = {
				time: timestamp,
				namespace,
				message: messageParts.join(' '),
			};
			const extra = args.filter((a) => typeof a !== 'string' && !(a instanceof Error));
			if (extra.length) payload.data = extra;
			console.log(JSON.stringify(payload));
		} else {
			const prefix = `[${timestamp}] [${namespace}]`;
			console.log(prefix, ...args);
		}

	};
};

export const logAPI = createLogger('api');
export const logUI = createLogger('ui');
