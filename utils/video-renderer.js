import GIF from 'gif.js';

export default class VideoRenderer extends EventTarget {
	constructor(renderJob) {
		super();

		this.type = renderJob.type;
		this.files = renderJob.files;
		this.settings = renderJob.settings;

		this.ended = false;
		this.duration = null;
		this.video = null;
		this.gif = null;
		
		this._setupVideo(this.files[0]);
	}

	_setupVideo(videoFile) {
		this.video = document.createElement('video');
		this.video.src = (window.URL || window.webkitURL).createObjectURL(
			videoFile
		);
		this.video.muted = true;
		this.video.load();
		this.video.onloadeddata = () => {
			this.ready = true;
			this.duration = this.video.duration - (this.video.duration - this.settings.endAt) - this.settings.startAt;
			this.video.currentTime = this.settings.startAt;

			this.gif = new GIF({
				workers: 4,
				workerScript: 'gif.worker.js',
				width: this.video.videoWidth,
				height: this.video.videoHeight
			})
				.on('start', () => {
					console.log('starting gif recording');
					this.dispatchEvent(this._createEvent('start'));
				})
				.on('progress', p => {
					this.dispatchEvent(this._createEvent('progress', { status: 'encoding', progress: p }));
				})
				.on('finished', (blob) => {
					this.dispatchEvent(this._createEvent('finished', { blob }));
				});

			this.dispatchEvent(this._createEvent('ready', {
				width: this.video.videoWidth,
				height: this.video.videoHeight
			}));
		};

		this.video.addEventListener('play', () => console.log('started playing'));
		this.video.addEventListener('ended', this._onEnded.bind(this));
		this.video.addEventListener('waiting', () => console.log('waiting'));
	}

	start() {
		console.log('play');
		this.video.play();
		this._frameLoop();
	}

	_onEnded() {
		console.log('on ended');
		this.ended = true;
		this.gif.render();
		this.video.pause();
	}

	_frameLoop() {
		if (this.ended) return;

		this.dispatchEvent(this._createEvent('frame', { video: this.video }));
		this.gif.addFrame(this.video, {copy: true, delay: 1000 / 30 * 1.3});

		console.log(this.video.currentTime, this.settings.endAt);
		this.dispatchEvent(this._createEvent('progress', { 
			status: 'render', 
			progress: (this.video.currentTime - this.settings.startAt) / this.duration
		}));

		if (this.video.currentTime > this.settings.endAt) {
			this._onEnded();
			return;
		}

		setTimeout(this._frameLoop.bind(this), 1000 / 30);
	}

	_createEvent(name, data) {
		const event = new Event(name);

		for (const key in data) {
			event[key] = data[key];
		}

		return event;
	}
}