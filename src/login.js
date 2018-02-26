import React, {Component} from 'react'

import {Form, Input, Button, Checkbox, Icon} from 'antd'

import {createHashHistory } from 'history'
import {useRouterHistory} from 'react-router'

import globalService from './global.js'
import './login.css'

import logo from './img/logo.png'

const FormItem = Form.Item

let {cookieManage, UpdateForm, successMsg, warningMsg, getSearchJson, sessionManage, logOut, showLoading, hideLoading, confirmModal, confirmModalArr} = globalService	

// 去除#后的字符
let appHistory = useRouterHistory(createHashHistory)({queryKey:false});

 class Login extends Component {
	constructor (props) {
		super(props)
		
		this.loginBtnClick = this.loginBtnClick.bind(this)
		this.userNameChange = this.userNameChange.bind(this)
		this.passwordChange = this.passwordChange.bind(this)
		// 状态
		this.state = {
			userName: cookieManage.getCookie('userName') || '',
			password: cookieManage.getCookie('password') || '',
			//remember: (cookieManage.getCookie('remember') === 'true' ? true : false),
			// 修改密码的form表单框
			formModal: false,

		}
	}
	//登录
	loginBtnClick () {
		
		this.props.form.validateFields((err, values) => {
	      if (!err) {
	      	// 校验通过
	        let param = {
				userName: values.userName,
				password: values.password
			}
//	        if(param.password === 'Xsjc123.') {
//	        	// 弹出修改密码的弹出框
//				
//				
//	        }
			
	        // values.remember
			getSearchJson('post', '/API/token', param, (res) => {
//				showLoading()
//				console.log(res)
				if(res.status === 1000) {
					
					if(res.data === '您无权访问本系统!') {
						
						// 弹出修改密码的弹出框

					} else {
//						hideLoading()
//						console.log(res.data.token)
						// 登录成功之后跳转页面{
						appHistory.push({
							pathname: '/search'
						})
						sessionManage.setItem('userName', values.userName)
						sessionManage.setItem('token', res.data.token)
						sessionManage.setItem('admin', res.data.admin)
						//  cookie
						//if(values.remember) {
							// 记住密码和用户名
							//cookieManage.setCookie('userName', values.userName, 30)
							//cookieManage.setCookie('password', values.password, 30)
							//cookieManage.setCookie('remember', values.remember, 30)
						//} else {
							// 删除
							//if(cookieManage.hasCookie('userName')) {
								//cookieManage.removeCookie('userName')
								//cookieManage.removeCookie('password')
								//cookieManage.removeCookie('remember')
							//}
						//}
					}
					
				} else if(res.status === 1001) {
					warningMsg('用户名或密码不存在, 请重新输入')
				} else if (res.status === 9999) {
					if(res.data.indexOf("初始化密码") >= 0) {
						this.initPwd = values.password
						this.resetPwd = true
						
						confirmModal(() => {
							this.setState({
								formModal: true
							})
						}, () => {
							this.setState({
								formModal: false
							})
						}, '您使用的是初始化密码,需要修改密码, 您确定修改密码吗?')
						
					} else if (res.data.indexOf('禁用') >= 0) {
						warningMsg("用户已禁用,请联系管理员启用")
						
					}
					return
				} 
			}, (error) => {
				if(error.status === 401) {
					logOut('无权限, 请退出重新登录')
				} else if(error.status === 404) {
					warningMsg('无服务')
				}
			})
	      }
	   });
		
}
	// 监听输入的change事件
	userNameChange (ev) {
		this.setState({
			userName: ev.target.value
		})
	}
	passwordChange (ev) {
		this.setState({
			password: ev.target.value
		})
	}
	componentWillMount () {
		hideLoading()
	}
	componentDidMount () {
		console.log('hello didMount....', confirmModalArr)
		/**
		 * 退出之后将所有的模态框都销毁
		 */
		confirmModalArr.forEach(item => {
			item && item.destroy()
		})
		
	}
	// 渲染
	render () {

		const {getFieldDecorator} = this.props.form
		
		return (
			<div className='login_wrap'>
			
				<div className='login'>
					<div className='login_logo clearfix'>
						<img alt='logo' src={logo} className='logo_img'/>
						<span className='login_title'>航班查询系统</span>
					</div>
					<div className='login_form'>
						<Form>
							<FormItem>
					          {getFieldDecorator('userName', {
					          	initialValue: this.state.userName,
					            rules: [{ required: true, message: '请输入用户名' }],
					          })(
					            <Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="用户名" onChange={this.userNameChange} autoComplete="off"/>
					          )}
					        </FormItem>
					        <FormItem>
					          {getFieldDecorator('password', {
					          	initialValue: this.state.password,
					            rules: [{ required: true, message: '请输入密码' }],
					          })(
					            <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="密码" onChange={this.passwordChange} autoComplete="off"/>
					          )}
					        </FormItem>
					        {/*<FormItem>
					          {getFieldDecorator('remember', {
					            valuePropName: 'checked',
					            initialValue: this.state.remember,
					          })(
					            <Checkbox name="rememberPass">记住我</Checkbox>
					          )}
					          
					        </FormItem>*/}
					        <FormItem>
					        	<Button type="primary" htmlType="submit" className="login-form-button" style={{width: '100%', background: '#0AB068', borderColor: '#0AB068'}} onClick={this.loginBtnClick}>
						            登录
						        </Button>
					        </FormItem>
						</Form>					
					</div>
				</div>
				{/*修改密码的表单框*/}
				<UpdateForm loginThis={this}/>
			</div>
		)
	}
}

Login = Form.create()(Login)
export default Login




