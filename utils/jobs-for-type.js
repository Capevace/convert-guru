export default function jobsForType(type) {
	switch(type) {
		case 'video':
			return ['convert-to-gif', 'convert-to-audio'];
		default:
			return 0;
	}
};