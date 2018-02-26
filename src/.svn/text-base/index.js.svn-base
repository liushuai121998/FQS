import React from 'react';
import ReactDOM from 'react-dom';
import { createHashHistory} from 'history'
import { Router, Route, useRouterHistory} from 'react-router'

//import 'bootstrap/dist/css/bootstrap.css';
import 'antd/dist/antd.css'
import './index.css';
//import App from './App'
import Login from './login'		// 登录
//import UserManage from './userManage'	// 用户管理
//import DeptManage from './deptManage'	// 部门管理
//import LogSearch from './logSearch'		// 日志查询
//import ClientStastic from './clientStastic'	// 客户端统计

//import TableContent from './tableContent'	// 查询页面
//import registerServiceWorker from './registerServiceWorker';

// 去除#后的字符
let appHistory = useRouterHistory(createHashHistory)({queryKey:false});

let tableContent = (location, cb) => {
	require.ensure([], require => {
    	cb(null, require('./tableContent').default);
 	}, 'tableContent');
}
let manage = (location, cb) => {
	require.ensure([], require => {
    	cb(null, require('./App').default);
 	}, 'App');
}

let user = (location, cb) => {
	require.ensure([], require => {
    	cb(null, require('./userManage').default);
 	}, 'userManage');
}
let dept = (location, cb) => {
	require.ensure([], require => {
    	cb(null, require('./deptManage').default);
 	}, 'deptManage'); 
}
let log = (location, cb) => {
	require.ensure([], require => {
    	cb(null, require('./logSearch').default);
 	}, 'logSearch'); 
}
let client = (location, cb) => {
	require.ensure([], require => {
    	cb(null, require('./clientStastic').default);
 	}, 'clientStastic'); 
}
let compareData = (location, cb) => {
	require.ensure([], require => {
    	cb(null, require('./compareData').default);
 	}, 'compareData'); 
}

ReactDOM.render((

		<Router history={appHistory}>
			{/*登录*/}
		    <Route path="/" component={Login}>
			    
		    </Route>
		    <Route path='/compare' getComponent={compareData}></Route>
		    {/*航班查询*/}
		    <Route path='/search' getComponent={tableContent}></Route>
			{/*后台管理*/}
			<Route path='/user' getComponents={manage}>
				<Route path='/usermanage' getComponents={user}></Route>
				<Route path='/deptmanage' getComponents={dept}></Route>
				<Route path='/logsearch' getComponents={log}></Route>
				<Route path='/clientstastic' getComponents={client}></Route>
			</Route>
	  </Router>

), document.getElementById('root'));


//registerServiceWorker();
