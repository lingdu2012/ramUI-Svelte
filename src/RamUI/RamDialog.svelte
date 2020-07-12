<script>

export let show=false;
let display='none';

$:if(show){
    display='block';
}else{
    display='none';
}

function maskControl(){
    display='none';
    show=false;
}
</script>

<div class="mask-layer" style="display:{display}" on:click="{maskControl}">

</div>
<div class="dialog-layer" style="display:{display}">
    <div class="dialog-nav">对话框<span class="dialog-close" on:click="{maskControl}">X</span></div>
</div>

<style>
.mask-layer{
    position: absolute;
    top:0;
    left:0;
    bottom:0;
    right:0;
    width:100%;
    height:100%;
    background-color: rgba(0,0,0, 0.8);
    z-index: 1000;
}
.dialog-layer{
    min-width: 10rem;
    min-height: 10rem;
    background-color: #fff;
    position: absolute;
    z-index: 1001;
    top:50%;
    left:50%;
    border-radius: 0.2rem;
    transform: translateX(-50%) translateY(-50%);
}
.dialog-nav{
    line-height: 1.5;
    padding:0.5rem 1rem;
}
.dialog-close{
    float:right;
    font-weight: bold;
    cursor: pointer;
}
</style>