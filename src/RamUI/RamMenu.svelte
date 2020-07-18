<script>
    export let title="";
    export let menus=[];
    export let style="";
</script>

<nav class="menu" style="{style}">
<span class="title">{title}</span>
{#if menus.length>0}
<ul class="subMenu">
{#each menus as menu}
<li><a href="{menu['link']}">{menu['title']}</a></li>
{/each}
</ul>
{/if}
</nav>

<style>
.menu{
    padding:0.5rem 1rem;
    background-color: #fff;
    position: absolute;
    top:0;
    left:0;
    right:0;
    z-index: 10000;
    box-shadow: 0 2px 1px -1px rgba(0,0,0,.2), 0 1px 1px 0 rgba(0,0,0,.14), 0 1px 3px 0 rgba(0,0,0,.12);
}
.title{
    font-weight: bold;
    line-height: 2;
}
.subMenu{
    float:right;
    list-style: none;
    margin: 0;
    padding:0;
}
.subMenu li{
    float:left;
    padding:0.5rem 1rem;
    cursor: pointer;
}
a{
    padding:0.2rem 0.3rem;
    border-radius: 0.2rem;
    text-decoration: none;
}
a:hover{
   background-color: #ccc;
}
</style>