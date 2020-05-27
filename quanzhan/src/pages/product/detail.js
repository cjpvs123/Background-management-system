import React   from "react";
import { Card,List,Icon } from 'antd';
import LinkButton from "../../components/linkButton";
import {BASE_IMG_URL} from "../../utils/constants";
import {reqCategorys} from '../../api'

const Item = List.Item
export default class Detail extends React.Component{
    state = {
        cName1 : '',
        cName2 : ''
    }

    async componentDidMount () {
        const {pCategoryId,categoryId}=this.props.location.state.product

        if(pCategoryId==='0'){
            const result =await reqCategorys(categoryId)
            const cName1 = result.data.name
             this.setState({cName1})
        }else {
            const result = await Promise.all([reqCategorys(pCategoryId),reqCategorys(categoryId)])
            const cName1 = result[0].data.name
            const cName2 = result[1].data.name
            this.setState({cName1,cName2})
        }
    }

    render() {
        console.log(this.props)
        const {cName1,cName2} = this.state
        const {name,desc,price,detail,imgs}=this.props.location.state.product
        const title = (
            <span>
                <LinkButton>
                    <Icon
                        type='arrow-left'
                        style={{marginRight:10,fontSize:20}}
                        onClick={()=>this.props.history.goBack()}
                    />
                </LinkButton>
                <span>商品详情</span>
            </span>

        )
        return(
            <Card title={title}  className='product-detail'>
                <List>
                    <Item>
                        <span className='left'>商品名称:</span>
                        <span>{name}</span>
                    </Item>
                    <Item>
                        <span className='left'>商品描述:</span>
                        <span>{desc}</span>
                    </Item>
                    <Item>
                        <span className='left'>商品价格:</span>
                        <span>{price}元</span>
                    </Item>
                    <Item>
                        <span className='left'>商品分类:</span>
                        <span>{cName1}{cName2? '-->'+cName2 :''}</span>
                    </Item>
                    <Item>
                        <span className='left'>商品图片:</span>
                        <span>{
                            imgs.map(img=>(
                                <img
                                    key={img}
                                    className='product-img'
                                    src={BASE_IMG_URL+img}
                                    alt={img}
                                />
                            ))
                        }</span>
                    </Item>
                    <Item>
                        <span className='left'>商品详情:</span>
                        <span dangerouslySetInnerHTML={{__html:detail}}/>
                    </Item>

                </List>

            </Card>
        )
    }
}