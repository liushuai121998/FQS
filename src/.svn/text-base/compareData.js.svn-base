import React, {Component} from 'react'
import {Table, Select, Tooltip} from 'antd'
import axios from 'axios'

import './compareData.css'

import globalService from './global.js'

import _ from 'lodash'

let Option = Select.Option


let {compareUrl, showLoading, hideLoading, errorMsg} = globalService

function getJson (url, data, callback) {
	axios.get(url, {
    			params: data
    		})
		    .then((res) => {
		    	callback(res.data)
		    })
		    .catch((err) => {
		    	hideLoading()
		    })
}


function handleTime (time) {
	if(time) {
		
		let str = time.slice(-8, -3).split(':').join('')
		return str
	} else {
		return '--'
	}
}

let getColumns = (titleName) => {
	return [
	{
		title: '序号',
		dataIndex: 'index',
		key: 'index',
		fixed: 'left',
		render: (text, record, index) => {
				return (
					<span>{index + 1}</span>
				)
		},
		className: 'index'
	},
		{title: titleName,
		children: [
	{
		title: '月-日',
		dataIndex: 'operationDate',
		key: 'operationDate',
		render: (text, record, index) => {
			let operationDate = record.operationDate
			operationDate = operationDate ? operationDate.slice(5, 10) : '--'
			return (
				<span>{operationDate}</span>
			)
		},
		className: 'operationDate'
	},
	{
				title: '到港',
				dataIndex: 'flightNo',
				key: 'A',
				render: (text, record, index) => {
					let str = '--'
					if(record.aord === 'A') {
						str = record.flightNo
					}
					return (
							<span>{str}</span>
						)
					
				},
		className: 'flightNo_A'
		},
	{
				title: '离港',
				dataIndex: 'flightNo',
				key: 'D',
				render: (text, record, index) => {
					let str = '--'
					if(record.aord === 'D') {
						str = record.flightNo
					}
					return (
							<span>{str}</span>
						)
					
				},
		className: 'flightNo_D'

	},
	{
		title: '重复号',
		dataIndex: 'repeatCount',
		key: 'repeatCount',

		render: (text, record, index) => {
			let str = record.repeatCount || '--'
			return (
				<span>{str}</span>
			)
		},
		className: 'repeatCount'
	},{
		title: '机号',
		dataIndex: 'acRegNo',
		key: 'acRegNo',

		render: (text, record, index) => {
			let str = record.acRegNo || '--'
			return (
				<span>{str}</span>
			)
		},
		className: 'acRegNo'
	},
	{
				title: '类型',
				dataIndex: 'dori',
				key: 'dori',
		render: (text, record, index) => {
			let str = record.dori || '--'
			return (
				<span>{str}</span>
			)
		},
		className: 'dori'
	},
{
				title: '机型',
				dataIndex: 'aircraftType',
				key: 'aircraftType',
		render: (text, record, index) => {
			let str = record.aircraftType || '--'
			return (
				<span>{str}</span>
			)
		},
		className: 'aircraftType'
	},{
				title: 'VIP',
				dataIndex: 'flgVip',
				key: 'flgVip',
		render: (text, record, index) => {
			let str = record.flgVip || '--'
			return (
				<span>{str}</span>
			)
		},
		className: 'flgVip'
	},
	{
				title: '共享航班',
				dataIndex: 'codeShare',
				key: 'codeShare',
		render: (text, record, index) => {
			let result = record.codeShare
			if(result) {
				<Tooltip placement="topLeft" title={result} overlayStyle={{wordWrap : 'break-word'}}>
					<span>{result}</span>
			 	</Tooltip>
			} else {
				return (
					<span>--</span>
				)
			}
			
		},
		className: 'codeShare'
			},
	{
				title: '任务',
				dataIndex: 'taskCode',
				key: 'taskCode',
		render: (text, record, index) => {
			let str = record.taskCode || '--'
			return (
				<span>{str}</span>
			)
		},
		className: 'taskCode'
			},
	{
				title: '运营状态',
				dataIndex: 'operationalStatus',
				key: 'operationalStatus',
		render: (text, record, index) => {
			let str = record.operationalStatus || '--'
			return (
				<span>{str}</span>
			)
		},
		className: 'operationalStatus'
			},
	{
				title: '进程状态',
				dataIndex: 'processStatus',
				key: 'processStatus',
		render: (text, record, index) => {
			let str = record.processStatus || '--'
			return (
				<span>{str}</span>
			)
		},
		className: 'processStatus'
			},
	{
				title: '值机柜台',
				dataIndex: 'checkinRange',
				key: 'checkinRange',
		render: (text, record, index) => {
			let str = record.checkinRange || '--'
			return (
				<span>{str}</span>
			)
		},
		className: 'checkinRange'
			},
	{
				title: '行李转盘',
				dataIndex: 'carousel',
				key: 'carousel',
		render: (text, record, index) => {
			let str = record.carousel || '--'
			return (
				<span>{str}</span>
			)
		},
		className: 'carousel'
			},
	{
				title: '航线',
				dataIndex: 'flightCourse',
				key: 'flightCourse',
		render: (text, record, index) => {
			let str = record.flightCourse || '--'
			return (
				<span>{str}</span>
			)
		},
		className: 'flightCourse'
			},
	{
				title: '始发站',
				dataIndex: 'originalAirport',
				key: 'originalAirport',
		render: (text, record, index) => {
			let str = record.originalAirport || '--'
			return (
				<span>{str}</span>
			)
		},
		className: 'originalAirport'
			},
	{
				title: '目的站',
				dataIndex: 'destAirport',
				key: 'destAirport',
		render: (text, record, index) => {
			let str = record.destAirport || '--'
			return (
				<span>{str}</span>
			)
		},
		className: 'destAirport'
			},
	{
				title: '经停站',
				dataIndex: 'transit',
				key: 'transit',
		render: (text, record, index) => {
			let str = record.transit || '--'
			return (
				<span>{str}</span>
			)
		},
		className: 'transit'
			},
	{
				title: '机位',
				dataIndex: 'finalParkingbayId',
				key: 'finalParkingbayId',
		render: (text, record, index) => {
			let str = record.finalParkingbayId || '--'
			return (
				<span>{str}</span>
			)
		},
		className: 'finalParkingbayId'
			},
	{
				title: '登机口',
				dataIndex: 'gate',
				key: 'gate',
		render: (text, record, index) => {
			let str = record.gate || '--'
			return (
				<span>{str}</span>
			)
		},
		className: 'gate'
			},
	{
				title: '计到',
				dataIndex: 'sta',
				key: 'sta',
				render: (text, record, index) => {
					return (
						<span>{handleTime(record.sta)}</span>
					)
				},
		className: 'sta'
			},
	{
				title: '预到',
				dataIndex: 'eta',
				key: 'eta',
				render: (text, record, index) => {
					return (
						<span>{handleTime(record.eta)}</span>
					)
				},
		className: 'eta'
			},
	{
				title: '实到',
				dataIndex: 'ata',
				key: 'ata',
				render: (text, record, index) => {
					return (
						<span>{handleTime(record.ata)}</span>
					)
				},
		className: 'ata'
			},
	{
				title: '计离',
				dataIndex: 'std',
				key: 'std',
				render: (text, record, index) => {
					return (
						<span>{handleTime(record.std)}</span>
					)
				},
		className: 'std'
			},
	{
				title: '预离',
				dataIndex: 'etd',
				key: 'etd',
				render: (text, record, index) => {
					return (
						<span>{handleTime(record.etd)}</span>
					)
				},
		className: 'etd'
		},
	{
				title: '实离',
				dataIndex: 'atd',
				key: 'atd',
				render: (text, record, index) => {
					return (
						<span>{handleTime(record.atd)}</span>
					)
				},
		className: 'atd'
			},
	{
			title: '预位',
			dataIndex: 'estimatedInBlockTime',
			key: 'estimatedInBlockTime',
			render: (text, record, index) => {
//			let str = record.estimatedInBlockTime || '--'
//			return (
//				<span>{str}</span>
//			)
			return (
						<span>{handleTime(record.estimatedInBlockTime)}</span>
					)
		},
		className: 'estimatedInBlockTime'
			},
	{
				title: '异常原因',
				dataIndex: 'abnormalCauseCn',
				key: 'abnormalCauseCn',
		render: (text, record, index) => {
			let str = record.abnormalCauseCn || '--'
			return (
				<span>{str}</span>
			)
		},
		className: 'abnormalCauseCn'
		}]
	}
	]
}


