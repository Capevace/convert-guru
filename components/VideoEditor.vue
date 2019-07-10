<template>
	<main class="w-full">
		<section class="flex">
			<div
				class="mr-6 w-full flex flex-wrap justify-center relative"
			>
				<VideoCanvas
					:video-state="videoState"
					ref="videoCanvas"
				></VideoCanvas>
				<section class="w-full px-4 py-3 bg-white rounded-lg shadow-lg">
					<TrimBar
						class="h-8 w-full"
						:video-state="videoState"
						@start="onStartAtChanged"
						@end="onEndAtChanged"
						@current="onCurrentTimeChanged"
					></TrimBar>
				</section>
			</div>
			<aside class="w-1/3 p-5 flex flex-wrap content-between bg-white rounded-lg shadow-lg">
				<section class="w-full">
					<h2 class="font-semibold text-2xl leading-none">
						{{ labelForjob(job.type) }}
					</h2>
					<h3 class="font-semibold text-gray-500 text-xl mb-5">{{ this.job.files[0].name }}</h3>
					<h4 class="mb-2 font-bold text-gray-500 text-sm">Actions</h4>
					<button
						class="bg-gray-300 text-gray-700 w-full p-3 rounded font-semibold mb-3"
						@click="play"
					>
						Play / Pause
					</button>
					<!-- <button
						class="bg-gray-300 text-gray-700 w-full p-3 rounded font-semibold mb-3"
					>
						Trim
					</button> -->
				</section>
				<section class="w-full">
					<button
						class="bg-indigo-500 text-white w-full p-3 rounded font-semibold"
						@click="exportJob"
					>
						{{ labelForjob(job.type) }}
					</button>
				</section>
			</aside>
		</section>
	</main>
</template>
<script type="text/javascript">
import labelForjob from '../utils/label-for-job';
import VideoEditor from '../utils/video-editor.js';
import TrimBar from './TrimBar';
import VideoCanvas from './VideoCanvas';

export default {
	props: ['job'],
	data: () => ({
		videoState: null
	}),
	mounted() {
		this.videoEditor = new VideoEditor(this.job.files[0]);
		this.videoEditor.addEventListener('ready', e => {
			this.videoState = e.videoState;

			this.$refs.videoCanvas.onReady(e.videoState, e.video);
		});

		this.videoEditor.addEventListener('playing', e => {
			this.videoState = e.videoState;
		});

		this.videoEditor.addEventListener('trimmed', e => {
			this.videoState = e.videoState;
		});

		this.videoEditor.addEventListener('frame', e => {
			this.videoState = e.videoState;
			this.$refs.videoCanvas.onFrame(e.videoState, e.video);
		});
	},
	methods: {
		labelForjob,
		play() {
			this.videoEditor.play();
		},
		pause() {
			this.videoEditor.pause();
		},
		exportJob() {
			this.videoEditor.destroy();
			this.videoEditor = null;

			this.$emit('export', { 
				type: this.job.type, 
				files: this.job.files, 
				settings: {
					startAt: this.videoState.startAt, 
					endAt: this.videoState.endAt
				}
			});
		},

		onCurrentTimeChanged(time) {
			this.videoEditor.setCurrentTime(time);
		},
		onStartAtChanged(time) {
			this.videoEditor.setStartAt(time);
		},
		onEndAtChanged(time) {
			this.videoEditor.setEndAt(time);
		}
	},
	components: {
		TrimBar,
		VideoCanvas
	}
};
</script>
