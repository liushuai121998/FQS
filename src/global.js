//import Stomp from 'stompjs'
import axios from 'axios'
import {createHashHistory } from 'history'
import {useRouterHistory} from 'react-router'

import React, {Component} from 'react';
import {Modal, Form, Button, Input} from 'antd';

// 配置文件
//import config from './config/config.json'
let config = window.config
let Stomp = window.Stomp
let SockJS = window.SockJS

//console.log(config)
let {serviceUrl, searchUrl, rabitMqUrl, rabbitMQDebug, compareUrl, heartTime, host, aord, dori, flightStatus, reGetInitData, syncDataUrl, loadingTime, showLen, resetInit, refreshData, reConnectMQCount} = config	// syncDataUrl 同步数据的地址
reConnectMQCount = reConnectMQCount || 10
//let serviceUrl = 'http://192.168.6.221:8580/fqs-admin-service'

//let serviceUrl = 'http://192.168.6.221:8580/fqs-admin-service'
//let searchUrl = 'http://192.168.6.221:8580/fqs-query-service'
//
//let rabitMqUrl = '192.168.1.22'
//
//let heartTime = '300000'		//心跳机制时间
//
//let host = '/QUERY'
    // cookie的操作
// 去除#后的字符
let appHistory = useRouterHistory(createHashHistory)({queryKey:false});

const FormItem = Form.Item    
/**
 * window resize
 * @param {Object} callback
 */
function windowResize (callback) {
	
	window.onresize = function () {
		callback && callback()
	}
}

// 全局提示
const modalInfo = (title, content, okText, okCallback) => {
	let info = Modal.info({
		title: title,
		content: content,
		okText: okText || '知道了',
		onOk: okCallback
	})
}

const successMsg = (msg, time) => {
	//message.success(msg);
	time = time || 2000
	let info = Modal.success({
		title: '消息提示',
		content: msg
	})
	setTimeout(() => {
		info.destroy()
	}, time)
}

const errorMsg = (msg) => {
//message.error(msg);
  let info = Modal.error({
		title: '消息提示',
		content: msg
	})
  
}
const warningMsg = (msg, time) => {
	time = time || 2000
//message.warning(msg);
  let info = Modal.warning({
		title: '消息提示',
		content: msg,
	})
  
	setTimeout(() => {
		info.destroy()
	}, time)
}
// 保存confirm的modal
let confirmModalArr = []

const confirmModal = (okCallback, cancelCallback, msg) => {
	let info = Modal.confirm({
			title: '消息提示',
			content: msg,
			onOk: okCallback,
			onCancel: cancelCallback,
			okText: '确定',
			okType: 'primary',
			cancelText: '取消',
			cancelType: 'default'
		})
	
	confirmModalArr.push(info)
}

