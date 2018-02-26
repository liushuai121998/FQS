import React, { Component } from 'react'
import moment from 'moment'
import { DatePicker, Button, Table } from 'antd'
import globalService from './global.js'

import './logs.css'

const { RangePicker } = DatePicker;
const {getJson, hideLoading, showLoading, errorLogOut} = globalService

const defaultNo = 20 	// 默认显示多少条数据

class LogSearch extends Component {
	constructor (props) {
		super(props)
		this.timeChange = this.timeChange.bind(this)
		this.confirmLogs = this.confirmLogs.bind(this)
		this.state = {
			logLists: [],
			total: defaultNo,
			// 表格的高度
			tableHeight: '',
			// 默认第一页
			defaultCurrent: 1
		}
		this.timeRange = []
	}
	/**
	 * 时间的改变
	 */
	timeChange (date, dateString) {
		// 时间范围
		this.timeRange = dateString
		
	}
	/**
	 * 确定按钮
	 */
	confirmLogs () {
//		console.log(this.timeRange)
		// 发送请求
		let param = {
			startTime: this.timeRange[0],
			endTime: this.timeRange[1],
			pageSize: defaultNo,
			pageNo: 1
		}
		this.setState({
			defaultCurrent: 1
		})
		this.getLogsData(param)
	}
	// 获取日志数据
	getLogsData (param) {
		showLoading()
		getJson('get', '/API/monit/log', param, (res) => {
//			console.log(res)
			if(res.status === 1000) {
				this.setState({
					logLists: res.data.list,
					total: res.data.total
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
	// 挂载前 
	componentWillMount () {
		// 初始化
		let param = {
			pageSize: defaultNo,
			pageNo: 1
		}
		this.getLogsData(param)
	}
	// 已经挂载
	componentDidMount () {
		this.setState({
			tableHeight: this.refs.logsWrap.offsetHeight - 145
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
			title: '操作类型',
			dataIndex: 'operationType',
			key: 'operationType',
			width: '15%'
		}, {
			title: '操作员',
			dataIndex: 'userId',
			key: 'userId'
		}, {
			title: 'IP',
			dataIndex: 'ip',
			key: 'ip',
			width: '15%'
		}, {
			title: '操作内容',
			dataIndex: 'describe',
			key: 'describe',
			width: '30%'
		}, {
			title: '操作时间',
			dataIndex: 'createTime',
			key: 'createTime',
			width: '20%'
		}]
		// 分页的配置
				let pagination = {
					total: this.state.total,		// 数据总量
					defaultPageSize: defaultNo,	// 默认每页显示多少条数据
					defaultCurrent: 1,		// 默认的当前页	
					current: this.state.defaultCurrent,		// 当前页
					showSizeChanger: true,	// pageSize 是否可变
					pageSizeOptions: [`${defaultNo}`, '50', '100'],		// pageSize 的可选范围
					onChange: (page, pageSize) => {			// pageNo 发生变化时

						this.setState({
							defaultCurrent: page
						})
						// 发送请求
						let param = {
							pageNo: page,
							pageSize: pageSize,
							startTime: this.timeRange[0],
							endTime: this.timeRange[1]
						}
//						console.log(param)
						this.getLogsData(param)
					},
					onShowSizeChange: (current, size) => {			// pageSize 发生变化时
						// 发送请求
						this.setState({
							defaultCurrent: 1
						})
						
						let param = {
							pageNo: 1,
							pageSize: size,
							startTime: this.timeRange[0],
							endTime: this.timeRange[1]
						}
						this.getLogsData(param)
					},
					showQuickJumper: true
				}
		return (
			<div className='logs_wrap' ref='logsWrap'>
				<div className='select_time'>
					<RangePicker onChange={this.timeChange} showTime={{
				        hideDisabledOptions: true,
				        defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('00:00:00', 'HH:mm:ss')],
				      }}
      				  format="YYYY-MM-DD HH:mm:ss" />
					<Button type='primary' onClick={this.confirmLogs} style={{marginLeft: '20px'}}>确认</Button>
				</div>
				<Table bordered={true} rowClassName={(record, index) => {
						// 奇数  偶数
						if(index % 2 === 0) {
							// 偶数
							return "even"
						} else {
							return "odd"
						}
						
					}} onRowClick={this.selectLine.bind(this)} dataSource={this.state.logLists} columns={columns} rowKey={(record, index) => index } pagination={pagination} scroll={{ y: this.state.tableHeight }} />
			</div>
		)
	}
}
export default LogSearch