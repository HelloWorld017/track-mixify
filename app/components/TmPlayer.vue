<template>
	<div class="TmPlayer">
		<tm-player-file v-if="playing.type === 'file'" :file="playing.file" @end="nextQueue"/>
		<tm-player-youtube v-else-if="playing.type === 'youtube'" :id="playing.id" @end="nextQueue"/>
	</div>
</template>

<style lang="less" scoped>
	.TmPlayer {
		
	}
</style>

<script>
	export default {
		computed: {
			current() {
				return this.$store.state.current;
			},
			
			playing() {
				return this.$store.state.playing;
			}
		},
		
		methods: {
			playpause() {
				this.$store.commit('setPlaying', !this.playing);
			},
			
			nextQueue() {
				this.$store.dispatch('next');
			}
		}
	};
</script>
