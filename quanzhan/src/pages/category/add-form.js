import React from 'react';
import {
    Form,
    Select,
    Input
} from 'antd'
import PropTypes from 'prop-types'
const Item =Form.Item;
const Option = Select.Option

class AddForm extends React.Component{
    componentWillMount() {
        this.props.setForm(this.props.form)
    }
    static propTypes ={
        setForm:PropTypes.func.isRequired,
        category:PropTypes.array.isRequired,
        parentId:PropTypes.string.isRequired,
    }

    render() {
        const { getFieldDecorator } = this.props.form
        const {category,parentId}  =this.props
        return(
            <Form>
                <Item>
                    {
                        getFieldDecorator('parentId', {
                            initialValue:parentId
                        })
                        (
                            <Select>
                                <Option value='0'>一级分类</Option>
                                {
                                    category.map((item)=>(
                                        <Option value={item._id}>{item.name}</Option>
                                        )
                                    )
                                }
                            </Select>
                        )
                    }
                </Item>
                <Item>
                    {
                        getFieldDecorator('categoryName', {
                            initialValue:'',
                            rules:[
                                {required:true,message:'分类名称必须输入'}
                            ]
                        })
                        (
                            <Input placeholder='请输入分类名称'/>
                        )
                    }
                </Item>
            </Form>
        )
    }
}

export default Form.create()(AddForm)