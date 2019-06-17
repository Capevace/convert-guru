export default function labelForJob(job) {
	switch (job) {
		case 'convert-to-gif':
			return 'Convert to GIF'
		case 'convert-to-audio':
			return 'Convert to Audio'
		default:
			return 'Undefined job ' + job
	}
}