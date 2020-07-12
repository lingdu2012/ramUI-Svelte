<script>
 export let txt="按钮";
 export let type="button";
 export let style="";
 export let btn="primary";

</script>

<button class="{btn}" type="{type}" style="{style}" on:click>{txt}</button>
<style>
button{
    color: #fff;
    cursor: pointer;
    margin: 0;
    padding: 0;
    border: 1px solid transparent; 
    outline: none;
    padding: 0.375rem 0.75rem;
    font-size: 0.9375rem;
    line-height: 1.5;
    -webkit-appearance: button;
    text-transform: none;
    background-color: #fff;
}

button:hover{
    opacity: 0.7;
}

.primary{
    background-color: #2780E3;
    border-color: #2780E3;
}
.primary-outline{
    color: #2780E3;
    border-color: #2780E3;
}

.secondary{
    background-color: #373a3c;
    border-color: #373a3c;
}
.secondary-outline{
    color: #373a3c;
    border-color: #373a3c;
}
.success{
    background-color: #3FB618;
    border-color: #3FB618;
}
.success-outline{
    color: #3FB618;
    border-color: #3FB618;
}
.info{
   
    background-color: #9954BB;
    border-color: #9954BB;
}
.info-outline{
    color: #9954BB;
    border-color: #9954BB;
}
.warning{
    background-color: #FF7518;
    border-color: #FF7518;
}
.warning-outline{
    color: #FF7518;
    border-color: #FF7518;
}
.danger{
    background-color: #FF0039;
    border-color: #FF0039;
}
.danger-outline{
    color: #FF0039;
    border-color: #FF0039;
}
.link{
    font-weight: 400;
    color: #2780E3;
    text-decoration: none;
}
</style>