const logOut = (str) => {
	str = str || '连接中断, 请退出重新连接'
	confirmModal(() => {
                	appHistory.push({
                		pathname: '/'
                	})
                	sessionManage.removeItem('admin')
                	sessionManage.removeItem('token')
                	sessionManage.removeItem('userName')
                	hideLoading()	
                	
                	globalService.disConnect()
                	
                	// 停止心跳
                	if(heartWatch.timeId != null) {
                		clearInterval(heartWatch.timeId)
                	}
                	
                	
                }, () => {}, str)
}
const errorLogOut = () => {
	// 退出到登录页
    appHistory.push({
                		pathname: '/'
                	})
                	sessionManage.removeItem('admin')
                	sessionManage.removeItem('token')
                	sessionManage.removeItem('userName')
                	hideLoading()
    globalService.disConnect()
    
    // 停止心跳
    if(heartWatch.timeId != null) {
        clearInterval(heartWatch.timeId)
   	}
}
//缓存封装
let localManage = {
	setItem:function(key,value){
		if(typeof value === 'object') {
			value = JSON.stringify(value)
		}
	    localStorage.setItem(key,value);
	}, 
	getItem:function(key){
		let item = localStorage.getItem(key) || ''
		if(item.indexOf('[') === 0 || item.indexOf('{') === 0) {
			item = JSON.parse(item)
		}
	    return  item;
	},
	removeItem:function(key){
	    localStorage.removeItem(key);
	}
};
let sessionManage = {
	setItem:function(key,value){
		if(typeof value === 'object') {
			value = JSON.stringify(value)
		}
	    sessionStorage.setItem(key,value);
	}, 
	getItem:function(key){
		let item = sessionStorage.getItem(key) || ''
		if(item.indexOf('[') === 0 || item.indexOf('{') === 0) {
			item = JSON.parse(item)
		}
	    return  item;
	},
	removeItem:function(key){
	    sessionStorage.removeItem(key);
	}
};
let cookieManage = {
        /**
         * 设置cookie
         */
        setCookie(cname, cvalue, exdays) {
            let d = new Date()
            d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000)) // 过期时间
            let expires = 'expires=' + d.toUTCString()
            document.cookie = cname + "=" + cvalue + "; " + expires;
        },
        /**
         * 获取cookie
         */
        getCookie(cname) {
            let name = cname + "=";
            let ca = document.cookie.split(';');
            for (let i = 0, len = ca.length; i < len; i++) {
                let c = ca[i];
                while (c.charAt(0) === ' ') c = c.substring(1);
                if (c.indexOf(name) !== -1) {
                    var cnameValue = c.substring(name.length, c.length);
                    return cnameValue;
                }
            }
            return ''
        },
        /**
         * 删除cookie
         */
        removeCookie(cname) {
            this.setCookie(cname, "", -1)
        },
        /**
         * 是否存在
         */
        hasCookie(cname) {
        	if(this.getCookie(cname)) {
        		return true
        	} else {
        		return false
        	}
        }
    }
    /**
     * 表单模态框
     */
