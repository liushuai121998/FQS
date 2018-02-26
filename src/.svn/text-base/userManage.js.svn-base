import React, { Component } from 'react'


import {Modal, Button, Switch, Table, Input, Row, Col, Form, Select, Icon, Tooltip} from 'antd'
import globalService from './global.js'

import './user.css'
// 全局提示

let {getJson, successMsg, warningMsg, confirmModal, hideLoading, showLoading, errorLogOut, sessionManage, windowResize} = globalService

const FormItem = Form.Item
class UserManage extends Component {
	constructor (props) {
		super(props)
		
		this.state = {
			modalShow: false,
			users: [],
			depts: [],
			deleteModalShow: false,
			resetModalShow: false, 	// 重置模态框
			updateUserModal: false, // 修改用户模态框
			updateUserData: {},
			tableHeight: '',
			
			// 输入框的值
			searchValue: ''
		}
		this.deptFlags = {}
		
		this.addUser = this.addUser.bind(this)
		
		this.resetPassword = this.resetPassword.bind(this)
		this.updateUser = this.updateUser.bind(this)
		this.deleteUser = this.deleteUser.bind(this)
	}
	// 挂载前
	componentWillMount () {
//		console.log(sessionManage.getItem('token'))
		if(!sessionManage.getItem('token')) {
			errorLogOut()
			return 
		}
		this.getUser()
		showLoading()
		// 获取部门的数据
		getJson('get', '/API/depts', '', (res) => {
			if(res.status === 1000) {
				hideLoading()
				this.setState({depts: res.data})
				res.data.forEach((dept) => {
					// 将deptId => deptName 联系起来
					this.deptFlags[dept['deptId']] = dept['deptName']
				})
			}
		}, (error) => {
			if(error.status === 401) {
				errorLogOut()
			} else if(error.status === 500) {
				errorLogOut()
			}
		})
	}
	// 已经挂载
	componentDidMount () {
//		sessionManage.getItem('token')
		if(!sessionManage.getItem('token')) {
			errorLogOut()
			return 
		}
		// tableHeight 的高度
		setTimeout(() => {
			this.refs.userWrap && this.setState({
				tableHeight: (this.refs.userWrap.offsetHeight - 100)
			})
		}, 500)
		
		windowResize(() => {
			this.refs.userWrap && this.setState({
				tableHeight: (this.refs.userWrap.offsetHeight - 100)
			})
		})
	}
	getUser () {
		showLoading()
		let param = {
			pageSize: 0,
			pageNum: 0
		}
		param['filterKey'] = this.state.searchValue
		// 获取用户的数据
		getJson('get', '/API/users', param, (res) => {

			if(res.status === 1000) {
				hideLoading()
				let users = res.data.list.filter((item) => {
					return item.isadmin === '0'
				})

				this.setState({users})
			}
			
		})
	}
	/**
	 * 添加用户
	 */
	addUser () {
		// 弹出添加的模态框
		
		// 模态框的显示与隐藏
		this.setState({
			modalShow: true
		})
		
		// 获取用户的数据
		this.getUser()
	}
	/*
	 * 重置密码
	 */
	resetPassword (record, ev) {

		this.resetId = record.id
//		this.setState({resetModalShow: true})
		confirmModal(this.resetToggle.bind(this, true), () => {}, '确定重置密码吗？')
	}
	/**
	 * 确定重置密码
	 */
	resetToggle (isConfirm) {
		if(isConfirm) {
			// 重置密码
			getJson('PUT', `/API/users/${this.resetId}/reset`, {id: this.resetId}, (res) => {
//				console.log(res)
				if(res.status === 1000) {
					successMsg('重置成功')
//					this.setState({resetModalShow: false})
				} else {
					warningMsg('重置失败')
//					this.setState({resetModalShow: false})
				}
				hideLoading()
			})
			
		} else {
//			this.setState({resetModalShow: false})
		}
	}
	/**
	 * 更新用户
	 */
	updateUser (record, ev) {

		this.updateUserName = record.userName
		this.updateDesc = record.remark
		this.deptName = record.deptName
		this.deptSelectValue = record.deptId
		this.switchChecked = record.enable === '0' ? true : false
		this.updateId = record.id 
		
		this.setState({
			updateUserModal: true,
			updateUserData: record	
		})
		
		// 设置  数据
		this.props.form.setFields({
			'isEnable': {
				value: record.enable === '0' ? true : false		// 设置修改状态的值
			},
			'userName': {
				value: record.userName 
			},
			'deptSelect': {
				value: record.deptId
			},
			'remark': {
				value: record.remark
			}
		})

	}
	  /***
   *  开关切换
   */
	  switchEnable (checked) {
	  	this.switchChecked = checked
	  }
	/**
	 * 确认修改
	 */
	updateUserToggle (isConfirm) {
		if(isConfirm) {
			this.props.form.validateFields((err, values) => {
				if(!err) {
					// 确认修改
					
					let param = {
					}
					
					if(this.updateUserName !== values.userName) {
						param.userName = values.userName
					}

					if(this.updateDesc !== values.remark) {
						param.remark = values.remark
					}
					if(this.deptSelectValue !== values.deptSelect) {
						param.deptId = values.deptSelect
					}
					if(this.switchChecked !== values.isEnable) {
						param.enable = values.isEnable ? '0' : '1'
					}
					
					if(JSON.stringify(param) === '{}') {
						warningMsg('没有做任何的修改')
//						this.setState({updateUserModal: false})
						return 
					}
					
					getJson('PUT', `/API/users/${this.updateId}`, param, (res) => {
//						console.log(res, 'res....', param, values)
						if(res.status === 1000) {
							
							this.getUser()
							this.setState({updateUserModal: false})
							successMsg('修改成功')
							
						} else if(res.status === 1010) {
							
							warningMsg('用户名已经存在')
							
						} else {
							warningMsg('修改失败')
							this.setState({updateUserModal: false})
						}
						
						hideLoading()
						
					})
				} else {
					
//					warningMsg('验证失败')
				}
			})
			

		} else {
			this.setState({updateUserModal: false})
		}
	}
	
