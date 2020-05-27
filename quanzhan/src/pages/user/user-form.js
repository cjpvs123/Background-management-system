import React from 'react';
import {
    Form,
    Select,
    Input
} from 'antd'
import PropTypes from 'prop-types'
const Item =Form.Item;
const Option =Select.Option

class UserForm extends React.PureComponent{

    componentWillMount() {
        this.props.setForm(this.props.form)
    }
    static propTypes ={
        roles:PropTypes.array.isRequired,
        user:PropTypes.object.isRequired,
        setForm:PropTypes.func.isRequired
    }

    render() {
        const { getFieldDecorator } = this.props.form
        const {roles,user}  =this.props
        const formItemLayout = {
            labelCol:{span:4},
            wrapperCol:{span:18}
        }
        return(
            <Form {...formItemLayout}>

                <Item label='用户名：'>
                    {
                        getFieldDecorator('username', {
                            initialValue:user.username,
                        })
                        (
                            <Input placeholder='请输入用户名称'/>
                        )
                    }
                </Item>
                {
                    user._id? null : (
                        <Item label='密码：'>
                            {
                                getFieldDecorator('password', {
                                    initialValue:user.password,
                                })
                                (
                                    <Input placeholder='请输入密码'/>
                                )
                            }
                        </Item>
                    )
                }

                <Item label='手机号：'>
                    {
                        getFieldDecorator('phone', {
                            initialValue:user.phone,
                        })
                        (
                            <Input placeholder='请输入手机号'/>
                        )
                    }
                </Item>
                <Item label='邮箱：'>
                    {
                        getFieldDecorator('email', {
                            initialValue:user.email,
                        })
                        (
                            <Input placeholder='请输入你的邮箱'/>
                        )
                    }
                </Item>
                <Item label='角色：'>
                    {
                        getFieldDecorator('role_id', {
                            initialValue:user.role_id
                        })
                        (
                            <Select>
                                {
                                    roles.map((item)=>(
                                            <Option value={item._id} key={item._id}>{item.name}</Option>
                                        )
                                    )
                                }
                            </Select>
                        )
                    }
                </Item>
            </Form>
        )
    }
}

export default Form.create()(UserForm)