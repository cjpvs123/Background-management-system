import React   from "react";
import {Table, Card, Input, Icon, Button, Select, message} from "antd";
import LinkButton from "../../components/linkButton";
import {PAGE_SIZE} from "../../utils/constants";
import {reqProducts,reqSearchProducts,reqUpdateStatus} from '../../api'


const  Option = Select.Option

export default class Home extends React.Component{
    state = {
        products:[],
        total:'',
        loading:false,
        searchName:'',
        searchType:'productName'
    }
    initColumns = () =>{
         this.columns = [
            {
                title: '商品名称',
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: '商品描述',
                dataIndex: 'desc',
                key: 'des',
            },
            {
                title: '价格',
                dataIndex: 'price',
                key: 'price',
                render:(price)=> '¥'+ price

            },
            {
                width:100,
                title: '状态',

                render:(product)=> {
                    const {_id,status} = product
                    const newStatus = status === 1 ? 2 : 1

                    return(
                        <span>
                            <Button
                                type='primary'
                                onClick={()=>this.updateStatus(_id,newStatus)
                                }>
                                {status===1?'下架':'上架'}
                            </Button>
                            <span>{status===1?'在售':'下架'}</span>
                        </span>
                    )
                }
            },
            {
                width:100,
                title: '操作',
                render:(product)=>{
                    return(
                        <span>
                            <LinkButton onClick={()=>this.props.history.push('/product/detail',{product})}>详情</LinkButton>
                            <LinkButton onClick={()=>this.props.history.push('/product/addupdate',product)}>修改</LinkButton>
                        </span>
                    )
                }
            },
        ];
    }

    getProducts = async (pageNum)=>{
        this.pageNum = pageNum
        const {searchName,searchType} = this.state
        this.setState({loading:true})
        let result
        if(searchName){
             result =await  reqSearchProducts({pageNum,pageSize:PAGE_SIZE,searchName,searchType})
        }
        else {
             result = await reqProducts(pageNum,PAGE_SIZE)
        }
        this.setState({loading:false})
        if(result.status===0){
            const {total,list} =result.data
            this.setState({
                total,
                products:list
            })
        }
    }

    updateStatus = async (productId,status) =>{
        const result = await reqUpdateStatus(productId,status)
        if(result.status === 0){
            message.success('更新商品成功')
            this.getProducts(this.pageNum)
        }
    }


    componentWillMount() {
        this.initColumns()
    }
    componentDidMount() {
        this.getProducts(1)
    }


    render() {
        const {products,total,loading,searchType,searchName} = this.state
        const columns =this.columns

        const title = (
            <span>
                    <Select value={searchType}
                            style={{width:150}}
                            onChange={value => {this.setState({searchType:value})} }
                    >
                        <Option value='productName'>按名称搜索</Option>
                        <Option value='productDesc'>按描述搜索</Option>
                    </Select>
                    <Input
                        placeholder='关键字'
                        value={searchName}
                        style={{width:150,margin:'0 15px'}}
                        onChange={event => {this.setState({searchName:event.target.value})}}
                    />
                    <Button type='primary' onClick={()=>this.getProducts(1)}>搜索</Button>
            </span>


        )
        const extra = (
            <Button type='primary'
                    onClick={() => this.props.history.push('/product/addupdate')}>
                <Icon type='plus'/>
                添加商品
            </Button>
        )
        return(
            <Card title={title} extra={extra}>
                <Table
                    dataSource={products}
                    columns={columns}
                    bordered={true}
                    loading={loading}
                    rowKey='_id'
                    pagination={{
                        current: this.pageNum,
                        defaultPageSize:PAGE_SIZE,
                        showQuickJumper:true,
                        total:total,
                        onChange:this.getProducts
                    }}
                />;
            </Card>
        )
    }
}