	/**
	 * 删除用户
	 */
	deleteUser (record, ev) {

		// 删除的id
		this.deleteId = record.id
		
		// 弹出对话框
//		this.setState({deleteModalShow: true})
		confirmModal(this.deleteToggle.bind(this, true), () => {}, '确定删除吗？')
	}
	/**
	 * 确定删除
	 */
	deleteToggle (isConfirm) {

		if(isConfirm) {
			getJson('delete', `/API/users/${this.deleteId}`, '', (res) => {
				if(res.status === 1000) {
					// 重新请求一次数据
					this.getUser()
//					this.setState({deleteModalShow: false})
					successMsg('删除成功')
				} else {
					successMsg('删除失败')
				}
				hideLoading()
			})
		} else {
//			this.setState({deleteModalShow: false})
		}
		
	}
	/**
	 * 输入框的change事件
	 */
	onChangeSearch (ev) {
		this.setState({ searchValue: ev.target.value });
	}
	/**
	 * 搜索过滤用户
	 */
	filterUser () {
		this.getUser()
	}
	/**
	 * 清空输入框的内容
	 */
	emptySearch () {
		this.searchInput.focus();
    	this.setState({ searchValue: ''});
	}
	/***
	 * 选择的部门
	 */
	deptSelect (value) {
		this.deptSelectValue = value
	}
	/**
	 * 单击行
	 */
	selectLine (record, index, ev) {
		function getTarget (target) {
			if(target.nodeName.toLowerCase() === 'tr') {
				this.target = target
				return
			} else {
				target = target.parentNode
				getTarget.call(this, target)
			}
		}
		this.target && this.target.classList.remove('active')
		let target = ev.target
		getTarget.call(this, target)
		this.target.classList.add('active')
	}
	render () {
		const { getFieldDecorator} = this.props.form;
		
		let isBackdrop = true	// 点击遮罩隐藏
		
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
		
		const columns = [{
			  title: '序号',
			  dataIndex: 'index',
			  key: 'index',
			  render: (text, record, index) => {
			  	return (
			  		<span>{index + 1}</span>
			  	)
			  },
			  width: 60
			},{
				title: '用户名',
				dataIndex: 'userName',
				key: 'userName',
				width: '8%'
			},
			{
				title: '部门',
				dataIndex: 'deptName',
				key: 'deptName',
				width: '8%'
			},{
				title: '描述',
				dataIndex: 'remark',
				key: 'remark',
				
			},{
				title: '是否启用',
				dataIndex: 'enable',
				key: 'enable',
				render: (text, record) => {
					return (
						<div>{record.enable === '0' ? '是' : '否'}</div>
					)
				},
				width: 90
			},{
				title: '最后登录时间',
				dataIndex: 'lastLoginTime',
				key: 'lastLoginTime',
				width: '15%'
			},{
				title: '最后登录IP',
				dataIndex: 'lastLoginIp',
				key: 'lastLoginIp',
				width: '10%'
			},{
				title: '创建时间',
				dataIndex: 'createTime',
				key: 'createTime',
				width: '15%'
			},{
				title: '操作',
				dataIndex: 'operate',
				key: 'operate',
				width: '8%',
				render: (text, record) => {
					return (
						<div>

							<Tooltip placement="topLeft" title='重置密码' overlayStyle={{wordWrap : 'break-word'}}>
								<span ref='resetPassword' className='reset_password' onClick={this.resetPassword.bind(this, record)}><i className='search-icon'>&#xe600;</i></span>
						
							</Tooltip>	
							<Tooltip placement="topLeft" title='修改' overlayStyle={{wordWrap : 'break-word'}}>

								<span className='update_user' ref='updateUser' onClick={this.updateUser.bind(this, record)}><i className='search-icon'>&#xe677;</i></span>
						
							</Tooltip>
							<Tooltip placement="topLeft" title='删除' overlayStyle={{wordWrap : 'break-word'}}>
								<span className='delete_user' ref='deleteUser' onClick={this.deleteUser.bind(this, record)}><i className='search-icon'>&#xe76b;</i></span>

						
							</Tooltip>
							        

									
						</div>
					)
				}
			}
		]
		
		const { searchValue } = this.state;
   		const suffix = searchValue ? <Icon type="close-circle" style={{cursor: 'pointer'}} onClick={this.emptySearch.bind(this)} /> : null;
		
		return (
			<div className='user_wrap' ref='userWrap'>
				<div className='clearfix'>
				    <Row>
				    	<Col span={4}>
							<Input onPressEnter={this.filterUser.bind(this)} addonAfter={<Icon type="search" style={{cursor: 'pointer'}} onClick={this.filterUser.bind(this)} />} suffix={suffix} placeholder="搜索用户名/部门" onChange={this.onChangeSearch.bind(this)} value={searchValue} ref={node => this.searchInput = node} />
				    	</Col>
				    	<Col>
				    		<UserForm isShow={this.state.modalShow} addUser={this.addUser} depts={this.state.depts} title='添加用户'></UserForm>
				    	</Col>
				    </Row>
				    {/*<Button color="info" onClick={this.addUser}>添加</Button>*/}
				    
				</div>
				<div className='user_content'>
					<Table bordered={true} rowClassName={(record, index) => {
						// 奇数  偶数
						if(index % 2 === 0) {
							// 偶数
							return "even"
						} else {
							return "odd"
						}
						
					}} onRowClick={this.selectLine.bind(this)} dataSource={this.state.users} columns={columns} pagination={false} rowKey={(record, index) => {return index}} scroll={{ y: this.state.users.length * 49 > this.state.tableHeight ? this.state.tableHeight : false }}/>
				</div>
				{/*修改用户模态框*/}
									<Modal visible={this.state.updateUserModal} maskClosable={isBackdrop} title='修改用户' onOk={this.updateUserToggle.bind(this, true)} onCancel={this.updateUserToggle.bind(this, false)}>
										<Form className='user_form'>
											<FormItem label='用户名:' {...formItemLayout} >
												{
													getFieldDecorator('userName', {
														initialValue: '',
														rules: [{ required: true, message: '用户名是必须的' }, {
											    			pattern: /^[^\u4e00-\u9fa5\s]+$/g,
											    			whitespace: true,
											    			message: '用户名不能包含中文或空格'
											    		}],
													})(
										        		<Input type="text"/>
													)
												}

											</FormItem>
											
											<FormItem label='部门:' {...formItemLayout} >
										         {
										         	getFieldDecorator('deptSelect', {
										         		initialValue: '',
										         		rules:[{required: true, message: '部门是必须的'}]
										         	})(
										         		<Select showSearch filterOption={(inputValue, option) => {
															return option.props.children.indexOf(inputValue) >= 0
										         		}}>
											            	<Select.Option disabled value='disabled'>-选择部门-</Select.Option>
											            	{this.state.depts.map((dept, index) => {
											            		return (
											            			<Select.Option key={'option' + index} value={dept.deptId}>{dept.deptName}</Select.Option>
											            		)
											            	})}
											            </Select>
										         	)
										         }
											</FormItem>
											
											<FormItem label='描述:' {...formItemLayout} >

										        {
													getFieldDecorator('remark', {
														initialValue: ''
													})(
										        		<Input type="textarea"/>
													)
												}
											</FormItem>
											<FormItem label='是否启用:' {...formItemLayout}>
												{
													getFieldDecorator('isEnable', {
														valuePropName: 'checked'
													})(
										        		<Switch checkedChildren="开" unCheckedChildren="关"/>
													)
												}

											</FormItem>
										</Form>
							        </Modal>
							        
				{/*重置密码模态框*/}
									{/*<Modal visible={this.state.resetModalShow} maskClosable={isBackdrop} onOk={this.resetToggle.bind(this, true)} onCancel={this.resetToggle.bind(this, false)}>
										<div>确定重置密码吗?</div>					          
							        </Modal>*/}
				{/*删除模态框*/}
									{/*<Modal visible={this.state.deleteModalShow}  maskClosable={isBackdrop} title='消息提示' onOk={this.deleteToggle.bind(this, true)} onCancel={this.deleteToggle.bind(this, false)}>
										<div>确定删除吗?</div>
							        </Modal>*/}
			</div>
		)
	}
}
UserManage = Form.create()(UserManage)
export default UserManage


