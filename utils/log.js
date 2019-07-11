const ENABLE_LOGGING = false;

export function log(...args) {
	if (ENABLE_LOGGING)
		console.log(...args);
}