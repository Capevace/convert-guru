<template>
	<header class="w-full flex justify-between items-center py-8">
		<nuxt-link to="/" class="font-semibold text-2xl flex">
			<Logo class="w-8 fill-current text-white mr-2 text-center"></Logo>
			ConvertGuru
		</nuxt-link>
		<nav class="text-xs font-bold">
			<nuxt-link to="/how-it-works" class="mr-10">HOW IT WORKS</nuxt-link>
		</nav>
	</header>
</template>
<script type="text/javascript">
import Logo from './Logo';
export default {
	components: { Logo }
};
</script>
