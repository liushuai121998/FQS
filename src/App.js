import React, { Component } from 'react'
//import ReactDOM from 'react-dom';
import {Icon, Dropdown, Menu} from 'antd'
import {Link} from 'react-router'

import globalService from './global.js'
import './App.css'
import smallLogo from './img/logo_small.png'

//ReactDOM.unmountComponentAtNode()

let {UpdateForm, confirmModal, sessionManage, appHistory, getSearchJson, successMsg, warningMsg, showLoading, hideLoading, getSyncJson, heartWatch} = globalService	
const MenuItem = Menu.Item
class Manage extends Component {
	constructor (props) {
		super(props)

		this.state = {
			// 修改密码的form表单框
			formModal: false,
			userName: sessionManage.getItem('userName'),
			updateDataModal: false,
			loading: true,
			activeKey: '1'
		}
	}
	/**
	 * 显示修改密码的模态框
	 */
	showUpdatePw (ev) {
		ev.preventDefault()
		this.setState({
			formModal: true
		})
	}
	/**
	 * 同步数据
	 */
	resetData (ev) {
		ev.preventDefault()

		confirmModal(this.confirmUpdate.bind(this, true), this.confirmUpdate.bind(this, false), '确定同步数据吗？')
		
	}
	/**
	 * 退出登录
	 */
	logOut (ev) {
		ev.preventDefault()
		confirmModal(this.confirmLogout.bind(this, true), this.confirmLogout.bind(this, false), '确定退出系统吗？')
	}
	/**
	 * 确定退出
	 */
	confirmLogout (isConfirm) {
		if(isConfirm) {
			getSearchJson('delete', '/API/token', '', (res) => {
				if(res.status === 1000) {
					// 退出系统
					appHistory.push({
						pathname: '/'
					})
					sessionManage.removeItem('token')
					sessionManage.removeItem('admin')
					sessionManage.removeItem('userName')
				}
			})
		}
	}
	/**
	 * 确定同步数据
	 */
	confirmUpdate (isConfirm) {
		if(isConfirm) {
			// 调用数据同步的接口
			showLoading('正在同步, 请稍后...')
			getSyncJson('post', '/API/sync', '', (res) => {
				hideLoading()
//				console.log(res)
				if(res.status === 1000) {
					successMsg('同步成功')
				} else {
					warningMsg('同步失败')
				}
			})
		}
	}
	setActiveKey (pathName) {
		let pathObj = {
			usermanage: '1',
			deptmanage: '2',
			logsearch: '3',
			clientstastic: '4'
		}
		
		this.setState({
			activeKey: pathObj[pathName]
		})
	}
	componentWillMount () {
		
		let pathName = this.props.location.pathname
		if(pathName) {
			pathName = pathName.slice(1)
			this.setActiveKey(pathName)
		}
		
	}
	
	componentDidMount () {
		
		window.onpopstate = (ev) => {
			// 点击前进后退
			let hash = document.location.hash
			if(hash) {
				if(hash.indexOf('#/') >= 0) {
					hash = hash.slice(2)
				} else {
					hash = hash.slice(1)
				}
				
				this.setActiveKey(hash)
			}
		}
		
		this.setState({
			loading: false
		})
		heartWatch(() => {
			
		}, false)
	}
	render () {
		const menu = sessionManage.getItem('admin') === 'true' ? (
			<Menu>
			    <MenuItem>
			      <a onClick={this.showUpdatePw.bind(this)}><i className='search-icon' style={{color: '#1AA094', marginRight: '5px'}}>&#xe602;</i>修改密码</a>
			    </MenuItem>
			    <MenuItem>
			      <a onClick={this.resetData.bind(this)}><i className='search-icon' style = {{color: '#1AA094', marginRight: '5px'}}>&#xe723;</i>数据同步</a>
			    </MenuItem>
			    <MenuItem>
			      <a onClick={this.logOut.bind(this)}><i className='search-icon' style={{color: '#D81E06', marginRight: '5px'}}>&#xe601;</i>退出系统</a>
			    </MenuItem>
			</Menu>
		) : (
			<Menu>
			    <MenuItem>
			      <a onClick={this.showUpdatePw.bind(this)}><i className='search-icon' style={{color: '#1AA094', marginRight: '5px'}}>&#xe602;</i>修改密码</a>
			    </MenuItem>
			    <MenuItem>
			      <a onClick={this.logOut.bind(this)}><i className='search-icon' style={{color: '#D81E06', marginRight: '5px'}}>&#xe601;</i>退出系统</a>
			    </MenuItem>
			</Menu>
		)
		return (

			<div className='content_wrap'>
				<div className='nav_list'>
					<div className='header_logo'>
						<img src={smallLogo} className='header_img'/>
						<span className='header_title'>航班查询系统</span>
					</div>
					<Menu mode="horizontal" selectedKeys={[this.state.activeKey]}>
			          <MenuItem key='1'>
			            <Link to='usermanage'>用户管理</Link>
			          </MenuItem>
			          <MenuItem key='2'>
			            <Link to='deptmanage'>部门管理</Link>
			          </MenuItem>
			          {/*<MenuItem key='3'>
			            <Link to='logsearch'>日志查询</Link>
			          </MenuItem>*/}
			          <MenuItem key='4'>
			            <Link to='clientstastic'>客户端统计</Link>
			          </MenuItem>
	        		</Menu>
	        		<div className='user_info'>
	        			<Dropdown overlay={menu} trigger={['click']}>
						    <a style={{ textDecoration: "none", color: '#fff'}}  ><Icon type="user" style={{ fontSize: "15px"}} /> {this.state.userName} </a>
						</Dropdown>
	        		</div>
					<UpdateForm loginThis={this} />
					{/*数据同步的消息提示框*/}
					{/*
					  * 	<Modal visible={this.state.updateDataModal} onOk={this.confirmUpdate.bind(this, true)} onCancel={this.confirmUpdate.bind(this, false)} title='提示信息'>
						<div>确定同步数据吗?</div>					          
					</Modal>*/}
				</div>
				<div className='info_wrap'>
					{this.props.children}
				</div>
			</div>
		)
	}
}


export default Manage