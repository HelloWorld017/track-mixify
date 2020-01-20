<template>
	<div class="TmPlayer">
		<div class="TmPlayer__player" v-if="current">
			<tm-player-file v-if="current.type === 'file'" :file="current.file" @end="nextQueue"/>
			<tm-player-youtube v-else-if="current.type === 'youtube'" :id="current.id" @end="nextQueue"/>
		</div>
		<div class="TmPlayer__player TmPlayer__player--placeholder" v-else>
			Skip 버튼을 눌러 시작하세요!
		</div>
		<div class="TmPlayer__buttons">
			<a @click="nextQueue">
				Skip
			</a>
		</div>
	</div>
</template>

<style lang="less" scoped>
	.TmPlayer {
		flex: 1;
		display: flex;
		flex-direction: column;

		&__player {
			flex: 1;

			&--placeholder {
				display: flex;
				align-items: center;
				justify-content: center;
				font-family: 'Noto Sans CJK KR', sans-serif;
				font-size: 2rem;
				font-weight: 100;
				color: #a0a0a0;
			}
		}
		
		&__buttons {
			display: flex;

			a {
				cursor: pointer;
				background: #202020;
				border-radius: 3px;
				box-sizing: border-box;
				color: #f1f2f3;
				font-family: 'Noto Sans CJK KR', sans-serif;
				font-size: 1.2rem;
				padding: 10px 20px;
				margin: 10px;
			}
		}
	}
</style>

<script>
	import TmPlayerFile from "./TmPlayerFile.vue";
	import TmPlayerYoutube from "./TmPlayerYoutube.vue";

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
		},

		components: {
			TmPlayerFile,
			TmPlayerYoutube
		}
	};
</script>
