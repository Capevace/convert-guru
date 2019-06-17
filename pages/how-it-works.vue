<template>
	<div
		class="header-gradient text-white px-16 relative antialiased min-h-screen pb-5"
	>
		<Header></Header>
		<main v-if="!job" class=" w-full leading-relaxed container max-w-xl m-auto text-lg">
			<h1 class="font-semibold text-3xl mb-3">How ConvertGuru works</h1>
			<p class="mb-5">
				ConvertGuru is made possible due to the fact that we process all conversion <strong>directly in your browser</strong> which means we don't have to process any video data on our servers. Everything you convert with ConvertGuru is encoded on your machine. This has many advantages:
			</p>

			<h2 class="font-semibold text-xl mb-2">Your privacy is protected</h2>
			<p class="mb-5">
				Other video conversion apps require you to upload a video to their site to be able to utilize the service. <strong>We don't!</strong> A selected file is never uploaded to our servers and all processing is done in your browser. All data stays on your device. We will never know what files you convert using our service because the files never leave your device to begin with.
			</p>

			<h2 class="font-semibold text-xl mb-2">Less bandwidth</h2>
			<p class="mb-5">
				Because the processing is done inside the browser you won't have to waste precious mobile bandwidth when you convert a video. This is especially important when dealing with high quality videos which can grow in size quickly!
			</p>

			<h2 class="font-semibold text-xl mb-2">Useable offline</h2>
			<p class="mb-5">
				This website is what developers call a "Progressive Web App". What does that mean for you? Basically, you can install this website straight to your iPhone's or Android phone's homescreen just like an app. The website will then be cached on your device so you can use it even without an internet connection!
			</p>

			<h2 class="font-semibold text-xl mb-2">We can keep the service free</h2>
			<p>Because everything is encoded on your device we don't have to pay more for our servers than for just hosing this site! Less costs, less ads!</p>
		</main>
	</div>
</template>
<script type="text/javascript">
import Header from '../components/Header';
export default {
	components: {
		Header
	}
};
</script>