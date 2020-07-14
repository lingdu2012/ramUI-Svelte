<script>
    import { onMount } from 'svelte';
    import { spring } from 'svelte/motion';
    
    //export let autoRest=false;

function pannable(node) {
	let x;
	let y;

	function handleMousedown(event) {
		x = event.clientX;
		y = event.clientY;

		node.dispatchEvent(new CustomEvent('panstart', {
			detail: { x, y }
		}));

		window.addEventListener('mousemove', handleMousemove);
		window.addEventListener('mouseup', handleMouseup);
	}

	function handleMousemove(event) {
		const dx = event.clientX - x;
		const dy = event.clientY - y;
		x = event.clientX;
		y = event.clientY;

		node.dispatchEvent(new CustomEvent('panmove', {
			detail: { x, y, dx, dy }
		}));
	}

	function handleMouseup(event) {
		x = event.clientX;
		y = event.clientY;

		node.dispatchEvent(new CustomEvent('panend', {
			detail: { x, y }
		}));

		window.removeEventListener('mousemove', handleMousemove);
		window.removeEventListener('mouseup', handleMouseup);
	}

	node.addEventListener('mousedown', handleMousedown);

	return {
		destroy() {
			node.removeEventListener('mousedown', handleMousedown);
		}
	};
}

    const coords = spring({ x: 0, y: 0 }, {
		stiffness: 0.2,
		damping: 0.4
    });

	function handlePanStart() {
		coords.stiffness = coords.damping = 1;
	}

	function handlePanMove(event) {
		coords.update($coords => ({
			x: $coords.x + event.detail.dx,
			y: $coords.y + event.detail.dy
        }));
    }

	function handlePanEnd(event) {
		coords.stiffness = 0.2;
		coords.damping = 0.4;
		//coords.set({ x: 0, y: 0 });
	}

  
</script>

<div class="drag-layer" 
    use:pannable
	on:panstart={handlePanStart}
	on:panmove={handlePanMove}
	on:panend={handlePanEnd}
	style="transform:
		translate({$coords.x}px,{$coords.y}px)"
    >
<slot></slot>
</div>

<style>
.drag-layer{
    position: absolute;
    z-index:1000;
    top:0;
    left:0;
    min-width: 10rem;
    min-height: 10rem;
    border:0.1rem dashed #CCC;
    cursor: move;
}
</style>