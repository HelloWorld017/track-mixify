<template>
	<div class="TmQueue">
		<div class="TmQueue__item" v-for="(queue, index) in queues">
			<span class="TmQueue__item__no">
				{{index + 1}}
			</span>
			<div class="TmQueue__item__content">
				<span class="TmQueue__item__title">
					{{queue.title}}
				</span>

				<span class="TmQueue__item__owner">
					by {{queue.owner}}
				</span>
			</div>
		</div>
	</div>
</template>

<style lang="less" scoped>
	.TmQueue {
		background: #f1f2f3;
		font-family: 'Noto Sans CJK KR', sans-serif;
		font-size: 1.2rem;
		color: #202020;
		width: 20vw;

		&__item {
			display: flex;
			align-items: center;
			padding: 20px 10px;

			&__no {
				font-size: 1.3rem;
				font-weight: 800;
				margin-right: 10px;
			}

			&__content {
				display: flex;
				flex-direction: column;
				flex: 1;
				overflow: hidden;
			}

			&__title {
				font-size: 1rem;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
			}

			&__owner {
				font-size: .8rem;
			}
		}
	}
</style>

<script>
	export default {
		computed: {
			queues() {
				return this.$store.state.queue;
			}
		}
	};
</script>

