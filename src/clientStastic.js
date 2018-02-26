import React, { Component } from 'react'
import {Table } from 'antd'
import globalService from './global.js'

const {getJson, hideLoading, showLoading, errorLogOut, sessionManage, windowResize} = globalService

class ClientStastic extends Component {
	constructor (props) {
		super(props)
		this.state = {
			clientList: [],
			// 表格的高度
			tableHeight: ''
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
	componentWillMount () {
		if(!sessionManage.getItem('token')) {
			errorLogOut()
			return 
		}
		showLoading()
		getJson('get', '/API/monit/client', '', (res) => {
//			console.log(res)
			if(res.status === 1000) {
				this.setState({
					clientList: res.data
				})
				hideLoading()
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
		if(!sessionManage.getItem('token') || !this.refs.clientWrap) {
			errorLogOut()
			return 
		}
		setTimeout(() => {
			this.refs.clientWrap && this.setState({
				tableHeight: this.refs.clientWrap.offsetHeight - 120
			})
		}, 500)
		
		windowResize(() => {
			this.refs.clientWrap && this.setState({
				tableHeight: this.refs.clientWrap.offsetHeight - 120
			})
		})
	}
	render () {
		const columns = [{
			title: '序号',
			dataIndex: 'index',
			key: 'index',
			render: (text, record, index) => {
				
				return (
					<div>{index + 1}</div>
				)
			},
			width: 100
		},{
			title: '用户名',
			dataIndex: 'userName',
			key: 'userName',
			width: '20%'
		}, {
			title: '用户IP',
			dataIndex: 'ip',
			key: 'ip',
			width: '20%'
		}, {
			title: '部门名称',
			dataIndex: 'deptName',
			key: 'deptName',
			width: '20%'
		}, {
			title: '登录时间',
			dataIndex: 'loginTime',
			key: 'loginTime'
		}]
		return (
			<div className="client_wrap" ref='clientWrap' style={{width: '100%', height: '100%', background: '#fff', padding: '10px'}}>
				<div style={{padding: '20px 0'}}>在线客户端<span style={{marginLeft: '20px'}}>{this.state.clientList.length}</span></div>
				<Table bordered={true} rowClassName={(record, index) => {
						// 奇数  偶数
						if(index % 2 === 0) {
							// 偶数
							return "even"
						} else {
							return "odd"
						}
						
					}} onRowClick={this.selectLine.bind(this)} dataSource={this.state.clientList} columns={columns} rowKey={(record, index) => index } pagination={false} scroll={{ y:this.state.clientList.length * 43 > this.state.tableHeight ? this.state.tableHeight : false }} />
			</div>
		)
	}
}
export default ClientStastic