/**
 * 添加用户的表单组件(模态框)
 */
class UserForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      modal: this.props.isShow,
      depts: []
    };
//  console.log(props)
    this.toggle = this.toggle.bind(this);
  }
  
  toggle(isConfirm) {
	
	if(isConfirm) {
		// 表单验证
		this.props.form.validateFields((err, values) => {
			if(!err) {
				// 发送请求
				let param = {
					deptId: values.dept,
					enable: values.enable ? '0': '1',
					remark: values.remark,
					userName: values.userName
				}

				getJson('post', '/API/users', param, (res) => {
//					console.log(res)
					if(res.status === 1000) {
						successMsg('添加成功')
						this.props.addUser()
						this.setState({
					      modal: !this.state.modal
					    })
					} else if(res.status === 1010) {
						warningMsg('用户已经存在, 请重新输入')
					}

				})
			} else {
//				warningMsg('添加失败')
			}
		})
		
	} else {
		// 重置表单数据
		this.props.form.resetFields()
		this.setState({
	      modal: !this.state.modal
	    })
	}
    
 }
  /***
   *  开关切换
   */
  switchEnable (checked) {
  	this.switchChecked = checked
  }
  /**
   * 选择的部门
   */
  deptSelect (value) {
  	this.deptSelectValue = value
  }
  /**
   * 渲染
   */
  render() {
  	//
  	let isBackdrop = true
  	
  	const { getFieldDecorator} = this.props.form;
  	
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
      <div>
        <Button type='primary' onClick={this.toggle.bind(this, false)} style={{marginLeft: '20px'}}>添加</Button>
        <Modal visible={this.state.modal}  maskClosable={isBackdrop} title={this.props.title} onOk={this.toggle.bind(this, true)}
          onCancel={this.toggle.bind(this, false)}>
			<Form className='user_form'>
				<FormItem label='用户名:' {...formItemLayout}>
				    {
				    	getFieldDecorator('userName', {
				    		initialValue: '',
				    		rules: [{ required: true, message: '用户名是必须的' }, {
				    			pattern: /^[^\u4e00-\u9fa5\s]+$/g,
				    			message: '用户名不能包含中文或空格'
				    		}],
				    	})(
				    		<Input type='text'/>
				    	)
				    }
				</FormItem>
					<FormItem label='部门' {...formItemLayout}>
				         {
				         	getFieldDecorator('dept', {
				         		initialValue: '',
				         		rules: [{required: true, message: '部门是必须的'}]
				         	})(
				         		<Select showSearch filterOption={(inputValue, option) => {
															return option.props.children.indexOf(inputValue) >= 0
										         		}} onSelect={this.deptSelect.bind(this)}>
					            	<Select.Option disabled value='' selected>-选择部门-</Select.Option>
					            	{this.props.depts.map((dept, index) => {
					            		return (
					            			<Select.Option key={'option' + index} value={dept.deptId} >{dept.deptName}</Select.Option>
					            		)
					            	})}
					            </Select>
				         	)
				         }
					</FormItem>
					
					<FormItem label='描述:' {...formItemLayout}>
				        {
				        	getFieldDecorator('remark', {
				        		initialValue: ''
				        	})(
				        		<Input type="textarea"/>
				        	)
				        }
					</FormItem>
					
					<FormItem label='是否启用:' {...formItemLayout}>
				        {
				        	getFieldDecorator('enable', {
				        		valuePropName: 'checked',
				        		initialValue: true
				        	})(
				        		<Switch checkedChildren="开" unCheckedChildren="关" onChange={this.switchEnable.bind(this)} />
				        	)
				        }
					</FormItem>	
					
			</Form>
        </Modal>
      </div>
    );
  }
}

UserForm = Form.create()(UserForm)