import GIF from 'gif.js.optimized';
import { log } from './log';

export default class VideoRenderer extends EventTarget {
	constructor(renderJob) {
		super();

		this.type = renderJob.type;
		this.files = renderJob.files;
		this.settings = renderJob.settings;

		this.ended = false;
		this.rendering = false;
		this.waiting = false;
		this.duration = null;
		this.video = null;
		this.gif = null;
		this.renderTimeoutId = null;
		
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
				workers: 5,
				workerScript: 'gif.worker.js',
				width: this.video.videoWidth,
				height: this.video.videoHeight
			})
				.on('start', () => {
					log('starting gif recording');
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

		this.video.addEventListener('play', () => log('started playing'));
		this.video.addEventListener('playing', () => log('playing event'));
		this.video.addEventListener('canplay', () => {
			if (this.rendering && this.waiting) {
				this.waiting = false;
				this.renderTimeoutId = setTimeout(this._frameLoop.bind(this), 1000 / 30);
			}
		});
		this.video.addEventListener('ended', this._onEnded.bind(this));
		this.video.addEventListener('waiting', () => {
			if (this.rendering) {
				this.waiting = true;
				clearTimeout(this.renderTimeoutId);
				this.renderTimeoutId = null;
			}
		});
	}

	start() {
		log('play');
		this.rendering = true;
		this.video.addEventListener('play', () => this._frameLoop(), {
			once: true
		});

		this.video.play();
	}

	_onEnded() {
		log('on ended');
		this.ended = true;
		this.rendering = false;
		this.gif.render();
		this.video.pause();
	}

	_frameLoop() {
		if (this.ended) return;

		if (this.video.currentTime > this.settings.endAt) {
			this._onEnded();
			return;
		} else if (!this.waiting) {
			this.dispatchEvent(this._createEvent('frame', { video: this.video, frame: this.frameCounter }));
			this.gif.addFrame(this.video, {copy: true, delay: 1000 / 30 * 1.3});

			log(this.frameCounter, this.video.currentTime, this.settings.endAt);
			this.dispatchEvent(this._createEvent('progress', { 
				status: 'render', 
				progress: (this.video.currentTime - this.settings.startAt) / this.duration
			}));

			this.renderTimeoutId = setTimeout(this._frameLoop.bind(this), 1000 / 30);
		}
	}

	_createEvent(name, data) {
		const event = new Event(name);

		for (const key in data) {
			event[key] = data[key];
		}

		return event;
	}
}