export default class CompareData extends Component {
	constructor (props) {
		super(props);
		this.state = {
			dbFlights: [],
			cacheFlights: [],
			tableHeight: 0,
			cacheStr: '',
			dbStr: '',
			// 比对的结果
			compareResult: ''
		}
	}
	getInitData () {
		getJson(compareUrl, '', (res) => {
			console.log(res)
			if(res.status === 1000) {
				
				let diffDbFlights = []
				let diffCacheFlights = []
				
				let dbToCache = res.data['db-cache']
				let cacheToDb = res.data['cache-db']
				
				let dbFlights = _.cloneDeep(res.data.dbFlights)
				let cacheFlights = _.cloneDeep(res.data.cacheFlights)

				let compareAttrs = res.data.compareAttrs
				
				let cacheFlightsArr = cacheFlights.map(item => item.id)
				let dbFlightsArr = dbFlights.map(item => item.id)
				let dbIndex = ''
				
				if(cacheToDb.length > 0) {
					
					let str = '存在数据量不同的航班号: ('
					cacheToDb.forEach(item => {
						let i = cacheFlightsArr.indexOf(item.id)
						console.log(i)
						if(i > 0) {
							
							str += (cacheFlights[i].flightNo) + ' '
							
							diffDbFlights.push({difference: true})
							cacheFlights[i].difference = true
							diffCacheFlights.push(cacheFlights[i])
							
							//dbFlights.splice(i, 0, {difference: true})
							
						}
					})
					
					dbIndex = str + ')'
					
				}
				
				let dbStr = ` 到港数据: ${dbFlights.filter(item => item.aord === 'A').length}, 离港数据: ${dbFlights.filter(item => item.aord === 'D').length} ${dbIndex}`
				
				let cacheIndex = ''
				
				if(dbToCache.length > 0 ) {
					let dbFlightsArr = dbFlights.map(item => item.id)
					let str = '存在数据量不同的航班号: ('
					dbToCache.forEach(item => {
						let i = dbFlightsArr.indexOf(item.id)
						if(i > 0) {
							
							diffCacheFlights.push({difference: true})
							dbFlights[i].difference = true
							diffDbFlights.push(dbFlights[i])
							
							str += (dbFlights[i].flightNo) + ' '
							// cacheFlights.splice(i, 0, {difference: true})
						}
					})
					cacheIndex = str + ')'
				}
				

				let updateCacheIndex = ''
				let columns = getColumns('')[1].children
				let keysArr = columns.map(item => item.dataIndex)
				
				let diffDbKeys = []
				let diffCacheKeys = []
				
				if(compareAttrs.length > 0) {
						let str = '存在字段不一样的航班号: ('
						compareAttrs.forEach(item => {
							
							let keys = []
							
							let i = cacheFlightsArr.indexOf(item.id)
							
							if(i >= 0) {
								str += (cacheFlights[i].flightNo) + ' '
								cacheFlights[i].isUpdate = true	
								
								diffCacheFlights.push(cacheFlights[i])
								for(let n in item) {
									let keyIndex = keysArr.indexOf(n)
									if(keyIndex > 0) {
										keys.push(keyIndex)	
									}
								}
							
								diffCacheKeys.push({
									keys,
									index: (diffCacheFlights.length) - 1,
								})
								
							}
							
							let j = dbFlightsArr.indexOf(item.id)
//							let dbKeys = []
							if(j > 0) {
								dbFlights[j].isUpdate = true	
								diffDbFlights.push(dbFlights[j])
								
//								for(let n in item) {
//									let keyIndex = keysArr.indexOf(n)
//									if(keyIndex > 0) {
//										dbKeys.push(keyIndex)	
//									}
//								}
//								
//								diffDbKeys.push({
//									keys: dbKeys,
//									index: (diffDbFlights.length) - 1,
//								})
							}
							
						})
						updateCacheIndex = str + ')'
				}
				
				let cacheStr = ` 到港数据: ${cacheFlights.filter(item => item.aord === 'A').length}, 离港数据: ${cacheFlights.filter(item => item.aord === 'D').length}`
				//  ${cacheIndex} ${updateCacheIndex}
				this.setState({
					
					dbFlights: diffDbFlights,
					cacheFlights: diffCacheFlights,
					dbStr,
					cacheStr,
					compareResult: `${cacheIndex} ${updateCacheIndex}`
					
				}, () =>{
					
					hideLoading()
					
					if(diffCacheKeys.length > 0) {
						let {dbFlights, cacheFlights} = this.state
					
						let trNodes = document.querySelectorAll('.compare1Table .ant-table-body tr')
						let cacheNodes = document.querySelectorAll('.compare2Table .ant-table-body tr')
						
						
//						console.log(diffCacheKeys)

//						diffDbKeys.forEach(item => {
//							item.keys.forEach(keyIndex => {
//								trNodes[item.index].querySelectorAll('td')[keyIndex + 1].style.background = 'yellow'
//							})
//						})
						
						diffCacheKeys.forEach(item => {
							item.keys.forEach(keyIndex => {
								trNodes[item.index].querySelectorAll('td')[keyIndex + 1].style.background = 'yellow'
								cacheNodes[item.index].querySelectorAll('td')[keyIndex + 1].style.background = 'yellow'
							})
						})
						
					}
					
					
//					let cacheFlights = this.state.cacheFlights
//					let cacheFlightsArr = cacheFlights.map(item => item.id)
//					let updateCacheIndex = ''
//					if(compareAttrs.length > 0) {
//						let str = '存在字段不一样的索引: ('
//						compareAttrs.forEach(item => {
//							
//							let i = cacheFlightsArr.indexOf(item.id)
//							
//							if(i >= 0) {
//								str += (i + 1) + ' '
//								let trNodes = document.querySelectorAll('.compare2Table .ant-table-body tr')
//								let columns = getColumns('')[1].children
//								
//								let keysArr = columns.map(item => item.dataIndex)
//								for(let n in item) {
//									let keyIndex = keysArr.indexOf(n)
//									if(keyIndex > 0) {
//										if(trNodes[i].querySelectorAll('td')[keyIndex + 1] ) {
//											trNodes[i].querySelectorAll('td')[keyIndex + 1].style.background = 'yellow'
//										}
//										
//									}
//									
//								}
//								
//								cacheFlights[i].isUpdate = true	
//								
//							}
//						})
//						updateCacheIndex = str + ')'
//					}
//					let {cacheStr} = this.state
//					cacheStr = cacheStr + ' ' + updateCacheIndex
//					this.setState({
//						cacheFlights,
//						cacheStr,
//					})
				})
				
			} else {
				hideLoading()
				errorMsg('系统错误, 请联系管理员')
			}
		})
	}
	componentWillMount () {
		showLoading()
		this.getInitData()
		
//		this.timeId = setInterval(() => {
//			this.getInitData()
//		}, 5*60*1000)
		
		document.title = '航班比对系统'
		
	}
	componentDidMount () {
		setTimeout(() => {
			this.setState({
				tableHeight: document.documentElement.clientHeight - 224
			})
		}, 1000)
		let tableBody = document.querySelectorAll('.ant-table-body')

		// 滚动
		enterLeave(tableBody[0], tableBody[1])
		enterLeave(tableBody[1], tableBody[0])
		
		/**
		 * tableScroll
		 * @param {Object} dom1
		 * @param {Object} dom2
		 */
		function tableScroll (dom1, dom2) {
			dom1.onscroll = (ev) => {
				dom2.scrollLeft = ev.target.scrollLeft
				dom2.scrollTop = ev.target.scrollTop
			}
		}
		/**
		 * enterLeave
		 * @param {Object} dom1
		 * @param {Object} dom2
		 */
		function enterLeave (dom1, dom2) {
			dom1.onmouseenter = () => {
				tableScroll(dom1, dom2)
			}
			
			dom1.onmouseleave = () => {
				dom1.onscroll = null
			}
		}
		
	}
	rowClassName (record, index) {
		let className = ''
		if(record.difference) {
			className = 'difference_flight'
		} else if(record.isUpdate) {
			className = 'update_flight'
		}
		return className
	}
	rowClick (record, index) {
		console.log(record)
	}
	getData (value) {
		if(this.timeId) {
			clearInterval(this.timeId)
		}
		
		if(this.newTimeId) {
			clearInterval(this.newTimeId)
		}
		
//		this.newTimeId = setInterval(() => {
//			this.getInitData()
//		}, value * 60 * 1000)
		
	}
	render () {
		return (
			<div>
				<div style={{padding: '20px 0', fontSize: '16px', }} className='clearfix'>
					<div style={{float: 'left'}}>数据比对</div>
					<div style={{marginLeft: '30px', float: 'left'}}>
						{/*每<Select defaultValue='5' style={{width: '100px'}} onChange={this.getData.bind(this)}>
							<Option value='5'>5分钟</Option>
							<Option value='10'>10分钟</Option>
						</Select>请求一次*/}(按Ctrl+F 搜索航班号找到相应的数据)
					</div>
				</div>
				<div className='compare_result'>
					<Tooltip placement="topLeft" title={this.state.compareResult} overlayStyle={{wordWrap : 'break-word'}}>
						<span>{this.state.compareResult}</span>
			 		</Tooltip>
				</div>
				<div className='table_compare' style={{whiteSpace: 'nowrap'}}>
					<div className='compare1' style={{display: 'inline-block', width: 'calc(50% - 10px)'}}>
						<Table rowClassName={this.rowClassName.bind(this)} className='compare1Table' dataSource={this.state.dbFlights} columns={getColumns('db中的数据 ' + this.state.dbStr)} pagination={false} bordered rowKey={(record, index) => {return index}} scroll={{x: 2600, y: this.state.tableHeight}}/>
					</div>
					<div className='compare2' style={{display: 'inline-block', width: 'calc(50% - 10px)', marginLeft: '20px'}}>
						<Table rowClassName={this.rowClassName.bind(this)} onRowClick={this.rowClick.bind(this)} className='compare2Table' dataSource={this.state.cacheFlights} columns={getColumns('缓存中的数据' + this.state.cacheStr)} pagination={false} bordered rowKey={(record, index) => {return index}} scroll={{x: 2600, y: this.state.tableHeight}}/>
					</div>
				</div>
			</div>
		)
	}
}
