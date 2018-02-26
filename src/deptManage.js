import React, { Component } from 'react'
import {Table, Button, Input, Row, Col, Tabs, Transfer, Icon, Select, Tooltip} from 'antd'
// Transfer 穿梭框
import 'antd/dist/antd.css'
import globalService from './global.js'
import './dept.css'

const {getJson, successMsg, warningMsg, confirmModal, hideLoading, showLoading, errorLogOut, sessionManage, windowResize} = globalService

// 全局提示

class DeptManage extends Component {
	constructor (props) {
		super(props)
		
		this.deptAdd = this.deptAdd.bind(this)
		this.updateDept = this.updateDept.bind(this)
		this.deptSearch = this.deptSearch.bind(this)
		this.deleteDept = this.deleteDept.bind(this)
		this.state = {
			// 显示配置界面
			isDeptUpdateShow: false,
			tableDataSource: [],
			tableHeight: '',
			// 点击新增
			isClickAdd: false,
			// 点击配置数据的deptId
			configDeptId: '',
			searchValue: ''
		}
	}
	/**
	 * 点击新增
	 */
	deptAdd (ev) {
		
		if(this.isAdd) {
			warningMsg('请先完成之前的添加的操作')
			return
		}
		// 新增
		let tableDataSource = this.state.tableDataSource
		tableDataSource.push({})
		this.isAdd = true
		this.setState({
			tableDataSource,
			isClickAdd: true
		})
	}
	/**
	 * 确定添加	或编辑
	 */
	confirmAdd (index, isConfirm, record, ev) {	
		
		let targetNode = ev.target
		if(targetNode.nodeName.toLowerCase() === 'i') {
			targetNode = targetNode.parentNode
		}
		// 输入框
		let inputNode = targetNode.parentNode.parentNode.parentNode.querySelectorAll('input')
		
		// 是否是可编辑的
		if(isConfirm) {
			let param = {
				deptNo: inputNode[0].value,
				deptName: inputNode[1].value
			}

			if(!param.deptNo) {
				warningMsg('部门编号不能为空')
				return
			} else {
				let reg = /^\d{1,6}$/g
				if(!reg.test(param.deptNo)) {
					warningMsg('部门编号必须是1-6位的数字')
					return
				}
			}
			
			if(!param.deptName) {
				warningMsg('部门名称不能为空')
				return
			}
			if(param.deptName) {
				let pattern = /[\u4e00-\u9fa5]{1}/g
				let nameStr = param.deptName.replace(pattern, 'ss')
				if(nameStr.length > 20) {
					warningMsg('部门名称的字符长度不能超过20')
					return
				}
			}
			
			// 发送请求
			if(record.isEdit) {
				// 编辑时的状态
				if(record.deptNo === param.deptNo && record.deptName === param.deptName) {
					warningMsg('部门信息没做任何修改')
					return
				}
				if(record.deptNo === param.deptNo) {
					param = {
						deptName: inputNode[1].value
					} 
				}
				if(record.deptName === param.deptName) {
					param = {
						deptNo: inputNode[0].value
					}
				}
				
				
				getJson('put', `/API/depts/${record.deptId}`, param, (res) => {
//					console.log(res)
					if(res.status === 1000) {
						// 重新请求一次部门数据
						if(this.state.searchValue) {
							this.filterDept()
						} else {
							this.getDepts()
						}
						successMsg('修改成功')
						//
						this.isAdd = false
					} else if(res.status === 9999) {
						warningMsg(res.data)

					}
					hideLoading()
				})
				
			} else {
				if(record.isFirst) {
					return
				}
				record.isFirst = true
				// 新增
				getJson('post', '/API/depts', param, (res) => {
//					console.log(res)
					record.isFirst = false
					if(res.status === 1000) {
						// 重新请求一次部门数据
						successMsg('添加成功')
						if(this.state.searchValue) {
							this.filterDept()
						} else {
							this.getDepts()
						}
						this.isAdd = false
					} else if(res.status === 9999) {
						warningMsg('部门编号或部门名称已存在')
					}
					hideLoading()
				})
				
			}
			
		} else {
			if(record.isEdit) {
				// 编辑状态取消
				let tableDataSource = this.state.tableDataSource
				tableDataSource[index].isEdit = false
				this.setState({
					tableDataSource
				})
				
			} else{
				// 新增取消
				// 删除这条数据
				let tableDataSource = this.state.tableDataSource
				tableDataSource.splice(index, 1)
				this.setState({
					tableDataSource
				})
			}
			
			this.isAdd = false
			
		}
	}
	/**
	 * 权限配置
	 * 
	 */
	authorityConfig (deptId) {
		// 点击权限配置显示DeptUpdateAdd 组件
		this.isClickConfig = true
		this.setState({
			isDeptUpdateShow: true,
			configDeptId: deptId
		}, () => {
			// 发送请求获取服务配置的数据
			
		})
	}
	/**
	 * 更新
	 */
	updateDept (index, ev) {
		// 使部门名称变成可编辑状态
		let tableDataSource = this.state.tableDataSource
		tableDataSource[index].isEdit = true
		this.setState({
			tableDataSource
		})
	}
	deleteModalShow (deptId) {
		confirmModal(this.deleteDept.bind(this, true, deptId), () => {}, '部门以及部门权限信息都将会删除，是否删除？')
	}
	/**
	 * 删除
	 */
	deleteDept (isConfirm, deptId) {
		let param = {
			isDelPerms: isConfirm
		}

		isConfirm && getJson('delete', `/API/depts/${deptId}`, param, (res) => {
//			console.log(res)
			if(res.status === 1000) {
				if(res.data === '部门内存在用户不可删除!') {
					warningMsg('部门内存在用户不可删除!')
				} else {
					this.getDepts()
					successMsg('删除成功')
				}
				hideLoading()
			}
		})
		
//		this.setState({
//			deleteModal: false
//		})
		
	}
	/**
	 * 过滤部门
	 */
	filterDept () {
				// 发送请求
		let {searchValue} = this.state
		searchValue = searchValue ? searchValue.trim() : ''
		let param = searchValue ? {queryName: searchValue} : ''
		if(!param) {
			
			this.getDepts()
			
		} else {
			getJson('get', '/API/depts/filter', param, (res) => {

				if(res.status === 1000) {
					this.setState({
						tableDataSource: res.data
					})
					hideLoading()
				}
				
			})
		}
		
		
	}
	/**
	 * 搜索
	 */
	deptSearch () {
		this.isAdd = false
		this.filterDept()
		
	}
		/**
	 * 输入框的change事件
	 */
	onChangeSearch (ev) {
		this.setState({ searchValue: ev.target.value });
	}
	/**
	 * 清空输入框的内容
	 */
	emptySearch () {
		this.searchInput.focus();
    	this.setState({ searchValue: ''});
	}
	/**
	 * 获取部门的数据
	 */
	getDepts () {
		showLoading()
		// 获取部门的数据
		getJson('get', '/API/depts', '', (res) => {
//			console.log(res)
			if(res.status === 1000) {
				this.setState({
					tableDataSource: res.data
				})
				this.isAdd = false
				
			} else if(res.status === 1001) {
				warningMsg('请携带令牌登录')
			}
			
			hideLoading()
		}, (error) => {
			
			if(error.status === 401) {
				errorLogOut()
			} else if(error.status === 500) {
				errorLogOut()
			}
			
		})
	}
	// 加载前
	componentWillMount () {
		if(!sessionManage.getItem('token')) {
			errorLogOut()
			return 
		}
		// 发送请求
		this.getDepts()
	}
	// 已经加载
	componentDidMount () {
		if(!sessionManage.getItem('token') || !this.refs.deptWrap) {
			errorLogOut()
			return 
		}
		// tableHeight 的高度
		setTimeout(() => {
			this.refs.deptWrap && this.setState({
				tableHeight: (this.refs.deptWrap.offsetHeight - 100)
			})
		}, 500)
		
		
	}
	// 
	componentDidUpdate () {
		windowResize(() => {
			this.refs.deptWrap && this.setState({
				tableHeight: (this.refs.deptWrap.offsetHeight - 100)
			})
		})
		console.log(this.isReturn)
		// 按下了返回
		if(this.isReturn) {
			this.refs.deptWrap && this.setState({
				tableHeight: (this.refs.deptWrap.offsetHeight - 100)
			})
			this.isReturn = false
		}
		if(this.state.isClickAdd) {
			// 滚动到底部
			document.querySelector('.ant-table-body').scrollTop = document.querySelector('.ant-table-body').scrollHeight	
			this.setState({
				isClickAdd: false
			})
		}
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
	/**
	 * 渲染
	 */
	render () {
		const columns = [{
			  title: '序号',
			  dataIndex: 'index',
			  key: 'index',
			  render: (text, record, index) => {
			  	return (
			  		<span>{index + 1}</span>
			  	)
			  },
			  width: 100
			}, {
			  title: '部门编号',
			  dataIndex: 'deptNo',
			  key: 'deptNo',
			  width: "25%",
			  render: (text, record) => {
			  	
			  	if(JSON.stringify(record) === '{}' || record.isEdit) {
			  		// 新增的数据
			  		return (
			  			<div>
			  				<Input defaultValue={record.isEdit ? record.deptNo : ''} />
			  			</div>
			  		)	
			  	} else {
			  		return (
			  			<div className='edit_dept_name'>{record.deptNo}</div>
			  		)
			  	}
			  	
			  }
			}, {
			  title: '部门名称',
			  dataIndex: 'deptName',
			  key: 'deptName',
			  width: "25%",
			  render: (text, record) => {
			  	
			  	if(JSON.stringify(record) === '{}' || record.isEdit) {
			  		// 新增的数据
			  		return (
			  			<div>
			  				<Input defaultValue={record.isEdit ? record.deptName : ''} />
			  			</div>
			  		)	
			  	} else {
			  		return (
			  			<div className='edit_dept_name'>{record.deptName}</div>
			  		)
			  	}
			  	
			  }
			}, {
			  title: '创建时间',
			  dataIndex: 'createTime',
			  key: 'createTime',
			}, {
			  title: '操作',
			  dataIndex: 'operate',
			  key: 'operate',
			  width: "10%",
			  render: (text, record, index) => {
			  	// text 当前行的值
			  	// record 当前行的数据
			  	if(JSON.stringify(record) === '{}' || record.isEdit) {
			  		// 新增的数据
			  		return (
			  			<div>
				  			<span className="confirm_icon" style={{cursor: 'pointer'}} onClick={this.confirmAdd.bind(this, index, true, record)}><Icon type="check-circle" style={{color: 'green', fontSize: '16px'}} /></span>
				  			<span className="cancel_icon" style={{cursor: 'pointer'}} onClick={this.confirmAdd.bind(this, index, false, record)} ><Icon type="close-circle" style={{color: 'red', fontSize: '16px'}} /></span>
				  		</div>
			  		)
			  		
			  	} else {
			  		
			  		return (
				  		<div>
				  			<Tooltip placement="topLeft" title='权限配置' overlayStyle={{wordWrap : 'break-word'}}>

				  				<span id={record.deptId} className='authority_config' style={{cursor: 'pointer'}} onClick={this.authorityConfig.bind(this, record.deptId)} ><i className='search-icon'>&#xe6a6;</i></span>
						
							</Tooltip>
							<Tooltip placement="topLeft" title='修改' overlayStyle={{wordWrap : 'break-word'}}>


				  				<span id={record.deptId} className='update_dept' style={{cursor: 'pointer'}} onClick={this.updateDept.bind(this, index)} ><i className='search-icon'>&#xe677;</i></span>
								
							</Tooltip>
							<Tooltip placement="topLeft" title='删除' overlayStyle={{wordWrap : 'break-word'}}>

				  				<span className='delete_dept' onClick={this.deleteModalShow.bind(this, record.deptId)} style={{cursor: 'pointer'}}><i className='search-icon'>&#xe76b;</i></span>
								
							</Tooltip>

				  		</div>
			  		)
			  		
			  	}
			  	
			  }
			}];
		const { searchValue } = this.state;
   		const suffix = searchValue ? <Icon type="close-circle" style={{cursor: 'pointer'}} onClick={this.emptySearch.bind(this)} /> : null;
		return (
			<div className="dept_wrap" ref='deptWrap' style={{background: this.state.isDeptUpdateShow ? '#F5F5F5' : '#fff'}}>
				<div className="dept_show" ref='deptShow' style={{display: this.state.isDeptUpdateShow ? 'none': 'block'}}>
					<div className='dept_header'>
						<Row>
							<Col span={4}>
								<Input onPressEnter={this.deptSearch.bind(this)} addonAfter={<Icon type="search" style={{cursor: 'pointer'}} onClick={this.deptSearch.bind(this)} />} suffix={suffix} placeholder="搜索部门编号/部门名称" onChange={this.onChangeSearch.bind(this)} value={searchValue} ref={node => this.searchInput = node} />
							</Col>
							<Button type="primary" style={{'marginLeft': '20px'}} onClick={this.deptAdd}>添加</Button>
						</Row>
					</div>
					<Table bordered={true} rowClassName={(record, index) => {
						// 奇数  偶数
						if(index % 2 === 0) {
							// 偶数
							return "even"
						} else {
							return "odd"
						}
						
					}} onRowClick={this.selectLine.bind(this)} dataSource={this.state.tableDataSource} columns={columns} pagination={false} rowKey={(record, index) => {return index}} scroll={{ y: this.state.tableDataSource.length * 49 > this.state.tableHeight ? this.state.tableHeight : false }}/>
				</div>
				<DeptUpdateAdd deptShowIns={this}/>
			</div>
		)
	}
}


export default DeptManage

/**
 * 部门的增改
 */

const TabPane = Tabs.TabPane;
//const FormItem = Form.Item



class DeptUpdateAdd extends Component {
	constructor (props) {
		super(props)
		this.returnDept = this.returnDept.bind(this)
		this.addService = this.addService.bind(this)	// 添加服务
		this.saveTaskData = this.saveTaskData.bind(this)	// 保存任务类型数据
		this.state = {
			mockData: [],
    		targetKeys: [],
    		// 服务的表格数据
    		tableDataSource: [],
    		// 可选的服务数据(去除了已选的数据)
    		optionalServiceData: [],
    		// 第一次请求服务
			isGetServiceFirst: true,
			// 表格高度
			tableHeight: '',
			isGetHeight: false,
			// 是否点击添加
			isClickAdd: false,
			// 任务类型可管理的数据
			taskSelectedData: [],
			// 初始化类型数据时可管理的taskCode集合
			initSelTaskCode: [],
			// 任务类型可选的数据
			taskOptionalData: [],
			// 航空公司权限数据
			airCompanyData: [],
			// 初始化 航空公司可管理公司的数据
			initSelAirCompany: [],
			// 航空公司可管理的数据
			airCompanySelData: [],
			// 穿梭框的高度
			transferHeight: '',
			// 
			defaultActiveKey: '1'
		}
		
		// 监测数据变化的标识
		this.checkFlag = {}
		
	}
	/**
	 * 返回
	 */
	returnDept () {
		// this.props.deptShowIn 	部门展示列表组件的实例
		this.checkFlag = {}
		this.setState({
			// 第一次请求服务
			isGetServiceFirst: true,
			defaultActiveKey: '1'
		})
		this.props.deptShowIns.setState({
			isDeptUpdateShow: false,
			configDeptId: ''
		})
		
		this.props.deptShowIns.isReturn = true
		
		// 将那些搜索条件清空
		let searchNode = document.querySelectorAll('.common_dept_style .ant-transfer-list-search-action')
//		console.log(searchNode)
		if(searchNode) {
			searchNode = [...searchNode]
			searchNode.forEach((node) => {
				node.click && node.click()	// 绑定
			})
		}

	}
	/**
	 *  获取服务明细
	 */
	getServiceDetail () {
		let deptId = this.props.deptShowIns.state.configDeptId
		if(!this.state.isGetHeight) {
			this.setState({
				tableHeight: this.refs.deptManage.offsetHeight - 200,
				isGetHeight: true
			})
			
		}
		getJson('get', `/API/depts/${deptId}/service`, '', (res) => {

				if(res.status === 1000) {

					this.setState({
						tableDataSource: res.data.selected,
						// 可选的服务数据
						optionServiceData: res.data.optional,
						isGetServiceFirst: false,
						isClickAdd: false
					})
					
					this.isAddService = false
				}
				hideLoading()
			})
		
	}
	/**
	 * 更新服务数据
	 */
	updateServiceData (param, callback) {
		let deptId = this.props.deptShowIns.state.configDeptId
		getJson('post', `/API/depts/${deptId}/perms/service`, param, (res) => {
//				console.log(param)
				if(res.status === 1000) {
					this.selectDetailNo = undefined
					this.selectDetailShowCol = undefined
					this.getServiceDetail()
					callback && callback()
				}
		})
	}
	/**
	 * 修改服务权限数据
	 */
	updateService (index) {
		let tableDataSource = this.state.tableDataSource
		tableDataSource[index].isEdit = true
		this.setState({
			tableDataSource
		})
	}
	/**
	 * 确认添加或 修改
	 */
	confirmAddUp (isConfirm, record, index, ev) {
//		console.log(record, this.selectDetailShowCol)
		if(isConfirm) {
			// 确认 
//			let deptId = this.props.deptShowIns.state.configDeptId
			if(record.isEdit) {
				// 修改状态
				let param = []
				// 判断两次的数据
				
				this.selectDetailNo = this.selectDetailNo ? this.selectDetailNo : record.detailNo
				this.selectDetailShowCol = Number(this.selectDetailShowCol) >= 0 ? this.selectDetailShowCol : record.showStartEnd
				
				if(record.detailNo !== this.selectDetailNo) {

					param = [{
						flag: 'I',
						detailNo: this.selectDetailNo,
						showStartEnd: this.selectDetailShowCol
					}, {
						flag: 'D',
						detailNo: record.detailNo,
						showStartEnd: record.showStartEnd
					}]
					
				} else {

					if(record.showStartEnd !==  this.selectDetailShowCol) {
						
						param = [{
							flag: 'U',
							detailNo: record.detailNo,
							showStartEnd: this.selectDetailShowCol
						}]
						
					} else {
						warningMsg('没有任何修改')
						this.selectDetailNo = undefined
						this.selectDetailShowCol = undefined
//						let tableDataSource = this.state.tableDataSource
//						tableDataSource[index].isEdit = false
//						this.setState({
//							tableDataSource
//						})
						return 
					}
					
				}
				this.updateServiceData(param, () => {
					successMsg('修改成功')
				})
				
			} else {

				if(!this.selectDetailNo) {
					warningMsg('服务细节项目名称不能为空')
					return
				}
				if(!this.selectDetailShowCol) {
					warningMsg('可见列不能为空')
					return
				}
				if(record.isFirst) {
					
					return
				}
				record.isFirst = true
				// 新增状态
				let param = [{
					flag: 'I',
					detailNo: this.selectDetailNo,
					showStartEnd: this.selectDetailShowCol
				}]

				this.updateServiceData(param, () => {
					record.isFirst = false
					this.isAddService = false
					successMsg('添加成功')
				})
			}
		} else {
			// 取消
			if(record.isEdit) {
				this.selectDetailNo = undefined
				this.selectDetailShowCol = undefined
				// 修改状态
				let tableDataSource = this.state.tableDataSource
				tableDataSource[index].isEdit = false
				this.setState({
					tableDataSource
				})
				
			} else {
				// 新增状态
				let tableDataSource = this.state.tableDataSource
				tableDataSource.splice(index, 1)
				this.setState({
					tableDataSource
				})
				
			}
			this.isAddService = false
		}
	}
	/**
	 * 删除服务权限数据
	 */
	deleteService (isConfirm, record) {
		if(isConfirm) {
			// 确认删除
			let param = [{
					flag: 'D',
					detailNo: record.detailNo,
					showStartEnd: record.showStartEnd
				}]

			this.updateServiceData(param, () => {
				successMsg('删除成功')
			})
		}
	}
	deleteSerToggle (record) {
		confirmModal(this.deleteService.bind(this, true, record), () => {}, '确定删除吗?')
	}
	/**
	 * 服务数据的选择
	 */
	serviceSelect (flag, value) {
		if(flag === 'detailNo') {
			// 服务项目Id
			this.selectDetailNo = value
			
		} else if(flag === 'showCol') {
			// 可见列

			this.selectDetailShowCol = value

		}
	}
	
