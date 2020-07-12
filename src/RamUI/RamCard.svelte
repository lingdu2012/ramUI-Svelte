<script>
    export let title="";
    export let mark="";
    export let style="";
</script>
<div class="card" style="{style}">
   {#if title.length>0}
    <div class="title">
    {title}
    </div>
   {/if}
    <slot></slot>
    {#if mark.length>0}
    <div class="mark">
    {mark}
    </div>
   {/if}
</div>


<style>
.card{
    padding:1rem;
    border-radius: 0.2rem;
    box-shadow: 0 2px 1px -1px rgba(0,0,0,.2), 0 1px 1px 0 rgba(0,0,0,.14), 0 1px 3px 0 rgba(0,0,0,.12);
}
.title{
   padding-bottom:0.5rem;
   border-bottom: 1px dashed #CCC;
    font-weight: bold;
}
.mark{
    padding-top:0.5rem;
    border-top: 1px dashed #CCC;
}
</style>