class UpdateForm extends Component {
	constructor (props) {
		super(props)
		this.state = {
			confirmDirty: false
		}
	}
	/**
	 * 确认修改密码
	 */
	updatePassword (isConfirm) {
		if(isConfirm) {
			this.props.form.validateFields((err, values) => {
				if(!err) {
					let param = {}
					if(this.props.loginThis.resetPwd) {
						param = {
							newPassWord: values.password,
							userName: this.props.loginThis.state.userName,
							oldPassWord: this.props.loginThis.initPwd,
							confirmPassWord: values.confirm
						}
						console.log(param)
						// 发送请求
						globalService.getJson('put', '/API/users/resetPwd', param, (res) => {
							if(res.status === 1000) {
								this.props.loginThis.setState({
									formModal: false
								})
								successMsg('修改成功')
							} else {
								warningMsg('修改失败')
							}
						})
					} else {
						param = {
							newPassWord: values.password,
							confirmPassWord: values.confirm
						}
						globalService.getJson('put', '/API/users/modifyPwd', param, (res) => {
							if(res.status === 1000) {
								this.props.loginThis.setState({
									formModal: false
								})
								successMsg('修改成功')
							} else {
								warningMsg('修改失败')
							}
						})
					}
					// 重置表单数据
					this.props.form.resetFields()
				}
			})
			
		} else {
			
			this.props.loginThis.setState({
				formModal: false
			})
					
			// 重置表单数据
			this.props.form.resetFields()
		}

	}
	/**
	 * 确认密码失去焦点
	 */
	handleConfirmBlur (e){
	    const value = e.target.value;
	    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
	}
	/**
	 * check密码
	 */
	checkPassword (rule, value, callback){
	    const form = this.props.form;
	    if (value && value !== form.getFieldValue('password')) {
	      callback('两次输入的密码不一致');
	    } else {
	      callback();
	    }
	  }
	/**
	 * 确认密码
	 */
	checkConfirm (rule, value, callback) {
	    const form = this.props.form;
	    console.log(this.props)
	    if (value && this.state.confirmDirty) {
	      form.validateFields(['confirm'], { force: true });
	    }
	    callback();
	  }
	render () {
		const {getFieldDecorator} = this.props.form
		const formItemLayout = {
	      labelCol: {
	        xs: { span: 24 },
	        sm: { span: 6 },
	      },
	      wrapperCol: {
	        xs: { span: 24 },
	        sm: { span: 14 },
	      },
	    };
		return (
			<Modal visible={this.props.loginThis.state.formModal} title='修改密码' footer={null} onCancel={() => {this.props.loginThis.setState({formModal: false})}}>
					<Form>
						<FormItem {...formItemLayout}
				          label="用户名:">
							<div>{this.props.loginThis.state.userName}</div>
						</FormItem>
						<FormItem {...formItemLayout}
				          label="角色:">
							<div>{sessionManage.getItem('admin') === 'true' ? "管理员" : "普通用户"}</div>
						</FormItem>
				        <FormItem
				          {...formItemLayout}
				          label="新密码:"
				          hasFeedback
				        >
				          {getFieldDecorator('password', {
				            rules: [{
				              required: true, message: '请输入密码',
				            }, {
				              validator: this.checkConfirm.bind(this),
				            }, {
				              min: 8,	// 密码8位以上
				              message: '密码长度8位及以上'
				            }, {
				            	// 大写字母	小写字母		数字 符号
				              pattern: /^((?=.*[a-z])(?=.*[A-Z])(?=.*[\d])(?=.*\W).\S{7,})$/g,
				              message: '密码必须由大写字母、小写字母、数字以及符号组成'
				            }],
				          })(
				            <Input type="password" />
				          )}
				        </FormItem>
				        <FormItem
				          {...formItemLayout}
				          label="确认密码:"
				          hasFeedback
				        >
				          {getFieldDecorator('confirm', {
				            rules: [{
				              required: true, message: '请输入确认密码',
				            }, {
				              validator: this.checkPassword.bind(this),
				            }],
				          })(
				            <Input type="password" onBlur={this.handleConfirmBlur.bind(this)} onPressEnter={(e) => {
				            	e.preventDefault()

				            	this.updatePassword.call(this, true)
				            	
				            }} />
				          )}
				        </FormItem>
				        <FormItem
				        >
				          <div style={{textAlign: 'center'}}>
							<Button type='default' onClick={this.updatePassword.bind(this, false)}>
							    取消
							</Button>
							<Button type="primary" htmlType="submit" style={{marginLeft: '20px'}}  onClick={this.updatePassword.bind(this, true)}>
							    保存
							</Button>
				          </div>
				        </FormItem>
					</Form>
				</Modal>
		)
	}
}
UpdateForm = Form.create()(UpdateForm)

let isFirst = true
let isSearchFirst = true
/**
 * 心跳监测
 */
let heartWatch = (callback, isQuery) => {
			let param = isQuery ? 'getSearchJson' : 'getJson'
			// 心跳监测
			heartWatch.timeId = setInterval(() => {

				globalService[param]('post', '/API/token/heartbeat', '', (res) => {
					if(res.data.indexOf('重新获取令牌') >= 0) {
						
						clearInterval(heartWatch.timeId)
						// 不是首页
						if(window.location.pathname !== '/') {
							confirmModal(() => {
								appHistory.push({
									pathname: '/'
								})
							}, () => {}, '连接中断, 请退出重新连接')
	
							callback && callback()
						}
						
					}
				}, (error) => {
					if(error.status === 504) {
						callback && callback()
					}
				})
			}, heartTime)
			
	}
