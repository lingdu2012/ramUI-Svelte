<script>
    import 'bootstrap/dist/css/bootstrap.min.css';
    import RamContainer from '../src/components/Container.svelte';
    import RamRow from '../src/components/Row.svelte';
    import RamCol from '../src/components/Col.svelte';
    import RamTable from '../src/components/Table.svelte';
    
    export let name;


    let ths=['序号',"姓名","学号"];
    let cols=[0,1,2];
    let data=[[1,'张三','10001'],[2,'李四','10002']];
    let cols2=['ind','username','nums'];
    let data2=[{
        ind:1,
        username:'小明',
        nums:'10003'
    },{
        ind:2,
        username:'小红',
        nums:'10004'
    }];

</script>

<main>
	<h1>Hello ,{name}!</h1>
    <RamContainer type="fluid">
     <RamRow exClass="row-cols-auto">
        <RamCol rowNum="3"><button type="button" class="btn btn-primary">Primary</button></RamCol>
        <RamCol rowNum="3"><button type="button" class="btn btn-secondary">Secondary</button></RamCol>
        <RamCol><button type="button" class="btn btn-success">Success</button>
        <button type="button" class="btn btn-danger">Danger</button>
        </RamCol>
     </RamRow>
    <RamTable>
        <thead slot="thead">
            <tr>
                <th scope="col">#</th>
                <th scope="col">First</th>
                <th scope="col">Last</th>
                <th scope="col">Handle</th>
            </tr>
        </thead>
        <tbody slot="tbody">
            <tr>
                <th scope="row">1</th>
                <td>Mark</td>
                <td>Otto</td>
                <td>@mdo</td>
            </tr>
                <tr>
                <th scope="row">2</th>
                <td>Jacob</td>
                <td>Thornton</td>
                <td>@fat</td>
                </tr>
                <tr>
                <th scope="row">3</th>
                <td colspan="2">Larry the Bird</td>
                <td>@twitter</td>
            </tr>
        </tbody>
    </RamTable>
    <RamTable ths={ths} cols="{cols}" data="{data}" exClass="table-striped"></RamTable>
    <RamTable ths={ths} cols="{cols2}" data="{data2}" exClass="table-hover"></RamTable>
    </RamContainer>
 

</main>