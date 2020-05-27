import React   from "react";
import {Card, Input, Icon, Form, Cascader, Button, message} from "antd";
import LinkButton from "../../components/linkButton";
import {reqCategory,reqAddOrUpdateProduct} from "../../api";
import PicturesWall from "./pictures-wall";
import RichTextEditor from './rich-text-editor'


const Item = Form.Item
const TextArea = Input.TextArea


class Add_Update extends React.Component{
    constructor(props) {
        super(props);

        this.pw = React.createRef()
        this.editor = React.createRef()
    }

    state = {
        options:[]
    };
    initOptions = async (category) =>{
        const options = category.map(item=>(
            {
                value: item._id,
                label: item.name,
                isLeaf: false,
            })
        )
        const{isupdate,product} = this
        const{pCategoryId} =product
        if(isupdate&&pCategoryId!=='0'){
            const subCategory =await this.getCategory(pCategoryId)
            const childOption = subCategory.map(item=>({
                value: item._id,
                label: item.name,
                isLeaf: true,
            }))
            const targetOption =options.find(option => option.value===pCategoryId)
            targetOption.children=childOption
        }

        this.setState({
            options
        })


    }


    getCategory = async (parentId) =>{
        const result  = await  reqCategory(parentId)
        if(result.status === 0){
            const category = result.data
            if(parentId === '0'){
                this.initOptions(category)
            }
            else {
                return category
            }
        }
    }

    loadData = async selectedOptions => {
        const targetOption = selectedOptions[0];
        targetOption.loading = true;
        const subCategory = await this.getCategory(targetOption.value)
        targetOption.loading = false;
        if(subCategory && subCategory.length>0){
            const childOptions = subCategory.map(item => ({
                    value: item._id,
                    label: item.name,
                    isLeaf: true
                })
            )
            targetOption.children = childOptions
        }
        else{
            targetOption.isLeaf =  true
        }
        this.setState({
            options: [...this.state.options],
        });
    }


    submit = () =>{
        this.props.form.validateFields(async (err,values)=>{
            if(!err){
                const {name,desc,price,categoryIds} = values
                let pCategoryId,categoryId
                if(categoryIds.length===1){
                     pCategoryId = '0'
                     categoryId = categoryIds[0]
                }
                else {
                     pCategoryId = categoryIds[0]
                     categoryId = categoryIds[1]
                }
                const imgs = this.pw.current.getImgs()
                const detail = this.editor.current.getDetail()
                const product = {name,desc,price,imgs,detail,pCategoryId,categoryId}
                if(this.isupdate){
                     product._id = this.product._id
                }
                const result  = await reqAddOrUpdateProduct(product)
                if(result.status === 0){
                    message.success(`${this.isupdate?'更新':'添加'}商品成功！`)
                    this.props.history.goBack()
                }
                else {
                    message.error(`${this.isupdate?'更新':'添加'}商品失败！`)
                }
            }
        })
    }
    validatePrice = (rule,value,callback) =>{
        if(value*1 >0){
            callback()
        }
        else {
            callback('价格必须大于0')
        }

    }
    componentDidMount() {
        this.getCategory('0')
    }
    componentWillMount() {
        const product = this.props.location.state
        this.isupdate =  !!product
        this.product = product || {}
    }

    render() {
        const {isupdate,product} =this
        const {pCategoryId,categoryId,imgs,detail} =product
        const categoryIds = []
        if(isupdate){
            if(pCategoryId==='0'){
                categoryIds.push(categoryId)
            }
            else{
                categoryIds.push(pCategoryId);
                categoryIds.push(categoryId);
            }
        }
        const title = (
            <span>
                <LinkButton onClick={()=>this.props.history.goBack()}>
                    <Icon type="arrow-left" style={{marginRight:8}}/>
                    <span>{isupdate?'修改商品':'添加商品'}</span>
                </LinkButton>
            </span>
        )
        const formItemLayout = {
            labelCol: { span: 2 },
            wrapperCol: { span: 8 },
        };
        const {getFieldDecorator} =this.props.form
        return(

                <Card title={title} extra=''>
                    <Form {...formItemLayout}>
                        <Item label='商品名称:'>
                            {
                                getFieldDecorator('name', {
                                    initialValue: product.name,
                                    rules: [
                                        {required: true, message: '必须输入商品名称'}
                                    ]
                                })(<Input placeholder='请输入商品名称'/>)
                            }

                        </Item>
                        <Item label='商品描述:'>
                            {
                                getFieldDecorator('desc', {
                                    initialValue: product.desc,
                                    rules: [
                                        {required: true, message: '必须输入商品描述'}
                                    ]
                                })(<TextArea placeholder='请输入商品描述' autoSize={{ minRows: 2, maxRows: 6 }}/>)
                            }

                        </Item>
                        <Item label='商品价格:'>
                            {
                                getFieldDecorator('price', {
                                    initialValue: product.price,
                                    rules: [
                                        {required: true, message: '必须输入商品价格'},
                                        {validator:this.validatePrice}
                                    ]
                                })(<Input type='Number' addonAfter='元' placeholder='请输入商品价格'/>)
                            }

                        </Item>
                        <Item label='商品分类:'>
                            {
                                getFieldDecorator('categoryIds', {
                                    initialValue: categoryIds,
                                    rules: [
                                        {required: true, message: '必须输入商品分类'},
                                    ]
                                })(<Cascader
                                    placeholder='请指定商品分类'
                                    options={this.state.options}
                                    loadData={this.loadData}
                                />)
                            }
                        </Item>
                        <Item label='商品图片:'>
                           <PicturesWall ref={this.pw} imgs={imgs} />
                        </Item>
                        <Item label='商品详情:' labelCol={{span: 2}}  wrapperCol={{ span: 20 }} >
                            <RichTextEditor ref={this.editor} detail={detail}/>
                        </Item>
                        <Item>
                            <Button type='primary' onClick={()=>this.submit()}>提交</Button>
                        </Item>

                    </Form>

                </Card>


        )
    }
}
export default Form.create()(Add_Update)