import React   from "react";
import {Card, Button, Table, Modal, message} from 'antd'
import {PAGE_SIZE} from "../../utils/constants";
import {reqRoles,reqAddRole,reqUpdateRole} from "../../api";
import AddFrom from './add-form'
import AuthForm from './auth-form'
import memoryUtils from "../../utils/memoryUtils";
import {formateDate} from "../../utils/dateUtils";
import storageUtils from "../../utils/storageUtils";

export default class Role extends React.Component{
    state = {
        roles:[],
        role:{},
        isAddRole:false,
        isUpdateRole:false
    }
    constructor(props) {
        super(props);

        this.auth =React.createRef()
    }
    showAddRole = () =>{
        this.setState({
            isAddRole:true
        })
    }
    showUpdateRole = () =>{
        this.setState({
            isUpdateRole:true
        })
    }

    updateRole = async () =>{


        const role = this.state.role
        const menus  = this.auth.current.getMenus()
        role.menus = menus
        role.auth_time = Date.now()
        role.auth_name = memoryUtils.user.username
        const  result = await reqUpdateRole(role)
        if(result.status === 0) {
            if(role._id===memoryUtils.user.role_id){
                memoryUtils.user = {}
                storageUtils.removeUser()
                this.props.history.replace('/login')
                message.success('当前用户角色设置成功')
            }
            else {
                message.success('设置角色权限成功!')
                this.getRoles()
            }
            }


        else {
            message.error('设置角色权限失败!')
        }
        this.setState({
            isUpdateRole:false
        })


    }

    addRole =  () =>{
        this.setState({
            isAddRole:false
        })

        this.form.validateFields(async (err,values)=>{
            if(!err){
                const {roleName}=values
                this.form.resetFields()
                const result = await reqAddRole(roleName)
                console.log(result)
                if(result.status === 0){
                    message.success('添加角色成功!')
                    const role = result.data
                    console.log(role)
                    this.setState((state)=>({
                        roles:[...state.roles,role]
                    }))
                }
                else {
                    message.error('添加角色失败!')
                }

            }
        })
        this.setState({
            isSetRole:false
        })
    }

    handleCancelAddRole = () =>{
        this.setState({
            isAddRole:false
        })
        this.form.resetFields()
    }

    handleCancelUpdateRole = () =>{
        this.setState({
            isUpdateRole:false
        })
    }

    getRoles = async () =>{
        const result = await reqRoles()
        if(result.status === 0){
            const roles = result.data
            this.setState({
                roles
            })
        }

    }

    onRow = (role) =>{
            return {
                onClick: event => {
                    this.setState({
                        role
                    })
                }, // 点击行
            };

    }

    initColumns = () =>{
        this.columns =[
            {
                title:'角色分类',
                dataIndex: 'name',
            },
            {
                title:'创建时间',
                dataIndex: 'create_time',
                render:(create_time)=>formateDate(create_time)
            },
            {
                title:'授权时间',
                dataIndex: 'auth_time',
                render:formateDate
            },
            {
                title: '授权人',
                dataIndex: 'auth_name',
            }

        ]
    }

    componentWillMount() {
        this.initColumns()
    }
    componentDidMount() {
        this.getRoles()
    }

    render() {
        const {roles,role,isAddRole,isUpdateRole} =this.state
        const title = (
            <span>
                <Button
                    type='primary'
                    style={{marginRight:15}}
                    onClick={this.showAddRole}
                >创建角色</Button>
                <Button
                    type='primary'
                    disabled={!role._id}
                    onClick={this.showUpdateRole}
                >设置角色权限</Button>
            </span>
        )
        return(
            <Card title={title} >
                <Table
                    bordered
                    rowKey='_id'
                    dataSource={roles}
                    columns={this.columns}
                    pagination={{defaultPageSize:PAGE_SIZE}}
                    rowSelection={{
                        type:"radio",
                        selectedRowKeys:[role._id],
                        onSelect: (role)=>{
                            this.setState({role})
                        }
                    }}
                    onRow={this.onRow}
                />;
                <Modal
                    title="添加角色"
                    visible={isAddRole}
                    onOk={this.addRole}
                    onCancel={this.handleCancelAddRole}

                >
                    <AddFrom
                        setForm={(form) => this.form = form}
                    />
                </Modal>
                <Modal
                    title="设置权限权限"
                    visible={isUpdateRole}
                    onOk={this.updateRole}
                    onCancel={this.handleCancelUpdateRole}
                >
                    <AuthForm role={role} ref={this.auth}/>
                </Modal>
            </Card>
        )
    }
}