import React from "react";
import {Form,Input,Tree} from "antd";
import menuList from "../../config/menuConfig";
import PropTypes from 'prop-types'


const { TreeNode } = Tree;
const Item = Form.Item


export default class AuthForm extends React.Component{
    static propTypes ={
        role:PropTypes.object
    }
    constructor (props) {
        super(props)
        const {menus} = this.props.role
        this.state = {
            checkedKeys: menus
        }
    }
    getMenus = () =>  this.state.checkedKeys

     onCheck = (checkedKeys) => {
        this.setState({
            checkedKeys
        })
    };


    getTreeNodes = (menuList) =>{
        return menuList.reduce((pre,item)=>{
            pre.push(
                <TreeNode title={item.title} key={item.key}>
                    {item.children?this.getTreeNodes(item.children):null}
                </TreeNode>
            )
            return pre
        },[])
    }

    componentWillReceiveProps(nextProps, nextContext) {
        const menus =  nextProps.role.menus
        this.setState({
            checkedKeys:menus
        })

    }

    componentWillMount() {
        this.treeNodes = this.getTreeNodes(menuList)
    }

    render() {
        const {role}  =this.props
        const {checkedKeys} = this.state

        return(
            <div>
                <Item label='角色名称:' labelCol={{span: 4}}  wrapperCol={{ span: 15 }} >
                        <Input value={role.name} disabled/>
                </Item>

                <Tree
                    checkable
                    defaultExpandAll={true}
                    checkedKeys={checkedKeys}
                    onCheck={this.onCheck}
                >
                    <TreeNode title='平台权限'>
                        {this.treeNodes}
                    </TreeNode>
                </Tree>

            </div>
        )
    }
}
