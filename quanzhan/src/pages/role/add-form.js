import React from "react";
import {Form,Input} from "antd";
import PropTypes from 'prop-types'


const Item = Form.Item
class AddFrom extends React.Component{
    static propTypes ={
        setForm:PropTypes.func.isRequired
    }
    componentWillMount() {
        this.props.setForm(this.props.form)
    }

    render() {
        const {getFieldDecorator} = this.props.form

        return(
                <Form>
                    <Item label='角色名称:' labelCol={{span: 4}}  wrapperCol={{ span: 15 }} >
                    {
                        getFieldDecorator('roleName',{
                            initialValue:'',
                            rules:[
                                {required:true,message:'请输入角色名称'}
                                ]
                            }
                        )(<Input placeholder='请输入角色名称'/>)
                    }
                    </Item>
                </Form>
            )
    }
}
export default Form.create()(AddFrom)