let globalService = {
    /**
     * ws连接
     * @param {Object} mqName	mq的名称
     * @param {Object} fn	回调函数
     */
    "wsConnect" (mqName, successFn, errorFn) {
        let connect = () => {
        	// 初始化 ws 对象
        	if (window.location.search == '?ws') {
		        var ws = new WebSocket('ws://' + rabitMqUrl + ':15674/ws');
		     } else {
		     	console.log('heoollll ws.........')
		        var ws = new SockJS('http://' + rabitMqUrl + ':15674/stomp');
		     }
            // 获得Stomp client对象
            let client = Stomp.over(ws);
            globalService.client = client
            // 定义连接成功回调函数
            let on_connect = function(x) {
                //data.body是接收到的数据
                client.subscribe(mqName, function(data) {
                    var msg = data.body;
                    // 接受到消息数据调用callback
                    successFn && successFn(data.body)
                });
            };
            // 定义错误时回调函数
            let on_error = function(err) {
                console.log('error', err);
                errorFn && errorFn()
            };
            client.heartbeat.outgoing = 0;
			client.heartbeat.incoming = 0;
			
            client.debug = function (str) {
            	console.log(str)
            }
            
//          
			if(rabbitMQDebug) {	// 不显示debug
				client.debug = null	
			}
            
            // 连接RabbitMQ
            client.connect('fqsquery', 'fqsquery123', on_connect, on_error, host);
//			admin/topsci123456
//			client.connect('admin', 'topsci123456', on_connect, on_error, host);
			
        }
        connect()
        console.log(">>>连接上ws");
    },
	/*
	 * 断开rabitMq连接
	 */
    disConnect: () => {
    	
    	globalService.client && globalService.client.disconnect(() => {
			console.log('断开rabitMq的连接')
		})
    	
    },
    serviceUrl: serviceUrl,
    // 发送请求
    getJson(method, url, data, callback, errorCallback) {
    	let token = sessionManage.getItem('token');
    	
//  	if(!token) {
//  		errorLogOut()
//  		return
//  	}
    	
    	let isGetData = false
    	axios.defaults.headers.common['token'] = token
//  	axios.defaults.headers.common['Content-Type'] = 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW';
//      // 设置token
//      axios.interceptors.request.use(function (config) {
//		        var token = sessionManage.getItem('token');
//		        if (token) {
//		            config.headers["token"] = token;
//		        }
//		            return config;
//		       }, function (error) {  
//		            return Promise.reject(error);
//	    });
	       
    	if(method === 'get') {
    		axios.get(serviceUrl + url, {
    			params: data
    		})
		    .then((res) => {
//		    	showLoading()
				isGetData = true
		    	callback(res.data)
		    })
		    .catch((err) => {
				if(err.response) {
				
					errorCallback && errorCallback(err.response)
				}
		    	
		    })
    	} else if (method === 'delete') {
    		axios.delete(serviceUrl + url, {
    			params: data
    		})
		    .then((res) => {

				isGetData = true
		    	callback(res.data)
		    })
		    .catch((err) => {

		    	if(err.response) {
					errorCallback && errorCallback(err.response)
				}
		    	
		    })
    	} else {
    		let config = {
            method: method,
            url: serviceUrl + url,
            data: data,
            requestHeader: {
                'Content-Type': 'application/json',
                "Accept": "*/*",
                "Accept-Encoding": "gzip, deflate"
            	}
        	}
	        axios(config)
	            .then((res) => {
//	            	showLoading()
					isGetData = true
	                callback(res.data)
	            })
	            .catch((err) => {

	                if(err.response) {
						errorCallback && errorCallback(err.response)
					}
	            })
    	}
    	setTimeout(() => {
    		if(!isGetData && isFirst) {
    			hideLoading()
    			warningMsg("请求超时")
    			isFirst = false
    		}
    	}, loadingTime)
    },
    getSyncJson(method, url, data, callback, errorCallback) {
    	let token = sessionManage.getItem('token');
    	// 没有token直接输入查询页面地址, 回退到首页
    	if(!token && url !== '/API/token' && method !== 'post') {
    		appHistory.push({
                pathname: '/'
            })
    		return
    	}
    	let isGetData = false
    	axios.defaults.headers.common['token'] = token
//  	axios.defaults.headers.common['Content-Type'] = 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW';
//      // 设置token
//      axios.interceptors.request.use(function (config) {
//		        var token = sessionManage.getItem('token');
//		        console.log(token)
//		        if (token) {
//		            config.headers["token"] = token;
//		        }
//		            return config;
//		       }, function (error) {  
//		            return Promise.reject(error);
//	        });
	    let config = {
	            method: method,
	            url: syncDataUrl + url,
	            data: data,
	            requestHeader: {
	                'Content-Type': 'application/json',
	                "Accept": "*/*",
	                'Accept-Encoding': "gzip, deflate"
	            	},
				
        	}
	        axios(config)
	            .then((res) => {
	            	isGetData = true
//	            	showLoading()
	                callback(res.data)
	            })
	            .catch((err) => {

	                if(err.response) {

						errorCallback && errorCallback(err.response)
					}
	                
	            })
	        setTimeout(() => {
    		if(!isGetData && isSearchFirst) {
    			hideLoading()
    			warningMsg('请求超时')
    			isSearchFirst = false
    		}
    	}, loadingTime)
    },
    getSearchJson(method, url, data, callback, errorCallback) {
    	let token = sessionManage.getItem('token');
//  	console.log(token, '..............token')
    	// 没有token直接输入查询页面地址, 回退到首页
    	if(!token && url !== '/API/token' && method !== 'post') {
    		appHistory.push({
                pathname: '/'
            })
    		return
    	}
		let isGetData = false
		axios.defaults.headers.common['token'] = token
//      axios.defaults.headers.common['Content-Type'] = 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW';
        // 设置token
//      axios.interceptors.request.use( (config) => {
//		        
//		        if (token) {
//		        	console.log('设置token', token)
//		            config.headers["token"] = token;
//		        }
//		            return config;
//		       }, (error) => {  
//		            return Promise.reject(error);
//	        });
		
    	if(method === 'get') {
    		axios.get(searchUrl + url, {
    			params: data
    		})
		    .then((res) => {
		    	isGetData = true
//		    	showLoading()
		    	callback(res.data)
		    })
		    .catch((err) => {

		    	if(err.response) {
					errorCallback && errorCallback(err.response)
				}
		    })
    	} else {
    		let config = {
	            method: method,
	            url: searchUrl + url,
	            data: data,
	            requestHeader: {
	                'Content-Type': 'application/json',
	                "Accept": "*/*",
	                'Accept-Encoding': "gzip, deflate"
	            	},
				
        	}
	        axios(config)
	            .then((res) => {
	            	isGetData = true
//	            	showLoading()
	                callback(res.data)
	            })
	            .catch((err) => {

	                if(err.response) {

						errorCallback && errorCallback(err.response)
					}
	                
	            })
    	}
    	
    	setTimeout(() => {
    		if(!isGetData && isSearchFirst) {
    			hideLoading()
    			warningMsg('请求超时')
    			isSearchFirst = false
    		}
    	}, loadingTime)
    	
    },
    // 操作cookie
    cookieManage: cookieManage,
    UpdateForm,
    // 全局提示
    successMsg,
    warningMsg,
    errorMsg,
    // confirm提示框
    confirmModal,
    modalInfo,
    // localStorage
    localManage,
    searchUrl,
    // sessionStorage
    sessionManage,
    hideLoading,
    showLoading,
    heartTime,
    aord,
    dori,
    flightStatus,
    
    appHistory,
    // 重新获取初始化数据的命令
    reGetInitData,
    syncDataUrl,
    
    logOut,
    // 错误退出到登录页
    errorLogOut,
    windowResize,
    
    showLen,
    
    heartWatch,
    resetInit,
    compareUrl,
    
    refreshData,
    
    reConnectMQCount,		// 尝试重新连接mq的次数
    
    confirmModalArr
}
let loadingDom = document.getElementById('loading')
/**
 * 
 * @param {Object} str
 */
function showLoading (str) {
	if(window.getComputedStyle(loadingDom, null).display === 'block') {
		return
	}
	
	str = str || 'Loading...'
	document.getElementById('loadingText').innerHTML = str
	loadingDom.style.display = 'block'	
}
/**
 * 
 */
function hideLoading () {
	loadingDom.style.display = 'none'
}


export default globalService