	// 任务类型
	/***
	 * 获取任务类型数据
	 */
	getTaskCode (deptId) {
		getJson('get', `/API/depts/${deptId}/taskcode`, '', (res) => {
			if(res.status === 1000) {
			
				let selectTaskCode = res.data.selected.map((selected) => {
					return selected.taskCode
				})
				
				// 总的数据	
				let optional = res.data.optional.concat(res.data.selected)
				
				this.setState({
					taskSelectedData: selectTaskCode,
					taskOptionalData: optional,
					initSelTaskCode: selectTaskCode
				})
				hideLoading()
			}
		})
	}
	/**
	 * 获取航空公司数据
	 */
	getAirCompany (deptId) {

		getJson('get', `/API/depts/${deptId}/subairline`, '', (res) => {
			if(res.status === 1000) {
//				console.log(res)
				let selectTaskCode = res.data.selected.map((selected) => {
					return selected.id
				})
				// 总的数据	
				let optional = res.data.optional.concat(res.data.selected)
				
				this.setState({
					airCompanySelData: selectTaskCode,
					airCompanyData: optional,
					initSelAirCompany: selectTaskCode
				})
				hideLoading()
			}
		})
	}
	
	/**
	 * 数据更新
	 */
	componentDidUpdate () {
		this.isConfig = this.props.deptShowIns.isClickConfig	// 是否点击了界面配置
		if(this.isConfig) {
			
			let deptId = this.props.deptShowIns.state.configDeptId
			
			if(deptId) {
				if(!this.checkFlag[deptId]) {
					
					console.log('请求服务配置数据.......')
					
					this.checkFlag[deptId] = true
					// 获取服务数据
					this.getServiceDetail()
					// 获取任务类型数据
					this.getTaskCode(deptId)
					// 获取航空公司数据
					this.getAirCompany(deptId)
					
					// 穿梭框的高度
					this.setState({
						transferHeight: this.refs.deptManage.offsetHeight * 0.6
					})
				}
			}
		}
		// 点击添加
		if(this.state.isClickAdd) {
			document.querySelector('.dept_manage .ant-table-body').scrollTop = document.querySelector('.dept_manage .ant-table-body').scrollHeight
		}
		windowResize(() => {
			let deptManage = this.refs.deptManage
			deptManage && this.setState({
				tableHeight: deptManage.offsetHeight - 200,
				transferHeight: deptManage.offsetHeight * 0.6
			})
		})
	}
	/**
	 * handleChange 穿梭框
	 */
	handleChange (taskCom, targetKeys) {
	    if(taskCom === 'task') {
	    	this.setState({ taskSelectedData: targetKeys });
	    } else if(taskCom === 'company') {
	    	this.setState({ airCompanySelData: targetKeys });
	    }
	}
	/**
	 * 保存task配置数据	航空公司数据
	 */
	saveTaskData (isTask) {
		let deptId = this.props.deptShowIns.state.configDeptId
		if(isTask) {
			let param = returnParam(this.state.initSelTaskCode, this.state.taskSelectedData, true)
			// 发送请求
			getJson('post', `/API/depts/${deptId}/perms/taskCode`, param, (res) => {
				if(res.status === 1000) {
					successMsg('保存成功')
					this.getTaskCode(deptId)
				}
				hideLoading()
			})
		} else {

			let param = returnParam(this.state.initSelAirCompany, this.state.airCompanySelData, false)
			// 发送请求
			getJson('post', `/API/depts/${deptId}/perms/subairline`, param, (res) => {
				if(res.status === 1000) {
					this.setState({
						airCompanySelData: [],
						airCompanyData: [],
						initSelAirCompany: []
					})
					this.getAirCompany(deptId)
					successMsg('保存成功')
				}
				hideLoading()
			})
		}
	}
	/**
	 * 添加服务
	 */
	addService () {
		
		if(this.isAddService) {
			warningMsg('请先完成之前的添加操作')
			return
		}
		
		let tableDataSource = this.state.tableDataSource
		tableDataSource.push({})
		this.isAddService = true
		
		// 置空
		this.selectDetailNo = ''
		this.selectDetailShowCol = ''
		
		this.setState({
			tableDataSource,
			isClickAdd: true
		})
	}
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
	/**
	 * 渲染
	 */
	render () {
	   	// columns
	   	const columns = [
		   	{
				  title: '序号',
				  dataIndex: 'index',
				  key: 'index',
				  render: (text, record, index) => {
				  	return (
				  		<span>{index + 1}</span>
				  	)
				  },
				  width: 100
			},
			{
				  title: '服务细节项目名称',
				  dataIndex: 'detailName',
				  key: 'detailName',
				  render: (text, record) => {
				  	if(JSON.stringify(record) === '{}' || record.isEdit) {
				  		if(record.isEdit) {
				  			return (
					  			<Select style={{ width: 200 }} showSearch onBlur={(value) => {
					  				this.selectDetailNo = value
					  			}} filterOption={(inputValue, option) => {
															return option.props.children.indexOf(inputValue) >= 0
										         		}} defaultValue={record.detailName} onSelect={this.serviceSelect.bind(this, 'detailNo')}>
							        {this.state.optionServiceData.map((optionItem, index) => {
							        	return (
							        		<Select.Option key={'option'+index} value={optionItem.detailNo}>{optionItem.detailName}</Select.Option>
							        	)
							        })}
							    </Select>
					  		)
				  		} else {
				  			return (
					  			<Select style={{ width: 200 }} showSearch onBlur={(value) => {this.selectDetailNo = value}} filterOption={(inputValue, option) => {
															return option.props.children.indexOf(inputValue) >= 0
										         		}} onSelect={this.serviceSelect.bind(this, 'detailNo')}>
							        {this.state.optionServiceData.map((optionItem, index) => {
							        	return (
							        		<Select.Option key={'option'+index} value={optionItem.detailNo}>{optionItem.detailName}</Select.Option>
							        	)
							        })}
							    </Select>
					  		)
				  		}
				  		
				  	} else {
				  		return (
				  			<div>{record.detailName}</div>
				  		)
				  	}
				  }

			},
			{
				  title: '可见列',
				  dataIndex: 'showStartEnd',
				  key: 'showStartEnd',
				  render: (text, record) => {
				  	let showCol = ''
				  		switch (record.showStartEnd) {
				  			case "0":
				  				showCol = '开始'
				  			break;
				  			case "1":
				  				showCol = '结束'
				  			break;
				  			case "2":
				  				showCol = '开始和结束'
				  			break;
				  		}
				  	if(JSON.stringify(record) === '{}' || record.isEdit) {
				  		if(record.isEdit) {
				  			return (
					  			<Select style={{ width: 200 }} defaultValue={showCol} onSelect={this.serviceSelect.bind(this, 'showCol')}>
							        <Select.Option value="0">开始</Select.Option>
							        <Select.Option value="1">结束</Select.Option>
							        <Select.Option value="2">开始和结束</Select.Option>
							    </Select>
					  		)
				  		} else {
				  			return (
					  			<Select style={{ width: 200 }} onSelect={this.serviceSelect.bind(this, 'showCol')}>
							        <Select.Option value="0">开始</Select.Option>
							        <Select.Option value="1">结束</Select.Option>
							        <Select.Option value="2">开始和结束</Select.Option>
							    </Select>
					  		)
				  		}
				  	} else {
				  		
				  		return (
				  			<div>{showCol}</div>
				  		)
				  	}
				  },
				  width: '20%'
			},
			{
				  title: <Icon type='plus' style={{cursor: 'pointer', fontSize: '20px'}} onClick={this.addService}/>,
				  dataIndex: 'operate',
				  key: 'operate',
				  render: (text, record, index) => {
				  	if(JSON.stringify(record) === '{}' || record.isEdit) {
				  		return (
				  			<div>
					  			<span className="confirm_icon" style={{cursor: 'pointer'}} onClick={this.confirmAddUp.bind(this, true, record, index)}><Icon type="check-circle" style={{color: 'green', fontSize: '16px'}} /></span>
					  			<span className="cancel_icon" style={{cursor: 'pointer'}} onClick={this.confirmAddUp.bind(this, false, record, index)}><Icon type="close-circle" style={{color: 'red', fontSize: '16px'}} /></span>
					  		</div>
				  		)
				  	} else {
				  		return (
				  			<div>
				  				<span className='update_service' onClick={this.updateService.bind(this, index)} style={{cursor: 'pointer', marginRight: '20px'}}><i className='search-icon'>&#xe677;</i></span>
					  			<span className='delete_service' onClick={this.deleteSerToggle.bind(this, record)} style={{cursor: 'pointer'}}><i className='search-icon'>&#xe76b;</i></span>
				  			</div>
				  		)
				  	}
				  },
				  width: '20%'
			}
	   	]
		return (
			<div style={{display: this.props.deptShowIns.state.isDeptUpdateShow ? 'block' : 'none'}} ref="deptManage" className='dept_manage'>
				<div className='dept_nav'>
					<Tabs type="card" defaultActiveKey={this.state.defaultActiveKey} >
				      <TabPane tab={<span className="tab_title">任务类型</span>} key="1">
				        <div className="dept_add">
				        	<div className="dept_add_form common_dept_style">
				        		<Transfer
							        dataSource={this.state.taskOptionalData}
							        showSearch
							        listStyle={{
							          width: 300,
							          height: this.state.transferHeight,
							          textAlign: 'left'
							        }}
							        operations={['右移', '左移']}
							        titles={['可选的任务类型列表', '可管理的任务类型列表']}
							        searchPlaceholder='搜索'
							        notFoundContent='无数据'
							        targetKeys={this.state.taskSelectedData}
							        onChange={this.handleChange.bind(this, 'task')}
							        rowKey={record => record.taskCode}
							        render={item => `${item.taskCode}-${item.taskChinese}`}
							        lazy={false}
							     />
				        	</div>
				        	<div className='dept_btn'>
				        		<Button type="default" className='return_btn cancel_btn' onClick={this.returnDept}>返回</Button>
				        		<Button type="primary" className='save_btn' onClick={this.saveTaskData.bind(this, true)}>保存</Button>
				        	</div>
				        </div>
				      </TabPane>
				      
				      <TabPane tab={<span className="tab_title">服务权限</span>} key="2">
				      	<Table onRowClick={this.selectLine.bind(this)} dataSource={this.state.tableDataSource} columns={columns} pagination={false} rowKey={(record, index) => {return index}} scroll={{ y: this.state.tableDataSource.length * 49 > this.state.tableHeight ? this.state.tableHeight : false }}/>
				        <div className='dept_btn'>
				        	<Button type="default" className='return_btn cancel_btn' onClick={this.returnDept}>返回</Button>
				        </div>
				      </TabPane>
				      
				      <TabPane tab={<span className="tab_title">航空公司权限</span>} key="3">
				        <div className='common_dept_style'>
				        	<Transfer
						        dataSource={this.state.airCompanyData}
						        showSearch
						        listStyle={{
						          width: 300,
						          height: this.state.transferHeight,
						          textAlign: 'left'
						        }}
						        operations={['右移', '左移']}
						        titles={['可选的航空公司列表', '可管理的航空公司列表']}
						        searchPlaceholder='搜索'
						        notFoundContent='无数据'
						        targetKeys={this.state.airCompanySelData}
						        onChange={this.handleChange.bind(this, 'company')}
						        render={item => `${item.parentAirline}-${item.subairlineName}`}
						        rowKey={record => record.id}
						  		lazy={false}
						     />
				        </div>
				        <div className='dept_btn'>
				        	<Button type="default" className='return_btn cancel_btn' onClick={this.returnDept}>返回</Button>
				        	<Button type="primary" className='save_btn' onClick={this.saveTaskData.bind(this, false)}>保存</Button>
				        </div>
				      </TabPane>
				      
				    </Tabs>
				</div>
			</div>
		)
	}
}

// 处理两个数据的不同之处		穿梭框
/**
 * 
 * @param {Object} source
 * @param {Object} target
 */
function returnParam (source, target, isTask) {
		let a = source	// 源
		let b = target	// 目标
//		let intersection = b.filter(v => a.includes(v))		// 交集
		let difference = b.filter(v => !a.includes(v))	// 目标中有,源数据中没有		// 新增
		let difference2 = a.filter(v => !b.includes(v)) // 源数据有, 目标中没有		// 删除
		let param = []
		let arr1 = []
		let arr2 = []
		if(isTask) {
			arr1 = difference.map((item) => {
				return {
					flag: 'I',
					taskCode: item
				}
			})
			arr2 = difference2.map((item) => {
				return {
					flag: 'D',
					taskCode: item
				}
			})
		} else {
			arr1 = difference.map((item) => {
				return {
					flag: 'I',
					id: item
				}
			})
			arr2 = difference2.map((item) => {
				return {
					flag: 'D',
					id: item
				}
			})
		}
		
		param = param.concat(...arr1, ...arr2)
		return param
}
