<script>
    export let type='';
    export let style='';
    let mtype="";
    $: if(type){
        mtype="-"+type;
    }

</script>

<div class="container{mtype}" style="{style}">
    <slot></slot>
</div>