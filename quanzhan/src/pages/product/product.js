import React   from "react";
import {Switch,Route,Redirect} from "react-router-dom";
import Home from "./home";
import Detail from "./detail";
import Add_Update from "./add-update";
import './product.less'


export default class Product extends React.Component{
    render() {
        return(
            <Switch>
                <Route path='/product' component={Home} exact/>
                <Route path='/product/addupdate' component={Add_Update}/>
                <Route path='/product/detail' component={Detail}/>
                <Redirect to='/product'/>
            </Switch>
        )
    }
}