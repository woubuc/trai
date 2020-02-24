export function joinUrl(parts : string[]) : string {
	return normaliseUrl(parts
		.map(part => {
			if (!part.startsWith('/')) {
				part = `/${ part }`;
			}
			if (part.endsWith('/')) {
				part = part.slice(0, -1);
			}
			return part;
		})
		.join(''));
}

export function normaliseUrl(url : string) : string {
	url = url.toLowerCase();

	while (url.includes('//')) {
		url = url.replace('//', '/');
	}

	if (url.endsWith('/')) {
		url = url.slice(0, -1);
	}

	return url;
}
