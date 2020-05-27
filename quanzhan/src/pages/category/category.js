import React   from "react";
import {Card, Button, Icon, Table, message,Modal} from 'antd';
import LinkButton from "../../components/linkButton";
import {reqCategory,reqAddCategory,reqUpdateCategory} from "../../api";
import AddForm from "./add-form";
import UpdateForm from "./update-form";

export default class Category extends React.Component{
    state = {
        loading:false,
        category:[],
        subCategory:[],
        parentId:'0',
        parentName:'',
        showStatus:'0'
}

    initColumns = () =>{
         this.columns = [
            {
                title: '分类的名称',
                dataIndex: 'name',
            },
            {
                title: '操作',
                width:300,
                render: (categorys) => (
                    <span>
                        <LinkButton onClick={()=>this.showUpDate(categorys)}>修改分类</LinkButton>
                        {this.state.parentId==='0'? (<LinkButton onClick={()=>this.showSubCategory(categorys)}>查看子分类</LinkButton>):null}
                    </span>
                )

            }]
    };
    showCategory = () =>{
        this.setState({
            parentId:'0',
            parentName:'',
            subCategory:[]
        })
    }
    showSubCategory = (categorys) =>{
        this.setState({
            parentId: categorys._id,
            parentName: categorys.name
        },()=> {
                this.getCategory()
        }
    )
    }
    //展示品类
    getCategory = async (parentId) =>{
        this.setState({loading:true})
        parentId = parentId || this.state.parentId
        const result = await reqCategory(parentId)
        this.setState({loading:false})
        if(result.status===0){
            const category = result.data;
            if(parentId ==='0'){
                this.setState({
                    category:category
                })
            }else{
                this.setState({
                    subCategory:category
                })
            }

        }else {
            message.error('获取分类列表失败')
    }
    }
    showAdd = () =>{
        this.setState({
            showStatus:1
        })
    }
    //增加品类
    addCategory = () =>{

        this.form.validateFields(async (err,values)=>{
            if(!err){
                this.setState({
                    showStatus:0
                })

                const {parentId,categoryName} = values
                this.form.resetFields();
                const result = await reqAddCategory(categoryName,parentId)
                if(result.status===0){
                    if(parentId=== this.state.parentId){
                        this.getCategory()
                    }else {
                        this.getCategory('0')
                    }
                }
            }
        })
    }
    showUpDate = (category) =>{
        this.categorys = category
        this.setState({
            showStatus:2
        })
    }
    //修改品类
    updateCategory =  () =>{
        console.log('updateCategory()')

        this.form.validateFields(async (err,values)=>{
            if(!err){
                this.setState({
                    showStatus:0
                })

                const categoryId = this.categorys._id
                const {categoryName} = values

                const result = await reqUpdateCategory({categoryId,categoryName})
                if(result.status === 0){
                    this.getCategory()
                }
            }
        })

    }

    handleCancel = () =>{
        this.setState({
            showStatus: 0
        })
    }
    componentWillMount() {
        this.initColumns()
    }
    componentDidMount() {
        this.getCategory()
    }

    render() {
        const {category,loading,subCategory,parentId,parentName,showStatus} =this.state;
        const categorys = this.categorys|| {};
        const title = parentId==='0'?'一级列表分类':(
            <span>
                <LinkButton onClick={this.showCategory}>一级分类列表</LinkButton>
                <Icon type='arrow-right' style={{marginRight:'5px'}}/>
                <span>{parentName}</span>
            </span>);
        const extra = (
            <Button type='primary' onClick={this.showAdd} >
                <Icon type='plus'/>
                添加
            </Button>
        )


        return(

            <Card title={title} extra={extra} >
                <Table
                    bordered
                    rowKey='_id'
                    loading={loading}
                    dataSource={parentId==='0'? category:subCategory}
                    columns={this.columns}
                    pagination={{defaultPageSize:4,showQuickJumper:true}}
                />;
                <Modal
                    title="添加分类"
                    visible={showStatus===1}
                    onOk={this.addCategory}
                    onCancel={this.handleCancel}
                >
                    <p>添加界面</p>
                    <AddForm
                        category={category}
                        parentId={parentId}
                        setForm={(form)=>this.form=form}
                    />


                </Modal>
                <Modal
                    title="更新分类"
                    visible={showStatus===2}
                    onOk={this.updateCategory}
                    onCancel={this.handleCancel}
                >
                    <p>更新的界面</p>
                    <UpdateForm
                        categoryName={categorys.name}
                        setForm={(form)=>this.form=form}
                    />
                </Modal>
            </Card>
        )
    }
}