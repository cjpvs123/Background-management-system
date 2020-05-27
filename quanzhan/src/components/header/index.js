import React from "react";
import './index.less';
import {formateDate} from '../../utils/dateUtils';
import {withRouter} from 'react-router-dom';
import menuList from "../../config/menuConfig";
import memoryUtils from "../../utils/memoryUtils";
import storageUtils from "../../utils/storageUtils";
import {Modal} from "antd";
import LinkButton from '../../components/linkButton'
import {reqWeather} from '../../api'

class Header extends React.Component{
    state = {
        currentTime :formateDate(Date.now()),
        dayPictureUrl:'',
        weather:''
    }
    getTime = () =>{
        this.intervalId =  setInterval(()=>{
            const currentTime = formateDate(Date.now());
            this.setState({currentTime})
        },1000)
    }
    getTitle = () =>{
        let path = this.props.location.pathname;
        if(path.indexOf('/product')===0){
            path='/product'
        }
        let title;
        menuList.forEach(item=>{
            if (item.key===path){
                title = item.title

            }else if (item.children) {
                const cItem = item.children.find(cItem => cItem.key===path);
                if(cItem) {
                    title = cItem.title
                }
            }
                })
        return title
    }
    logout = () =>{
        Modal.confirm({
            content:'确定退出吗?',
            onOk:()=>{
                console.log('OK',this);

                storageUtils.removeUser();
                memoryUtils.user = {};


                this.props.history.replace('/login')
            }

        })

    }

    getWeather = async () =>{
        const {dayPictureUrl,weather} =await reqWeather('北京')
        this.setState({dayPictureUrl,weather})
    }

    componentDidMount() {
    this.getTime();
    this.getWeather()
    }

    componentWillMount() {
    clearInterval(this.intervalId)
    }

    render() {
        const {currentTime, dayPictureUrl, weather} = this.state;

        const username = memoryUtils.user.username
        const title = this.getTitle()
        return(
            <div className='header'>
               <div className='header-top'>
                    <span>欢迎,{username}</span>
                   <LinkButton onClick={this.logout}>退出</LinkButton>
               </div>
                <div className='header-bottom'>
                    <div className='header-bottom-left'>{title}</div>
                    <div className='header-bottom-right'>
                        <span>{currentTime}</span>
                        <img src={dayPictureUrl} alt="weather"/>
                        <span>{weather}</span>
                    </div>
                </div>
            </div>
        )
    }
}
export default withRouter(Header)