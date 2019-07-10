<template>
	<main class="w-1/2 m-auto bg-white rounded-lg shadow-lg p-5 flex justify-between">
		<section class="w-full flex">
			<template v-if="!gifDataUrl">
				<div class="w-full mr-5 flex flex-wrap content-between">
					<div class="w-full">
						<h2 class="font-semibold text-2xl">
							Converting to GIF...
						</h2>
						<h3 class="text-xl mb-5 font-semibold text-gray-500">
							{{ this.job.files[0].name }}
						</h3>
					</div>

					<div class="w-full bg-indigo-200 h-8 block rounded shadow overflow-hidden">
						<div :style="{ width: `${progress * 100}%` }" class="w-1/2 bg-indigo-500 h-full text-sm text-indigo-200 font-semibold flex items-center justify-center">
							<span>{{ (progress * 100).toFixed(0) }}%</span>
						</div>
					</div>
				</div>
				<canvas :width="previewSize.width" :height="previewSize.height" class="bg-black w-1/2" ref="preview"></canvas>
			</template>
			<template v-else>
				<div class="w-full mr-5 flex flex-wrap content-between">
					<div class="w-full">
						<h2 class="font-semibold text-2xl">
						Your Video was successfully converted.
						</h2>
						<h3 class="text-xl mb-5 font-semibold text-gray-500">
							To download the GIF press the button below.
						</h3>
					</div>
			
					<div class="w-full flex">
						<a 
							class="bg-indigo-500 text-white text-xl font-semibold rounded px-5 py-3 w-1/2 mr-2 text-center" 
							:href="gifDataUrl" 
							:download="downloadFilename">
							Download GIF
						</a>
						<a 
							class="bg-gray-200 text-gray-600 text-xl font-medium rounded px-5 py-3 w-1/2 ml-2 text-center"
							href="#"
							@click.prevent="convertNewVideo"
						>
							Convert new Video
						</a>
					</div>
				</div>
				<img class="w-1/2" :src="gifDataUrl">
			</template>
		</section>
	</main>
</template>
<script type="text/javascript">
import VideoRenderer from '../utils/video-renderer';

export default {
	props: ['job'],
	data: () => ({
		previewSize: { width: 480, height: 270 },
		status: 'render',
		progress: 0,
		gifDataUrl: null
	}),
	computed: {
		downloadFilename() {
			const filenameArray = this.job.files[0].name.split('.');
			filenameArray.splice(-1,1);
			
			return filenameArray.join('.') + '.gif';
		}
	},
	methods: {
		convertNewVideo() {
			this.$emit('back');
		}
	},
	mounted() {
		const context = this.$refs.preview.getContext('2d');
		const videoRenderer = new VideoRenderer(this.job);

		videoRenderer.addEventListener('ready', (e) => {
			console.log('ready');
			this.previewSize = { width: e.width, height: e.height };
			videoRenderer.start();
		});

		videoRenderer.addEventListener('progress', (e) => {
			console.log('progress', e.progress);
			this.status = e.status;
			this.progress = this.status === 'render'
				? e.progress * 0.5
				: 0.5 + (e.progress * 0.5);
		});

		videoRenderer.addEventListener('frame', (e) => {
			console.log('frame');
			context.drawImage(e.video, 0, 0);
		});

		videoRenderer.addEventListener('finished', (e) => {
			console.log('finished', e.blob);
			this.gifDataUrl = URL.createObjectURL(e.blob);
		});
	}
};
</script>