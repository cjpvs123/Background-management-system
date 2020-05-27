import React from "react";
import memoryUtils from "../../utils/memoryUtils";
import { Layout } from 'antd';
import LeftNav from "../../components/left-nav";
import Header from "../../components/header";
import {Switch,Redirect,Route} from 'react-router-dom'
import {router4Component} from "../../utils/router4Component";
import {arrayRemove} from "../../utils/arrayRemove";
import NotFound from "../not-found/not-found";


const { Footer, Sider, Content } = Layout

class Admin extends React.Component{
    componentWillMount() {
        let user = memoryUtils.user;
        console.log(user)

        if (Object.keys(user).length === 0) {
            user = {role: {menus: []}};
        }

        if(user.username === 'admin'){
            const menus = user.role.menus
            if (menus.length === 0) {
                //   将对象router4Component 进行key的提取，返回值为一堆数据，然后全部放进menus中
                menus.push(...Object.keys(router4Component))
            }
        }
        //   浅拷贝menus，因为left-nav需要用的menus，所以不能改变menus，否则'/charts'和'/products'会不被渲染
        const menus = this.menus = [...user.role.menus];

        arrayRemove(menus, '/charts');
        arrayRemove(menus, '/products');
        arrayRemove(menus, '/0-0');
    }


    render() {
        const user = memoryUtils.user;
        if(!user||!user._id){
            return<Redirect to='/login' />
        }

        return(
            <Layout style={{minHeight:'100%'}}>
                <Sider>
                    <LeftNav/>
                </Sider>
                <Layout>
                    <Header/>
                    <Content style={{margin:'20px',background:'#fff'}}>
                        <Switch>
                            <Redirect  from='/' to='/home'  exact/>
                            {this.menus.map((elm => {
                                return <Route path={elm} component={router4Component[elm]} key={elm} />
                            }))}
                            <Route component={NotFound}/>
                        </Switch>
                    </Content>
                    <Footer style={{textAlign:'center',color:'#cccccc'}}>推荐使用谷歌浏览器，可以获得更佳页面操作体验</Footer>
                </Layout>
            </Layout>
        )
    }
}
export default Admin
