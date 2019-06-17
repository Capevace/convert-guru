<template>
	<main class="w-full bg-white rounded-lg shadow-lg p-5 flex justify-between">
		<section class="w-full mr-5 content-between h-full">
			<div class="w-full">
				<h2 class="font-semibold text-2xl leading-none">
					Converting to GIF...
				</h2>
				<h3 class="font-semibold text-gray-500 text-xl mb-5">my-fil.mp4</h3>
			</div>

			<div class="w-full bg-indigo-200 h-5 block rounded shadow overflow-hidden">
				<div :style="{ width: `${progress * 100}%` }" class="w-1/2 bg-indigo-500 h-full text-sm text-center text-indigo-200 font-semibold">
					{{ (progress * 100).toFixed(0) }}%
				</div>
			</div>
		</section>
		<canvas v-if="!gifDataUrl" :width="previewSize.width" :height="previewSize.height" class="bg-black" ref="preview"></canvas>
		<img v-else :src="gifDataUrl">
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