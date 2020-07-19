<script>
export let style="";
</script>
<div class="container" style="{style}">
    <div class="header">
        <slot name="header"></slot>
    </div>
    <div class="area">
        <div class="aside">
            <slot name="aside"></slot>
        </div>
        <div class="content">
            <div class="footer">
                <slot name="footer" ></slot>
            </div>
            <div class="main">
                <slot name="main" ></slot>
            </div>
           
        </div>
    </div>
</div>

<style>
.container{
    display: -webkit-flex; /* Safari */
    display: flex;
    overflow: hidden;
    flex-direction: column;

}
.header{
    flex: 0 0 auto;
    overflow: hidden;
}
.area{
    flex: 1 1 auto;
    flex-direction: row;
    display: -webkit-flex; /* Safari */
    display: flex;
}
.aside{
    flex:0 0  auto;
    min-width: 1rem;
    overflow: hidden;
}
.content{
    flex:1 1 auto;
    flex-direction: column-reverse;
    display: -webkit-flex; /* Safari */
    display: flex;
}
.footer{
    flex:0 0 auto;
    min-height:1rem;
}
.main{
    flex:1 1 auto;
}
</style>