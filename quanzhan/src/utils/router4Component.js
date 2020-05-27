import Home from "../pages/home/home";
import User from "../pages/user/user";
import Bar from "../pages/charts/bar";
import Line from "../pages/charts/line";
import Pie from "../pages/charts/pie";
import Role from "../pages/role/role";
import Category from "../pages/category/category";
import product from "../pages/product/product";

export const router4Component = {
    '/home': Home,
    '/product': product,
    '/category': Category,
    '/role': Role,
    '/user': User,
    '/charts/bar': Bar,
    '/charts/line': Line,
    '/charts/pie':Pie
}