import React   from "react";
import {Card, Table, Modal, Button, message} from "antd";
import {PAGE_SIZE} from "../../utils/constants";
import {reqAddOrUpdateUser, reqRoles, reqUsers, reqUsersDelete} from '../../api/index'
import {formateDate} from "../../utils/dateUtils";
import LinkButton from "../../components/linkButton";
import UserForm from "./user-form";



export default class User extends React.Component{
    state = {
        users:[],
        roles:[],
        isShow:false
    }
    showAdd = () =>{
        this.user = {}
        this.setState({
            isShow:true
        })

    }

    showUpdate = (user) =>{
        this.user = user
        this.setState({
            isShow:true
        })
    }

    deleteUser=  (user) =>{
        Modal.confirm({
            title: `你确定要删除${user.username}吗? `,
            onOk: async ()=> {
                const result = await reqUsersDelete(user._id)
                if(result.status === 0){
                    message.success('删除用户成功!')
                    this.getUsers()
                }
            },
        });

    }

    getUsers = async () =>{
        const result = await reqUsers()
        console.log(result)
        if(result.status === 0) {
            this.setState({
                users:result.data.users,
                roles:result.data.roles
            })
            console.log(this.state.roles)
        }

    }

    addOrUpdateUser =  async () =>{

        const user =this.form.getFieldsValue()
        this.form.resetFields()
        if(this.user){
             user._id=this.user._id
        }
        const result =await reqAddOrUpdateUser(user)
        if(result.status === 0){
            message.success(`${user._id? '修改':'创建'}用户成功！`)
            this.getUsers()
        }
        else {
            message.error(`${user._id? '修改':'创建'}用户失败！`)
        }

        this.setState({
            isShow:false
        })
    }
    initColumns = () =>{
        this.columns = [
            {
                title:'用户名',
                dataIndex:'username'
            },
            {
                title:'邮箱',
                dataIndex:'email'
            },
            {
                title:'电话',
                dataIndex:'phone'
            },
            {
                title:'注册时间',
                dataIndex:'create_time',
                render:formateDate
            },
            {
                title: '所属角色',
                dataIndex:'role_id',
                render:(role_id)=> this.state.roles.find(role=>role._id===role_id).name

            },
            {
                title: '操作',
                dataIndex:'',
                render:(user)=>(
                    <span>
                        <LinkButton onClick={() => this.showUpdate(user)}>修改</LinkButton>
                        <LinkButton onClick={() => this.deleteUser(user)}>删除</LinkButton>
                    </span>
                )
            },
        ]
    }

    componentDidMount() {
        this.getUsers()
    }

    componentWillMount() {
        this.initColumns()
    }

    render() {
        const {isShow,users,roles} = this.state
        const title = (
            <span>
                <Button type='primary' onClick={this.showAdd}>创建用户</Button>
            </span>
        )

        return(
            <Card title={title}  >
                <Table
                    bordered
                    rowKey='_id'
                    dataSource={users}
                    columns={this.columns}
                    pagination={{defaultPageSize:PAGE_SIZE}}
                />
                <Modal
                    title="添加分类"
                    visible={isShow}
                    onOk={this.addOrUpdateUser}
                    onCancel={()=>{
                        this.form.resetFields()
                        this.setState({
                            isShow: false
                        })
                    }}
                >
                <UserForm
                    setForm={(form)=>this.form=form}
                    roles={roles}
                    user={this.user}
                />
                </Modal>
            </Card>
        )
    }
}
