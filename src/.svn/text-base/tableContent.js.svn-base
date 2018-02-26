import React, {PureComponent} from 'react'
import {Icon, Dropdown, Menu, Modal, Select, Input, Button, Tabs, Checkbox, Transfer, Table, Tooltip} from 'antd'

import globalService from './global.js'
import './App.css'
import './tableContent.css'
import smallLogo from './img/logo_small.png'

// 全局的工具类
let {UpdateForm, confirmModal, localManage, getSearchJson, sessionManage, hideLoading, wsConnect, showLoading, successMsg, warningMsg, heartWatch, aord, dori, appHistory, reGetInitData, logOut, errorLogOut, windowResize, showLen, getSyncJson, resetInit, disConnect, refreshData, modalInfo, reConnectMQCount} = globalService	

const MenuItem = Menu.Item
const Option = Select.Option
const TabPane = Tabs.TabPane

const CheckboxGroup = Checkbox.Group;

// 到离港	'A' 'D' 对应关系
let reverseAord = {
	
}
for(let n in aord) {
	reverseAord[aord[n]] = n
}
// 类型		对应关系
let reverseDori = {
	
}
for(let n in dori) {
	reverseDori[dori[n]] = n
}
//深度克隆
/**
 * 深度克隆
 * @param {Object} obj
 */
function deepClone(obj){
    var result,oClass=isClass(obj);
        //确定result的类型
    if(oClass==="Object"){
        result={};
    }else if(oClass==="Array"){
        result=[];
    }else{
        return obj;
    }
    for(var key in obj){
        var copy=obj[key];
        if(isClass(copy)=="Object"){
            result[key]=deepClone(copy);//递归调用
        }else if(isClass(copy)=="Array"){
            result[key]=deepClone(copy);
        }else{
            result[key]=obj[key];
        }
    }
//	var result = JSON.parse(JSON.stringify(obj))
    return result;
}
//返回传递给他的任意对象的类
/**
 * 判断类型
 * @param {Object} o
 */
function isClass(o){
    if(o===null) return "Null";
    if(o===undefined) return "Undefined";
    return Object.prototype.toString.call(o).slice(8,-1);
}


/**
 * push新方法
 * @param {Object} newItem
 */
Array.prototype.newPush = function (newItem){
	let flag = false
	this.forEach(item => {
		if(item.id.indexOf(newItem.id) >= 0) {
			flag = true
			return
		}
	})
	!flag && this.push(newItem)
	return this
}
/**
 * 处理航班连班的数组方法 	找到对应的连班航班index
 * @param {Object} arr
 * @param {Object} keyName
 * @param {Object} valueName
 */
function arrUtil (arr, keyName, valueName) {
	let searchIndex = -1;
			
	let flag = []
	for(let i=0,len=arr.length; i<len; i++) {
		flag = []
				
		keyName.forEach((item, index) => {
			if(arr[i][item] && arr[i][item] == valueName[index]) {
				flag.push(true)
			}
		})
				
		if(flag.length === valueName.length) {
			searchIndex= i;
			break;
		}		
	}
	
	return searchIndex;	// 找到对应连班的索引
}

/**
 * sortNo 排序
 */
function sortNoSort (data) {
	let sortData = [], noSortData = [];
	
	// 新用户不用排序了(没做任何配置)
	let count = 0
	data.forEach(item => {
		if(item.sortNo != -1) {
			if(item.sortNo == 0) {
				// 基础列没做任何配置
				count++
			}
			sortData.push(item)
		} else {
			count++
			noSortData.push(item)
		}
	})

	if(count === data.length) {
		// 说明没做任何的配置（新用户）
		return data
	} else {
		
		sortData.sort((a, b) => {
			let aNo = Number(a['sortNo'])
			let bNo = Number(b['sortNo'])
			if(aNo > bNo) {
				return 1
			} else if(aNo < bNo) {
				return -1
			} else if(aNo === bNo) {
				return 0
			}
		})
		return [...sortData, ...noSortData];
	}
	
	
}

/**
 * 单列搜索的方法
 */
let columnSearchMethod = {
	/**
	 * 大于
	 */
	daYun (itemKey, str) {
			if(itemKey.indexOf(',') > 0) {
								let arr = itemKey.split(',')
								let flag = false
								arr.forEach((arrItem) => {
									arrItem = arrItem.trim()
									if(Number(arrItem) > Number(str)) {
										flag = true
									}
								})
								if(flag) {
									return true
								}
							} else {
								return Number(itemKey) > Number(str)
							}
		},
	/**
	 * 小于
	 */
		xiaoYu (itemKey, str) {
			if(itemKey.indexOf(',') > 0) {
								let arr = itemKey.split(',')
								let flag = false
								arr.forEach((arrItem) => {
									arrItem = arrItem.trim()
									if(Number(arrItem) < Number(str)) {
										flag = true
									}
								})
								if(flag) {
									return true
								}
							} else {
								return Number(itemKey) < Number(str)
							}
		},
		/**
		 * 大于小于
		 */
		daXiaoYu (itemKey, start, end) {
			if(itemKey.indexOf(',') > 0) {
									let arr = itemKey.split(',')
									let flag = false
									arr.forEach((arrItem) => {
										arrItem = arrItem.trim()
										arrItem = isNaN(Number(arrItem)) ? arrItem : Number(arrItem)
										if(arrItem >= start && arrItem <= end) {
											flag = true
										}
									})
									if(flag) {
										return true
									}
								} else {
									let str = isNaN(itemKey) ? itemKey : Number(itemKey)
									return str >= start && str <= end 
								}
		},
		/**
		 * 使用，和-隔开
		 */
		fun1 (itemKey, start, end) {
					let flag = false
					if(itemKey.indexOf(',') >= 0) {
										
										let arr1 = itemKey.split(',')
										arr1.forEach(item1 => {
											item1 = item1.trim()
											item1 = isNaN(Number(item1)) ? item1 : Number(item1)
											
											if(item1 >= start && item1 <= end) {
												flag = true
											}
											
										})
										
									} else {
										
										let str = isNaN(Number(itemKey)) ? itemKey : Number(itemKey)
										
										if(str >= start && str <= end) {
											flag = true
										}
										
									}
					return flag
				},
		/**
		 * 使用，-隔开
		 */
				fun2 (itemKey, arrItem) {
					let flag = false
					if(itemKey.indexOf(',') >= 0) {
										
										let arr1 = itemKey.split(',')
										arr1.forEach(item1 => {
											item1 = item1.trim()
											item1 =  isNaN(Number(item1)) ? item1 : Number(item1)
											if(itemKey == item1) {
					
												flag = true
											}
										})
										
									} else {
										
										arrItem = isNaN(Number(arrItem)) ? arrItem : Number(arrItem)
										if(itemKey == arrItem) {
											flag = true
										}
										
									}
					return flag
				}
}


export default class TableContent extends PureComponent {
	constructor (props) {
		super (props)
		// 初始化state
		this.state = {
			start: 0,
			showLen: showLen,
			tableData: [],
			// 初始化的table数据
			initTableData: [],
			// 过滤后的table数据
			filterTableData: [],
			// 修改密码的form表单框
			formModal: false,
			userName: sessionManage.getItem('userName'),
			updateDataModal: false,

			// 基础表头数据
			showTheaderArr: [],
			initTheaderArr: [],
			// 服务表头数据
			serviceTheaderArr: [],
			initServiceTheader: [],
			// 表格高度
			tableHeight: '',
			// 表格宽度
			tableWidth: '',
//			tableLoading: true,
			// 界面配置的模态框
			configModalShow: false,
			// 颜色示例
			colorConfigShow: false,
			// 初始化完毕
			initEnd: false,
			// 输入框的值
			searchValue: '',
			columnSearchTitle: '',
			// 按列搜索输入框的值
			columnSearchValue: '',
			// 基础列
			optionalBaseCols: [],
			optionalServiceCols: [],
			selectedBaseKey: [],
			initSelectedBaseKey: [],
			// 服务列
			initSelectedServiceKey: [],
			selectedServiceKey: [],
			
			optionalCols: [],	// 可选的列（包括服务列和航班列）
			selectedKey: [], // 选择的key（包括服务列和航班列）
			initSelectedKey: [],
			
			upDownDisabled: true,
			// 到离港
			optionalAord: [],
			selectedAord: [],
			initSelectedAord: [],
			// 类型
			optionalDori: [],
			selectedDori: [],
			initSelectedDori: [],
			// 到离港默认值
			defaultAordValue: 'all',
			// 类型的默认值
			defaultDoriValue: 'all',
			// 
			clickAordSave: false,
			// 全选	全不选
			aordIndeterminate: true,
			doriIndeterminate: true,
			checkAordAll: false,
			checkDoriAll: false,
			// 合并的数据大小
			mergeLength: 0,
			// 到港的数据大小
			comeLength: 0,
			// 离港的数据大小
			leaveLength: 0,
			// 初始化未做任何处理的数据
			initData: [],
			
			// 
			sortInfo: {},
			// 连接状态
			connectStatus: '',
			prevColumnTitle: '',
			prevColumnValue: '',
			// 默认的排序规则
			defaultSortRule: 'IA',
			isLiu: false
		}
		
		
		
		// 搜索输入框的内容
		this.inputValue = ''
		
		// 类型
		this.flightType = 'all'
		// 状态
		this.flightStatus = 'all'
		// 到离港
		this.comeLeaveStr = 'all'
		
		// 到港
		this.comeData = []
		// 离港
		this.leaveData = []
		// 到离港合并
		this.mergeData = []
		// 全局搜索
		// 激活的Tab的key
		this.activeKey = '1'
		
		this.targetSelectedKeys = []
		this.targetSelectedSerKeys = []
		
		//
		this.updateMsg = []
		
		this.startUpdate = 0
		this.endUpdate = 50
		
		// 到港的服务
		this.comeServices = []
		// 离港的服务
		this.leaveServices = []
		
		
		this.widthChange = {}
		
		// 排序规则
		this.sortRule = 'IA'	// 默认地服排序

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
				if(res.status === 1000 || res.status === 1009) {
					this.isLogOut = true
					// 退出系统
					appHistory.push({
						pathname: '/'
					})
					
					sessionManage.removeItem('token')
					sessionManage.removeItem('admin')
					sessionManage.removeItem('userName')
					
					disConnect()	// 断开rabitMq的连接
					
					// 停止心跳
					if(heartWatch.timeId != null) {
                		clearInterval(heartWatch.timeId)
                	}
					
				}
			})
			
		}
	}
	/**
	 * 确定同步数据
	 */
	confirmUpdate (isConfirm) {
		if(isConfirm) {
			showLoading('正在同步, 请稍后...')
			// 调用数据同步的接口
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
	/**
	 * 界面配置
	 */
	uiConfig (ev) {
		let { optionalAord, optionalDori, selectedDori, selectedAord, initSelectedDori, initSelectedAord} = this.state

		ev.preventDefault()
		this.setState({
//			optionalBaseCols: [],
//			selectedBaseKey: [],
//			initSelectedBaseKey: [],
			/**
			 * 打开界面配置之后，到离港配置，类型配置的选中与不选中的情况
			 */
			selectedDori: initSelectedDori,
			selectedAord: initSelectedAord,
			aordIndeterminate: !!initSelectedAord.length && (initSelectedAord.length < optionalAord.length),
			doriIndeterminate: !!initSelectedDori.length && (initSelectedDori.length < optionalDori.length),
			checkDoriAll: initSelectedDori.length === optionalDori.length,
			checkAordAll: initSelectedAord.length === optionalAord.length,
			/**
			 * 
			 */
			optionalCols: [],
			selectedKey: [],
			initSelectedKey: []
		}, () => {
			
			this.getFlightConfig(() => {
				this.targetSelectedKeys = []
				this.targetSelectedSerKeys = []
				this.setState({
					configModalShow: true,
					upDownDisabled: true
				})
			})
			
		})
	}
	/*
	 * 导出数据
	 */
	exportData (ev) {
		ev.preventDefault()
		confirmModal(() => {
			let {showTheaderArr, serviceTheaderArr, tableData, start, columnSearchTitle, sortInfo, selectedDori, searchValue, defaultSortRule} = this.state
			let searchConfig = {
				aord: this.comeLeaveStr,
				dori: {
					statusKey: this.flightType,
					statusValue: selectedDori
				},
				status: this.flightStatus,
				column: {
					columnSearchTitle: this.columnSearchTitle,
					columnSearchValue: this.state.prevColumnValue
				},
				searchValue,
				sortRule: defaultSortRule	// 采用的排序规则
			}
			
			exportTableData(showTheaderArr, serviceTheaderArr, start, tableData, searchConfig, sortInfo)
			
		}, () => {}, '是否导出当前页面数据？')
		
	}
	/**
	 * 航班的过滤
	 */
	filterSelectFlight (initTableData) {
		console.log('filterSelectFlight................start')
		let {selectedDori, mergeLength, comeLength, leaveLength} = this.state		// 类型

		let tableData = []
		if(this.flightStatus === 'all') {
			if(this.flightType === 'all') {		// 类型
				
				tableData = initTableData.filter((item) => {
					if(item.dori) {
							// 合并的
						if(item.dori.indexOf(' / ') >= 0 ) {
							let arr = item.dori.split(' / ')
							return selectedDori.indexOf(arr[0]) >= 0 || selectedDori.indexOf(arr[1]) >= 0
						} else {
							return selectedDori.indexOf(item.dori) >= 0
						}
					}
				})
				
			} else {
				
				tableData = initTableData.filter((item) => {
						if(item.dori) {
							// 合并的
							return item.dori.indexOf(this.flightType) >= 0
						} 
				})
				
			}
		} else {
			if(this.flightType === 'all') {		// 类型
//				console.log(this.flightStatus)
				tableData = initTableData.filter((item) => {
					if(item.dori) {
							// 合并的
						if(item.dori.indexOf(' / ') >= 0 ) {
							let arr = item.dori.split(' / ')
//							return (selectedDori.indexOf(arr[0]) >= 0 || selectedDori.indexOf(arr[1]) >= 0) && item.operationalStatus.indexOf(this.flightStatus) >= 0
							return (selectedDori.indexOf(arr[0]) >= 0 || selectedDori.indexOf(arr[1]) >= 0) && item.newStatus.indexOf(this.flightStatus) >= 0
						} else {
//							return selectedDori.indexOf(item.dori) >= 0 && item.operationalStatus.indexOf(this.flightStatus) >= 0
							return selectedDori.indexOf(item.dori) >= 0 && item.newStatus.indexOf(this.flightStatus) >= 0
						}
						
					} else {
//						return item.operationalStatus.indexOf(this.flightStatus) >= 0
						return item.newStatus.indexOf(this.flightStatus) >= 0
					}
				})
				
			} else {
				
				tableData = initTableData.filter((item) => {
						if(item.dori) {
							// 合并的
//							return item.operationalStatus.indexOf(this.flightStatus) >= 0 && item.dori.indexOf(this.flightType) >= 0
							return item.newStatus.indexOf(this.flightStatus) >= 0 && item.dori.indexOf(this.flightType) >= 0
						}
				})
				
			}	
		}
		if(this.comeLeaveStr === 'all') {
			mergeLength = tableData.filter((item) => item.aord === 'A / D').length
			//console.log(tableData)
			comeLength = tableData.filter((item) => item.aord.indexOf('A') >= 0).length
			leaveLength = tableData.filter((item) => item.aord.indexOf('D') >= 0).length
//			console.log(mergeLength, comeLength, leaveLength)		
		} else {
			comeLength = this.comeLeaveStr === 'A' ? tableData.length : 0
			mergeLength = 0
			leaveLength = this.comeLeaveStr === 'D' ? tableData.length : 0
		}
		
		this.setState({
			mergeLength,
			comeLength,
			leaveLength
		})
		console.log('filterFlightSelect.................end', tableData.length)
		return tableData
	}
	/**
	 * 
	 */
	getBaseSerKey () {
		
		let {showTheaderArr, serviceTheaderArr} = this.state

		let columns = getKey (showTheaderArr, serviceTheaderArr, 0, {}) || []
		let baseKeyArr = []
		let serviceKeyArr = []
		
		if(columns.length > 0) {
			columns.splice(0, 1)
		}
		
		columns.forEach(item => {
			// 基础列
			if(item.dataIndex !== 'services') {
				baseKeyArr.push(item.key)
			} else {
//				serviceKeyArr.push(item.key)
			}
			
		})

		return {
			baseKeyArr,
//			serviceKeyArr,
		}
		
	}
	/**
	 * 
	 */
	getBaseSerTemp (item, baseKeyArr, serviceKeyArr) {
		let temp = []
		if(baseKeyArr.length < 1) {
			return []
		}
		for(let n in item) {
							if(n !== 'services') {
								
								if(n === 'flightNo') {
									// || item.aord === 'A / D'
									if(baseKeyArr && baseKeyArr.indexOf(item.aord) >= 0 || item.aord === 'A / D') {
										if(item.aord === 'A / D') {
											let flightNoArr = item['flightNo'].split(' / ')
											if(baseKeyArr.indexOf('A') >= 0) {
												if(baseKeyArr.indexOf('D') >= 0) {
													temp.push(item['flightNo'])
												} else {
													// 
													temp.push(flightNoArr[0])
												}
											} else if(baseKeyArr.indexOf('D') >= 0) {
												temp.push(flightNoArr[1])
											}
											
										} else {
											temp.push(item['flightNo'])
										}
									}

								} else if(baseKeyArr && baseKeyArr.indexOf(n) >= 0) {
									if(n === 'sta' || n === 'std' || n==='eta' || n==='etd' || n==='ata' || n==='atd'|| n === 'estimatedInBlockTime') {
										// 时间格式
										let opDate = item[n] ? item[n].slice(11, 16).split(':').join('') : ''
										temp.push(opDate)
										
									} else if(n === 'operationDate') {
										// 日期
										let operationDate = ''
										
										if(item[n].indexOf(' / ') > 0) {
											// 连班
											let operationDateArr = item[n].split(' / ')
											operationDate = operationDateArr[0].slice(5, 10) + ' / ' + operationDateArr[1].slice(5, 10)
											
										} else {
											operationDate = item[n] ? item[n].slice(5, 10) : ''
										}
										
										temp.push(operationDate)
										
									} else if(n === 'destAirport' || n === 'originalAirport' || n === 'transit') {
										// 目的站 始发站  经停站
										temp.push(item[n])
										let itemFlag = this.returnRouteKey(n)
										if(itemFlag) {
											temp.push(item[itemFlag])
										}
			
									} else if(n === 'flightCourse') {
										// 航线
										temp.push(item[n], item['destAirportIata'], item['originAirportIata'], item['transitIata'], item['flightCourseKey'])
										
									} else {
										temp.push(item[n])
									}
								}
								
							} else {
								
//								serviceKeyArr && serviceKeyArr.forEach(serNo => {
//									let str = serNo ? serNo.slice(0, -2) : ''
//									if(item.services) {
//										item.services.forEach(serItem => {
//											if(serItem.detailNo === str) {
//												if(serNo.indexOf('_0') >= 0) {
//													let startTime = serItem.actualStartTime
//													startTime = startTime ? startTime.slice(-8, -3).split(':').join('') : ''
//													temp.push(startTime)
//												} else if(serNo.indexOf('_1') >= 0) {
//													let endTime = serItem.actualEndTime
//													endTime = endTime ? endTime.slice(-8, -3).split(':').join('') : ''
//													temp.push(endTime)
//												}
//											}
//										})	
//									}
//								})
//								
							}
						}
		return temp
	}
	/**
	 * 
	 */
	filterSearchValue (initTableData) {
		
//		let {baseKeyArr, serviceKeyArr} = this.getBaseSerKey()
		let {baseKeyArr} = this.getBaseSerKey()
		
		let valuesArr = []
		
		initTableData.forEach((item) => {
			let temp = []
//			temp = this.getBaseSerTemp(item, baseKeyArr, serviceKeyArr)
			temp = this.getBaseSerTemp(item, baseKeyArr)
			valuesArr.push(temp)
		})

		return valuesArr
	}
	/**
	 * 过滤航班
	 */
	filterFlight (initTableData) {
		console.log('filterFlight..............start', this.columnSearchValue)
		let tableData = []
//		console.log(this.searchValue)
		let valuesArr = []
		let filterIndexArr = []
	
		if (this.searchValue || this.columnSearchValue) {
			
			if(this.searchValue) {
				// 获取所有对象对应的属性值
					valuesArr = this.filterSearchValue(initTableData)
					
					// 不区分大小写
					this.searchValue = this.searchValue.toUpperCase()	// 都转化成大写
					// 保存所有符合条件的索引
					valuesArr.forEach((item, index) => {
						let joinStr = item.join(',')
						joinStr = joinStr.toUpperCase()
						// 不区分大小写	
						if(joinStr.indexOf(this.searchValue) >= 0) {
							filterIndexArr.push(index)
						}
					})
					
					// 过滤出满足条件的
					tableData = initTableData.filter((item, index) => {
						return filterIndexArr.indexOf(index) >= 0
					})

					if(this.columnSearchValue) {
						tableData = this.filterColumn(tableData)
					}
				
			} else {
				// 按列搜索
				tableData = this.filterColumn(initTableData)
			}
			
			return this.filterSelectFlight(tableData)
			
		} else {
			console.log('filterFlight.........................end')
			return this.filterSelectFlight(initTableData)
		}
	
	}
	/***
	 * 判断是自定义的排序还是IA排序
	 * 先排序后搜索
	 */
	preSearchSort () {

		let {initData} = this.state
		console.log(initData.length, '...........initData.length...............')
		let initTableData = []
		if(!this.sortOrder) {
			console.log('flightConSort...........')
			initTableData = this.flightConSort(deepClone(initData))
		} else {
			
			let sorter = {
				field: this.sortFlag,
				order: this.sortOrder,
				columnKey: this.sortColumnKey
			}
			
			initTableData = this.flightConSort(deepClone(initData))
			
			initTableData = this.clickSort(sorter, initTableData)
			
		}
		
		return initTableData
	}
	// changeTheader
	changeTheader (value, callback) {
		
		console.time('filter')
		
		let {showTheaderArr, initTheaderArr, serviceTheaderArr, initServiceTheader} = this.state
		let returnValue = returnValueObj({})	// id与key的对应关系
		
		// 更新基础列的宽度信息
		let updateBaseWidth = (showTheaderArr) => {
			showTheaderArr.forEach(item => {
				
				if(returnValue[item.id]) {
					let className = returnValue[item.id].className
					if(!this.widthChange[className]) {
						this.widthChange[className] = this.keyToWidth(className)
					}
				}
				
			})
		}
		
		// 更新服务列的宽度信息
		let updateSerWidth = (serviceTheaderArr) => {
			serviceTheaderArr.forEach(item => {
				let str = item.detailNo + '_' + item.showStartEnd
				let valueName = item.showStartEnd == '0' ? 'startSer' : 'endSer'
				if(!this.widthChange[valueName + str]) {
					this.widthChange[valueName + str] = this.keyToWidth(valueName)
				}
				
			})
		}
		
		switch (value) {
			case 'all':
			serviceTheaderArr = deepClone(initServiceTheader)
			showTheaderArr = deepClone(initTheaderArr)
			
			updateBaseWidth(showTheaderArr)
			updateSerWidth(serviceTheaderArr)
			
			break;
			case 'A': 
			// 离港	登机口 预离 实离 计离 
			let noTheader = ["fc395038e9074b1492d30995568ba568", "e046786ba9f3433fa0541b69fb46b004", "b62932e6badb454d8c7f34f0f5f4e7e8", "6eb13dfdc91e4c5a81e9e31194b57693", "9fe305970c854737af6660a59d3b3878"]
			
			showTheaderArr = initTheaderArr.filter((item) => {
				return noTheader.indexOf(item.id) < 0
			})
			
			updateBaseWidth(showTheaderArr)
			
			// 区分到港服务
			if(this.showComeService) {
				let detailNoArr = this.showComeService.map(item => item.detailNo)
				serviceTheaderArr = initServiceTheader.filter(item => detailNoArr.indexOf(item.detailNo) >= 0)
				// 默认宽度
				
				updateSerWidth(serviceTheaderArr)
				
			}
			
			break;
			case 'D':
			// 到港 预到 实到 计到
			let noLeaveTheader = ["cfe1cf3efa7b46ffaa9d05286730718d", "051a0904baba484c9e3f30e91d347cb1", "284a4f18150545ebb712c03c54987837", "689340f0788144d4a441b8cc5ea94fb4"]
			
			showTheaderArr = initTheaderArr.filter((item) => {
				return noLeaveTheader.indexOf(item.id) < 0
			})
			
			updateBaseWidth(showTheaderArr)
			
			// 离港服务
			if(this.showLeaveService) {
				let detailNoArr = this.showLeaveService.map(item => item.detailNo)
				serviceTheaderArr = initServiceTheader.filter(item => detailNoArr.indexOf(item.detailNo) >= 0)
				// 默认宽度
				updateSerWidth(serviceTheaderArr)
			}
			
			break;
			
		}
		
		this.setState({
			showTheaderArr,
			serviceTheaderArr
		}, () => {
			console.timeEnd('filter')
			callback && callback()
		})
		
	}
	// 到离港过滤
	comeLeaveFilter (value, callback) {
		console.time('comeLeave')
		// 初始化的表格数据
		this.changeTheader(value, () => {
			//		let tableData = []
			let {initTableData, tableData} = this.state
	
			// 经过排序之后的
			console.time('sort')
			initTableData = this.preSearchSort()
			console.timeEnd('sort')
			console.log('initTableData.length',initTableData.length)
			
			console.time('shaixuan')
			tableData = this.filterFlight(initTableData)
			console.timeEnd('shaixuan')
			console.log('tableData.length', tableData.length)
			

			this.flightUpdate = false
			
			console.log('到离港筛选: ', tableData.length)
			
			this.setState({
				initTableData,
				tableData,
				filterTableData: tableData,
				// 初始化完毕
				initEnd: true,
				defaultSortRule: this.clickColumnId ? '按列排序' : this.sortRule
			}, () =>{
				console.time('render')
				console.log('hello er', this.state.tableData.length)
				// 初始化数据获取到
				let {initData, tableData} = this.state
	//			this.initRender = true
				this.isGetInit = true
				if(this.isClearTime) {
					// 过滤完数据之后继续更新
					this.splitQuery(initData, tableData, 2000)
					this.isClearTime = false
				}
				if(callback) {
					
					this.setTimeArr = this.setTimeArr || []
					
					this.setInterTime = setInterval(() => {
						this.setTimeArr.push(this.setInterTime)	
						if(tableData.length > 0 && document.getElementsByClassName('table-content')[0] && document.getElementsByClassName('table-content')[0].offsetHeight > 40 || tableData.length === 0) {
							callback()
							this.setTimeArr.forEach(item => {
//								console.log('setinterval.................')
								clearInterval(item)
							})
						}
						
					}, 100)
				}
				
				// 调整列宽
				this.dragWidthChange()
				
				// 更新宽度
				this.updateTdWidth()
				console.timeEnd('render')
				console.timeEnd('comeLeave')
				
				// 如果获取到表头数据
				if(this.isGetConfig) {
					this.hideAllHeader()
				}
				
			})
		})
	}
	/**
	 * 隐藏了所有的表头
	 */
	hideAllHeader () {
		
		let {showTheaderArr, serviceTheaderArr} = this.state
		if(showTheaderArr.length === 0 && serviceTheaderArr.length === 0) {
			hideLoading()
					// 没有显示任何的列
//			this.setState({
//				comeLength: 0,
//				mergeLength: 0,
//				leaveLength: 0,
//				tableData: []
//			})
			
			
			
//			disConnect()
		}
	}
	
	/**
	 * 更新td的宽度
	 */
	updateTdWidth () {
		
		// 更新宽度   this.widthChange 保存更新之后的宽度
		for(let n in this.widthChange) {
			let changeNodes = document.querySelectorAll('.' + n)
			if(changeNodes) {
				for(let i=0, len=changeNodes.length; i<len; i++) {
					changeNodes[i].style.width = this.widthChange[n] + 'px'
				}
			}
		}
		
		//td渲染完毕之后出现悬浮框
		let tdNodes = document.querySelectorAll('.table-content td')
		tdNodes = [...tdNodes]
		tdNodes.forEach(item => {
			this.showOrHideTip(item)
		})
		
	}
	/**
	 * 到离港改变
	 */
	comeLeaveChange (value) {
		if(this.queryLoad) {
			// 正在更新
			clearTimeout(this.queryTime)	// 清除定时器
			this.isClearTime = true
		}
		
		this.isSaveConfig = true
		
		// 获取过滤的状态	到离港	类型 	状态		搜索
		this.comeLeaveStr = value
		this.setState({
			defaultAordValue: value,
			// 单列搜索
			columnSearchValue: '',
			prevColumnTitle: '',
			prevColumnValue: ''
		})
		
		this.columnSearchValue = ''
		
		this.comeLeaveFilter(value)
	}
	/*表格行的类名*/
	rowClassName (record, index) {
		
		let lineHight = localManage.getItem('id')
		let className = ''
		
		if(record.id.indexOf(' / ') >= 0) {
			let arr = record.id.split(' / ')
			if((lineHight && lineHight.indexOf(arr[0]) >= 0) || lineHight.indexOf(arr[1]) >= 0) {
				className += 'id' + arr[0] + '-' + arr[1] + ' line_hight'
			} else {
				className += 'id' + arr[0] + '-' + arr[1]
			}
			
		} else {
			if(lineHight && lineHight.indexOf(record.id) >= 0) {
				className += 'id' + record.id + ' line_hight'
			} else {
				className += 'id' + record.id
			}
		}
		
		let newTime = record.newTime
		let status = record.newStatus
		
		if(record.ata) {
			// 到港
			className += manageStatusTime (newTime, status, '到达', ' come_flight')

		}
		if (record.atd) {
			// 离港
			className += manageStatusTime (newTime, status, '起飞', ' leave_flight')

		}
		
		function manageStatusTime (newTime, status, flag, str) {
			let className = ''
			if(newTime) {
				
				if(newTime.indexOf(' / ') >= 0) {
					// 合并的
					let arr = newTime.split(' / ')
					let start = splitTime(arr[0])
					let end = splitTime(arr[1])

					if(start >= end) {
						
						// 连班的情况	start>= end 显示前面一个航班的状态
						if(status.indexOf(' / ') >= 0) {
							
							let statusArr = status.split(' / ')
							
							statusArr[0] = statusArr[0].trim()	// 前面一个航班的状态
							
							if(statusArr[0].indexOf('|') >= 0) {
									
								let startStr = ''
								let isProcess = record.isProcess
								
								if(isProcess && isProcess.indexOf(' / ') > 0) {
									isProcess = isProcess.split(' / ')[0]
								}
								
								if(isProcess === 'true') {
									startStr = statusArr[0].split('|')[0].trim()
								} else if(isProcess === 'false') {
									startStr = statusArr[0].split('|')[1].trim()
								}
								className = diffStatusTime(startStr)
								if(!className) {
									let endStr = statusArr[0].split('|')[1].trim()
									className = diffStatusTime(endStr)
								}
									
							} else {
									
								className = diffStatusTime(statusArr[0])
								if(!className) {
									className = diffStatusTime(statusArr[1])
								}
							}
							
						}
					} else {
						
						if(status.indexOf(' / ') >= 0) {
							
							let statusArr = status.split(' / ')
							statusArr[1] = statusArr[1].trim()
							
							if(statusArr[1].indexOf('|') >= 0) {
								let startStr = ''
								let isProcess = record.isProcess
								
								if(isProcess && isProcess.indexOf(' / ') > 0) {
									isProcess = isProcess.split(' / ')[1]
								}
								
								if(isProcess === 'true') {
									startStr = statusArr[1].split('|')[0].trim()
								} else if(isProcess === 'false') {
									startStr = statusArr[1].split('|')[1].trim()
								}
								
								className = diffStatusTime(startStr)
								
								if(!className) {
									let endStr = statusArr[1].split('|')[1].trim()
									className = diffStatusTime(endStr)
								}	
								
							} else {
									
								className = diffStatusTime(statusArr[1])
								if(!className) {
									className = diffStatusTime(statusArr[0])
								}
							}
							
						}
					}
					
				} else {
					// 延误的情况
					if(status.indexOf(' / ') >= 0) {
							// 连班但是只有一个值
						let statusArr = status.split(' / ')
						
						if(newTime.indexOf('_1') >= 0) {
								// 后面的一个
							statusArr[1] = statusArr[1].trim()
							// 延误的情况需要考虑
							if(statusArr[1].indexOf('|') > 0) {
								
								let temp = statusArr[1].split('|')
								let isProcess = record.isProcess
								
								if(isProcess.indexOf(' / ') > 0) {
									isProcess = isProcess.split(' / ')[0]
								}
								
								if(isProcess === 'false') {
									className = diffStatusTime(temp[1])
								} else if(isProcess === 'true') {
									className = diffStatusTime(temp[0])
								}
								
								if(!className) {
									className = diffStatusTime(temp[1])
								}
								
							} else {
								className = diffStatusTime(statusArr[1])
							}
							
								
						} else if(newTime.indexOf('_0') >= 0) {
								// 前面的一个
							statusArr[0] = statusArr[0].trim()
							// 延误的情况需要考虑
							if(statusArr[0].indexOf('|') > 0) {
								
								let temp = statusArr[0].split('|')
								let isProcess = record.isProcess
								
								if(isProcess.indexOf(' / ') > 0) {
									isProcess = isProcess.split(' / ')[0]
								}
								
								if(isProcess === 'false') {
									className = diffStatusTime(temp[1])
								} else if(isProcess === 'true') {
									className = diffStatusTime(temp[0])
								}
								
								if(!className) {
									className = diffStatusTime(temp[1])
								}

							} else {
								
								className = diffStatusTime(statusArr[0])
								
							}
						}
							
					} else {
						if(status.indexOf('|') > 0) {
								
							let temp = status.split('|')
							
							if(record.isProcess === 'false') {
								className = diffStatusTime(temp[1])
							} else if(record.isProcess === 'true') {
								className = diffStatusTime(temp[0])
							}
							
							if(!className) {
								className = diffStatusTime(temp[1])
							}

						} else {
							className = diffStatusTime(status)
						}
					}
				}
				
			} else {
				//	newTime 为null
				if(status) {
					
					if(status.indexOf('到达') >= 0) {
						className = diffStatusTime('到达')
					} else if(status.indexOf('起飞') >= 0) {
						className = diffStatusTime('起飞')
					} else {
						className = str
					}
					
				}

			}

			return className
		}
		/**
		 * return className
		 * @param {Object} flag
		 */
		function diffStatusTime (flag) {
			let str = ''
			if(flag) {
				if(flag.indexOf('登机结束') >= 0) {
					str = ' end_boarding_high'
				} else if(flag.indexOf('过站登机') >= 0 || flag.indexOf('本站登机') >= 0 || flag.indexOf('催促登机') >= 0) {
					str = ' boarding_high'
				} else if(flag.indexOf('前起') >= 0) {
					str = ' first_flight_high'
				} else if(flag.indexOf('取消') >= 0) {
					str = ' cancel_flight_high'
				} else if(flag.indexOf('延误') >= 0 || flag.indexOf('备降') >= 0) {
					str = ' delay_flight_high'
				} else if(flag.indexOf('到达') >= 0) {
					str = ' come_flight_high'
				} else if(flag.indexOf('起飞') >= 0) {
					str = ' leave_flight_high'
				}
			}
	
			return str
		}
		
		if(status.indexOf('登机结束') >= 0) {
			className += manageStatusTime(newTime, status, '登机结束', ' end_boarding')
		}
		if(status.indexOf('过站登机') >= 0) {
			className += manageStatusTime(newTime, status, '过站登机', ' boarding')
		}
		if(status.indexOf('本站登机') >= 0) {
			className += manageStatusTime(newTime, status, '本站登机', ' boarding')
		}
		if(status.indexOf('催促登机') >= 0) {
			className += manageStatusTime(newTime, status, '催促登机', ' boarding')
		}
		if(status.indexOf('前起') >= 0) {
			className += manageStatusTime(newTime, status, '前起', ' first_flight')
		}
		
		
		if(status.indexOf('取消') >= 0) {
			className += manageStatusTime (newTime, status, '取消', ' cancel_flight')
		}
		if(status.indexOf('延误') >= 0) {
			className += manageStatusTime (newTime, status, '延误', ' delay_flight')
		}
		if(status.indexOf('备降') >= 0) {
			className += manageStatusTime (newTime, status, '备降', ' delay_flight')
		}

		if(record.active) {
			className += ' active'
		}
		
		return className

	}
	/*单击行*/
	rowClick (record, index, ev) {
		this.refs.deleteFlightWrap.style.display = 'none'
		this.selectLine(ev, record, index)
		console.log(record)
	}
	/**
	 * showColumnSearch
	 */
	showColumnSearch (ev) {
		// 递归找到对应的th或td
		function getTarget (target) {
			if(target.nodeName.toLowerCase() === 'th' || target.nodeName.toLowerCase() === 'td') {
				this.targetTh = target
				return
			} else {
				target = target.parentNode
				getTarget.call(this, target)
			}
		}
		
		let target = ev.target
		getTarget.call(this, target)
		
		if(!this.targetTh || this.targetTh.className.indexOf('startSer') >= 0 || this.targetTh.className.indexOf('endSer') >=0 || this.targetTh.className.indexOf('index') >= 0) {
			return
		}
		
		let {columnSearchTitle} = this.state
		
		let columnSearch = this.refs.columnSearch
		columnSearch.style.display = 'block'
		// 边缘处理
		if(ev.clientY + columnSearch.offsetHeight > document.documentElement.clientHeight) {
			columnSearch.style.top = ev.clientY - columnSearch.offsetHeight + 'px'
		} else {
			columnSearch.style.top = ev.clientY + 'px'
		}
		
		if(ev.clientX + columnSearch.offsetWidth > document.documentElement.clientWidth) {
			columnSearch.style.left = ev.clientX - columnSearch.offsetWidth + 'px'
		} else {
			columnSearch.style.left = ev.clientX + 'px'
		}
		
		
		
		let returnObj = returnValueObj(this.state.sortInfo)
		
		for(let i in returnObj) {
			if(this.targetTh.className.indexOf(returnObj[i].className) >= 0 ) {
				columnSearchTitle = returnObj[i].title
				this.columnFilterKey = returnObj[i].className
				break;
			}
		}
		
		this.columnSearchInput.focus()		// 获取焦点
		this.setState({
			columnSearchTitle
		})
		
	}
	/**
	 * 双击行
	 */
	rowDoubleClick (record, index, ev) {
		this.showColumnSearch(ev)
	}
	/**
	 * 按列搜索输入框change事件
	 */
	onChangeColSearch (ev) {

		this.setState({ columnSearchValue: ev.target.value });
	}
	/**
	 * 清空输入框的内容
	 */
	emptyColumnSearch () {
		
		this.columnSearchInput.focus();
    	this.setState({ columnSearchValue: ''});
    	
	}
	/**
	 * 
	 */
	filterColumn (initTableData) {
		let columnSearchValue = this.columnSearchValue ? this.columnSearchValue.toUpperCase() : ''	// 不区分大小写， 都转化为大写
		let tableData = []
		let filterKey = this.confirmFilterKey
		console.log(this.confirmFilterKey)
		if(!this.confirmFilterKey) {
			return []
		}
//		this.prevColumnTitle = columnSearchTitle
//		this.prevColumnValue = columnSearchValue
		
		// 复合查询
		let mutilSearch = {
			flight: (value) => {
				
				if(value.indexOf('>') >= 0) {
					// 大于
					let str = value.slice(1)
//					console.log(str)
					tableData = initTableData.filter((item) => {
						if(item[filterKey]) {
							
							if(item[filterKey].indexOf(' / ') > 0) {
								// 连班的情况
								
								let arr = item[filterKey].split(' / ')
								return columnSearchMethod.daYun(arr[0], str) || columnSearchMethod.daYun(arr[1], str)
								
							} else {
								return columnSearchMethod.daYun(item[filterKey], str)
							}
							
						}
					})
					
				}
				if(value.indexOf('<') >= 0) {
					// 小于
					let str = value.slice(1)
					tableData = initTableData.filter(item => {
						if(item[filterKey] ) {
							
							if(item[filterKey].indexOf(' / ') > 0) {
								// 连班的情况
								
								let arr = item[filterKey].split(' / ')
								return columnSearchMethod.xiaoYu(arr[0], str) || columnSearchMethod.xiaoYu(arr[1], str)
								
							} else {
								return columnSearchMethod.xiaoYu(item[filterKey], str)
							}
							
						}
					})
				}
				
				
				// 3, 5-9, 8-12
				if(value.indexOf(',') >= 0) {
					let getData = []
					let arr = value.split(',')
					initTableData.forEach((item) => {
						let flag = false
						if(item[filterKey]) {
							arr.forEach((arrItem) => {
								if(arrItem.indexOf('-') > 0) {
									arrItem = arrItem.trim()	// 去掉前后的空格
									arrItem = arrItem.split('-')
									
									let start = isNaN(Number(arrItem[0])) ? arrItem[0] : Number(arrItem[0])
									let end = isNaN(Number(arrItem[1])) ? arrItem[1] : Number(arrItem[1])
									
									if(item[filterKey].indexOf(' / ') > 0) {
										// 连班的情况
										
										let arr = item[filterKey].split(' / ')
										flag = columnSearchMethod.fun1(arr[0], start, end) || columnSearchMethod.fun1(arr[1], start, end)

									} else {
										
										flag = columnSearchMethod.fun1(item[filterKey], start, end)

									}
									if(flag) {
										getData.push(item)
									}
									
								} else {
									
									if(item[filterKey].indexOf(' / ') > 0) {
										// 连班的情况
										let arr = item[filterKey].split(' / ')
										
										flag = columnSearchMethod.fun2(arr[0], arrItem) || columnSearchMethod.fun2(arr[1], arrItem)
										
									} else {
										
										flag = columnSearchMethod.fun2(item[filterKey], arrItem)
										
									}
									if(flag) {
										getData.push(item)
									}
								}
								
							})
						}
					})
					tableData = getData
					
				} else if(value.indexOf('>') < 0 && value.indexOf('<') < 0) {
					
					if(value.indexOf('-') >= 0) {
						let valueArr = value.split('-')
						
						let start =  isNaN(Number(valueArr[0])) ? valueArr[0] : Number(valueArr[0])
						let end = isNaN(Number(valueArr[1])) ? valueArr[1] : Number(valueArr[1])
						
						tableData = initTableData.filter((item) => {
							if(item[filterKey] ) {
								if(item[filterKey].indexOf(' / ') > 0) {
								// 连班的情况
									let arr = item[filterKey].split(' / ')
									return columnSearchMethod.daXiaoYu(arr[0], start, end) || columnSearchMethod.daXiaoYu(arr[1], start, end)
									
								} else {
									return columnSearchMethod.daXiaoYu(item[filterKey], start, end)
								}
							}
						})
						
					} else {
						
						tableData = initTableData.filter(item => {

							value = isNaN(Number(value)) ? value : Number(value)
							
							if(item[filterKey]) {
								if(item[filterKey].indexOf(' / ') > 0) {
									let arr = item[filterKey].split(' / ')
									return arr[0] == value || arr[1] == value || item[filterKey] == value
								} else {
									
									return item[filterKey] == value
									
								}
							}

						})
						
					}
				}
			},
			time: (value) => {
				if(value.indexOf(',') >= 0) {
					let getData = []
					let arr = value.split(',')
					initTableData.forEach((item) => {
						let str = item[filterKey] ? item[filterKey].slice(-9, -3).split(':').join('') : '--'
						arr.forEach((arrItem) => {
							
							if(arrItem.indexOf('-') > 0) {
								arrItem = arrItem.trim()	// 去掉前后的空格
								arrItem = arrItem.split('-')
								if(arrItem[0].length === 4 && arrItem[1].length === 4 && Number(str) >= Number(arrItem[0]) && Number(str) <= Number(arrItem[1])) {
									getData.newPush(item)
								}
							} else if(arrItem.length === 4 && Number(str) === Number(arrItem)) {
								getData.newPush(item)
							}
						})
					})

					tableData = getData
				} else {
					if(value.indexOf('-') > 0) {
						tableData = initTableData.filter(item => {
							let str = item[filterKey] ? item[filterKey].slice(-9, -3).split(':').join('') : '--'
							let arr = value.split('-')
							if(arr[0].length === 4 && arr[1].length === 4) {
								return Number(str) >= Number(arr[0]) && Number(str) <= Number(arr[1])
							}
						})
					} else {
						tableData = initTableData.filter(item => {
							let str = item[filterKey] ? item[filterKey].slice(-9, -3).split(':').join('') : '--'
							if(value.length === 4) {
								return Number(str) === Number(value)
							}
							
						})
					}
//					console.log(tableData.length)
				}
			}
		} 
		
		/**
		 * 三字码搜索(按列)
		 */
		let _this = this
		function routeSanSearch (filterKey, value) {
			
			let data = []
			let itemFlag = _this.returnRouteKey(filterKey)
			
			data = initTableData.filter(item => {
				let str1 = item[filterKey]
				let str2 = item[itemFlag]
				// 转化为大写进行比较
				return str1 && str1.toUpperCase().indexOf(value) >= 0 || str2 && str2.toUpperCase().indexOf(value) >= 0
			})
			
			return data
			
		}
		
		
		if(filterKey === 'flightNo_A') {
			tableData = initTableData.filter((item) => {
				//不区分大小写
				let flightNo = item['flightNo']
				flightNo = flightNo.toUpperCase()
				// 如果是连班就需要拆分了
				if(flightNo.indexOf(' / ') > 0) {
					// 连班
					flightNo = flightNo.split(' / ')[0]
				}
				return item.aord.indexOf('A') >= 0 && flightNo.indexOf(columnSearchValue) >= 0
				
			})
						
		} else if(filterKey === 'flightNo_D') {
						
			tableData = initTableData.filter((item) => {
				let flightNo = item['flightNo']
				flightNo = flightNo.toUpperCase()
				// 如果是连班就需要拆分了
				if(flightNo.indexOf(' / ') > 0) {
					// 连班
					flightNo = flightNo.split(' / ')[1]
				}
				return item.aord.indexOf('D') >= 0 && flightNo.indexOf(columnSearchValue) >= 0
				
			})
						
		} else if(filterKey === 'finalParkingbayId' || filterKey === 'carousel' || filterKey === 'gate') {
			//复合查询	机位 登机口 行李转盘 <5 >5 3-5, 5-8, 9  || filterKey === 'checkinRange'
			// 支持复杂查询
			mutilSearch.flight(columnSearchValue)
			
		} else if(filterKey === 'ata' || filterKey === 'atd' || filterKey === 'sta' || filterKey === 'std' || filterKey === 'eta' || filterKey === 'etd') {
			// 时间 0900-1000
			mutilSearch.time(columnSearchValue)
			
		} else if(filterKey === 'checkinRange') {
			// 值机柜台，使用逗号查询
			tableData = initTableData.filter((item) => {
				let itemStr = item[filterKey]
				let flag = false
				if(itemStr) {
					itemStr = itemStr.toUpperCase() // 不区分大小写，都转为大写
					if(columnSearchValue.indexOf(',') > 0) {
						let searchArr = columnSearchValue.split(',')
						
						searchArr.forEach((arrItem) => {
							if(arrItem) {
								arrItem = arrItem.trim()	// 去掉空格
								if(itemStr.indexOf(arrItem) >= 0) {
									flag = true
								}
							}
						})
						
					} else {
						if(itemStr.indexOf(columnSearchValue) >= 0) {
							flag = true
						}
					}
				}
				return flag
			})
			
		} else if(filterKey === 'flightCourse') {
			
			tableData = initTableData.filter((item) => {
				let itemStr = item[filterKey]
				if(itemStr) {
					itemStr = itemStr.toUpperCase()
					return itemStr.indexOf(columnSearchValue) >= 0 || (item['destAirportIata'] && item['destAirportIata'].indexOf(columnSearchValue) >= 0 || (item['originAirportIata'] && item['originAirportIata'].indexOf(columnSearchValue) >= 0) || (item['transitIata'] && item['transitIata'].indexOf(columnSearchValue) >= 0) || (item['flightCourseKey'] && item['flightCourseKey'].indexOf(columnSearchValue)) >= 0)
				}
			})
			
		} else if(filterKey === 'destAirport' || filterKey === 'originalAirport' || filterKey === 'transit') {
			
			// 始发站 目的站 经停站(三字码搜索)
			tableData = routeSanSearch(filterKey, columnSearchValue)
			
		} else {
//			 else if(filterKey === 'index') {
//			
//			let columnValue = Number(columnSearchValue)
//			tableData = initTableData.filter((item, index) => {
//				if(index === columnValue) {
//					return true
//				}
//			})
//			
//		}
			tableData = initTableData.filter((item) => {
				let itemStr = item[filterKey]
				if(itemStr) {
					itemStr = itemStr.toUpperCase()		// 都转为大写
					if(itemStr.indexOf(' / ') >= 0) {
						return itemStr.split(' ').join('').indexOf(columnSearchValue) >= 0
					} else {
						return itemStr.indexOf(columnSearchValue) >= 0
					}
				}
			})				
		}
		return tableData
	}
	/**
	 * 返回对应三字码的key
	 * 
	 */
	returnRouteKey (filterKey) {
		let itemFlag = ''
		switch (filterKey) {
				case 'originalAirport':
				itemFlag = 'originAirportIata'
				// 始发站
				break;
				case 'transit':
				itemFlag = 'transitIata'
				// 经停站
				break;
				case 'destAirport':
				// 目的站
				itemFlag = 'destAirportIata'
				break;
		}
		
		return itemFlag
	}
	
	/**
	 * 确定按列搜索
	 */
	confirmColumnSearch () {
		
		if(this.queryLoad) {
			// 正在更新
			clearTimeout(this.queryTime)	// 清除定时器
			this.isClearTime = true
		}
		this.flightUpdate = false
		
		let {columnSearchValue, columnSearchTitle} = this.state
		this.columnSearchValue = columnSearchValue
		
		this.columnSearchTitle = columnSearchTitle
		
		this.confirmFilterKey = this.columnFilterKey
		
		let {initTableData} = this.state
		
//		if(!this.flightUpdate) {
			initTableData = this.preSearchSort()
//		}
		
		let data = this.filterFlight(initTableData)
//		let filterTableData = deepClone(data).sort((a, b) => {
//				return a['num'].localeCompare(b['num'])
//			})
		this.setState({
			tableData: data,
			filterTableData: data,
			prevColumnTitle: columnSearchTitle,
			prevColumnValue: columnSearchValue ? columnSearchValue : '空',
			initEnd: true
		}, () => {
			
			let {initData, tableData} = this.state
//			this.initRender = true
			this.isGetInit = true
			if(this.isClearTime) {
				// 过滤完数据之后继续更新
				this.splitQuery(initData, tableData, 2000)
				this.isClearTime = false
			}
			
		})
	}
	/*选中行*/
	selectLine (ev, record) {
//		console.log(this.target)
		function getTarget (target) {
			if(target.nodeName.toLowerCase() === 'tr') {
				this.target = target
				return
			} else {
				target = target.parentNode
				getTarget.call(this, target)
			}
		}
		let target = ev.target
		getTarget.call(this, target)
		
		if(record) {
			
			let {tableData} = this.state
			
			if(this.activeId) {
				
				tableData.forEach(item => {
					if(item.id === this.activeId) {
						item.active = false
					}
				})
				
			}
			
			let recordIndex = tableData.indexOf(record)

			if(recordIndex >= 0) {
				tableData[recordIndex].active = true
				this.activeId = tableData[recordIndex].id
			}

			this.setState({
				tableData: [].concat(tableData)
			})
			
		}
		
	}
	/*单行高亮*/
	lineHightClick (ev) {
//		ev.target.style.display = 'none'
		this.refs.deleteFlightWrap.style.display = 'none'
		// 保存单行高亮的数据  获取这一个数据id
		let classArr = this.target.className.split(' ')
		
		let reg = /^id/g
		
		if(ev.target.innerHTML === '单行高亮') {
			this.target && this.target.classList.add('line_hight')
			for(let i=0, len=classArr.length; i<len; i++) {
				if(reg.test(classArr[i])) {
					// 保存id
					let getId = localManage.getItem('id')
					let saveId = classArr[i].slice(2)
					if(saveId.indexOf('-') >= 0) {
						if(getId) {
							getId.push(...saveId.split('-'))
							localManage.setItem('id', getId)
						} else {
							localManage.setItem('id', [...saveId.split('-')])
						}
					} else {
						if(getId) {
							getId.push(saveId)
							localManage.setItem('id', getId)
						} else {
							localManage.setItem('id', [saveId])
						}
					}
					
					return
				}
			}
		} else {
			// 取消高亮
			this.target && this.target.classList.remove('line_hight')

			for(let i=0, len=classArr.length; i<len; i++) {
				if(reg.test(classArr[i])) {
//					console.log(classArr[i])
					// 保存id
					let getId = localManage.getItem('id')
					
					let saveId = classArr[i].slice(2)
					
					if(saveId.indexOf('-') >= 0) {
						saveId = saveId.split('-')
						let startIndex = getId.indexOf(saveId[0])
						if(startIndex >= 0) {
							getId.splice(startIndex, 1)
						}
						let endIndex = getId.indexOf(saveId[1])
						if(endIndex >= 0) {
							getId.splice(endIndex, 1)
						}
					} else {
						let getIndex = getId.indexOf(saveId)
						if(getIndex >= 0) {
							getId.splice(getIndex, 1)
						}
					}
					localManage.setItem('id', getId)
				}
			}
		}
		
	}
	/**
	 * 航班数据的过滤
	 */
	filterFlightData (value, type) {
		let {initTableData} = this.state
		
//		if(!this.flightUpdate) {
			initTableData = this.preSearchSort()
//		}
		
		this.flightUpdate = false	// 不能写在this.setState回调中
		
		let tableData = this.filterFlight(initTableData)
//		let filterTableData = deepClone(tableData).sort((a, b) => {
//				return a['num'].localeCompare(b['num'])
//			})
		console.log('航班数据筛选: ', tableData.length)
		
		this.setState({
			tableData,
			filterTableData: tableData,
			initEnd: true,
		}, () => {
//			this.flightUpdate = false
			let {initData, tableData} = this.state
//			this.initRender = true
			this.isGetInit = true
			if(this.isClearTime) {
				// 过滤完数据之后继续更新
				this.splitQuery(initData, tableData, 2000)
				this.isClearTime = false
			}
		})
	}
	/**
	 * 航班状态的切换
	 */
	flightStatusChange (value) {

		if(this.queryLoad) {
			// 正在更新
			clearTimeout(this.queryTime)	// 清除定时器
			this.isClearTime = true
		}
		

		
		this.flightStatus = value
		this.filterFlightData(value, 'flightStatus')
		
	}
	/**
	 * 类型切换
	 */
	typeChange (value) {
		
		if(this.queryLoad) {
			// 正在更新
			clearTimeout(this.queryTime)	// 清除定时器
			this.isClearTime = true
		}

		this.setState({
			defaultDoriValue: value
		})
		this.flightType = value
		this.filterFlightData(value, 'dori')
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
	 * 确定搜索
	 */
	confirmSearch () {
		
		if(this.queryLoad) {
			// 正在更新
			clearTimeout(this.queryTime)	// 清除定时器
			this.isClearTime = true
		}
		
		this.flightUpdate = false			// 需要放在this.setState() 之前，不能放在回调里面
		
		let {searchValue} = this.state
		this.searchValue = searchValue
		
		
		let {initTableData} = this.state
		
//		if(!this.flightUpdate) {
			initTableData = this.preSearchSort()
//		}
		// 全局模糊搜索
		let data = this.filterFlight(initTableData)
//		let filterTableData = deepClone(data).sort((a, b) => {
//				return a['num'].localeCompare(b['num'])
//			})
		console.log('搜索航班数据: ', data.length)
		this.setState({tableData: data, filterTableData: data, initEnd: true}, () => {
//			this.flightUpdate = false
			let {initData, tableData} = this.state
			if(this.isClearTime) {
				// 过滤完数据之后继续更新
				this.splitQuery(initData, tableData, 2000)
				
				this.isClearTime = false
			}
			
		})
	}
	
	/*重置搜索*/
	resetSearch () {
		
		if(this.queryLoad) {
			// 正在更新
			clearTimeout(this.queryTime)	// 清除定时器
			this.isClearTime = true
		}
		
		this.flightUpdate = false
		
		let {comeLength, leaveLength, mergeLength, initData, defaultDoriValue, selectedDori} = this.state
		if(selectedDori.length === 1) {
			defaultDoriValue = selectedDori[0]
		} else {
			this.flightType = 'all'		//
			defaultDoriValue = 'all'
		}
		let data = []

		this.flightStatus = 'all'
		
		this.searchValue = ''
		this.columnSearchValue = ''
		this.confirmFilterKey = undefined
		
		if(this.comeLeaveStr === 'all') {
			data = this.flightConSort(deepClone(initData))
			data = this.filterFlight(data)
			
			let onlyCome = data.filter(item => item.aord.indexOf('A') >= 0).length
			let onlyLeave = data.filter(item => item.aord.indexOf('D') >= 0).length
			let commonLen = data.filter(item => item.aord === 'A / D').length
			mergeLength = commonLen
			comeLength = onlyCome
			leaveLength = onlyLeave
			
		} else {
			
			if(this.comeLeaveStr === "A") {
				data = this.flightConSort(initData.filter(item => item.aord === 'A'))
				data = this.filterFlight(data)
				comeLength = data.length
				leaveLength = 0
			} else {
				data = this.flightConSort(initData.filter(item => item.aord === 'D'))
				data = this.filterFlight(data)
				comeLength = 0
				leaveLength = data.length
			}
			
			mergeLength = 0
		}
		// click表头排序key值的id
		this.clickColumnId = undefined
		
		console.log('重置筛选: ', data.length)
		
		this.sortOrder = undefined
		
		this.setState({
			initEnd: true,
			tableData: data,
			filterTableData: data,
			initTableData: data,
			searchValue: '',
			columnSearchValue: '',
			defaultDoriValue,
			comeLength,
			leaveLength,
			
			mergeLength,
			// 取消排序
			sortInfo: {},
			prevColumnTitle: '',
			prevColumnValue: '',
			// 默认排序
			defaultSortRule: this.sortRule
		}, () => {
			
			let {initData, tableData} = this.state
			if(this.isClearTime) {
				// 过滤完数据之后继续更新
				this.splitQuery(initData, tableData, 5000)
				
				this.isClearTime = false
			}
			
		})
		
		

//		this.prevColumnTitle = ''
//		this.prevColumnValue = ''
		
	}
	/**
	 * 点击排序
	 */
	clickSort (sorter, filterTableData) {
		this.clickColumnId = sorter.column ? sorter.column.id : undefined 

		let flag = sorter.field
		let sortFilter = {
			// init 到离港的情况，航班排序
			init: (previous, next) => {
				if(sorter.columnKey === 'A') {
								// 到港航班排序
						if(previous.indexOf(' / ') > 0) {
							// 连班的情况
							previous = previous.split(' / ')[0]
						}
						if(next.indexOf(' / ') > 0) {
							// 连班的情况
							next = next.split(' / ')[0]
						}
					} else if (sorter.columnKey === 'D') {
						// 离港航班排序
						if(previous.indexOf(' / ') > 0) {
							// 连班的情况
							previous = previous.split(' / ')[1]
						}
						if(next.indexOf(' / ') > 0) {
							// 连班的情况
							next = next.split(' / ')[1]
						}
					}
				return {
					previous,
					next
				}
			},
			/**
			 * 相同的时候的处理
			 */
			sameSort: {
				// 相同时的排序规则
				descend: (a, b) => {
					if(a['num'] > b['num']) {
						return -1
					} else if(a['num'] < b['num']) {
						return 1
					} else if(a['num'] === b['num']) {
						return 0
					}
				},
				ascend: (a, b) => {
					if(a['num'] > b['num']) {
						return 1
					} else if(a['num'] < b['num']) {
						return -1
					} else if(a['num'] === b['num']) {
						return 0
					}
				}
			},
			// 降序
			descend: (a, b) => {
				let previous = a[flag]
				let next = b[flag]
				// 航班	到离港状态下
				if(this.comeLeaveStr === 'all') {
					let temp = sortFilter.init(previous, next)
					previous = temp.previous
					next = temp.next
				}
				if(previous > next) {
					return -1
				} else if(previous < next) {
					return 1
				} else if(previous === next){
					return sortFilter.sameSort['descend'](a, b)
//					return 0
				}
			},
			// 升序
			ascend: (a, b) => {
				let previous = a[flag]
				let next = b[flag]
				// 航班	到离港状态下
				if(this.comeLeaveStr === 'all') {
					let temp = sortFilter.init(previous, next)
					previous = temp.previous
					next = temp.next
				}
				
				if(previous > next) {
					return 1
				} else if(previous < next) {
					return -1
				} else if(previous === next) {
					return sortFilter.sameSort['ascend'](a, b)
//					return 0
				}
			}
		}
		let tableData = []

		// 存在排序字段
		if(sorter.order) {
			
			let haveFlagData = []
			let noFlagData = []
			
			if(sorter.columnKey === 'A' || sorter.columnKey === 'D') {
				// 到离港
				filterTableData.forEach((item) => {
					if(item.id === this.activeId) {
						item.active = true
					} else {
						item.active = false
					}
					if(item.aord.indexOf(sorter.columnKey) >= 0) {
						haveFlagData.push(item)
					} else {
						noFlagData.push(item)
					}
				})

				haveFlagData.sort(sortFilter[sorter.order])
				
			} else {
				filterTableData.forEach((item) => {
					if(item.id === this.activeId) {
						item.active = true
					} else {
						item.active = false
					}
					if(item[flag]) {
						haveFlagData.push(item)
					} else {
						noFlagData.push(item)
					}
				})
				haveFlagData.sort(sortFilter[sorter.order])
			}
			
			noFlagData.sort(sortFilter.sameSort[sorter.order])
			
			tableData = haveFlagData.concat(noFlagData)
			
			this.setState({
				defaultSortRule: '按列排序'
			})
			
		} else {
			
			let {filterTableData} = this.state
			// 不存在排序字段
			filterTableData.forEach(item => {
				if(item.id === this.activeId) {
					item.active = true
				} else {
					item.active = false
				}
			})
			
			// 选择哪种默认排序(地服排序)
			tableData = this.choiceDefaultSort(filterTableData)
			this.setState({
				defaultSortRule: this.sortRule
			})
			
		}
		
		return tableData
	}
	/**
	 * 表格数据的变化 排序
	 */
	tableChange (pagination, filters, sorter) {
		this.sortFlag = sorter.field
		this.sortOrder = sorter.order
		this.sortColumnKey = sorter.columnKey
		
		let {filterTableData} = this.state
		
//		let tableData =	this.filterFlight(initTableData)
		
		let tableData = this.clickSort(sorter, filterTableData)
		
		this.setState({
			tableData,
			initEnd: true,
			sortInfo: sorter
		}, () => {
			if(sorter.column) {
				let className = sorter.column.className
				let sortNodes = document.querySelectorAll('.' + className + '.ant-table-column-sort')
				sortNodes = [...sortNodes]
				sortNodes.forEach(item => {
					item.className = className
				})
			}
		})
		
	}
	/**
	 * key和width的对应关系
	 */
	keyToWidth (name) {
		let keyValue = {
			index: 60,
			operationDate: 80,
			"flightNo_A": 85,
			"flightNo_D": 85,
			repeatCount: 85,
			acRegNo: 80,
			dori: 80,
			aircraftType: 80,
			flgVip: 80,
			codeShare: 120,
			taskCode: 82,
			newStatus: 120,
			checkinRange: 100,
			carousel: 100,
			flightCourse: 100,
			originalAirport: 100,
			destAirport: 100,
			transit: 100,
			finalParkingbayId: 80,
			gate: 85,
			sta: 70,
			eta: 70,
			ata: 70,
			std: 70,
			atd: 70,
			etd: 70,
			estimatedInBlockTime: 70,
			abnormalCauseCn: 120,
			startSer: 105,
			endSer: 105
		}
		return keyValue[name]
	}
	
	/**
	 * 界面配置表格列的变化
	 */
	handleCols (isBase, targetKeys, direction, moveKeys) {
		// 基础列与服务列
		if(isBase) {
			this.isBase = true
			this.targetSelectedKeys = []
			
			// moveKeys在targetKeys中存在说明新增进来的
			moveKeys.forEach(item => {
				
				if(targetKeys.indexOf(item) >= 0) {
					
					if(item.indexOf('_0') > 0) {
						this.widthChange['startSer' + item] = this.keyToWidth('startSer')
					} else if(item.indexOf('_1') > 0) {
						this.widthChange['endSer' + item] = this.keyToWidth('endSer')
					} else {
						let valueObj = returnValueObj({})[item]
						if(valueObj) {
							this.widthChange[valueObj.className] = this.keyToWidth(valueObj.className)
						}
					}
				}
			})
			
			
			this.setState({ 
				selectedKey: targetKeys,
			}, () => {
				// 改变this.initSelectedBase
				let {selectedKey, initSelectedKey} = this.state
				
				this.initSelected = returnParam(initSelectedKey, selectedKey, 'base')
				
				console.log(this.initSelected)
				
			});
			
		} else {
//			this.isService = true
//			this.targetSelectedSerKeys = []
//			this.setState({selectedServiceKey: targetKeys}, () => {
//				
//				// 更新this.initSelectedService
//				let {selectedServiceKey, initSelectedServiceKey, optionalServiceCols} = this.state
//				let serParam = returnParam(initSelectedServiceKey, selectedServiceKey, 'services', optionalServiceCols)
//						// 
//				serParam.forEach(item => {
//					item.detailNo = item.detailNo + '_' + item.showStartEnd
//				})
//				
//				this.initSelectedService = serParam
//				
//			})
//			
//			moveKeys.forEach(item => {
//				
//				if(targetKeys.indexOf(item) >= 0) {
//					if(item.indexOf('_0') > 0) {
//						console.log(this.widthChange['startSer' + item])
//						this.widthChange['startSer' + item] = this.keyToWidth('startSer')
//					} else if(item.indexOf('_1') > 0) {
//						console.log(this.widthChange['endSer' + item])
//						this.widthChange['endSer' + item] = this.keyToWidth('endSer')
//					}
//				}
//				
//			})
//			
		}
	}
	/**
	 * 选中项发生改变时的回调函数
	 */
	selectedColsChange (isBase, sourceSelectedKeys, targetSelectedKeys) {
		
		if(targetSelectedKeys.length > 0) {
			
			this.targetSelectedKeys = targetSelectedKeys
			this.setState({upDownDisabled: false})
			
		} else {
			
			this.setState({upDownDisabled: true})

		}
	}
	/**
	 * changeBaseKeys
	 */
	changeBaseKeys (callback, isUp) {
//		let {selectedBaseKey} = this.state
//				// this.targetSelectedKeys  需要排序
//			if(this.initSelectedBase) {	
//				
//				this.targetSelectedBase = this.initSelectedBase.filter(item => {
//					return this.targetSelectedKeys.indexOf(item.id) >= 0
//				})
//					// 排好序的对象
//				this.targetSelectedBase = sortNoSort(this.targetSelectedBase)
//				this.targetSelectedKeys = this.targetSelectedBase.map(item => item.id)
//					
//			}
//				
//			selectedBaseKey = callback(this.targetSelectedKeys, selectedBaseKey)
//				// 数据移动
//			this.setState({
//				selectedBaseKey: [].concat(...selectedBaseKey)
//			}, () => {
//				// 更新this.initSelectedBase
//				let {selectedBaseKey, initSelectedBaseKey} = this.state
//				this.initSelectedBase = returnParam(initSelectedBaseKey, selectedBaseKey, 'base')
//				
//			})
		let {selectedKey} = this.state
		if(this.initSelected) {

			this.targetSelected = this.initSelected.filter(item => {
				if(has(item, 'id')) {
					// 基础
					return this.targetSelectedKeys.indexOf(item.id) >= 0
					
				} else if(has(item, 'detailNo')) {
					// 服务
					let str = `${item.detailNo}_${item.showStartEnd}`
					return this.targetSelectedKeys.indexOf(str) >= 0
					
				}
			})
			
			// 排序
			this.targetSelected = sortNoSort(this.targetSelected)

			this.targetSelectedKeys = this.targetSelected.map(item => {
				if(has(item, 'id')) {
					// 基础
					return item.id
				} else if(has(item, 'detailNo')) {
					// 服务
					return `${item.detailNo}_${item.showStartEnd}`
				}
			})
			
			
			
			
			/****更新航班列界面配置下移滚动的位置*/
			let oldTop, itemHeight, lastContent;
//			if(!isUp) {
				let lastId = `id${this.targetSelectedKeys[this.targetSelectedKeys.length - 1]}`
				let lastNode = document.getElementById(lastId)
				lastContent = lastNode.offsetParent.querySelector('.ant-transfer-list-content')
				let lastItem = lastContent.querySelector('.ant-transfer-list-content-item:first-child')

				itemHeight = lastItem.offsetHeight
				
				oldTop = lastContent.scrollTop
//				lastContent.scrollTop = itemHeight + oldTop
//			}
			/*****/
			selectedKey = callback(this.targetSelectedKeys, selectedKey)
			
			
			
			this.setState({
				selectedKey: [].concat(...selectedKey)
			}, () => {
				if(!isUp) {
					if(this.downCount > 0) {
						lastContent.scrollTop = itemHeight + oldTop
					}
				} else {
					if(this.upCount > 0) {
						lastContent.scrollTop = oldTop > itemHeight ? oldTop - itemHeight : 0
					}
				}
				// 更新this.initSelected
				let {selectedKey, initSelectedKey} = this.state
				this.initSelected = returnParam(initSelectedKey, selectedKey, 'base')
				
			})
		}

	}
	/**
	 * changeServiceKeys 
	 * callback 上移或下移
	 * 
	 */
	changeServiceKeys (callback) {
//		if(this.initSelectedService) {
//			let targetSelectedKeys = this.initSelectedService.filter(item => {
//				return this.targetSelectedSerKeys.indexOf(item.detailNo) >= 0
//			})
//					
//			targetSelectedKeys = this.sortNoSort(targetSelectedKeys)
//			this.targetSelectedSerKeys = targetSelectedKeys.map(item => item.detailNo)
//		}
//				
//		let {selectedServiceKey} = this.state
//
//		selectedServiceKey = callback(this.targetSelectedSerKeys, selectedServiceKey)
//				// 数据移动
//		this.setState({
//			selectedServiceKey: [].concat(...selectedServiceKey)
//		}, () => {
//					// 更新this.initSelectedService
//			let {selectedServiceKey, initSelectedServiceKey, optionalServiceCols} = this.state
//			let serParam = returnParam(initSelectedServiceKey, selectedServiceKey, 'services', optionalServiceCols)
//					// 
//			serParam.forEach(item => {
//				item.detailNo = item.detailNo + '_' + item.showStartEnd
//			})
//			this.initSelectedService = serParam
//		})
		
	}
	/**
	 * 上移
	 */
	upMove (isBase) {
		this.upCount = 0
		// 上移的方法		数据的位置进行交换
		let up = (targetSelectedKeys, selectedBaseKey) => {
			for(let i=0, len=targetSelectedKeys.length; i<len; i++) {
				let selIndex = selectedBaseKey.indexOf(targetSelectedKeys[i])
				
				if(selIndex > 0) {
					let temp = selectedBaseKey[selIndex - 1]
					if(targetSelectedKeys.indexOf(temp) < 0) {
						this.upCount++
						selectedBaseKey[selIndex - 1] = targetSelectedKeys[i]
						selectedBaseKey[selIndex] = temp
					}
				}
				
			}
			return selectedBaseKey
		}
		
		if(isBase) {
			this.isBase = true
			if(this.targetSelectedKeys) {
				this.changeBaseKeys(up, true)
			}
			
		} else {
//			
//			this.isService = true
//			
//			if(this.targetSelectedSerKeys) {
//				this.changeServiceKeys(up)
//			}
		}
	}
	/**
	 * 下移
	 */
	downMove (isBase) {
		this.downCount = 0
		// 下移	更新数据的位置
		let down = (targetSelectedKeys, selectedBaseKey) => {
			for(let i=targetSelectedKeys.length - 1; i >= 0; i--) {
				let selIndex = selectedBaseKey.indexOf(targetSelectedKeys[i])
				if(selIndex < selectedBaseKey.length - 1) {
					let temp = selectedBaseKey[selIndex + 1]
					if(targetSelectedKeys.indexOf(temp) < 0) {
						this.downCount++
						selectedBaseKey[selIndex + 1] = targetSelectedKeys[i]
						selectedBaseKey[selIndex] = temp
					}
				}
			}
			return selectedBaseKey
		}
		
		if(isBase) {
			this.isBase = true

			if(this.targetSelectedKeys) {

				this.changeBaseKeys(down, false)
			}
			
		} else {
//			this.isService = true
//			if(this.targetSelectedSerKeys) {
//				this.changeServiceKeys(down)
//			}
		}
		
	}
	/**
	 * 到离港配置
	 */
	aordChange (checkedList) {
		let {optionalAord} = this.state
		this.setState({
			selectedAord: checkedList,
			aordIndeterminate: !!checkedList.length && (checkedList.length < optionalAord.length),
      		checkAordAll: checkedList.length === optionalAord.length,
		})
	}
	/**
	 * 类型配置
	 */
	doriChange (checkedList) {
		let {optionalDori} = this.state
		this.setState({
			selectedDori: checkedList,
			doriIndeterminate: !!checkedList.length && (checkedList.length < optionalDori.length),
      		checkDoriAll: checkedList.length === optionalDori.length,
		})
	}
	/**
	 * 全选
	 */
	checkedAll (isAord, ev) {
		let { optionalAord, optionalDori} = this.state
		if(isAord) {
			this.setState({
				selectedAord: ev.target.checked ? optionalAord : [],
				aordIndeterminate: false,
      			checkAordAll: ev.target.checked,
			})
		}else {
			this.setState({
				selectedDori: ev.target.checked ? optionalDori : [],
				doriIndeterminate: false,
      			checkDoriAll: ev.target.checked,
			})
		}
	}
	/**
	 * 保存配置
	 */
	saveConfig () {
		// 到离港	类型
		let {selectedAord, selectedDori, initSelectedAord, initSelectedDori} = this.state

		switch (this.activeKey){
			case '1':
			
			if(!this.isBase) {
				warningMsg('没有做任何修改')
				return 
			}
			// 航班列
			let {selectedKey, initSelectedKey} = this.state
			
			let allParam = returnParam(initSelectedKey, selectedKey, 'base')
			let param = [], serParam = [];
			
			allParam.forEach(item => {
				if(has(item, 'id')) {
					// 基础列
					param.push(item)
				} else {
					// 服务列
					serParam.push(item)
				}
			})
			
			console.log(param, serParam)

//			let showParam = param.filter(item => item.isShow == '0')
//			let showSerParam = serParam.filter(item => item.isShow == '0')
//			
//			if(showParam.length === 0 && showSerParam.length === 0) {
//				warningMsg('必须选择一个航班列')
//				return 	
//			}
			
			/**
			 * 服务列改变
			 */
			let serviceChange = (serParam) => {
				
				getSearchJson('post', '/API/init/serviceCols', serParam, (res) => {
					if(res.status === 1000) {
						// 获取配置数据
						this.getConfigData(() => {
							this.scrollChange()
							this.comeLeaveFilter(this.comeLeaveStr)
							setTimeout(() => {
								successMsg('航班配置成功')
								hideLoading()
							}, 10)
						})
						
					}
				})
				
			}
			
			getSearchJson('post', '/API/init/baseCols', param, (res) => {
				showLoading()
				if(res.status === 1000) {
//					successMsg('基础列配置成功')
//					
//					this.setState({
//						configModalShow: false
//					})
//					// 获取配置数据
//					this.getConfigData(() => {
//						this.scrollChange()
//						this.comeLeaveFilter(this.comeLeaveStr)
//					})
//					
					// 提交服务列
					serviceChange(serParam)
				}
			})

			this.isSaveConfig = true

			// 配置航班列，将其他的配置选项初始化
			this.setState({
				selectedAord: initSelectedAord,
				selectedDori: initSelectedDori,
				configModalShow: false
			})
			
			break;
			
			case '2':
//			if(!this.isService) {
//				warningMsg('没有做任何修改')
//				return 
//			}
//			let {selectedServiceKey, initSelectedServiceKey, optionalServiceCols} = this.state
//			
//			let serParam = returnParam(initSelectedServiceKey, selectedServiceKey, 'services', optionalServiceCols)
//			
//			console.log(serParam)
//			
//			getSearchJson('post', '/API/init/serviceCols', serParam, (res) => {
//				if(res.status === 1000) {
//					successMsg('服务列配置成功')
//					this.setState({
//						configModalShow: false
//					})
//					// 获取配置数据
//					this.getConfigData(() => {
//						this.scrollChange()
//						this.comeLeaveFilter(this.comeLeaveStr)
//					})
//				}
//			})
//			this.isSaveConfig = true
			// 服务列
			break;
			case '3':
			
			let aordSame = true
			let doriSame = true
			
			if(selectedAord.length === initSelectedAord.length && selectedDori.length === initSelectedDori.length) {
				
				selectedAord.forEach(item => {
					if(initSelectedAord.indexOf(item) < 0) {
						aordSame = false
					}
				})
				selectedDori.forEach(item => {
					if(initSelectedDori.indexOf(item) < 0) {
						doriSame = false
					}
				})
				if(aordSame && doriSame) {
					warningMsg('没有做任何修改')
					return
				}
			}
			
			
			if(selectedAord.length === 0 || selectedDori.length === 0) {
				warningMsg('必须选择一个类型和到离港数据')
				return
			}
			let aordParam = returnParam(initSelectedAord, selectedAord, 'aord')
			let doriParam = returnParam(initSelectedDori, selectedDori, 'dori')
			if(this.queryLoad) {
				// 正在更新
				clearTimeout(this.queryTime)	// 清除定时器
				this.isClearTime = true
			}
			getSearchJson('post', '/API/init/aord', aordParam, (res) => {
					showLoading()
					if(res.status === 1000) {
						getSearchJson('post', '/API/init/dori', doriParam, (dRes) => {
							if(dRes.status === 1000) {
								
								this.setState({
//									configModalShow: false,
									clickAordSave: true
								})
								
	//							// 获取配置数据
	//							this.getConfigData()
								// 到离港类型的数据
								this.getAordDori(() => {
									successMsg('配置成功')
									hideLoading()
								})
							}
						})
					}
			})
			this.setState({
				configModalShow: false
			})
			
			break;
		}
	}
	/**
	 * 取消配置
	 */
	cancelConfig () {
		if(this.activeKey === '3') {
			let {initSelectedAord, initSelectedDori, optionalDori, optionalAord} = this.state
			this.setState({
				selectedAord: initSelectedAord,
				selectedDori: initSelectedDori,
				checkDoriAll: initSelectedDori.length === optionalDori.length,
				checkAordAll: initSelectedAord.length === optionalAord.length,
				configModalShow: false
			})
		}

		this.targetSelectedKeys = []
		this.targetSelectedSerKeys = []
		
		this.isBase = false
		this.isService = false
		
		this.setState({
			configModalShow: false
		})
	}
	/**
	 * tab 切换
	 */
	tabActive (activeKey) {
		
		this.activeKey = activeKey; 
		
		if(activeKey === '1') {
			if(this.targetSelectedKeys.length > 0) {
				this.setState({upDownDisabled: false})
			} else {
				this.setState({upDownDisabled: true})
			}
		} else if(activeKey === '2') {
			if(this.targetSelectedSerKeys.length > 0) {
				this.setState({upDownDisabled: false})
			} else {
				this.setState({upDownDisabled: true})
			}
		}

	}
	/**
	 * 更新scrollXwidth
	 */
	updateScrollXWidth (callback) {
		let theadNode = document.getElementsByClassName('ant-table-thead')[0];
		if(!theadNode) {
			return
		}
		let thNodes = theadNode.querySelectorAll('th')
			
		let theadWidth = 0
		for(let i=0, len=thNodes.length; i<len; i++) {
			theadWidth += thNodes[i].offsetWidth
		}
		let L;
		let scrollXBar = this.refs.scrollXBar
		if(theadWidth <= document.documentElement.clientWidth - 44) {	// padding 30 滚动条 14
			scrollXBar.parentNode.style.display = 'none'
		} else {
			scrollXBar.parentNode.style.display = 'block'
			L = (scrollXBar.parentNode.offsetWidth)*(scrollXBar.parentNode.offsetWidth) / (theadWidth)
			scrollXBar.style.width = L  + 'px'
		}
		
		callback && callback(scrollXBar)
		
		return L
	}
	/*滚动条切换*/
	scrollChange (callback) {
		// 调用scroll方法
		setTimeout(() => {
			// 初始化滚动条的位置以及包裹区域的位置
			let tableContent = document.querySelectorAll('.table-content table')[0]
			
			if(!callback && tableContent) {
				tableContent.style.top = 0
			}
			
			let L, H;
			L = this.updateScrollXWidth()
			
			let {tableData} = this.state
			
			if(tableData.length * 41 < this.refs.contentWrap.offsetHeight - 40) {
				this.refs.scrollYBar.parentNode.style.display = 'none'
			} else {
				this.refs.scrollYBar.parentNode.style.display = 'block'
				H = (this.refs.scrollYBar.parentNode.offsetHeight - 41)*(this.refs.scrollYBar.parentNode.offsetHeight) / (this.state.tableData.length * 41 )
				this.refs.scrollYBar.style.height = H + 'px'
			}
			
			callback && callback(tableContent, this.refs.scrollYBar, this.refs.scrollXBar, H, L)
			
		}, 100)

	}
	/**
	 * 合并每一项
	 * @param {Object} item
	 * @param {Object} previousFlightIndex
	 */
	manageItem (item, previousFlight, isUpdate) {

					// 合并	
							for(let n in item) {
								if(n !== 'services') {
									// 基础列		
												if(n === 'id') {
													item[n] = item[n] + ' / ' + previousFlight[n]
													if(item[n] === this.activeId) {
														item.active = true
													} else {
														item.active = false
													}
												} else if(n === 'flightCourse' || n === 'flightCourseKey') {
													// 航线	和	航线三字码
													let startArr = item[n].split('-')
													let endArr = previousFlight[n].split('-')
													endArr.splice(0, 1)
													let result = startArr.concat(...endArr).join('-')
													item[n] = result
													
												} else if(n === 'originalAirport' || n === 'originAirportIata') {	// originalAirport  destAirport transit
													// 始发站
													item[n] = item[n]
													// 三字码

												} else if (n === 'destAirport' || n === 'destAirportIata') {
													// 目的站
													item[n] = previousFlight[n]
													// 目的站三字码

												
												} else if (n === 'transit' || n === 'transitIata') {
													// 经停站
													if(n === 'transit') {
														item[n] = item[n] ? (item[n] + ' ' + previousFlight['originalAirport'] + ' ' + previousFlight[n]) : (previousFlight['originalAirport'] + ' ' + previousFlight[n])
													} else {
														item[n] = item[n] ? (item[n] + ' ' + previousFlight['originAirportIata'] + ' ' + previousFlight[n]) : (previousFlight['originAirportIata'] + ' ' + previousFlight[n])
													}
													
												} else if (n === 'std' || n === 'atd' || n=== 'etd') {
													item[n] = previousFlight[n]
												} else if (n === 'sta' || n === 'ata' || n==='eta') {
													item[n] = item[n]
												} else if (n === 'newTime') {
//													item[n] = item[n] ? item[n] : '1999-01-01 00:00:00'
//													previousFlight[n] = previousFlight[n] ? previousFlight[n] : '1999-01-01 00:00:00'
//													item[n] = item[n] + ' / ' + previousFlight[n]
													if(item[n]) {
														item[n] = previousFlight[n] ? (item[n] + ' / ' + previousFlight[n] ) : item[n] + '_0'
													} else {
														item[n] = previousFlight[n] ? previousFlight[n] + '_1' : null
													}
													
												} else if (n === 'num' || n === 'iaKey') {
													// 更新时
													item[n] = item[n] ? item[n] : previousFlight[n]
													
												} else if(n === 'flgVip') {
													
													item[n] = item[n] ? item[n] : 'N'
													previousFlight[n] = previousFlight[n] ? previousFlight[n] : 'N'
													
													item[n] = item[n] == previousFlight[n] ? item[n] : item[n] + ' / ' + previousFlight[n]
													
												} else if(n === 'codeShare') {
													
													if(item[n]) {
														if(previousFlight[n]) {
															item[n] = item[n] + ' / ' + previousFlight[n]
														} else {
															item[n] = item[n] + ' / '
															item.isNextCodeShare = false
														}
													} else {
														if(previousFlight[n]) {
															item[n] = ' / ' + previousFlight[n]
															item.isNextCodeShare = true
														}
													}
													
												} else {

													if(previousFlight[n] !== item[n]) {
														if(previousFlight[n] || item[n]) {
															item[n] = item[n] ? ( previousFlight[n] ? item[n] + ' / ' + previousFlight[n] : item[n] ) : previousFlight[n]
														}
													}
													
												}
								} else {
									// 服务列
//									if(item[n]) {
//										
//										item[n].forEach((subItem, index) => {
//											
//											if(subItem.actualStartTime) {
//												item[n][index].actualStartTime = subItem.actualStartTime
//											} else {
//												if(item[n][index] && previousFlight[n] && previousFlight[n][index]) {
//													item[n][index].actualStartTime = previousFlight[n][index].actualStartTime
//												}
//											}
//											
//											if(subItem.actualEndTime) {
//												item[n][index].actualEndTime = subItem.actualEndTime
//											} else {
//												if(item[n][index] && previousFlight[n] && previousFlight[n][index]) {
//													item[n][index].actualEndTime = previousFlight[n][index].actualEndTime
//												}
//											}
//											
//										})
//									} else {
//										item[n] = previousFlight[n] ? previousFlight[n] : []
//									}
										
									item[n] = item[n] ? (previousFlight[n] ? item[n].concat(previousFlight[n]) : item[n]) : previousFlight[n]
								}
								
							}

						return item
				}
	/**
	 * 合并航班
	 */
	mergeFlight (data) {
				let initData = data
				let filterData = []
				let filterData2 = []
				let filterData3 = []
				
				let previousFlightNoArr = []
				for(let i=0, len=initData.length; i<len; i++) {
					
					if(initData[i].nextFlight && initData[i].aord === 'A') {
						
						filterData.push(initData[i])
						
					} else if(initData[i].previousFlight && initData[i].aord === 'D') {
						
						filterData2.push(initData[i])

						previousFlightNoArr.push(initData[i].previousFlight + ', ' + initData[i].previousFlightOperationDate + ', ' + initData[i].flightNo + ', ' + (initData[i].preRepeatCount ? '' + initData[i].preRepeatCount : '0'))

						// + ', ' + initData[i].flightNo + ', ' + initData[i].preRepeatCount ? '' + initData[i].preRepeatCount : '0'
					} else {
						
						filterData3.push(initData[i])
						
					}
				}

				let activeId = this.activeId	// 被点击的数据
				let mergeNextIndex = []
				
				// 到
				filterData.forEach(item => {
					
					let previousFlightIndex = previousFlightNoArr.indexOf(item.flightNo + ', ' + item.operationDate + ', ' + item.nextFlight + ', ' + (item.repeatCount ? '' + item.repeatCount : '0'))
					
					if( previousFlightIndex >= 0) {
							mergeNextIndex.push(previousFlightIndex)
							
							item = this.msgSortStr(item, "all", filterData2[previousFlightIndex])

							item = this.manageItem(item, filterData2[previousFlightIndex])
						
					} else {
						
						if(item.id === activeId) {
							item.active = true
						} else {
							item.active = false
						}
						item = this.msgSortStr(item, 'A')
					}
				})
				
				let flag = 0
				// 先将索引排序
				mergeNextIndex.sort((a, b) => {
					a = Number(a)
					b = Number(b)
					if(a > b) {
						return 1
					} else if(a < b) {
						return -1
					} else if(a === b) {
						return 0
					}
				})

				mergeNextIndex.forEach((item) => {
					filterData2.splice(item - flag, 1)
					flag++
				})
				
				filterData2.forEach(item => {
					
					if(item.id === activeId) {
						item.active = true
					} else {
						item.active = false
					}
					
					item = this.msgSortStr(item, 'D')
					
				})
				
				filterData3.forEach(item => {
					
					if(item.id === activeId) {
						item.active = true
					} else {
						item.active = false
					}
					
					if(item.aord === 'A') {

						item = this.msgSortStr(item, 'A')

					} else if(item.aord === 'D') {

						item = this.msgSortStr(item, 'D')

					}
				})
				
				let mergeTableData = [].concat(filterData, filterData2, filterData3)

				return mergeTableData
	}
	/**
	 * 默认AI排序
	 */
	flightConSort (data) {		// 初始化的数据data
		console.log('flightConSort......start')
		let comeLeave = {
			A: (data) => {
				let comeData = data.filter(item => item.aord === 'A')
				
				comeData.forEach((item) => {
					if(item.id === this.activeId) {
						item.active = true
					} else {
						item.active = false
					}
					item = this.msgSortStr(item, "A")

				})

				return comeData
			},
			D: (data) => {
				let leaveData = data.filter(item => item.aord === 'D')

				leaveData.forEach((item) => {
					if(item.id === this.activeId) {
						item.active = true
					} else {
						item.active = false
					}
					item = this.msgSortStr(item, "D")

				})

				return leaveData
			},
			all: (data) => {
				
				console.log(data.length, 'mergeFlight')		
				let mergeData = this.mergeFlight(data)
				return mergeData
				
			}
		}
		
		data = comeLeave[this.comeLeaveStr](data)
		
		data = this.choiceDefaultSort(data)		// 选择哪一种默认排序规则
		
		return data
	}
	/**
	 * 选择哪一种默认排序
	 */
	choiceDefaultSort (data) {
		// 选择哪一种默认排序
		// 执行了两遍
//		let {defaultSortRule} = this.state
		
		if(this.sortRule === 'AOC') {
			
			data.sort((a, b) => {
				if(a['num'] > b['num']) {
					return 1
				} else if(a['num'] < b['num']) {
					return -1
				} else if(a['num'] === b['num']) {
					return 0
				}
		
			})
			
		} else if(this.sortRule === 'IA') {
			
			data.sort((a, b) => {
				if(a['iaKey'] > b['iaKey']) {
					return 1
				} else if(a['iaKey'] < b['iaKey']) {
					return -1
				} else if(a['iaKey'] === b['iaKey']) {
					return 0
				}
			})
			
		}
		return data
		
	}
	
	// msg排序字段
	msgSortStr (msg, str, previous) {
		// num AOC排序字段
		// iaKey IA排序的字段
		var temp = ''
		switch(str){
			case 'A':
				if(msg.newStatus != null && (msg.newStatus.indexOf('取消') >= 0 || msg.newStatus.indexOf('备降') >= 0)) {
					msg.num = `A, ${msg.operationDate}, ${msg.repeatCount}, ${msg.flightNo}`
					
					msg.iaKey = `C, ${msg.operationDate}, ${msg.repeatCount}, ${msg.flightNo}`
					return msg
				}
				// iaKey
				
				if(msg.ata != null) {
					
					temp = msg.ata
					msg.iaKey = `B, ${temp}, ${msg.flightNo}`
					
				} else if(msg.newStatus != null && msg.newStatus.indexOf('前起') >= 0) {
					
					temp = msg.eta ? msg.eta : msg.sta
					msg.iaKey = `6, ${temp || 0}, ${msg.flightNo}`
					
				} else {
					
					temp = msg.eta ? msg.eta : msg.sta
					msg.iaKey = `8, ${temp || 0}, ${msg.flightNo}`
					
				}
				
//					if(msg.operationalStatus != null && (msg.operationalStatus.indexOf('取消') >= 0 || msg.operationalStatus.indexOf('备降') >= 0)) {
				if(msg.ata != null ) { // 实际到港时间ata
					
					msg.num = `3, ${msg.operationDate}, ${msg.ata}, ${msg.repeatCount}, ${msg.flightNo}`
					
				} else if(msg.eta != null) {
					
					msg.num = `7, ${msg.operationDate}, ${msg.eta}, ${msg.repeatCount}, ${msg.flightNo}`
					
				} else {
					
					msg.num = `9, ${msg.operationDate}, ${msg.sta}, ${msg.repeatCount}, ${msg.flightNo}`
					
				}
				
				
				
				
			break;
			case 'D':
				if(msg.newStatus != null && (msg.newStatus.indexOf('取消') >= 0 || msg.newStatus.indexOf('备降') >= 0)) {
					msg.num = `A, ${msg.operationDate}, ${msg.repeatCount}, ${msg.flightNo}`
					msg.iaKey = `C, ${msg.operationDate}, ${msg.repeatCount}, ${msg.flightNo}`
					return msg
				}
				// iaKey 
				if(msg.atd != null) {	// 实际起飞时间atd
					temp = msg.atd
					msg.iaKey = `9, ${temp}, ${msg.flightNo}`
				} else if(msg.newStatus != null && msg.newStatus.indexOf('登机结束') >= 0) {
					temp = msg.etd ? msg.etd : msg.std
					msg.iaKey = `2, ${temp || 0}, ${msg.flightNo}`
				} else if(msg.newStatus != null && msg.newStatus.indexOf('本站登机') >= 0 || msg.newStatus.indexOf('催促登机') >= 0 || msg.newStatus.indexOf('过站登机') >= 0) {
					temp = msg.etd ? msg.etd : msg.std
					msg.iaKey = `3, ${temp || 0}, ${msg.flightNo}`
				} else {
					temp = msg.etd ? msg.etd : msg.std
					msg.iaKey = `1, ${temp || 0}, ${msg.flightNo}`
				}
				
//				if(msg.operationalStatus != null && (msg.operationalStatus.indexOf('取消') >= 0 || msg.operationalStatus.indexOf('备降') >= 0)) {
				if(msg.atd != null) {	// 实际起飞时间atd
												
					msg.num = `1, ${msg.operationDate}, ${msg.atd}, ${msg.repeatCount}, ${msg.flightNo}`
					
					temp = msg.atd
					msg.iaKey = `9, ${temp}, ${msg.flightNo}`
					
				} else {
					let str = msg.etd == null ? msg.std : msg.etd
					msg.num = `4, ${msg.operationDate}, ${str}, ${msg.repeatCount}, ${msg.flightNo}`
				}
				
			break;
			case 'all':
				if(msg.newStatus != null && (msg.newStatus.indexOf('取消') >= 0 || msg.newStatus.indexOf('备降') >= 0) || previous.newStatus != null && (previous.newStatus.indexOf('取消') >= 0 || previous.newStatus.indexOf('备降') >= 0)) {	
					msg.num = `A, ${msg.operationDate}, ${previous.operationDate}, ${msg.repeatCount}, ${previous.repeatCount}, ${msg.flightNo}, ${previous.flightNo}`
					
					msg.iaKey = `C, ${msg.operationDate}, ${previous.operationDate}, ${msg.repeatCount}, ${previous.repeatCount}, ${msg.flightNo}, ${previous.flightNo}`			
					return msg
				}
				// iaKey
				if(msg.ata != null && previous.atd != null) {
					msg.iaKey = `A, ${previous.atd}, ${msg.flightNo}, ${previous.flightNo}`
				} else if(previous.newStatus != null && previous.newStatus.indexOf('登机结束') >= 0) {
					msg.iaKey = `2, ${msg.ata || 0}, ${msg.flightNo}, ${previous.flightNo}`		// 加个A区分离港和连班的层次
				} else if(previous.newStatus != null && previous.newStatus.indexOf('本站登机') >= 0 || previous.newStatus.indexOf('催促登机') >= 0 || previous.newStatus.indexOf('过站登机') >= 0) {
					msg.iaKey = `3, ${msg.ata || 0}, ${msg.flightNo}, ${previous.flightNo}`		// 加个A区分离港和连班的层次
				} else if(msg.ata != null) {
					msg.iaKey = `4, ${msg.ata}, ${msg.flightNo}, ${previous.flightNo}`
				} else if(msg.newStatus != null && msg.newStatus.indexOf('前起') >= 0) {
					temp = msg.eta ? msg.eta : msg.sta
					msg.iaKey = `5, ${temp || 0}, ${msg.flightNo}, ${previous.flightNo}`
				} else {
					temp = msg.eta ? msg.eta : msg.sta
					msg.iaKey = `7, ${temp || 0}, ${msg.flightNo}, ${previous.flightNo}`		// 加航班为了区分相同时间的时候排序
					
				}
				
//				if(msg.operationalStatus != null && (msg.operationalStatus.indexOf('取消') >= 0 || msg.operationalStatus.indexOf('备降') >= 0)) {
				if(previous && previous.atd != null) {

					msg.num = `2, ${msg.operationDate}, ${previous.operationDate}, ${previous.atd}, ${msg.repeatCount}, ${previous.repeatCount}, ${msg.flightNo}, ${previous.flightNo}`
								
				} else if(msg.ata != null) {
					msg.num = `5, ${msg.operationDate}, ${previous.operationDate}, ${msg.ata}, ${msg.repeatCount}, ${previous.repeatCount}, ${msg.flightNo}, ${previous.flightNo}`

				} else if(msg.eta != null) {
								
					msg.num = `6, ${msg.operationDate}, ${previous.operationDate}, ${msg.eta}, ${msg.repeatCount}, ${previous.repeatCount}, ${msg.flightNo}, ${previous.flightNo}`

				} else {

					msg.num = `8, ${msg.operationDate}, ${previous.operationDate}, ${msg.sta}, ${msg.repeatCount}, ${previous.repeatCount}, ${msg.flightNo}, ${previous.flightNo}`
								
				}
			break;
		}
		
		return msg
	}
	/**
	 * 滚动条位置的更新
	 */
	queryUpdateScroll () {
		
		let scrollYBar = this.refs.scrollYBar
		let T = scrollYBar.offsetTop
		let maxT = scrollYBar.parentNode.offsetHeight - scrollYBar.offsetHeight

		let scale = T / maxT
		let tbody = document.querySelector('.table-content table')

		let {start, tableData, showLen} = this.state 
		let length = tableData.length
		let charLen = length - showLen
		
		let tMaxT = tbody.offsetHeight - scrollYBar.parentNode.offsetHeight + 14
		
		if(charLen < 0) {
			return
		}

		if (scale < 0 || scale === 0) {
	        scale = 0          
	       	start = 0
	   } else if (scale > 1 || scale === 1) {
	   		scale = 1
			start = charLen
	   }
	   
	   start = ((scale * charLen) < 0 ? 0 : (scale * charLen)) | 0
	   
//	   tbody.style.top = -scale * tMaxT + 'px'					
	   
	   this.setState({
	        start
	   }, () => {
	    	// 更新滚动条的top值
	    	let {start, tableData, showLen} = this.state 
	    	let tScale = start / (tableData.length - showLen)
	    	scrollYBar.style.top = maxT * tScale + 'px'
	   })
	    
	}
	/**
	 * 获取各个航班的数据长度
	 */
	getFlightLength (tableData) {
		let comeLength = 0, leaveLength = 0, mergeLength = 0;
					
					if(this.comeLeaveStr === 'all') {
						tableData.forEach(item => {
							let itemAord = item.aord
							if(itemAord === 'A') {
								comeLength++
							} else if(itemAord === 'D') {
								leaveLength++
							} else {
								comeLength++
								leaveLength++
								mergeLength++
							}
						})
						
					} else {
						
						if(this.comeLeaveStr === 'A') {
							comeLength = tableData.length
							leaveLength = 0
							mergeLength = 0
						} else {
							comeLength = 0
							leaveLength = tableData.length
							mergeLength = 0
						}
						
					}
		return {
			comeLength,
			leaveLength,
			mergeLength
		}
	}
	
	/**
	* 消费队列
	* @param {Object} time
	*/
	splitQuery (initData, tableData, time) {
			this.queryLoad = true
			
			this.queryTime = setTimeout(() => {
				
				// 在更新过程中如何处理过滤的功能
				this.flightUpdate = true
				
				if(this.updateMsg.length > 0) {
					console.time('update')
//					let data = this.updateMsg.shift()
//					let data = []
					if(!this.splitData || this.splitData.length === 0) {
						// 过滤的情况
						this.splitData = []
						
						if(this.updateMsg.length > 20) {
							
							this.splitData = this.updateMsg.slice(0, 20)
							this.updateMsg = this.updateMsg.slice(20)
							
						} else {
							
							this.splitData = this.updateMsg.slice(0, this.updateMsg.length)
							this.updateMsg = []
							
						}
						
					}
					
					// 更新数据
					this.splitData.forEach((item, index) => {
						this.updateInfo[this.comeLeaveStr](initData, tableData, item)
					})
					
					let filterTableData = []
					
					if(this.sortOrder) {
						
						// 自定义排序规则		可以优化的地方
						let sorter = {
							field: this.sortFlag,
							order: this.sortOrder,
							columnKey: this.sortColumnKey
						}
						
						filterTableData = deepClone(tableData)
						
						tableData = this.clickSort(sorter, filterTableData)
									
					} else {
						
						tableData = this.choiceDefaultSort(tableData)		// 选择哪种默认排序
						
					}
					
					let {comeLength, leaveLength, mergeLength} = this.getFlightLength(tableData)
					
					filterTableData = filterTableData.length > 0 ? filterTableData : tableData
					
					this.setState({
						initData,
						tableData,
						filterTableData,
						initTableData: filterTableData,
						comeLength,
						leaveLength,
						mergeLength,
						initEnd: true
					}, () => {
						this.splitData = []
						
						let {initData, tableData} = this.state
						
						console.timeEnd('update')
						
						// 更新竖向滚动条的位置和长度
						this.queryUpdateScroll()
						
						this.splitQuery(initData, tableData,  1000)
						
						// 更新完成之后更新宽度
						setTimeout(() => {
							this.updateTdWidth()
							
							if(this.refs && this.refs.deleteFlightWrap) {
								this.refs.deleteFlightWrap.style.display = 'none'
							}
						},0)
						
					})
				} else {
					clearTimeout(this.queryTime)
					this.queryLoad = false
					this.flightUpdate = false
				}
				
			}, time)
		}
	/**
	 * 航班数据更新
	 */
	flightDataUpdate (data) {
		
		let {initData, tableData, initTableData, selectedDori} = this.state
		// 航班更新事件
//		let msg = data.mesg
//		msg = this.statusMerge(msg)
//		data.mesg = msg
		
		if(data.flag !== 'D') {
			data.mesg = this.statusMerge(data.mesg)
		} 
		
		// 只更新到港的数据
		let comeUpdate = {
			/**
			 * 航班更新
			 */
			FLIGHT: {
					/**
					 * 
					 */
					I: (msg, initData, tableData, str) => {
						/**
						 * 连班的情况
						 */
						let addInfo = (AorD) => {
							
							let searchIndex = AorD === 'A' ? arrUtil(tableData, ['aord', 'operationDate', 'repeatCount', 'flightNo'], ["D", msg.nextFlightOperationDate, msg.nextRepeatCount, msg.nextFlight]) : arrUtil(tableData, ['aord', 'operationDate', 'repeatCount', 'flightNo'], ["A", msg.previousFlightOperationDate, msg.preRepeatCount, msg.previousFlight])

								if(searchIndex >= 0) {
									
									if(AorD === 'D') {
										tableData[searchIndex] = this.msgSortStr(tableData[searchIndex], 'all', msg)
									} else {
										msg = this.msgSortStr(msg, 'all', tableData[searchIndex])
									}
									// 连班
									let newItem = AorD === 'D' ? this.manageItem(tableData[searchIndex], msg, 'true') : this.manageItem(deepClone(msg), tableData[searchIndex], 'false')
//									newItem = AorD === 'D' ? this.msgSortStr(newItem, 'all', msg) : this.msgSortStr(msg, 'all', newItem)
									tableData[searchIndex] = newItem
									
								} else {
									
									let initSearchIndex = AorD === 'A' ? arrUtil(initData, ['aord', 'operationDate', 'repeatCount', 'flightNo'], ["D", msg.nextFlightOperationDate, msg.nextRepeatCount, msg.nextFlight]) : arrUtil(initData, ['aord', 'operationDate', 'repeatCount', 'flightNo'], ["A", msg.previousFlightOperationDate, msg.preRepeatCount, msg.previousFlight])

									if(initSearchIndex >= 0) {
										
//										if(isAdd || isAddOrUpdate.call(this, initData[initSearchIndex], AorD)) {
											if(AorD === 'D') {
												tableData[searchIndex] = this.msgSortStr(deepClone(initData[initSearchIndex]), 'all', msg)
											} else {
												msg = this.msgSortStr(msg, 'all', deepClone(initData[initSearchIndex]))
											}
											// 合并
											let newItem = AorD === 'D' ? this.manageItem(deepClone(initData[initSearchIndex]), msg, 'true') : this.manageItem(deepClone(msg), deepClone(initData[initSearchIndex]), 'false')
//											newItem = AorD === 'D' ? this.msgSortStr(newItem, 'all', msg) : this.msgSortStr(msg, 'all', newItem)
											
											
											if(isAddOrUpdate.call(this, newItem, newItem.aord)) {
												tableData.newPush(newItem)
											}

//										}
											
									} else {
										
										if(isAddOrUpdate.call(this, msg, msg.aord)) {
											tableData.newPush(msg)
										}
									}	
									
								}
							
						}
						
						// 新增
						initData.newPush(deepClone(msg))
						
						msg = this.msgSortStr(msg, msg.aord)		// num

						// 筛选
						if(this.comeLeaveStr === 'all') {
							
							addInfo(msg.aord)
							
						} else {
							
							if(isAddOrUpdate.call(this, msg, str)) {
								tableData.newPush(msg)
							}
							
						}

					},
					/**
					 * 
					 */
					D: (msg, initData, tableData) => {
						console.log('......isiisisi')
						this.updateInfo.commonUtil(msg, initData, (updateIndex) => {
							console.log(updateIndex)
							initData.splice(updateIndex, 1)
						}, false)
						
						// 删除
						if(this.comeLeaveStr === 'all') {
							
							let splitIndex = -1
							let updateItem = {
								index: -1,
								id: ''
							}
							
							tableData.forEach((item, index) => {
								let splitId = item.id.indexOf(msg.id)
								if(splitId >= 0) {
									// 可能存在拆掉连班
									if(item.id.indexOf(' / ') >= 0 ) {
										let idArr = item.id.split(' / ')
										// 拆掉连班
										if(splitId === 0) {
											updateItem = {
												index,
												id: idArr[1]
											}
										} else {
											updateItem = {
												index,
												id: idArr[0]
											}
										}
										
									} else {
										splitIndex = index
									}
								}
							})
							
							// 找到对应的航班更新
							if(updateItem.id) {
								initData.forEach(item => {
									if(item.id === updateItem.id) {
										tableData[updateItem.index] = deepClone(item)
										return
									}
								})
							}
							
							console.log(splitIndex, 'splitIndex.....')
							if(splitIndex >= 0) {
								tableData.splice(splitIndex, 1)
							}
							
						} else {
							
							this.updateInfo.commonUtil(msg, tableData, (updateIndex) => {
								console.log(updateIndex, 'lllll')
								tableData.splice(updateIndex, 1)
							}, false)
							
						}
						
					},
					/**
					 * 
					 */
					U: (msg, initData, tableData, str) => {
						/**
						 * 连班的更新
						 */
						let mergeUpdate = (AorD, initData, tableData, msg) => {
							console.log(msg, '更新的initMsg')
							let updateIndex = -1
							// 现在视图中找到这条数据
							tableData.forEach((item, index) => {
								if(item.id.indexOf(msg.id) >= 0) {
									updateIndex = index
									return
								}
							})
							// 判断这条数据是否可能是连班
							let isLian = msg.nextFlightOperationDate && msg.nextFlight || msg.previousFlightOperationDate && msg.previousFlight

							let pushId = ''
							
							let spliceIndex = -1
							
							console.log(updateIndex, 'updateIndex............')
							
							if(updateIndex >= 0) {
								
								console.log(tableData[updateIndex], msg, 'tableData[updateIndex]................')
								// 存在连班的情况
								if(isLian) {
									
									let initIndex =  AorD === 'A' ? arrUtil(initData, ['aord', 'operationDate', 'repeatCount', 'flightNo'], ["D", msg.nextFlightOperationDate, msg.nextRepeatCount, msg.nextFlight]) : arrUtil(initData, ['aord', 'operationDate', 'repeatCount', 'flightNo'], ["A", msg.previousFlightOperationDate, msg.preRepeatCount, msg.previousFlight])
									
									if(initIndex >= 0) {
										// 原始数据中存在连班
										let initItem = deepClone(initData[initIndex])
										
										if(AorD === 'D') {
											initItem = this.msgSortStr(initItem, 'all', msg)
										} else {
											
											msg = this.msgSortStr(deepClone(msg), 'all', initItem)
										}
										
										// 拼接
										let newItem = AorD === 'D' ? this.manageItem(initItem, msg, 'true') : this.manageItem(deepClone(msg), initItem, 'false')
										let initSpliceIndex = -1
										
										tableData.forEach((item, index) => {
											if(item.id.indexOf(initData[initIndex].id) >= 0) {
												initSpliceIndex = index
												return
											}
										})
										
										console.log(initSpliceIndex, 'initSpliceIndex............')
										
										if(initSpliceIndex >= 0) {
											tableData.splice(initSpliceIndex, 1)
											if(updateIndex > initSpliceIndex) {
												updateIndex = updateIndex - 1
												tableData[updateIndex] = deepClone(newItem)
											} else {
												if(updateIndex === initSpliceIndex) {
													console.log(newItem, 'newItem..............')
													// 添加
													if(isAddOrUpdate.call(this, newItem, newItem.aord)) {
														tableData.newPush(newItem)
													}
												}
											}
										} else {
											tableData[updateIndex] = deepClone(newItem)
										}
										
									} else {
										// 直接更新这条消息
										// 更新即可
//										let updateServices = deepClone(tableData[updateIndex].services)
										tableData[updateIndex] = deepClone(msg)
//										tableData[updateIndex].services = updateServices
										
									}

								} else {

									// 直接更新这条消息
									// 更新即可
//									let updateServices = deepClone(tableData[updateIndex].services)
									tableData[updateIndex] = deepClone(msg)
//									tableData[updateIndex].services = updateServices
									
								}
//								debugger
								if(tableData[updateIndex] && !isAddOrUpdate.call(this, tableData[updateIndex], tableData[updateIndex].aord)) {
									//
									console.log(updateIndex, 'splice updateIndex')
//									// 删除
//									updateIndex = spliceIndex >= 0 ? (updateIndex > spliceIndex ? updateIndex - 1 : updateIndex) : updateIndex
									tableData.splice(updateIndex, 1)
									
								}
								
								
							} else {
								// 没有找到这条数据
								if(isLian) {
									let initIndex =  AorD === 'A' ? arrUtil(initData, ['aord', 'operationDate', 'repeatCount', 'flightNo'], ["D", msg.nextFlightOperationDate, msg.nextRepeatCount, msg.nextFlight]) : arrUtil(initData, ['aord', 'operationDate', 'repeatCount', 'flightNo'], ["A", msg.previousFlightOperationDate, msg.preRepeatCount, msg.previousFlight])
									
									if(initIndex >= 0) {
										// 原始数据中存在连班
										let initItem = deepClone(initData[initIndex])
										
										if(AorD === 'D') {
											initItem = this.msgSortStr(initItem, 'all', msg)
										} else {
											
											msg = this.msgSortStr(deepClone(msg), 'all', initItem)
										}
										// 拼接
										let newItem = AorD === 'D' ? this.manageItem(initItem, msg, 'true') : this.manageItem(deepClone(msg), initItem, 'false')
										if(isAddOrUpdate.call(this, newItem, newItem.aord)) {
											let spliceIndex = -1
											tableData.forEach((item, index) => {
												if(item.id.indexOf(initData[initIndex].id) >= 0) {
													spliceIndex = index
													return
												}
											})
											console.log(spliceIndex, deepClone(tableData[spliceIndex]))
											
											if(spliceIndex >= 0) {
												tableData.splice(spliceIndex, 1)
											}
											
											tableData.newPush(deepClone(newItem))
											console.log('lian push', newItem)
										}
									} else {
										let pushIndex = -1
										
										initData.forEach((item, index) => {
											if(item.id === msg.id) {
												pushIndex = index
											}
										})
										
										if(pushIndex >= 0) {
											if(isAddOrUpdate.call(this, initData[pushIndex], initData[pushIndex].aord)) {
												tableData.newPush(deepClone(initData[pushIndex]))
												
											}
										}
										
										console.log('liang push......', pushIndex)
										
									}
									
									
								} else {
									
									let pushIndex = -1
									initData.forEach((item, index) => {
										if(item.id === msg.id) {
											pushIndex = index
										}
									})
									
									if(pushIndex >= 0) {
										if(isAddOrUpdate.call(this, initData[pushIndex], initData[pushIndex].aord)) {
		//									
											tableData.newPush(deepClone(initData[pushIndex]))
											
										}
									}
									
									console.log('wu lian push', pushIndex)
								}
								
							}
							
						}
						

						msg = this.msgSortStr(msg, msg.aord)		// num

						let isCodeShare = false
						
						this.initUpdateData = null		/// 进来更新之前置空(null)
						// 更新
						this.updateInfo.commonUtil(msg, initData, (updateIndex) => {
								let updateServices = deepClone(initData[updateIndex].services)
								
								initData[updateIndex] = deepClone(msg)
								
								initData[updateIndex].services = updateServices

								this.initUpdateData = deepClone(initData[updateIndex])
								
							}, true, () => {
								
								// 共享航班
								isCodeShare = true
								initData.newPush(deepClone(msg))
								
						})
						
						if(this.comeLeaveStr === 'all') {
							
							if(isCodeShare) {
								
								let updateCodeIndex = -1 
								
								tableData.forEach((item, index) => {
									
									if(item.operationDate.indexOf(msg.operationDate) >= 0 && item.repeatCount && item.repeatCount.indexOf(msg.repeatCount) >= 0 && item.aord.indexOf(msg.aord) >= 0 && item.codeShare && item.codeShare.indexOf(msg.flightNo) >= 0) {
										updateCodeIndex = index
										return
									}
									
								})
								
								if(updateCodeIndex >= 0) {
									// 连班的情况和非连班的情况
									let updateTableCode = tableData[updateCodeIndex]
									if(updateTableCode.codeShare) {
										
										if(updateTableCode.codeShare.indexOf(' / ') > 0) {
											// 连班的情况
											let codeShareArr = updateTableCode.codeShare.split(' / ')	
											
											if(msg.aord === 'A') {
												
												if(codeShareArr[0]) {
//													codeShareArr[0] = codeShareArr[0].replace(msg.flightNo, '')
//
//													codeShareArr[0] = codeShareArr[0].replace(/,{2, }/g, ',')
													codeShareArr[0] = removeCodeEllip(codeShareArr[0], msg.flightNo)
												}
												
											} else {
												
												if(codeShareArr[1]) {
//													codeShareArr[1] = codeShareArr[1].replace(msg.flightNo, '')
//													codeShareArr[1] = codeShareArr[1].replace(/,{2, }/g, ',')
													codeShareArr[1] = removeCodeEllip(codeShareArr[1], msg.flightNo)
												}
												
											}
											
											if(codeShareArr[0] && codeShareArr[1]) {
												
												tableData[updateCodeIndex].codeShare = codeShareArr.join(' / ')
												
											} else {
												
												if(codeShareArr[0]) {
													tableData[updateCodeIndex].codeShare = codeShareArr[0] + ' / '
													tableData[updateCodeIndex].isNextCodeShare = false
												} else if(codeShareArr[1]) {
													tableData[updateCodeIndex].codeShare = ' / ' + codeShareArr[1] 
													tableData[updateCodeIndex].isNextCodeShare = true
												}
												
											}
										} else {
											// 非连班的情况
											let noMergeCode = removeCodeEllip(updateTableCode.codeShare, msg.flightNo)
//											let noMergeCode = updateTableCode.codeShare.replace(msg.flightNo, '')
											
//											noMergeCode = noMergeCode.replace(/,{2, }/g, ',')
											
											tableData[updateCodeIndex].codeShare = noMergeCode
											
										}
										
									}
									
									/**
									 * 去除多余的逗号
									 * @param {Object} codeShare
									 * @param {Object} flightNo
									 */
									function removeCodeEllip (codeShare, flightNo) {
										if(codeShare) {
											if(codeShare.indexOf(',' + flightNo + ',') >= 0) {
												return codeShare.replace(',' + flightNo + ',', ',')
											} else if(codeShare.indexOf(',' + flightNo) >= 0) {
												return codeShare.replace(',' + flightNo, '')
											} else if(codeShare.indexOf(flightNo + ',') >= 0) {
												return codeShare.replace(flightNo + ',', '')
											} else if(codeShare.indexOf(flightNo) >= 0) {
												return codeShare.replace(flightNo, '')
											}
										}
									}
									
									if(tableData[updateCodeIndex] && !isAddOrUpdate.call(this, tableData[updateCodeIndex], tableData[updateCodeIndex].aord)) {
										tableData.splice(updateCodeIndex, 1)
									}
									if(isAddOrUpdate.call(this, msg, msg.aord)) {
										tableData.newPush(msg)
									}

								}
								
							} else {
								// initData 还是被污染		需要解决				// 原始数据中消息对应的数据
								let initMsg = this.initUpdateData || msg	// 更新原始数据之后找到这条数据
								
								mergeUpdate(msg.aord, initData, tableData, initMsg)
								
							}
						} else {
							
								this.updateInfo.commonUtil(msg, tableData, (updateIndex) => {
									
									let updateServices = tableData[updateIndex].services
									tableData[updateIndex] = msg
									tableData[updateIndex].services = updateServices
									
									tableData[updateIndex] = this.msgSortStr(tableData[updateIndex], tableData[updateIndex].aord)		// 设置num的 		key值
									
									if(!isAddOrUpdate.call(this, tableData[updateIndex], tableData[updateIndex].aord)) {
										tableData.splice(updateIndex, 1)
									}
									
								}, true, (paramData, index) => {
									// 共享航班
									if(!isAddOrUpdate.call(this, paramData, paramData.aord)) {
										tableData.splice(index, 1)
									}
									if(isAddOrUpdate.call(this, msg, msg.aord)) {
										tableData.newPush(msg)
									}
									
								}, () => {
									// 没有找到对应的数据
									
									if(isAddOrUpdate.call(this, msg, msg.aord)) {
										tableData.newPush(msg)
									}
									
								})
								

						}
					}
			},
			/**
			 * 服务
			 */
			SERVICE: {
				init: (initData, msg) => {
					for(let i=0, len=initData.length; i<len; i++) {
						if(initData[i].id.indexOf(msg.flightId) >= 0) {
							if(!initData[i]['services']) {
								console.log('报错的地方', initData[i], initData[i].id, msg.id)
							}
							
							initData[i]['services'] && initData[i]['services'].forEach(item => {
								if(item.detailNo === msg.detailNo) {
									item.actualStartTime = msg.actualStartTime
									item.actualEndTime = msg.actualEndTime
									return
								}
							})
							
							break
						}
					}
					return initData
				},
				U: (msg, initData, tableData, callback) => {
					
					initData = comeUpdate['SERVICE'].init(initData, msg)
					//let initIdArr = initData.map(item => item.id)	// 保存initData 中所有的id

					tableData = comeUpdate['SERVICE'].init(tableData, msg)
					
					// 连班的服务拼接
					
				}
			}
		}
		
		this.updateInfo = {
			isCodeShare: false,
			/**
			 * 共享航班
			 */
			codeShare: (initData, msg, isTable) => {		//
						// 主航班和共享航班号不相同
						// 找出对应的主航班号
						// 更新原始数据
					let initSplice = -1
					let codeIndex = -1
					initData.forEach((item, index) => {
						if(item.id === msg.id) {
							initSplice = index
						}
						if(item.aord.indexOf(msg.aord) >= 0 && item.flightNo.indexOf(msg.codeShare) >= 0 && item.repeatCount && item.repeatCount.indexOf(msg.repeatCount) >= 0 && item.operationDate.indexOf(msg.operationDate) >= 0 ) {
								
//							item.codeShare = item.codeShare ? (item.codeShare.indexOf(msg.flightNo) >= 0 ? item.codeShare : item.codeShare + ',' + msg.flightNo) : msg.flightNo
							codeIndex = index
							
						}
					})
					
					
					
					if(codeIndex >= 0) {
//						codeIndex = codeIndex >= initSplice ? codeIndex - 1 : codeIndex
						let initCode = initData[codeIndex]
						
						if(initCode.id.indexOf(' / ') > 0) {
							// 连班
							if(initCode.codeShare) {
								
								let initCodeShare = initCode.codeShare.split(' / ')
								console.log(initCodeShare, '...........codeShare........')
								initData[codeIndex].codeShare = msg.aord === 'A' ? (initCodeShare[0] ? (initCodeShare[0].indexOf(msg.flightNo) >= 0 ? initCode.codeShare : initCodeShare[0] +',' + msg.flightNo + ' / ' + initCodeShare[1]) : (msg.flightNo + ' / ' + initCodeShare[1])) : (initCodeShare[1] ? (initCodeShare[1].indexOf(msg.flightNo) >= 0 ? initCode.codeShare : initCodeShare[0] + ' / ' + initCodeShare[1] +',' + msg.flightNo) : (initCodeShare[0] + ' / ' + msg.flightNo))
								
							} else {
								// 
								initData[codeIndex].codeShare = msg.aord === 'A' ? msg.flightNo + ' / ' : ' / ' + msg.flightNo
							}
							
						} else {
							// 
							if(initCode.codeShare) {
								initData[codeIndex].codeShare = initCode.codeShare.indexOf(msg.flightNo) >= 0 ? initCode.codeShare : initCode.codeShare + ',' + msg.flightNo
							} else {
								initData[codeIndex].codeShare = msg.flightNo
							}
						}
						
					}
					
//					initData.forEach((item, index) => {
//						if(item.id === msg.id) {
//							initSplice = index
//						}
//					})
					
					if(initSplice >= 0) {
						initData.splice(initSplice, 1)
					}
					
					
					
					return initData

			},
			/**
			 * 
			 */
			init: (msg, initData) => {
				
				msg.services = msg.services || []
				if(initData[0]) {
					initData[0].services && initData[0].services.forEach(item => {
						let cloneObj = deepClone(item)
						cloneObj.actualStartTime = null
						cloneObj.actualEndTime = null
						msg.services.push(cloneObj)
					})
				}

				return msg
			},
			/**
			 * 添加和删除
			 */
			commonUtil: (msg, initData, callback, isUpdate, addCallback, comeLeaveCallback) => {
						let updateIndex = -1
//						if(isUpdate) {
							for(let i=0, len=initData.length; i < len; i++) {
									if(initData[i].id === msg.id) {
										
										updateIndex = i
										
									} else {
										// 共享航班的情况
										if(msg.operationDate === initData[i].operationDate && initData[i].repeatCount === msg.repeatCount && msg.aord === initData[i].aord && initData[i].codeShare && initData[i].codeShare.indexOf(msg.flightNo) >= 0) {
											
											if(initData[i].codeShare.indexOf(',') >= 0) {
												
												let codeShare = initData[i].codeShare.split(',')
												let codeIndex = codeShare.indexOf(msg.flightNo)
												
//												console.log(codeIndex, initData[i], codeShare)
												
												if(codeIndex >= 0) {
													codeShare.splice(codeIndex, 1)
												}
												
												initData[i].codeShare = codeShare.join(',')
												
											} else {
												initData[i].codeShare = ''
											}
											
											addCallback && addCallback(initData[i], i)
										}
										
									}
									
							}
						// 找出需要更新的数据
						if(updateIndex >= 0) {
							callback && callback(updateIndex)
						} else {
							// 没有找到对应的数据	更新时，只离或只到状态下
							comeLeaveCallback && comeLeaveCallback()
						}
						
					},
			
			AOrD: (initData, tableData, data, str) => {
					let msg = data.mesg
					// 到港
					if(data.type === 'FLIGHT') {
						msg = this.updateInfo.init(msg, initData)
					}
					if(msg.affiliatedFlight) {	//this.updateInfo.isCodeShare
						// 共享航班
						initData = this.updateInfo.codeShare(initData, msg)
						tableData = this.updateInfo.codeShare(tableData, msg)
						
					} else {
						// 新增 删除 更新
						comeUpdate[data.type][data.flag](msg, initData, tableData, str)
					}
					
			},
			
			/**
			 * 只到
			 */
			A: (initData, tableData, data) => {
				this.updateInfo.isCodeShare = false
				this.updateInfo.AOrD(initData, tableData, data, 'A')
			},
			/**
			 * 只离
			 */
			D: (initData, tableData, data) => {
				this.updateInfo.isCodeShare = false
				this.updateInfo.AOrD(initData, tableData, data, 'D')
			},
			/**
			 * 到离港
			 */
			all: (initData, tableData, data) => {
				
				this.updateInfo.isCodeShare = false
				// 到离港的情况
				let msg = data.mesg
				if(data.type === 'FLIGHT') {
					msg = this.updateInfo.init(msg, initData)
				}
				
				if(msg.affiliatedFlight) {		// 从航班
					
					initData = this.updateInfo.codeShare(initData, msg)
					tableData = this.updateInfo.codeShare(tableData, msg)
					
				} else {
					
					comeUpdate[data.type][data.flag](msg, initData, tableData, 'all')
					
				}
				
			}
		}
		
		
		// 缓冲区
		if(data.mesg != null) {
			// 到港还是离港	清空sta，ata，eta，std，atd，etd
			if(data.type === 'FLIGHT') {
				let dataMesg = data.mesg
				if(dataMesg.aord === 'A') {
					dataMesg.std = ''
					dataMesg.etd = ''
					dataMesg.atd = ''
				} else if(dataMesg.aord === 'D') {
					dataMesg.sta = ''
					dataMesg.eta = ''
					dataMesg.ata = ''
				}
			}

			this.updateMsg.push(deepClone(data))	// 引用关系
		}

		if(this.updateMsg.length > 0) {
			!this.queryLoad && this.splitQuery(initData, tableData, 5000)
		}
		
		
		
		/**
		 * 是否应该更新或添加
		 */
		function isAddOrUpdate (msg, aord) {
			let mutilSearch = {
				flight: (item, filterKey, value) => {
					
					if(value.indexOf('>') >= 0) {
						// 大于
						let str = value.slice(1)
							if(item[filterKey]) {
							
								if(item[filterKey].indexOf(' / ') > 0) {
									// 连班的情况
									
									let arr = item[filterKey].split(' / ')
									return columnSearchMethod.daYun(arr[0], str) || columnSearchMethod.daYun(arr[1], str)
									
								} else {
									return columnSearchMethod.daYun(item[filterKey], str)
								}
								
							}
							
					}
					
					if(value.indexOf('<') >= 0) {
						// 小于
						let str = value.slice(1)
							if(item[filterKey] ) {
							
								if(item[filterKey].indexOf(' / ') > 0) {
									// 连班的情况
									
									let arr = item[filterKey].split(' / ')
									return columnSearchMethod.xiaoYu(arr[0], str) || columnSearchMethod.xiaoYu(arr[1], str)
									
								} else {
									return columnSearchMethod.xiaoYu(item[filterKey], str)
								}
								
							}
					}
					// 3, 5-9, 8-12
					if(value.indexOf(',') >= 0) {
						let flag = false
						let arr = value.split(',')
							if(item[filterKey]) {
								arr.forEach((arrItem) => {
									if(arrItem.indexOf('-') > 0) {
										arrItem = arrItem.trim()	// 去掉前后的空格
										arrItem = arrItem.split('-')
										let start = isNaN(Number(arrItem[0])) ? arrItem[0] : Number(arrItem[0])
										let end = isNaN(Number(arrItem[1])) ? arrItem[1] : Number(arrItem[1])
										if(item[filterKey].indexOf(' / ') > 0) {
											// 连班的情况
											let arr = item[filterKey].split(' / ')
											flag = columnSearchMethod.fun1(arr[0], start, end) || columnSearchMethod.fun1(arr[1], start, end)
	
										} else {
											
											flag = columnSearchMethod.fun1(item[filterKey], start, end)
	
										}
										
									} else{
										if(item[filterKey].indexOf(' / ') > 0) {
											// 连班的情况
											let arr = item[filterKey].split(' / ')
											
											flag = columnSearchMethod.fun2(arr[0], arrItem) || columnSearchMethod.fun2(arr[1], arrItem)
											
										} else {
											
											flag = columnSearchMethod.fun2(item[filterKey], arrItem)
											
										}
									}
									
								})
							}
						
						return flag
						
					} else if(value.indexOf('>') < 0 && value.indexOf('<') < 0) {
						if(value.indexOf('-') >= 0) {
							let valueArr = value.split('-')
							let start = isNaN(Number(valueArr[0])) ? valueArr[0] : Number(valueArr[0])
							let end = isNaN(Number(valueArr[1])) ? valueArr[1] : Number(valueArr[1])
								if(item[filterKey]) {
									if(item[filterKey].indexOf(' / ') > 0) {
										// 连班的情况
										let arr = item[filterKey].split(' / ')
										return columnSearchMethod.daXiaoYu(arr[0], start, end) || columnSearchMethod.daXiaoYu(arr[1], start, end)
										
									} else {
										return columnSearchMethod.daXiaoYu(item[filterKey], start, end)
									}
								}
							
						} else {
							
//							value = isNaN(Number(value)) ? value : Number(value)
//							return item[filterKey] == value
							if(item[filterKey]) {
								if(item[filterKey].indexOf(' / ') > 0) {
									let arr = item[filterKey].split(' / ')
									return arr[0] == value || arr[1] == value || item[filterKey] == value
								} else {
									
									return item[filterKey] == value
									
								}
							}
							
						}
					}
				},
				time: (item, filterKey, value) => {
					if(value.indexOf(',') >= 0) {
						let flag = false
						let str = item[filterKey] ? item[filterKey].slice(-9, -3).split(':').join('') : '--'
						let arr = value.split(',')
							arr.forEach((arrItem) => {
								
								if(arrItem.indexOf('-') > 0) {
									arrItem = arrItem.trim()	// 去掉前后的空格
									arrItem = arrItem.split('-')
									if(arrItem[0].length === 4 && arrItem[1].length === 4 && Number(str) >= Number(arrItem[0]) && Number(str) <= Number(arrItem[1])) {
										flag = true
									}
								} else if(arrItem.length === 4 && Number(str) === Number(arrItem)) {
									flag = true
								}
								
							})
						return flag
						
					} else {
						if(value.indexOf('-') > 0) {

								let str = item[filterKey] ? item[filterKey].slice(-9, -3).split(':').join('') : '--'
								let arr = value.split('-')
								if(arr[0].length === 4 && arr[1].length === 4) {
									if(Number(str) >= Number(arr[0]) && Number(str) <= Number(arr[1])) {
										return true
									}
								}

						} else {
							
								let str = item[filterKey] ? item[filterKey].slice(-9, -3).split(':').join('') : '--'
								if(value.length === 4 && Number(str) === Number(value)) {
									return true
								}
						}
					}
				}
			} 
			
			let {selectedDori} = this.state
			// 到离港		状态		类型		单列搜索
			// this.flightType === 'all' && selectedDori.indexOf(msg.dori) >= 0 || this.flightType !== 'all' && this.flightType === msg.dori	// 类型
			// this.flightStatus === 'all' || this.flightStatus !== 'all' && msg.operationalStatus.indexOf(this.flightStatus) >= 0		// 状态
			let columnSearchValue = this.columnSearchValue
			
			let filterKey = this.confirmFilterKey
			
			let {baseKeyArr, serviceKeyArr} = this.getBaseSerKey()
			let temp = []
			temp = this.getBaseSerTemp(msg, baseKeyArr, serviceKeyArr)
			temp = temp.join(',').toUpperCase() // 转化成大写		// 模糊搜索的字段
			
			let searchValue = this.searchValue ? this.searchValue.toUpperCase() : ''
			
//			console.log(this.flightStatus, columnSearchValue, filterKey, selectedDori.indexOf(msg.dori), msg, this.flightType, msg.operationalStatus.indexOf(this.flightStatus), temp.indexOf(searchValue), searchValue)

			let doriArr = []
			let isLianDori = false
			
			if(msg.dori.indexOf(' / ') >= 0) {
				isLianDori = true
				doriArr = msg.dori.split(' / ')
			}

				// operationalStatus
			console.log(this.comeLeaveStr)
			if((msg.aord === this.comeLeaveStr || this.comeLeaveStr === 'all' || msg.aord === 'A / D') && (this.flightType === 'all' && (isLianDori ? (selectedDori.indexOf(doriArr[0]) >=0 || selectedDori.indexOf(doriArr[1]) >= 0) : selectedDori.indexOf(msg.dori) >= 0) || this.flightType !== 'all' && msg.dori.indexOf(this.flightType) >= 0) && (this.flightStatus === 'all' || this.flightStatus !== 'all' && msg.newStatus.indexOf(this.flightStatus) >= 0) && (!searchValue || temp.indexOf(searchValue) >= 0)) {
				
				// 单列搜索
				if(columnSearchValue) {
					
					columnSearchValue = columnSearchValue.toUpperCase()
					
					if(filterKey === 'flightNo_A') {
						let flightNo = msg['flightNo']
						flightNo = flightNo.toUpperCase()
						// 连班的情况
						if(flightNo.indexOf(' / ') > 0) {
							flightNo = flightNo.split(' / ')[0]
						}
						if(msg.aord.indexOf('A') >= 0 && flightNo.indexOf(columnSearchValue) >= 0) {
							return true
						} else {
							return false
						}
							
					} else if(filterKey === 'flightNo_D') {
						let flightNo = msg['flightNo']
						flightNo = flightNo.toUpperCase()		
						// 连班的情况
						if(flightNo.indexOf(' / ') > 0) {
							flightNo = flightNo.split(' / ')[1]
						}
						if(msg.aord.indexOf('D') >= 0 && flightNo.indexOf(columnSearchValue) >= 0) {
							return true
						} else {
							return false
						}
									
					} else if(filterKey === 'finalParkingbayId' || filterKey === 'carousel' || filterKey === 'gate') {
						//复合查询	机位 登机口 值机柜台 行李转盘 <5 >5 3-5, 5-8, 9 || filterKey === 'checkinRange'
						// 支持复杂查询
						return mutilSearch.flight(msg, filterKey, columnSearchValue)
						
					} else if(filterKey === 'ata' || filterKey === 'atd' || filterKey === 'sta' || filterKey === 'std' || filterKey === 'eta' || filterKey === 'etd' || filterKey === 'estimatedInBlockTime') {
						// 时间 0900-1000
						return mutilSearch.time(msg, filterKey, columnSearchValue)
						
					} else if(filterKey === 'checkinRange') {
						let str = msg[filterKey]
						let checkFlag = false
						if(str) {
							str = str.toUpperCase()
							if(columnSearchValue.indexOf(',') > 0) {
								let searchArr = columnSearchValue.split(',')
								searchArr.forEach(item => {
									if(item) {
										item = item.trim()
										if(str.indexOf(item) >= 0) {
											checkFlag = true
											return
										}
									}
								})
							} else {
								if(str.indexOf(columnSearchValue) >= 0) {
									checkFlag = true
								}
							}
							return checkFlag
						}
					} else if(filterKey === 'flightCourse') {
						if(msg[filterKey] && msg[filterKey].toUpperCase().indexOf(columnSearchValue) >= 0 || msg['destAirportIata'] && msg['destAirportIata'].indexOf(columnSearchValue) >= 0 || msg['originAirportIata'] && msg['originalAirportIata'].indexOf(columnSearchValue) >= 0 || msg['transitIata'] && msg['transitIata'].indexOf(columnSearchValue) >= 0) {
							return true
						}
					} else if(filterKey === 'destAirport' || filterKey === 'originalAirport' || filterKey === 'transit') {
						let itemFlag = this.returnRouteKey(filterKey)
						if(msg[filterKey] && msg[filterKey].toUpperCase().indexOf(columnSearchValue) >= 0 || msg[itemFlag] && msg[itemFlag].toUpperCase().indexOf(columnSearchValue) >= 0) {
							return true
						} 
						
					} else {
							
						if(msg[filterKey] && msg[filterKey].toUpperCase().indexOf(columnSearchValue) >= 0) {
							return true
						} 		
					}

				} else {
					return true
				}
				
				
			} else {
				return false
			}
		}
		
	}
	// 获取更新的数据
	getUpdateData (initData) {
		
		let initTableData = []
		initTableData = this.flightConSort(deepClone(initData))		// IA排序

		return initTableData
	}
	
	/**
	 * 获取航班配置数据
	 */
	getFlightConfig (callback) {
		// 用于获取用户可选及已选航班服务列
		let getServiceCols = (selectedBase, optionalBase, selectedBaseKey) => {
			
				getSearchJson('get', '/API/init/serviceCols', '', (res) => {
					if(res.status === 1000) {
						// 新增一个key值id
						res.data.optional.forEach((item, index) => {
							if(item.showStartEnd == '0') {
								item.columnName = item.detailName + '开始'
							} else if(item.showStartEnd == '1') {
								item.columnName = item.detailName + '结束'
							}
							item.id = item.detailNo + '_' + item.showStartEnd
							
							item.detailNo = item.id
						})
						
						res.data.selected.forEach((item, index) => {
							if(item.showStartEnd == '0') {
								item.columnName = item.detailName + '开始'
							} else if(item.showStartEnd == '1') {
								item.columnName = item.detailName + '结束'
							}
							item.id = item.detailNo + '_' + item.showStartEnd
							
							item.detailNo = item.id
						})
							// 
//						res.data.selected = sortNoSort(res.data.selected)
						// 服务的数据key
						let selectedSerKey = res.data.selected.map(item => item.id)
						// 总的已选的列
						let tempSelected = [...selectedBase, ...res.data.selected]
						// 
						
						// 排序

						tempSelected = sortNoSort(tempSelected)

						this.initSelected = tempSelected
						
						// 已选的列key
						let selectedKey = tempSelected.map(item => item.id)
						
						// 可选的服务列
						let optionalService = res.data.optional.concat(res.data.selected)
						
						// 可选的列（总的）
						let optionalCols = [...optionalBase, ...optionalService]
						// 排序
						optionalCols = sortNoSort(optionalCols)
						
						
						
//						this.setState({
//							optionalServiceCols: res.data.optional.concat(res.data.selected),
//							selectedServiceKey: selected,
//							initSelectedServiceKey: selected
//						})

						// 排好序的Cols
						this.setState({
							// 总的
							optionalCols,	// 可选的列（包括服务列和航班列）
							selectedKey, // 选择的key（包括服务列和航班列）
							initSelectedKey: selectedKey,
							// 服务的
							selectedServiceKey: selectedSerKey,
							initSelectedServiceKey: selectedSerKey,
							// 基础的
							optionalBaseCols: optionalBase,
							selectedBaseKey,
							initSelectedBaseKey: selectedBaseKey
							
						}, () => {
							callback && callback()
						})
						
					}
				})
				
		}
				// 用于获取用户可选及已选航班基础列
		getSearchJson('get', '/API/init/baseCols', '', (res) => {
			
			if(res.status === 1000) {
				res.data.selected = sortNoSort(res.data.selected)
//				this.initSelected = res.data.selected
				let selectedBaseKey = res.data.selected.map(item => item.id)
//				this.setState({
//					optionalBaseCols: res.data.optional.concat(res.data.selected),
//					selectedBaseKey: selectedBase,
//					initSelectedBaseKey: selectedBase
//				})
				let optionalBase = res.data.optional.concat(res.data.selected)
				// 获取服务列
				getServiceCols(res.data.selected, optionalBase, selectedBaseKey)
				
			}
			
		})

		
	}
	/**
	 * 获取到离港类型数据
	 */
	getAordDori (callback, isGetInit) {
		let getInitAord = () => {
			
			// 用于获取用户可选及已选进出港配置
			getSearchJson('get', '/API/init/aord', '', (res) => {
	//			console.log(res.data)
				if(res.status === 1000) {
					let selected = res.data.selected.map(item => aord[item.aord])
					let optional = res.data.optional.concat(res.data.selected).map(item => aord[item.aord])
					if(selected.length === 1) {
						// 初始化进来的时候
						this.setState({
							defaultAordValue: selected[0]
						})
						
						this.comeLeaveStr = reverseAord[selected[0]]
						
					}
					this.setState({
						optionalAord: optional,
						selectedAord: selected,
						initSelectedAord: selected,
						initEnd: true,
						checkAordAll: selected.length === optional.length
					}, () => {
						callback && callback()
						// 更新
						!isGetInit && this.comeLeaveChange(this.comeLeaveStr)
					})
				}
			})
			
		}
		
		// 用于获取用户可选及已选航班类型配置
		getSearchJson('get', '/API/init/dori', '', (res) => {
			if(res.status === 1000) {
//				console.log(res.data)

				let selected = res.data.selected.map(item => dori[item.dori])
				let optional = res.data.optional.concat(res.data.selected).map(item => dori[item.dori])
				
				optional.sort()
				
				if(selected.length === 1) {
					
					this.setState({
						defaultDoriValue: selected[0]
					})
					
					this.flightType = selected[0]
					
				} else {
					
					if(this.flightType != 'all') {
						if(selected.indexOf(this.flightType) < 0) {
							this.flightType = 'all'
							this.setState({
								defaultDoriValue: 'all'
							})
						}
					}
					
				}
				this.setState({
					optionalDori: optional,
					selectedDori: selected,
					initSelectedDori: selected,
					initEnd: true,
					checkDoriAll: selected.length === optional.length
				}, () => {
//					callback && callback()
					// 更新
//					this.typeChange(this.flightType)
					getInitAord()
				})
				
			}
		})
	}
	
	/**
	 * 获取配置数据
	 */
	getConfigData (callback) {
		
		this.isGetConfig = false
				// 请求界面配置数据
		getSearchJson('get', '/API/init', '', (res) => {
//			console.log(res.data)
			if(res.status === 1000) {
				
				let baseCols = res.data.baseCols
				
				let serviceCols = res.data.serviceCols
//				
				this.setState({
					showTheaderArr: baseCols,
					initTheaderArr: baseCols,
					serviceTheaderArr: serviceCols,
					initServiceTheader: serviceCols
				}, () => {
					// 表头的拖动 
					this.dragWidthChange()
					
					this.isGetConfig = true
//					// 当表头全都隐藏
//					this.hideAllHeader()
					
					if(this.sortOrder && this.clickColumnId) {
						
						//如果这个id不在显示的范围内，就取消排序是用默认排序
						let idArr = this.state.showTheaderArr.map(item => item.id)
						
						if(idArr.indexOf(this.clickColumnId) < 0) {
							this.sortOrder = undefined
							this.clickColumnId = undefined
							this.setState({
								sortInfo: {}
							})
							
						}
						
					}
					
					this.setState({
						clickAordSave: true
					})
					callback && callback()
				})
				
				// 数据推送
				if(res.data.queueName && !this.queueName) {
//					hideLoading()
					// 连接队列
					this.connectMq = true
					this.queueName = res.data.queueName
//					this.queueName = 'token_xumlGAyQj0VY2r0HMZ5Qzg==.0007'
				}
			} else {
//				warningMsg('')
				console.log('init 请求失败')
			}
		})
	}
	/**
	 * 状态合并
	 */
	statusMerge (item) {
		// 设置一个新的属性 status newUpdateTime
		// item.operationalStatus = item.operationalStatus ? (item.operationalStatus === '延误' ? (item.processStatus ? `${item.processStatus}|${item.operationalStatus}` : item.operationalStatus) : (item.operationalStatus === '无' ? item.processStatus : item.operationalStatus)) : item.processStatus
		
		if(item.operationalStatus) {
			if(item.operationalStatus.indexOf('延误') >= 0) {
				if(item.processStatus) {
//					item.operationalStatus = item.operationalStatus.indexOf(item.processStatus) >= 0 ? item.operationalStatus : `${item.processStatus}|${item.operationalStatus}`
					item.newStatus = item.operationalStatus.indexOf(item.processStatus) >= 0 ? item.operationalStatus : `${item.processStatus}|${item.operationalStatus}`

					if(item.processUpdateTime && item.operUpdateTime) {
						
						if(splitTime(item.processUpdateTime) >= splitTime(item.operUpdateTime)) {
							
							item.newTime = item.processUpdateTime
							
							item.isProcess = "true"
							
						} else {
							
							item.isProcess = "false"
							
							item.newTime = item.operUpdateTime
							
						}
						
//						item.newTime = splitTime(item.processUpdateTime) > splitTime(item.operUpdateTime) ? item.processUpdateTime : item.operUpdateTime
						
					} else {
						
						if(item.processUpdateTime) {
							item.isProcess = "true"
							item.newTime = item.processUpdateTime
							
						} else {
							
							if(item.operUpdateTime) {
								item.isProcess = "false"
								item.newTime = item.operUpdateTime
								
							} else {
								item.newTime = null
								item.isProcess = "true"
							}
							
						}
					}
				} else {
//					item.operationalStatus = item.operationalStatus
					item.newStatus = item.operationalStatus
					item.newTime = item.operUpdateTime
					item.isProcess = "false"
				}
				
			} else {
				if(item.operationalStatus === '无') {
					if(item.processStatus) {

//						item.operationalStatus = item.processStatus
						item.newStatus = item.processStatus
						item.newTime = item.processUpdateTime
						item.isProcess = "true"
					} else {
//						item.operationalStatus = item.operationalStatus
						item.newStatus = item.operationalStatus
						item.newTime = item.operUpdateTime
						item.isProcess = "true"
					}
				} else {
//					item.operationalStatus = item.operationalStatus
					item.newStatus = item.operationalStatus
					item.newTime = item.operUpdateTime
					item.isProcess = "true"
				}
			}
		} else {

//			item.operationalStatus = item.processStatus
			item.newStatus = item.processStatus
			
			item.newTime = item.processUpdateTime
			
			item.isProcess = "true"
		}
		
		// 添加航线的三字码字段	key值    flightCourseKey
		item.flightCourseKey = item.transitIata ? item.originAirportIata + '-' + item.transitIata + '-' + item.destAirportIata : item.originAirportIata + '-' + item.destAirportIata
		
		return item
	}
	/**
	 * getInitData 获取初始化数据
	 */
	getInitData (callback) {

		if(this.queryLoad) {
			// 正在更新
			clearTimeout(this.queryTime)	// 清除定时器
			this.isClearTime = true
		}
		/**
		 * 获取初始化数据的callback
		 */
		let getInitCallback = (res) => {
			console.log('总的数据: ' + res.data.length)
			if(res.status === 1000) {
				
				if(res.data == null) {
					warningMsg('无数据', 5000)
					hideLoading()
					return
				}
				
				let comeLen = res.data.filter(item => item.aord === 'A').length
				let leaveLen = res.data.filter(item => item.aord === 'D').length
				console.log('到港: ' + comeLen, "离港数据: " + leaveLen)
//				console.log(deepClone(res.data[0]))
				res.data.forEach(item => {
					if(item.aord === 'A') {
						
						if(!this.showComeService) {
							this.showComeService = item.services
						}
						
						item.std = ''
						item.atd = ''
						item.etd = ''
					} else if (item.aord === 'D') {
						
						if(!this.showLeaveService) {
							this.showLeaveService = item.services
						}
						
						item.sta = ''
						item.ata = ''
						item.eta = ''
					}
					item = this.statusMerge(item)
				})

				if(res.data.length > 0) {
					this.isHaveData = 'true'
				} else {
					this.isHaveData = 'false'
				}
				// 合并	连班
//				this.changeTheader(this.comeLeaveStr)
//				
				this.flightUpdate = false
				
				this.setState({
//					initEnd: true,
					clickAordSave: true,
					initData: res.data,
//					tableData: data,
//					initTableData: data,
//					filterTableData: data,
				}, () => {
					
					// 显示航班
					console.log('初始化数据', this.state.initData.length)
					
					this.comeLeaveFilter(this.comeLeaveStr, () => {
						hideLoading()
						!callback && this.connectRabitMq()	///
					})
					callback && callback()
				})
				
				
			}
		}
		
		let randomTime = Math.round(Math.random() * 5)
		
		setTimeout(() => {
			// 请求初始化数据
			getSearchJson('get', '/API/flights', "", (res) => {
	
				getInitCallback(res)

			}, (error) => {
				hideLoading()
				if(error.status === 401) {
					logOut()
				}
			})
			
		}, randomTime)
		
		
	}
	componentWillMount () {
		
		document.title = '航班查询系统'
		
		if(!sessionManage.getItem('token')) {
			errorLogOut()
			return 
		}
		
		if(sessionManage.getItem('userName') === 'sliu') {
			this.setState({
				isLiu: true
			})
		}
		
		getSearchJson('post', '/API/token/heartbeat', '', (res) => {
					if(res.status === 1000) {
						this.setState({
							connectStatus: '正在监控'
						})
					} else {
//						this.setState({
//							connectStatus: '连接中断'
//						})
//						
//						disConnect()
					}
					if(res.data.indexOf('重新获取令牌') >= 0) {
						
						confirmModal(() => {
							appHistory.push({
								pathname: '/'
							})
						}, () => {}, '连接中断, 请退出重新连接')
						
						this.setState({
							connectStatus: '连接中断'
						})
						
						disConnect()
						
					}
		}, (error) => {
			
			if(error.status === 504) {
				
				this.setState({
					connectStatus: '连接中断'
				})
				disConnect()
				
			}
			
		})
		showLoading()
		
		//表头配置数据
		this.getConfigData(() => {
			// 航班配置数据
			// 到离港类型的数据
			this.getAordDori(() => {
				// 请求初始化数据
				this.getInitData()
			}, true)
			
		})
		
		
	}
	
	consleSortKey () {
		let {tableData} = this.state
		tableData.forEach(item => {
			console.log(item.iaKey)
		})		
	}
	/**
	 * 排序规则的切换
	 */
	sortRuleChange (value) {
		
		if(this.queryLoad) {
			// 正在更新
			clearTimeout(this.queryTime)	// 清除定时器
			this.isClearTime = true
		}
		
		// click表头排序key值的id
		this.clickColumnId = undefined
		this.sortOrder = undefined		// 清空列头排序
		
		// 改变this.sortRule
		this.sortRule = value
		
		let {tableData} = this.state
		if(value === 'IA') {
			tableData.sort((a, b) => {
					
				if(a['iaKey'] > b['iaKey']) {
					return 1
				} else if(a['iaKey'] < b['iaKey']) {
					return -1
				} else if(a['iaKey'] === b['iaKey']) {
						return 0
				}
					
			})
				
		} else if(value === 'AOC') {
				
			tableData.sort((a, b) => {
				if(a['num'] > b['num']) {
					return 1
				} else if(a['num'] < b['num']) {
					return -1
				} else if(a['num'] === b['num']) {
					return 0
				}	
			})
			
		}
		
		this.setState({
			// 默认的排序规则
		    defaultSortRule: value,
		    tableData,
		    // 取消排序
			sortInfo: {}
			
		}, () => {
			let {initData, tableData} = this.state
			if(this.isClearTime) {
					// 过滤完数据之后继续更新
				this.splitQuery(initData, tableData, 2000)
				this.isClearTime = false
				
			}
		})

	}
	
	heartWatch () {
		
			heartWatch(() => {
				this.setState({
					connectStatus: '连接中断'
				})
				disConnect()
			}, true)
			
			// 心跳监测
//			let timeId = setInterval(() => {
//				getSearchJson('post', '/API/token/heartbeat', '', (res) => {
//					if(res.data.indexOf('重新获取令牌') >= 0) {
//						clearInterval(timeId)
//						
//						confirmModal(() => {
//							appHistory.push({
//								pathname: '/'
//							})
//						}, () => {}, '连接中断, 请退出重新连接')
//						
//						this.setState({
//							connectStatus: '连接中断'
//						})
//						
//					}
//				})
//			}, heartTime)
			
	}
	/**
	 * 更新滚动的位置
	 * 
	 */
	updateScrollPos (scrollXBar, scrollYBar) {
		let thead = document.querySelector('.table-header table')
		let tableContent = document.querySelector('.table-content table')
						// 更新位置
		let offsetInfo = thead.getBoundingClientRect()
		let theadRight = offsetInfo.right - 15
						
		let theadLeft = thead.offsetLeft
						
		let parentWidth = scrollXBar.parentNode.offsetWidth 
		let tMaxL = offsetInfo.width - parentWidth
		let maxL = scrollXBar.parentNode.offsetWidth - scrollXBar.offsetWidth
						/**
						 * thead靠近边缘的时候
						 */
		if(theadRight < parentWidth) {
							
			let theadL = parentWidth - theadRight + theadLeft
							
			thead.style.left = theadL + 'px'
			tableContent.style.left = theadL + 'px'	
//							
			let scale = Math.abs(theadL / tMaxL)
			scrollXBar.style.left = maxL * scale + 'px'
							
		}
						
		let scrollRight = scrollXBar.getBoundingClientRect().right - 15
		let scrollLeft = scrollXBar.offsetLeft
						/**
						 * 滚动条靠近边缘的时候
						 */
		if(scrollRight > parentWidth) {
			let scrollL = scrollLeft - (scrollRight - parentWidth)
			scrollXBar.style.left = scrollL + 'px'
			let scale = scrollL / maxL
			thead.style.left = -scale * tMaxL + 'px'
			tableContent.style.left = -scale * tMaxL + 'px'	
		}
		
		// 更新纵向滚动条位置
		scrollYBar && this.updateScrollYPos(scrollYBar)
	}
	/**
	 * 更新纵向滚动条的位置(窗口放大或缩小)
	 */
	updateScrollYPos(scrollYBar) {
		let thead = document.querySelector('.table-header table')
		let tableContent = document.querySelector('.table-content table')

	}
	/**
	 * 鼠标右键出现单行高亮
	 */
	showLineHight () {
		// 禁止点击table时(鼠标右键)出现菜单
		document.querySelector('.table-content .ant-table-body tbody').oncontextmenu = (ev) => {
			
			ev.preventDefault()
			
			this.selectLine(ev)
			
			let lineHight = this.refs.lineHight
			let deleteFlightWrap = this.refs.deleteFlightWrap
			if(this.target.className.indexOf('line_hight') >= 0) {
				// 已经高亮的取消高亮
				deleteFlightWrap.style.display = 'block'
				lineHight.innerHTML = '取消高亮'
				
			} else {
				
				lineHight.innerHTML = '单行高亮'
				deleteFlightWrap.style.display = 'block'
				
			}
			
			if(ev.clientY + deleteFlightWrap.offsetHeight > document.documentElement.clientHeight) {
				deleteFlightWrap.style.top = ev.clientY - deleteFlightWrap.offsetHeight - 60 + 'px'
			} else {
				deleteFlightWrap.style.top = ev.clientY - 60 + 'px'
			}
			if(ev.clientX + deleteFlightWrap.offsetWidth > document.documentElement.clientWidth - 84) {
				deleteFlightWrap.style.left = ev.clientX - deleteFlightWrap.offsetWidth + 'px'
			} else {
				deleteFlightWrap.style.left = ev.clientX + 'px'
			}
		}
	}
	/**
	 * showColorModal 颜色示例
	 */
	showColorModal () {
		// 颜色示例	ctrl+H
		document.addEventListener('keydown', (ev) => {
			// event.altKey、event.ctrlKey、event.shiftKey 
			// h
			if(ev.keyCode === 72 && ev.ctrlKey) {
				ev.preventDefault()
				this.setState({
					colorConfigShow: true
				})
				
				if(this.refs && this.refs.deleteFlightWrap) {
					this.refs.deleteFlightWrap.style.display = 'none'
				}
				
			}
			
		})
	}
	
	/**
	 * 窗口变化时，横向和纵向滚动条的位置变化
	 */
	resizeScrollPos () {
		let windowObj = {
			width: window.innerWidth,
			height: window.innerHeight
		}
		// window resize
		windowResize(() => {
			this.scrollChange((tableContent, scrollYBar, scrollXBar, H, L) => {
				
				setTimeout(() => {
					//getComputedStyle	 获取css属性值
					this.updateScrollPos(scrollXBar, scrollYBar)	
				}, 200)
				
			})
			
			let charHeight = windowObj.height - window.innerHeight
			windowObj.height = window.innerHeight
			
			if(charHeight != 0) {
				let tableContent = document.querySelector('.table-content table')
				// 高度改变了
				this.refs.scrollYBar.style.top = 0 
				tableContent.style.top = 0
				
				this.setState({
					start: 0,
					tableHeight: this.refs.tableWrap.offsetHeight - 100,
					tableWidth: this.refs.tableWrap.offsetWidth
				})
				
			} else {
				this.setState({
					tableHeight: this.refs.tableWrap.offsetHeight - 100,
					tableWidth: this.refs.tableWrap.offsetWidth
				})
			}
			
		})
	}
	
	componentDidMount () {
		if(!sessionManage.getItem('token')) {
			errorLogOut()
			return 
		}
		
		this.resizeScrollPos()	// 窗口变化时，横向和纵向滚动条的位置变化
		
		setTimeout(function(){ 

			if(this.refs.tableWrap) {
				this.setState({		
					tableHeight: this.refs.tableWrap.offsetHeight - 100,
					tableWidth: this.refs.tableWrap.offsetWidth
				}) 	
				scroll.init(this.refs.contentWrap, this.refs.scrollYBar, this.refs.scrollXBar, this)
			}
			
        }.bind(this),500)

		scroll.init(this.refs.contentWrap, this.refs.scrollYBar, this.refs.scrollXBar, this)

		this.showLineHight()	// 鼠标右键出现单行高亮
		
		this.showColorModal()	// 颜色示例
		
		// 隐藏单行高亮
		document.addEventListener('click', () => {
			
			if(this.refs && this.refs.deleteFlightWrap) {
				this.refs.deleteFlightWrap.style.display = 'none'
			}
			
		})
		
		// 双击表头
		let thead = document.querySelector('.table-header thead')
		
		if(thead) {
			
			thead.ondblclick = (ev) => {
				this.showColumnSearch(ev)
			}
			
		}

		// 定时删除控制台的输出	5min 清除一次
		setInterval(() => {
			console.clear()
		},5 * 60 * 1000)
		
		this.handleFireFox()	// 处理火狐浏览器宽度过小不出现省略号的问题
		
	}
	
	/*
	 对火狐浏览器单独处理
	 * */
	handleFireFox () {
		// 判断火狐浏览器
		if(window.navigator.userAgent.indexOf("Firefox")>0){  
		    if(!this.isAppendStyle) {
		    	let styleNode = document.createElement('style')
			    this.isAppendStyle = true
			    styleNode.innerHTML = `
			    	.table-content tr td, .table-header tr th{
			    		min-width: 49px;
			    	}
			    	.column_title {
			    		min-width: 33px;
			    	}
			    `
			    document.head.appendChild(styleNode)
		    }
		    
		} 
	}
	
	/***
	 * 删除航班
	 */
	deleteFlight () {
//		flag (string): ARRIVAL//只到,DEPARTURE//只理,ALL//联班 ,
//flightId (string): 航班ID
		// 右键选中的航班
		if(this.target) {
			//
			let classArr = this.target.className
			classArr = classArr.split(' ')
			
			classArr.forEach(item => {
				let reg = /^id/g	// 以id开头
				
				if(reg.test(item)) {
					this.deleteId = item.slice(2)
				}
				
			})
			
			if(this.deleteId) {
				
				if(this.deleteId.indexOf('-') > 0) {
					// 说明是连班
					this.deleteId = this.deleteId.split('-')[0]
					
				}
				
				let {tableData} = this.state
				
				let deleteItem = null
				
				tableData.forEach(item => {
					if(item.id.indexOf(this.deleteId) >= 0) {
						deleteItem = item
						return
					}
				})
				
				if(!deleteItem) {
					return
				}
				// 需要删除的航班
				let {aord, flightNo} = deleteItem
				
				let confirmStr = ''
				let flag = ''
				if(aord === 'A / D') {
					// 连班
					if(flightNo.indexOf(' / ') > 0) {
						flightNo = flightNo.split(' / ')
						confirmStr = `是否删除到港航班: ${flightNo[0]}, 离港航班: ${flightNo[1]}`
					} else {
						// 到离港航班号相同
						confirmStr = `是否删除到港航班: ${flightNo}, 离港航班: ${flightNo}`
					}
					
					flag = 'ALL'
					
				} else {
					let type = aord === 'A' ? '到港' : '离港'
					flag = aord === 'A' ? 'ARRIVAL' : 'DEPARTURE'
					confirmStr = `是否删除${type}航班: ${flightNo}`
				}
				
				// 弹出框发送请求
				this.postDeleteFlight(confirmStr, this.deleteId, flag, flightNo)
			}

		}
	}
	/**
	 * 发送删除航班的请求
	 */
	postDeleteFlight (confirmStr, flightId, flag, comeLeaveFlightNo) {
		let param = {flag, flightId, confirm: false}
		
		let spliceFlight = (data, id) => {
			let spliceIndex = -1
			
			data.forEach((item, index) => {
				if(item.id.indexOf(id) >= 0) {
					spliceIndex = index
					return
				}
			})
			
			if(spliceIndex >= 0) {
				data.splice(spliceIndex, 1)
			}
			return data
		}
		
		this.confirmDeleteFlight({
			confirmStr,
			param,
			spliceFlight, 
			comeLeaveFlightNo
		})
		
	}
	/**
	 * 确定删除航班
	 */
	confirmDeleteFlight ({confirmStr, param, spliceFlight, comeLeaveFlightNo}) {
		let {tableData, initData} = this.state
		confirmModal(() => {
					
					getSearchJson('delete', '/API/flights', param, (res) => {
						if(res.status === 1000) {
							
							if(res.data.joinFlight) {
								// 连班的情况（非合屏状态下）
								let {aord, flightNo} = res.data.joinFlight
								let type = aord === 'A' ? '到港' : '离港'
								let clType = aord === 'A' ? '离港' : '到港'
								param.confirm = true
								this.confirmDeleteFlight({
									confirmStr: `存在${type}航班: ${flightNo}, 是否删除${clType}航班: ${comeLeaveFlightNo}`,
									param,
									spliceFlight
								})

							} else {
								// 删除对应的航班
								tableData = spliceFlight(tableData, param.flightId)
								initData = spliceFlight(initData, param.flightId)
								// 更新长度
								let {comeLength, leaveLength, mergeLength} = this.getFlightLength(tableData)
								this.setState({
									tableData,
									initData,
									comeLength,
									leaveLength,
									mergeLength
								}, () => {
									successMsg('删除成功')
									
									// 更新滚动条的位置
									this.queryUpdateScroll()
									
								})
							}
							
							
						} else {
							
							warningMsg('删除失败')
							
						}
						
					})
					
				}, () => {
					
					
				}, confirmStr)
	}
	
	/**
	 * 拖动宽度的变化
	 */
	dragWidthChange () {
		
		let dragNode = document.querySelectorAll('.drag_flag')
		
		console.log(dragNode.length, 'dragNode....................')
		this.dragTimeArr = this.dragTimeArr || []
		if(!dragNode) {
			
			this.dragTime = setInterval(() => {
				this.dragTimeArr.push(this.dragTime)
				dragNode = document.querySelectorAll('.drag_flag')
				if(dragNode) {
//					clearInterval(this.dragTime)
					this.dragTimeArr.forEach(item => {
						clearInterval(item)
					})
					dragNode = [...dragNode]
					if(dragNode.length > 0) {
						dragNode.forEach(item => {
							// 绑定事件
							dragWidth(item)
						})
					}
				}
			}, 100)
			
		} else {
			
			dragNode = [...dragNode]
			if(dragNode.length > 0) {
				dragNode.forEach(item => {
							// 绑定事件
					dragWidth(item)
				})
			}
			
		}
		
		
		
		/**
		 * returnTh
		 * @param {Object} dragNode
		 */
		let dragTh = null
		
		function returnTh (dragNode) {
			
			if(dragNode.nodeName === 'TH' || dragNode.nodeName === 'TD') {
				dragTh = dragNode
				return
			} else {
				dragNode = dragNode.parentNode
				returnTh(dragNode)
			}
			
		}
		/**
		 * dragWidth 拖拽宽度变化
		 * @param {Object} dragNode
		 */
		let _this = this
		function dragWidth (dragNode) {
			// 鼠标按下
			dragNode.onmousedown = (e) => {
				// 获取th
				returnTh(dragNode)
				// 不存在这个th
				if(!dragTh) {
					return
				}
				
				let initWidth = dragTh.offsetWidth
				let initLeft = dragTh.offsetLeft
				let downX = e.clientX
				
				let thClassName = dragTh.className
				
				if(thClassName && thClassName.indexOf(' ') > 0) {
					let classArr = thClassName.split(' ')
					// 服务的列头
					thClassName = classArr[1] === 'ant-table-column-sort' ? classArr[0] : classArr[1]
					// 点击了排序的表头
				}
					// 需要改变的th，td
				let nChangeNode = document.querySelectorAll('.'+thClassName) 
//				let nChangeNode = document.getElementsByClassName(thClassName)
				nChangeNode = [...nChangeNode]
				// 鼠标滑动
				document.onmousemove = (e) => {
					let moveX = e.clientX
					// 
					let L = moveX - downX + initWidth
						// 改变宽度
					nChangeNode.forEach((item) => {
						item.style.width = L + 'px'
					})
					
					_this.widthChange[thClassName] = L		// 更新这个this.widthChange 对应的值
					
					_this.updateScrollXWidth((scrollXBar) => {
						// 更新滚动条和内容区的位置
						_this.updateScrollPos(scrollXBar)
						
					})
					
				}
				// 鼠标抬起
				document.onmouseup = () => {
					// 保存所有的宽度
					let thNodes = document.querySelectorAll('.table-header th')
					for(let i=0, len=thNodes.length; i<len; i++) {
						
						let thClassName = thNodes[i].className
						if(thClassName && thClassName.indexOf(' ') > 0) {
							// 服务的列头
							thClassName = thClassName.split(' ')[1]
						}
						
						_this.widthChange[thClassName] = thNodes[i].getBoundingClientRect().width
						
					}
					
					console.log(_this.widthChange)
					
					document.onmousemove = null
					document.onmouseup = null
				}
			}
		}
		
		// 移入
		let thNodes = document.querySelectorAll('.table-header th')
		thNodes = [...thNodes]
		
		thNodes.forEach(item => {
			this.showOrHideTip(item)
		})
		
	}
	/**
		 * 显示或隐藏tooltip 
		 * @param {Object} itemNode
		 */
	showOrHideTip (itemNode) {
		let _this = this
			// 移入
			itemNode.onmousemove = function (e) {
				let titleNode = itemNode.querySelector('.column_title')
				
				if(!titleNode) {
					return
				}
				// 是否存在省略号
				if(isEllipsis(titleNode))
				{
					// 获取位置信息
					let offsetInfo = titleNode.getBoundingClientRect()
					let title = titleNode.innerHTML
					// 生成tooltip
					_this.createTooltip(true, title, offsetInfo.left, offsetInfo.top)
					
				} else {
					_this.createTooltip(false)
					
				}
				
			}
			// 移出
			itemNode.onmouseleave = function (e) {
				_this.createTooltip(false)
			}
			
	}
		
	/**
	 * 自定义tooltip
	 */
	createTooltip (isCreate, result, left, top) {
		let str = isCreate ? `<div id="antTip" class="ant-tooltip  ant-tooltip-placement-topLeft" style="word-wrap: break-word; left: ${left}px; top: ${top-40}px;">
			<div class="ant-tooltip-content">
			<div class="ant-tooltip-arrow"></div>
			<div class="ant-tooltip-inner">${result}</div>
			</div>
		</div>` : `<div class="ant-tooltip  ant-tooltip-placement-topLeft ant-tooltip-hidden" style="word-wrap: break-word;">
			<div class="ant-tooltip-content">
			<div class="ant-tooltip-arrow"></div>
			<div class="ant-tooltip-inner"></div>
			</div>
		</div>`
		
		document.getElementById('tooltip').innerHTML = str
		// 如果存在换行的情况
		let antTip = document.getElementById('antTip')
		if(antTip) {
			antTip.style.top = top - antTip.offsetHeight + 'px'
		}
		
	}
	
	// 这个还是需要加上
	
//	shouldComponentUpdate (nextProps = {}, nextState = {}) {
//		return true
//	  	const thisProps = this.props || {}, thisState = this.state || {};
//	
//	  	if (Object.keys(thisProps).length !== Object.keys(nextProps).length ||
//	      	Object.keys(thisState).length !== Object.keys(nextState).length) {
//	    	return true;
//	  	}
//	
//	  	for (const key in nextProps) {
////	    	if (!is(thisProps[key], nextProps[key])) {
////	      		return true;
////	    	}
//	  	}
//	
//	  	for (const key in nextState) {
//	  		if(typeof(thisState[key]) === 'object') {
//	  			
//	  			if(JSON.stringify(thisState[key]) !== JSON.stringify(nextState[key])) {
//	  				return true
//	  			}
//	
//	    	} else if (thisState[key] !== nextState[key]) {
//
//	      		return true;
//	    	}
//	  	}
//	  	return false;
//	}
	
	componentDidUpdate () {

		this.updateTdWidth()
		
		//this.refs.lineHight.style.display = 'none'
		
		// 保存界面配置之后，更新滚动条
		if(this.isSaveConfig) {
			let tableHeader = document.querySelectorAll('.table-header table')[0]
			tableHeader.style.left = 0
			document.querySelectorAll('.table-content table')[0].style.left = 0
			this.refs.scrollXBar.style.left = 0
			this.isSaveConfig = false
			
//			this.refs.lineHight.style.display = 'none'
		}
		
		if(this.state.initEnd) {
			// 显示无数据时的提示
			let tablePlaceholder = document.querySelector('.table-content .ant-table-placeholder')

			if(tablePlaceholder) {
				tablePlaceholder.style.width = document.documentElement.clientWidth + 'px'
			}
			
			// 滚动条切换
			if(!this.flightUpdate) {

				this.scrollChange()
				this.refs.scrollYBar.style.top = 0	
				
				this.setState({
					start: 0,
					initEnd: false,
				})
				
			} else {
				
				let {tableData} = this.state
			
				if(tableData.length * 41 < this.refs.contentWrap.offsetHeight - 40) {
					this.refs.scrollYBar.parentNode.style.display = 'none'
				} else {
					this.refs.scrollYBar.parentNode.style.display = 'block'
					this.refs.scrollYBar.style.height = (this.refs.scrollYBar.parentNode.offsetHeight - 41)*(this.refs.scrollYBar.parentNode.offsetHeight) / (this.state.tableData.length * 41 ) + 'px'
				}
				this.setState({
					initEnd: false
				})
			}
		}
		
		
		
//		if(this.state.clickAordSave && this.isHaveData === 'true') {
//			
//			// 重新检索
////			this.comeLeaveFilter(this.comeLeaveStr)
//			
//			this.setState({
//				clickAordSave: false
//			})
//			
//		}
		
		//console.log(this.connectMq && this.isGetInit && (this.isHaveData === 'true' && (this.state.tableData.length > 0 && document.getElementsByClassName('table-content')[0].offsetHeight > 42 || this.state.tableData.length === 0) || (this.isHaveData === 'false')))
		
		// 连接rabitMq 	 && this.isGetInit
//		if(this.connectMq && this.isGetInit && (this.isHaveData === 'true' && (this.state.tableData.length > 0 && document.getElementsByClassName('table-content')[0].offsetHeight > 40 || this.state.tableData.length === 0) || (this.isHaveData === 'false'))) {
////		hideLoading()
////		this.connectRabitMq()
//			this.connectMq = false
//			this.isGetInit = false
//		}
		
		
	}
	/**
	 * 连接rabitMq
	 */
	connectRabitMq () {
		// 重新获取初始化数据
		let getInitCmd = () => {
			
			let randomTime = Math.round(Math.random() * 120)	// 0-120s

			setTimeout(() => {
				if(this.queryLoad) {
					clearTimeout(this.queryTime)
					this.isClearTime = true
				}
				showLoading()
				this.getInitData(() => {
					
					hideLoading()
					let {initData, tableData} = this.state
					if(this.isClearTime) {
												// 过滤完数据之后继续更新
						this.splitQuery(initData, tableData, 5000)
						this.isClearTime = false
					}						
				})
			}, randomTime * 1000)
			
		}
		/// 日终时弹出退出登录对话框
		let showOutModal = () => {

			modalInfo('消息提示', '前一天航班已经结束运营并归档，新的一天即将开始，请退出重新获取航班数据', '确定', () => {
				this.confirmLogout.call(this, true)
			})
									
			// 停止心跳
			clearInterval(heartWatch.timeId)
									
			disConnect()
									
			this.setState({
				connectStatus: '连接中断'
			})
			
		}
		let errorCount = 0
		let rabitMqConnect = () => {
			wsConnect(this.queueName, (data) => {
							if(data.indexOf('{') === 0) {
								data = JSON.parse(data)
								this.flightDataUpdate(data)
							} else {
								data = data.trim()
								if(data === reGetInitData) {
//									this.flightUpdate = true
//									successMsg('运营结束')
//									showLoading('正在归档...')
//									// 重新获取初始化数据
//									this.getInitData(() => {
//										hideLoading()
//										successMsg('航班已归档')
//									})
									showOutModal()
									
								} else if(data === resetInit) {		// 字典变更
//									this.flightUpdate = true

									getInitCmd()
									
									
								} else if (data === refreshData) {		//reload
									getInitCmd()
								}
							}
//						
					}, () => {
						if(!this.isLogOut) {
									console.log('websocket连接中断')
									logOut('连接中断, 请退出重新连接')
	
									this.setState({
										connectStatus: '连接中断'
									})
									disConnect()
								}
//						errorCount++
//							if(errorCount === reConnectMQCount) {
//				                	// 尝试10次重连
//				               if(!this.isLogOut) {
//									console.log('websocket连接中断')
//									logOut('连接中断, 请退出重新连接')
//	
//									this.setState({
//										connectStatus: '连接中断'
//									})
//									disConnect()
//								}
//				            } else {
//				               rabitMqConnect()	// 重连
//				            }
					})
		}
		
		setTimeout(() => {
					
			// 连接rabbitMq
			rabitMqConnect()
			
			// 心跳监测
			this.heartWatch()
			
		}, 1000)
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
		// 显示的菜单
		const menuConfig = sessionManage.getItem('admin') === 'true' ? [
					  <MenuItem key='1'>
			            <a onClick={this.uiConfig.bind(this)}>界面配置</a>
			          </MenuItem>,
			          <MenuItem key='2'>
			            <a onClick={this.exportData.bind(this)}>导出数据</a>
			          </MenuItem>,
			          <MenuItem key='3'>
			          	<a href="#usermanage" target='_blank'>后台管理</a>
			          </MenuItem>] : [
			          	<MenuItem key='1'>
			            <a onClick={this.uiConfig.bind(this)}>界面配置</a>
			          </MenuItem>,
			          <MenuItem key='2'>
			            <a onClick={this.exportData.bind(this)}>导出数据</a>
			          </MenuItem>,
			          ]
		
		// 删除航班和单行高亮
		const deleteFlight = sessionManage.getItem('admin') === 'true' ? [
			<div key='1' onClick={this.lineHightClick.bind(this)} ref='lineHight' style={{padding: '4px 15px'}}>单行高亮</div>,
			<div key='2' ref='deleteFlight' onClick={this.deleteFlight.bind(this)} style={{padding: '4px 15px', borderTop: '1px solid #999'}}>删除航班</div>
		] : [
			<div key='1' onClick={this.lineHightClick.bind(this)} ref='lineHight' style={{padding: '8px 15px'}}>单行高亮</div>
		]
			          
		const { searchValue, columnSearchValue, columnSearchTitle, start, showLen, tableData} = this.state;
   		const suffix = searchValue ? <Icon type="close-circle" style={{cursor: 'pointer'}} onClick={this.emptySearch.bind(this)} /> : null;
   		const columnSuffix = columnSearchValue ? <Icon type="close-circle" style={{cursor: 'pointer'}} onClick={this.emptyColumnSearch.bind(this)} /> : null;
   		
   		const endShow = tableData.length > showLen ? start + showLen : tableData.length
		return (
			<div className='content_wrap' id='tableContent'>
				<div className="ant-modal-content" ref='columnSearch'  style={{display: "none", position: 'absolute', left: '0', top: '0', zIndex: '1000', width: '220px'}}>
					<button aria-label="Close" className="ant-modal-close" onClick={() => {this.refs.columnSearch.style.display = 'none'; this.setState({columnSearchValue: ''})}} ><span className="ant-modal-close-x"></span></button>
					<div className="ant-modal-header"><div className="ant-modal-title" id="rcDialogTitle0">{columnSearchTitle}</div></div>
					<div className="ant-modal-body">
						<div style={{marginBottom: '15px', wordWrap: 'break-word'}}>已选条件:{ (this.state.prevColumnTitle)}<span style={{marginLeft: '10px'}}>{this.state.prevColumnValue}</span></div>
						<Input style={{width: '100%'}} onPressEnter={this.confirmColumnSearch.bind(this)} suffix={columnSuffix} placeholder="按列搜索" onChange={this.onChangeColSearch.bind(this)} value={this.state.columnSearchValue} ref={node => this.columnSearchInput = node}/>
					</div>
					<div className="ant-modal-footer" style={{textAlign: 'center'}}><button type="button" className="cancel_btn ant-btn ant-btn-lg" onClick={() => {this.refs.columnSearch.style.display = 'none'; this.setState({columnSearchValue: ''})}}><span>取消</span></button><button type="button" className="confirm_btn ant-btn ant-btn-primary ant-btn-lg" onClick={this.confirmColumnSearch.bind(this)}><span>确定</span></button></div>
				</div>
				<div className='nav_list'>
					<div className='header_logo'>
						<img src={smallLogo} className='header_img'/>
						<span className='header_title'>航班查询系统</span>
					</div>
					<Menu mode="horizontal">
			          {menuConfig}
	        		</Menu>
	        		<div className='user_info'>
	        			<Dropdown overlay={menu} trigger={['click']}>
						    <a href="#" style={{ textDecoration: "none", color: '#fff'}}  ><Icon type="user" style={{ fontSize: "15px"}} /> {this.state.userName} </a>
						</Dropdown>
	        		</div>
					<UpdateForm loginThis={this} />
				</div>
				
				{/*查询的表格数据*/}
				<div className='info_wrap'>
					<div className='table_wrap' ref='tableWrap'>
						{/*查询页面的搜索条件*/}
						<div className='search_header'>
							<Select value={this.state.defaultAordValue} style={{width: '100px', marginRight: '20px'}} onChange={this.comeLeaveChange.bind(this)}>
								<Option value='all'>到/离港</Option>
								<Option value='A'>到港</Option>
								<Option value='D'>离港</Option>
							</Select>
							<Select value={this.state.defaultSortRule} style={{width: '100px', marginRight: '20px'}}  onChange={this.sortRuleChange.bind(this)}>
								<Option value='IA'>地服排序</Option>
								<Option value='AOC'>AOC排序</Option>
							</Select>
							<Select value={this.state.defaultDoriValue} style={{width: '100px', marginRight: '20px'}} onChange={this.typeChange.bind(this)}>
								{/*<Option value='disabled' disabled>-类型-</Option>*/}
								{(this.state.initSelectedDori.length > 1 || this.state.initSelectedDori.length === 0) && (<Option key='all' value='all'>全部类型</Option>)}
								{this.state.initSelectedDori.length > 0 && this.state.initSelectedDori.map((item, index) => {
									return (<Option key={index} value={item}>{item}</Option>)
								})}
							</Select>
							<Select value={this.flightStatus} style={{width: '100px', marginRight: '20px'}} onChange={this.flightStatusChange.bind(this)}>
								{/*<Option value='disabled' disabled>-航班状态-</Option>*/}
								<Option value='all'>全部状态</Option>
								<Option value='无'>无</Option>
								<Option value='前起'>前起</Option>
								<Option value='到达'>到达</Option>
								<Option value='值机开始'>值机开始</Option>
								<Option value='值机截止'>值机截止</Option>
								<Option value='过站登机'>过站登机</Option>
								<Option value='本站登机'>本站登机 </Option>
								<Option value='催促登机'>催促登机 </Option>
								<Option value='登机结束'>登机结束 </Option>
								<Option value='起飞'>起飞 </Option>
								<Option value='延误'>延误 </Option>
								<Option value='取消'>取消 </Option>
								<Option value='返航'>返航 </Option>
								<Option value='滑回'>滑回 </Option>
								<Option value='改降'>改降 </Option>

							</Select>

							<Input style={{marginRight: '20px', width: '200px', display: 'inline-block'}} onPressEnter={this.confirmSearch.bind(this)} addonAfter={<Icon type="search" style={{cursor: 'pointer'}} onClick={this.confirmSearch.bind(this)} />} suffix={suffix} placeholder="模糊搜索" onChange={this.onChangeSearch.bind(this)} value={searchValue} ref={node => this.searchInput = node} />
							<Button type='primary' className='confirm_btn' onClick={this.resetSearch.bind(this)}>重置</Button>
							<Button type='primary' className='confirm_btn' style={{display: this.state.isLiu ? 'inline-block' : 'none'}} onClick={this.consleSortKey.bind(this)}>排序的key值</Button>
						</div>
						<div onDragStart={() => {return false}} style={{height: this.state.tableHeight + 'px', overflow: "hidden"}} ref='contentWrap' className='content_wrap'>
							<Table className='table-header' bordered dataSource={[]} columns={getKey(this.state.showTheaderArr, this.state.serviceTheaderArr, this.state.start, this.state.sortInfo)} onChange={this.tableChange.bind(this)}  pagination={false} rowKey={(record, index) => {return index}}>
					    	</Table>
							<Table id='table' className='table-content' ref='table' rowClassName={this.rowClassName.bind(this)} onRowDoubleClick={this.rowDoubleClick.bind(this)} onRowClick={this.rowClick.bind(this)} onChange={this.tableChange.bind(this)}  dataSource={this.state.tableData.slice(start, endShow)} columns={getKey(this.state.showTheaderArr, this.state.serviceTheaderArr, this.state.start, this.state.sortInfo)} pagination={false} rowKey={(record, index) => {return index}}>
					    	</Table>
					    	{/*自定义滚动条*/}
					    	<div className='scroll_y'>
					    		<div className='scroll_y_bar' ref='scrollYBar'>
					    		</div>
					    	</div>
					    	<div className='scroll_x'>
					    		<div className='scroll_x_bar' ref='scrollXBar'>
					    		</div>
					    	</div>
						</div>
							
					    <div className='search_footer'>
					    	<div>
					    		<span style={{color: 'red'}}>{this.state.connectStatus}</span>
					    		<span style={{margin: '0 20px'}}>到港: {this.state.comeLength}</span>
					    		<span style={{marginRight: '20px'}}>离港: {this.state.leaveLength}</span>
					    		<span>连班: {this.state.mergeLength}</span>
					    	</div>
					    	<div style={{position: 'absolute', right: 0, top: 0}}>颜色配置: Ctrl+H </div>
					    </div>
					    <Modal className='config_modal' visible={this.state.configModalShow} width='900px' title='界面配置' footer={[

				            <Button className='cancel_btn' key="back" onClick={this.cancelConfig.bind(this)}>取消</Button>,
				            <Button className='confirm_btn' key="submit" type="primary" onClick={this.saveConfig.bind(this)}>
				              	确认
				            </Button>
				            
				          ]} onCancel={this.cancelConfig.bind(this)}>
							<Tabs className='config_tabs' type="card" onChange={this.tabActive.bind(this)}>
							    <TabPane tab="航班列调整" key="1" style={{textAlign: 'center'}}>
							    	<Transfer className='flight_transfer'
								        dataSource={this.state.optionalCols}
								        showSearch
								        listStyle={{
								          width: 250,
								          height: 400,
								          textAlign: 'left'
								        }}
								        operations={['右移', '左移']}
								        titles={['隐藏的航班列', '显示的航班列']}
								        searchPlaceholder='搜索'
								        notFoundContent='无数据'
								        targetKeys={this.state.selectedKey}
								        onChange={this.handleCols.bind(this, true)}
								        
								        render={item => {
								        	let value = item.columnName
								        	let label = (
								        		<span id={'id'+item.id} >{item.columnName}</span>
								        	)
								        	return {
								        		value,
								        		label
								        	}
								        }}
								        
								        rowKey={record => {
								        	return record.id
								        }}
								        onSelectChange={this.selectedColsChange.bind(this, true)}
								        lazy={false}
								     />
								     <div className ='up_down_move'>
								     	<Button type='primary' onClick={this.upMove.bind(this, true)} disabled={this.state.upDownDisabled}>上移</Button>
										<br></br>
								     	<Button type='primary' onClick={this.downMove.bind(this, true)} disabled={this.state.upDownDisabled}>下移</Button>
								     </div>
							    </TabPane>
							    {/*<TabPane tab="服务列调整" key="2" style={{textAlign: 'center'}}>
							    	<Transfer  className='service_transfer'
								        dataSource={this.state.optionalServiceCols}
								        showSearch
								        listStyle={{
								          width: 250,
								          height: 400,
								          textAlign: 'left'
								          
								        }}
								        operations={['右移', '左移']}
								        titles={['隐藏的服务列', '显示的服务列']}
								        searchPlaceholder='搜索'
								        notFoundContent='无数据'
								        targetKeys={this.state.selectedServiceKey}
								        onChange={this.handleCols.bind(this, false)}
								        render={item => {
								        	if(item.showStartEnd == '0') {
								        		return item.detailName + '开始'
								        	} else if(item.showStartEnd == '1') {
								        		return item.detailName + '结束'
								        	}
								        }}
								        rowKey={record => record.detailNo}
								        onSelectChange={this.selectedColsChange.bind(this, false)}
								        lazy={false}
								     />
								     <div className ='up_down_move'>
								     	<Button type='primary' onClick={this.upMove.bind(this, false)} disabled={this.state.upDownDisabled}>上移</Button>
										<br></br>
								     	<Button type='primary' onClick={this.downMove.bind(this, false)} disabled={this.state.upDownDisabled}>下移</Button>
								     </div>
							    </TabPane>*/}
							    <TabPane tab="到/离、类型调整" key="3">
							    	<div className='flight_type_config'>
							    		<div className='clearfix' style={{padding: '20px 0'}} >
								    		<div style={{float: 'left', width: '20%', textAlign: 'center'}}>
								    			到/离:
								    		</div>
								    		<div style={{float: 'left'}} className='come_leave_config'>
									    		<Checkbox
										            indeterminate={this.state.aordIndeterminate}
										            onChange={this.checkedAll.bind(this, true)}
										            checked={this.state.checkAordAll}
										          >
										            全选
										        </Checkbox>

									   			<CheckboxGroup options={this.state.optionalAord} value={this.state.selectedAord} onChange={this.aordChange.bind(this)} />
								    		</div>
								    	</div>
								    	<div className='clearfix' style={{padding: '20px 0'}}>
								    		<div style={{float: 'left', width: '20%', textAlign: 'center'}}>
								    			类型:
								    		</div>
								    		<div style={{float: 'left'}} className='type_config'>
								    			<Checkbox
										            indeterminate={this.state.doriIndeterminate}
										            onChange={this.checkedAll.bind(this, false)}
										            checked={this.state.checkDoriAll}
										          >
										            	全选
										        </Checkbox>

									   			<CheckboxGroup options={this.state.optionalDori} value={this.state.selectedDori} onChange={this.doriChange.bind(this)} />
								    		</div>
								    	</div>
							    	</div>
							    </TabPane>
							</Tabs>
						</Modal>
						{/*颜色示例*/}
						<Modal className='color_modal' visible={this.state.colorConfigShow} title='颜色示例' width='300px' footer={null} onCancel={() => {this.setState({colorConfigShow: false})}}>
							<ul className='color_wrap'>
								<li style={{background: '#FFFFFF'}}>正常颜色</li>
								<li style={{background: '#B8CF01'}}>选中颜色</li>
								<li style={{background: '#FFFF01'}}>高亮颜色</li>
								<li style={{background: '#E2EEB6'}}>登机结束</li>
								<li style={{background: '#D6E2FA'}}>过站登机 本站登机 催促登机</li>
								<li style={{background: '#CFF2E7'}}>前场起飞颜色</li>
								<li style={{background: '#FAD9EA'}}>延误备降颜色</li>
								<li style={{background: '#FFEAB8'}}>到港颜色</li>
								<li style={{background: '#9FA09F'}}>离港颜色</li>
								<li style={{background: '#C8C8C8'}}>取消颜色</li>

							</ul>
						</Modal>
						{/*单行高亮*/}
						{/*删除航班*/}
						<div ref='deleteFlightWrap' style={{display: 'none', position: 'absolute', border: '1px solid #999', background: '#fff', cursor: 'pointer', whiteSpace: 'nowrap', zIndex: '100'}}>
							{deleteFlight}
						</div>
						{/*<div onClick={this.lineHightClick.bind(this)} style={{display: 'none', position: 'absolute', border: '1px solid #999', background: '#fff', padding: '8px 15px', cursor: 'pointer', whiteSpace: 'nowrap', zIndex: '100'}} ref='lineHight'>单行高亮</div>*/}
						{/*令牌失效的弹框*/}
						{/*<Modal visible={this.state.tokenInvalid} title='提示信息' footer={
							[
				            <Button key="submit" type="primary" onClick={this.confirmTokenInvalid.bind(this)}>
				              	确定
				            </Button>,
				            <Button key="back" onClick={() => {this.setState({tokenInvalid: false})}}>取消</Button>
				          ]
						} onCancel={() => {this.setState({tokenInvalid: false})}}>
							令牌过期,请重新登录获取令牌
						</Modal>*/}
					</div>
				</div>
			</div>
			
			
		)
	}

}
/**
 * 
 * @param {Object} el
 * @param {Object} bar
 * @param {Object} instance
 */
function mouseMethod (el, bar, instance) {

		// chrome
		let isDown = true, isUp = true
		let tbody = document.querySelector('.table-content table')
		let dis = 0
		let mouseWheel = (ev) => {
					// 单行高亮隐藏
			if(instance.refs && instance.refs.deleteFlightWrap) {
				instance.refs.deleteFlightWrap.style.display = 'none'
			}
//			console.log('mouse wheel')
			let {start, tableData, showLen} = instance.state
			let length = tableData.length
			if(length * 41 < instance.refs.contentWrap.offsetHeight - 41) {
				return
			}
			bar.maxT = bar.parentNode.offsetHeight - bar.offsetHeight
			bar.tMaxT = tbody.offsetHeight - bar.parentNode.offsetHeight + 14
			// wheelDelta
			ev.delta = (ev.wheelDelta) ? ev.wheelDelta : -ev.detail;
			if(length <= showLen) {
				if (ev.delta < 0) {
					dis = dis + 41
					if(dis >= bar.tMaxT) {
						dis = bar.tMaxT
					}
					
				} else {
					dis = dis - 41
					
					if(dis <= 0) {
						dis = 0
					}
					
				}
				tbody.style.top = -dis + 'px'
				bar.style.top = (dis / bar.tMaxT) *bar.maxT + 'px'
				
			} else {
				if(ev.delta > 0) {
					// 下滑
					start = start - 2
					if(start <= 0) {
						start = 0
						isDown = false
						bar.style.top = 0
						tbody.style.top = 0
						instance.setState({
							start
						})
						return
					}			
			} else {
					// 上滑			
					start = start + 2
						if(start >= length - showLen) {
							start = length - showLen
							isUp = false
							tbody.style.top = -bar.tMaxT + 'px'
							bar.style.top = bar.maxT + 'px'
							instance.setState({
								start
							})
							return
						}
	
				}
				let scale = start / (length - showLen)
				tbody.style.top = -scale * bar.tMaxT + 'px'
				bar.style.top = scale * bar.maxT + 'px'
				instance.setState({
					start
				})
			}
		}
		el.addEventListener('mousewheel', mouseWheel)
		el.addEventListener('DOMMouseScroll', mouseWheel, false)

}

let scroll = {
	init (el, Ybar, Xbar, instanceThis) {
		this.mouse(el, Ybar, instanceThis)
		this.scrollY(Ybar, instanceThis)
		this.scrollX(Xbar, instanceThis)
		
	},
	// 鼠标滚轮事件
	mouse (el, Ybar, instanceThis) {
		
		mouseMethod(el, Ybar, instanceThis)
	},
	// scrollY 事件
	scrollY (bar, instance) {
		let timeout = null			
		let tbody = document.querySelector('.table-content table')		
		
		bar.onmousedown = (ev) => {
			
					// 单行高亮隐藏
			if(instance.refs && instance.refs.deleteFlightWrap) {
				instance.refs.deleteFlightWrap.style.display = 'none'
			}
			
			ev.preventDefault()
			bar.downY = ev.clientY
			bar.initY = bar.offsetTop
			bar.maxT = bar.parentNode.offsetHeight - bar.offsetHeight
			bar.tMaxT = tbody.offsetHeight - bar.parentNode.offsetHeight + 14
			
			document.onmousemove = (ev) => {
				// onmousemove         实时获取start, tableData.length	避免造成数据更新时出现空白的可能
				let {start, tableData, showLen} = instance.state 
				let length = tableData.length
				let charLen = length - showLen
				///
				bar.moveY = ev.clientY
				let T = bar.initY + bar.moveY - bar.downY
				if(T <= 0) {
					T = 0
				} else if(T >= bar.maxT) {
					
					T = bar.maxT
				}
				
				bar.style.top = T + 'px'
				let scale = T / bar.maxT
				
				tbody.style.top = -scale * bar.tMaxT + 'px'
				if(charLen < 0) {
					return
				}
				
				clearTimeout(timeout)
	            timeout = setTimeout(() => {
	        
	                if (scale === 0) {
	                    start = 0
	                    instance.setState({
		                    start
		               	})
	                    return
	                } else if (scale === 1) {
	                    start = charLen
	                    instance.setState({
		                    start
		                })
	                    return
	                }
							
	                start = ((scale * charLen) < 0 ? 0 : (scale * charLen)) | 0
	
	                instance.setState({
	                    start
	                })
	                        
	            }, 0)
			}
			document.onmouseup = () => {
				document.onmousemove = null
				document.onmouseup = null
			}
		}
		
	},
	// scrollX 事件
	scrollX (bar, instance) {

		let table = document.querySelectorAll('.table_wrap table')
		bar.onmousedown = (ev) => {
			
					// 单行高亮隐藏
			if(instance.refs && instance.refs.deleteFlightWrap) {
				instance.refs.deleteFlightWrap.style.display = 'none'
			}
			
			let maxL = bar.parentNode.offsetWidth - bar.offsetWidth
			let tMaxL = table[0].offsetWidth - table[0].parentNode.offsetWidth + 14
			ev.preventDefault()
			bar.downX = ev.clientX
			bar.initX = bar.offsetLeft
			document.onmousemove = (ev) => {
				ev.preventDefault()
				bar.moveX = ev.clientX
				let L = bar.initX + bar.moveX - bar.downX
				
				if(L < 0) {
					L = 0
				} else if(L > bar.parentNode.offsetWidth - bar.offsetWidth) {
					L = bar.parentNode.offsetWidth - bar.offsetWidth	
				}
				
				bar.style.left = L + 'px'
				let scale = L / maxL
				table[0].style.left = -tMaxL * scale + 'px'
				table[1].style.left = -tMaxL * scale + 'px'
				
				window.scrollRight = window.getComputedStyle(bar, null).right
				
			}
			document.onmouseup = () => {
				document.onmousemove = null
				document.onmouseup = null
			}
		}
	}
}

/**
 * 格式化日期
 * @param {Object} data
 */
function formatDate (data) {
	
	let opDate = data ? data.slice(11, 16).split(':').join('') : '--'
	return (
			<span className='column_title'>{opDate}</span>
	)
}

/**参数说明：

 * 根据长度截取先使用字符串，超长部分追加…

 * str 对象字符串

 * len 目标字节长度

 * 返回值： 处理结果字符串

 */

function cutString(str, len) {

    //length属性读出来的汉字长度为1

    if(str.length*2 <= len) {

        return str;

    }
    var strlen = 0;
    var s = "";
    for(var i = 0;i < str.length; i++) {
        s = s + str.charAt(i);
        if (str.charCodeAt(i) > 128) {
            strlen = strlen + 2;
            if(strlen >= len){
                return s.substring(0,s.length-1) + "...";
            }
        } else {
            strlen = strlen + 1;
            if(strlen >= len){
                return s.substring(0,s.length-2) + "...";
            }
        }
    }
    return s;
}

/**
 * 
 * @param {Object} param len
 */
function returnResult (param, len) {
	if(param) {
		let str = param
		let s = cutString(str, len)
		if(s.indexOf('...') >= 0) {
			return (
				<Tooltip placement="topLeft" title={str} overlayStyle={{wordWrap : 'break-word'}}>
					<span>{s}</span>
				</Tooltip>
			)
		} else {
			return (<span>{s}</span>)
		}
			
	} else {
		return (<span>--</span>)
	}
}

/**
 * 判断是否存在省略号
 * @param {Object} dom
 */
function isEllipsis(dom) {
	var flag;
	var offsetWidth = dom.offsetWidth;  
	var txtWidth = getStrWidth(dom.innerText)
	flag = txtWidth > offsetWidth; 
    return flag;  
}

/**
 * 获取字体具体的宽度(使用canvas)
 * @param {*} str 
 */
function getStrWidth(str)
	{
		var c=document.createElement("canvas"); 
//		console.log(window.getComputedStyle(document.querySelector('.ant-table-content'))["font-family"])
		document.body.appendChild(c)
		
		var ctx=c.getContext("2d");
		ctx.font="bold 16px 黑体"; 
		var txt=str;
		
		ctx.fillText("width:" + ctx.measureText(txt).width,10,50);
		ctx.fillText(txt,10,100);
		
		let txtWidth = ctx.measureText(txt).width
		document.body.removeChild(c)
		return txtWidth;
	}

// 表头字段和key值对应
let returnValueObj = (sortInfo) => {
	return {
	"b2e7076659b443f4a45be54f15299de6": {
		id: 'b2e7076659b443f4a45be54f15299de6',
		title: '月-日',
		dataIndex: 'operationDate',
		key: 'operationDate',
		className: 'operationDate',
		render: (text, record, index) => {
//			let opDate = record.operationDate ? record.operationDate.slice(5, 10) : ''
			let opDate = record.operationDate
			if(opDate) {
				let result = ''
				if(opDate.indexOf(' / ') >= 0) {
					let opArr = opDate.split(' / ')
					result = opArr[0].slice(5, 10) + ' / ' + opArr[1].slice(5, 10)
					
				} else {

					result = opDate.slice(5, 10)
					
				}
				return (
						<span className='column_title'>{result}</span>
					)

			} else {
				return (
					<span className='column_title'>--</span>
				)
			}
			
			
		},
		sorter: true,
		sortOrder: sortInfo.columnKey === 'operationDate' && sortInfo.order,
	},
	"cfe1cf3efa7b46ffaa9d05286730718d": {
				id: 'cfe1cf3efa7b46ffaa9d05286730718d',
				title: '到港',
				dataIndex: 'flightNo',
				key: 'A',
				render: (text, record, index) => {
					let str = '--'
					if(record.aord === 'A') {
						str = record.flightNo
					} else if(record.aord === 'A / D') {
						if(record.flightNo.indexOf(' / ') >= 0) {
							str = record.flightNo.split(' / ')[0]
						} else {
							str = record.flightNo
						}
					}
					return (
							<span className='column_title'>{str}</span>
						)
					
				},
				sorter: true,
				sortOrder: sortInfo.columnKey === 'A' && sortInfo.order,
				className: 'flightNo_A'
		},
	"fc395038e9074b1492d30995568ba568": {
		id: 'fc395038e9074b1492d30995568ba568',
				title: '离港',
				dataIndex: 'flightNo',
				key: 'D',
				width: '80px',
				render: (text, record, index) => {
					let str = '--'
					if(record.aord === 'D') {
						str = record.flightNo
					} else if(record.aord === 'A / D') {
						if(record.flightNo.indexOf(' / ') >= 0) {
							str = record.flightNo.split(' / ')[1]
						} else {
							str = record.flightNo
						}
					}
					return (
							<span className='column_title'>{str}</span>
						)
					
				},
				sorter: true,
				sortOrder: sortInfo.columnKey === 'D' && sortInfo.order,
				className: 'flightNo_D'
	},
	"aae2c4d651ce4126b2be41341efd8f0b": {
		id: 'aae2c4d651ce4126b2be41341efd8f0b',
		title: '重复号',
		dataIndex: 'repeatCount',
		key: 'repeatCount',
		sorter: true,
		sortOrder: sortInfo.columnKey === 'repeatCount' && sortInfo.order,
		className: 'repeatCount',
		render: (text, record, index) => {
			if(record.repeatCount) {
				return (<span className='column_title'>{record.repeatCount}</span>)
			} else {
				return (<span className='column_title'>--</span>)
			}
		}
	},
	"b482eb44e8b64f05b6a508a64810e237": {
		id: 'b482eb44e8b64f05b6a508a64810e237',
		title: '机号',
		dataIndex: 'acRegNo',
		key: 'acRegNo',
		sorter: true,
		sortOrder: sortInfo.columnKey === 'acRegNo' && sortInfo.order,
		className: 'acRegNo',
		render: (text, record, index) => {

			let result = record.acRegNo ? record.acRegNo : '--'
			return (
				<span className='column_title'>{result}</span>
			)
		}
	},
	"e614f421caf3499cbbfab5b6f402f1f3": {
		id: 'e614f421caf3499cbbfab5b6f402f1f3',
				title: '类型',
				dataIndex: 'dori',
				key: 'dori',
				sorter: true,
				sortOrder: sortInfo.columnKey === 'dori' && sortInfo.order,
				className: 'dori',
				render: (text, record, index) => {
					let dori = record.dori
					if(dori) {
						if(dori.indexOf(' / ') >= 0) {
							let doriArr = dori.split(' / ')
							// 连班情况
							let interIndex = dori.indexOf('国际')
							let startDori = doriArr[0]
							let endDori = doriArr[1]
//							return (
//						    	<Tooltip placement="topLeft" title={dori} overlayStyle={{wordWrap : 'break-word'}}>
//							       <span>{doriManage(startDori)} /...</span>
//							    </Tooltip>
//						    )
							return (<span className='column_title'>{doriManage(startDori)} / {doriManage(endDori)}</span>)
						} else {
							return (<span className='column_title'>{doriManage(dori)}</span>)
						}

					} else {
						return (<span className='column_title'>--</span>)
					}
					/**
					 * 
					 * @param {Object} dori
					 */
					function doriManage (dori) {
						if(dori.indexOf('国际') >= 0 || dori.indexOf('地区') >= 0) {
								return (<span style={{color: 'red'}}>{dori}</span>)
							} else if(dori.indexOf('混合') >= 0) {
								return (<span style={{color: 'blue'}}>{dori}</span>)
							} else {
								return (<span>{dori}</span>)
							}
					}
					
				}
		},
	"01fc83b3d84e4543b3776eb207dff429": {
		id: '01fc83b3d84e4543b3776eb207dff429',
				title: '机型',
				dataIndex: 'aircraftType',
				key: 'aircraftType',
				sorter: true,
				sortOrder: sortInfo.columnKey === 'aircraftType' && sortInfo.order,
				className: 'aircraftType',
				render: (text, record, index) => {
					let result = record.aircraftType ? record.aircraftType : '--'
					return (
						<span className='column_title'>{result}</span>
					)
//					return returnResult(record.aircraftType, 6)
				}
			},
	"8e3c8c181f0849d9b83ee7f891f56e1a":  {
		id: '8e3c8c181f0849d9b83ee7f891f56e1a',
				title: 'VIP',
				dataIndex: 'flgVip',
				key: 'flgVip',
				sorter: true,
				sortOrder: sortInfo.columnKey === 'flgVip' && sortInfo.order,
				className: 'flgVip',
				render: (text, record, index) => {
					let result = record.flgVip ? record.flgVip : '--'
					return (
						<span className='column_title'>{result}</span>
					)
				}
			},
	"77853cf09e7743018931e78461aea0fd": {
		id: '77853cf09e7743018931e78461aea0fd',
				title: '共享航班',
				dataIndex: 'codeShare',
				key: 'codeShare',
				sorter: true,
				sortOrder: sortInfo.columnKey === 'codeShare' && sortInfo.order,
//				render: (text, record, index) => {
//					return (<span>{record.codeShare || '--'}</span>)
//				}
				className: 'codeShare',
				render: (text, record, index) => {
					let result = record.codeShare ? record.codeShare : '--'
					return (
						<span className='column_title'>{result}</span>
					)
				}
			},
	"c15d545027a24f30b37c7fadc0576e14": {
		id: 'c15d545027a24f30b37c7fadc0576e14',
				title: '任务',
				dataIndex: 'taskCode',
				key: 'taskCode',
				sorter: true,
				sortOrder: sortInfo.columnKey === 'taskCode' && sortInfo.order,
				className: 'taskCode',
				render: (text, record, index) => {
					let result = record.taskCode ? record.taskCode : '--'
					return (
						<span className='column_title'>{result}</span>
					)
				}
			},
	"d7200eeb12c8437f8bd3d8948999e075": {
		id: 'd7200eeb12c8437f8bd3d8948999e075',
				title: '航班状态',
//				dataIndex: 'operationalStatus',
				dataIndex: 'newStatus',
//				key: 'operationalStatus',
				key: 'newStatus',
				sorter: true,
//				sortOrder: sortInfo.columnKey === 'operationalStatus' && sortInfo.order,
				sortOrder: sortInfo.columnKey === 'newStatus' && sortInfo.order,
//				className: 'operationalStatus',
				className: 'newStatus',
				render: (text, record, index) => {
					let result = record.newStatus ? record.newStatus : '--'
					return (
						<span className='column_title'>{result}</span>
					)
				}
			},
	"f2da842d2a414b019f4843ed5fabb5c8": {
		id: 'f2da842d2a414b019f4843ed5fabb5c8',
				title: '值机柜台',
				dataIndex: 'checkinRange',
				key: 'checkinRange',
				sorter: true,
				sortOrder: sortInfo.columnKey === 'checkinRange' && sortInfo.order,
				className: 'checkinRange',
				render: (text, record, index) => {
					let result = record.checkinRange ? record.checkinRange : '--'
					return (
						<span className='column_title'>{result}</span>
					)
				}
			},
	"c97afc5a91754bd9b0be5defdfba5d3a": {
		id: 'c97afc5a91754bd9b0be5defdfba5d3a',
				title: '行李转盘',
				dataIndex: 'carousel',
				key: 'carousel',
				width: '100px',
				sorter: true,
				sortOrder: sortInfo.columnKey === 'carousel' && sortInfo.order,
				className: 'carousel',
				render: (text, record, index) => {
					let result = record.carousel ? record.carousel : '--'
					return (
						<span className='column_title'>{result}</span>
					)
				}
			},
	"9b56717fea8b4759bf67d7ded157db5e": {
		id: '9b56717fea8b4759bf67d7ded157db5e',
				title: '航线',
				dataIndex: 'flightCourse',
				key: 'flightCourse',
				sorter: true,
				sortOrder: sortInfo.columnKey === 'flightCourse' && sortInfo.order,
				render: (text, record, index) => {
					let result = record.flightCourse ? record.flightCourse : '--'
					return (
						<span className='column_title'>{result}</span>
					)

				},
				className: 'flightCourse',
			},
	"8e002f85ae0f4f5e9b38d6ec04d9317b": {
		id: '8e002f85ae0f4f5e9b38d6ec04d9317b',
				title: '始发站',
				dataIndex: 'originalAirport',
				key: 'originalAirport',
				sorter: true,
				sortOrder: sortInfo.columnKey === 'originalAirport' && sortInfo.order,
				className: 'originalAirport',
				render: (text, record, index) => {
					let result = record.originalAirport ? record.originalAirport : '--'
					return (
						<span className='column_title'>{result}</span>
					)
				}
			},
	"a04b63c56c6b417da5588541eb748d3e": {
		id: 'a04b63c56c6b417da5588541eb748d3e',
				title: '目的站',
				dataIndex: 'destAirport',
				key: 'destAirport',
				width: '80px',
				sorter: true,
				sortOrder: sortInfo.columnKey === 'destAirport' && sortInfo.order,
				className: 'destAirport',
				render: (text, record, index) => {
					let result = record.destAirport ? record.destAirport : '--'
					return (
						<span className='column_title'>{result}</span>
					)
				}
			},
	"839dde4e27f94aeaab925cd05767d888": {
		id: '839dde4e27f94aeaab925cd05767d888',
				title: '经停站',
				dataIndex: 'transit',
				key: 'transit',
				width: '80px',
				sorter: true,
				sortOrder: sortInfo.columnKey === 'transit' && sortInfo.order,
				className: 'transit',
				render: (text, record, index) => {
					let result = record.transit ? record.transit : '--'
					return (
						<span className='column_title'>{result}</span>
					)
				}
			},
	"a4b09f3166ee4fbaa20a86158ae7ec8d": {
		id: 'a4b09f3166ee4fbaa20a86158ae7ec8d',
				title: '机位',
				dataIndex: 'finalParkingbayId',
				key: 'finalParkingbayId',
				width: '80px',
				sorter: true,
				sortOrder: sortInfo.columnKey === 'finalParkingbayId' && sortInfo.order,
				className: 'finalParkingbayId',
				render: (text, record, index) => {
					let result = record.finalParkingbayId ? record.finalParkingbayId : '--'
					return (
						<span className='column_title'>{result}</span>
					)
				}
			},
	"e046786ba9f3433fa0541b69fb46b004": {
		id: 'e046786ba9f3433fa0541b69fb46b004',
				title: '登机口',
				dataIndex: 'gate',
				key: 'gate',
				width: '80px',
				sorter: true,
				sortOrder: sortInfo.columnKey === 'gate' && sortInfo.order,
				className: 'gate',
				render: (text, record, index) => {
					let result = record.gate ? record.gate : '--'
					return (
						<span className='column_title'>{result}</span>
					)
				}
			},
	"051a0904baba484c9e3f30e91d347cb1": {
		id: '051a0904baba484c9e3f30e91d347cb1',
				title: '计到',
				dataIndex: 'sta',
				key: 'sta',
				width: '80px',
				render: (text, record, index) => {
					return formatDate(record.sta)

				},
				sorter: true,
				sortOrder: sortInfo.columnKey === 'sta' && sortInfo.order,
				className: 'sta'
			},
	"284a4f18150545ebb712c03c54987837": {
		id: '284a4f18150545ebb712c03c54987837',
				title: '预到',
				dataIndex: 'eta',
				key: 'eta',
				width: '80px',
				render: (text, record, index) => {
					return formatDate(record.eta)

				},
				sorter: true,
				sortOrder: sortInfo.columnKey === 'eta' && sortInfo.order,
				className: 'eta'
			},
	"689340f0788144d4a441b8cc5ea94fb4": {
		id: '689340f0788144d4a441b8cc5ea94fb4',
				title: '实到',
				dataIndex: 'ata',
				key: 'ata',
				width: '80px',
				render: (text, record, index) => {
					return formatDate(record.ata)

				},
				sorter: true,
				sortOrder: sortInfo.columnKey === 'ata' && sortInfo.order,
				className: 'ata'
			},
	"b62932e6badb454d8c7f34f0f5f4e7e8": {
		id: 'b62932e6badb454d8c7f34f0f5f4e7e8',
				title: '计离',
				dataIndex: 'std',
				key: 'std',
				width: '80px',
				render: (text, record, index) => {
					return formatDate(record.std)

				},
				sorter: true,
				sortOrder: sortInfo.columnKey === 'std' && sortInfo.order,
				className: 'std'
			},
	"6eb13dfdc91e4c5a81e9e31194b57693": {
		id: '6eb13dfdc91e4c5a81e9e31194b57693',
				title: '预离',
				dataIndex: 'etd',
				key: 'etd',
				width: '80px',
				render: (text, record, index) => {
					return formatDate(record.etd)

				},
				sorter: true,
				sortOrder: sortInfo.columnKey === 'etd' && sortInfo.order,
				className: 'etd'
		},
	"9fe305970c854737af6660a59d3b3878": {
		id: '9fe305970c854737af6660a59d3b3878',
				title: '实离',
				dataIndex: 'atd',
				key: 'atd',
				width: '80px',
				render: (text, record, index) => {
					return formatDate(record.atd)

				},
				sorter: true,
				sortOrder: sortInfo.columnKey === 'atd' && sortInfo.order,
				className: 'atd'
			},
	"2ef747c67d474cf0bded821e3f6cfccb": {
		id: '2ef747c67d474cf0bded821e3f6cfccb',
				title: '预位',
				dataIndex: 'estimatedInBlockTime',
				key: 'estimatedInBlockTime',
				width: '80px',
				sorter: true,
				sortOrder: sortInfo.columnKey === 'estimatedInBlockTime' && sortInfo.order,
				render: (text, record, index) => {
					return formatDate(record.estimatedInBlockTime)
				},
				className: 'estimatedInBlockTime'
			},
	"253060de29584c54a703993a0947eb58": {
		id: '253060de29584c54a703993a0947eb58',
				title: '异常原因',
				dataIndex: 'abnormalCauseCn',
				key: 'abnormalCauseCn',
				sorter: true,
				sortOrder: sortInfo.columnKey === 'abnormalCauseCn' && sortInfo.order,
				className: 'abnormalCauseCn',
				width: '120px',
				render: (text, record, index) => {
					let result = record.abnormalCauseCn ? record.abnormalCauseCn : '--'
					return (
						<span className='column_title'>{result}</span>
					)
				}
			},
	}	
}

/**
	 * 服务的开始结束
	 */
	let startEndObj = {
		start: (detailName, detailNo, sortNo=-1) => {
			return {
				realTitle: `${detailName}开始`,
				title: (<div style={{display: 'inline-block'}}><span className='column_title'>{detailName}开始</span><span className='drag_flag'></span></div>),
				dataIndex: 'services',
				key: `${detailNo}_0`,
				render: (text, record, index) => {

					let services = record.services || []
					let isNoSer = true
					
					for(let i=0, len=services.length; i<len; i++) {
						if(services[i].detailNo === detailNo) {
							isNoSer = false
							let startStr = services[i].actualStartTime
							startStr = startStr ? formatDate(startStr) : '--'
							
							return (<span>{startStr}</span>)
						}
					}
					if(isNoSer) {
						return (<span>--</span>)
					}
					
				},
				className: `startSer startSer${detailNo}_0`,
				width: '80px',
				sortNo
			}
		},
		end: (detailName, detailNo, sortNo=-1) => {
			return {
				realTitle: `${detailName}结束`,
				title: (<div style={{display: 'inline-block'}}><span className='column_title'>{detailName}结束</span><span className='drag_flag'></span></div>),		// 表头过长
				dataIndex: 'services',
				key: `${detailNo}_1`,
				render: (text, record, index) => {

					let services = record.services || []
					let isNoSer = true
					
					for(let i=0, len=services.length; i<len; i++) {
						if(services[i].detailNo === detailNo) {
							isNoSer = false
							let endStr = services[i].actualEndTime
							endStr = endStr ? formatDate(endStr) : '--'
							return (<span>{endStr}</span>)
						}
					}
					
					if(isNoSer) {
						return (<span>--</span>)
					}
				},
				width: '80px',
				className: `endSer endSer${detailNo}_1`,
				sortNo
			}
		}
	}

/**
 * 获取columns数据
 * @param {Object} theadData
 * @param {Object} start
 */
function getKey (baseCols, serviceCols, start, sortInfo) {

	let columns = []
	let indexColumn = [{
			title: (<div style={{display: 'inline-block'}}><span className='column_title'>序号</span><span className='drag_flag'></span></div>),
			realTitle: '序号',
			dataIndex: 'index',
			key: 'index',
			className: 'index',
			render: (text, record, index) => {
				return (
					<span>{start + index + 1}</span>
				)
			}
	}]

	let valueObj = returnValueObj(sortInfo)
	/**
	 * 基础表头数据
	 */
	for(let i=0, len=baseCols.length; i<len; i++) {
		if(valueObj[baseCols[i].id]) {
			valueObj[baseCols[i].id].realTitle = baseCols[i].columnName
			valueObj[baseCols[i].id].title = (<div style={{display: 'inline-block'}}><span className='column_title'>{baseCols[i].columnName}</span><span className='drag_flag'></span></div>)
			// 配置sortNo
			valueObj[baseCols[i].id].sortNo = baseCols[i].sortNo
			
			columns.push(valueObj[baseCols[i].id])
		}
	}
	
	/**
	 * 服务表头数据
	 */
	for(let j=0, len=serviceCols.length; j<len; j++) {

		if(serviceCols[j].showStartEnd == 0) {
			columns.push(startEndObj.start(serviceCols[j].detailName, serviceCols[j].detailNo, serviceCols[j].sortNo))
		} else if(serviceCols[j].showStartEnd == 1) {
			columns.push(startEndObj.end(serviceCols[j].detailName, serviceCols[j].detailNo, serviceCols[j].sortNo))
		}
		
	}
	
	if(baseCols.length > 0 || serviceCols.length > 0) {
		return [...indexColumn, ...sortNoSort(columns)]
	}
}
/**
 * 导出table的数据
 * @param {Object} baseCols
 * @param {Object} serviceCols
 * @param {Object} start
 * @param {Object} tbody
 */
function exportTableData (baseCols, serviceCols, start, tbody, searchConfig, sortInfo) {
	let data = {
		title: {},
		data: []
	}
	let columns = getKey(baseCols, serviceCols, start, sortInfo)
	let dataIndex = []
	let serviceDetailNo = []
	// 表头
	for(let i=0, len=columns.length; i<len; i++) {
		if(columns[i].dataIndex === 'services') {
			data.title[columns[i].key] = columns[i].realTitle
			serviceDetailNo.push(columns[i].key)
		} else {
			data.title[columns[i].key] = columns[i].realTitle
			dataIndex.push(columns[i].key)
		}
	}
	// 内容
	for(let i=0, len=tbody.length; i<len; i++) {
		let ele = {index: i+1}
		for(let j=1; j<dataIndex.length; j++) {
			// 基础数据		时间格式化的问题
				// 基础
			let str = ''
			if(dataIndex[j] === 'A') {
				if(tbody[i].aord === 'A') {
					str = tbody[i].flightNo
				} else if(tbody[i].aord === 'A / D') {
					if(tbody[i].flightNo.indexOf(' / ') >= 0) {
						str = tbody[i].flightNo.split(' / ')[0]
					} else {
						str = tbody[i].flightNo
					}
				}
				
			} else if(dataIndex[j] === 'D') {
				if(tbody[i].aord === 'D') {
					str = tbody[i].flightNo
				} else if(tbody[i].aord === 'A / D') {
					if(tbody[i].flightNo.indexOf(' / ') >= 0) {
						str = tbody[i].flightNo.split(' / ')[1]
					} else {
						str = tbody[i].flightNo
					}
				}

			} else if(dataIndex[j] === 'sta' || dataIndex[j] === 'std' || dataIndex[j] === 'eta' || dataIndex[j] === 'etd' || dataIndex[j] === 'ata' || dataIndex[j] === 'atd') {
//				let str = ''
//				str = tbody[i][dataIndex[j]] ? tbody[i][dataIndex[j]].slice(-8, -3).split(':').join('') : '--'
//				ele.push(str)
				str = tbody[i][dataIndex[j]]

			} else if(dataIndex[j] === 'flgVip') {
				str = tbody[i][dataIndex[j]]
				str = str ? str : 'N'

			} else {
				str = tbody[i][dataIndex[j]]
			}
			// 添加
			ele[dataIndex[j]] = str
		}
		// 服务		
		serviceDetailNo.forEach((serviceNo) => {
			tbody[i].services.forEach((item) => {
				if(serviceNo.slice(0, -2) === item.detailNo) {
					if(serviceNo.indexOf('_0') >= 0) {
						// 开始
//						ele.push({
//							tbody: item.actualStartTime,
//							tbodyKey: serviceNo
//						})
						ele[serviceNo] = item.actualStartTime
					} else if(serviceNo.indexOf('_1') >= 1) {
						// 结束
//						ele.push({
//							tbody: item.actualEndTime,
//							tbodyKey: serviceNo
//						})
						ele[serviceNo] = item.actualEndTime
					}
				}
			})
		})
		
		data.data.push(ele)
		
	}
	if(searchConfig.aord != 'all') {
		searchConfig.aord = aord[searchConfig.aord]
	} else {
		searchConfig.aord = '全部'
	}
	if(searchConfig.dori.statusKey === 'all') {
		searchConfig.type = '全部('+ [...searchConfig.dori.statusValue] +')'
	} else {
		searchConfig.type = searchConfig.dori.statusKey
	}
	if(searchConfig.status === 'all') {
		searchConfig.status = '全部'
	}
	searchConfig.searchValue = searchConfig.searchValue ? searchConfig.searchValue : '空'
	if(searchConfig.sortRule != '按列排序') {
		searchConfig.sortRule = searchConfig.sortRule === 'IA' ? '地服排序' : 'AOC排序'
	}
	
	tableToExcel(data.data, 'FQS航班数据导出', data.title, searchConfig)	
	

}
/**
 * 生成excel
 * @param {Object} JSONData
 * @param {Object} fileName
 * @param {Object} showLabel
 */
function tableToExcel (JSONData, FileName, showLabel, searchConfig) {
	//先转化json 
	var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
	var excel = '<table>';

	//生成表头
	var row = "<thead><tr>"; 
	for (var i in showLabel) { row += "<th>" + showLabel[i] + '</th>';}
	
	excel += row + "<thead></tr>";
	
	//循环生成表身 
	for (var i = 0; i < arrData.length; i++) { 
		
		var row = "<tr>"; 
//		for (var j = 0; j<.length; j++) {
//
//			var td = arrData[i][j] || '--'; 
//			
//			row += '<td>' + td + '</td>'; 
//			
//		} 
		
		for(var j in showLabel) {
			
			var td = arrData[i][j] || '--'; 
			row += '<td>' + td + '</td>'; 
			
		}
		
		excel += row + "</tr>";
		
	}
	excel += "</table>"; 

	var excelFile = "<html xmlns:o='urn:schemas-microsoft-com:office:office' " + "xmlns:x='urn:schemas-microsoft-com:office:excel' xmlns='http://www.w3.org/TR/REC-html40'>";
	excelFile += '<meta http-equiv="content-type" content="application/vnd.ms-excel; charset=UTF-8">'; 
	excelFile += '<meta http-equiv="content-type" content="application/vnd.ms-excel'; 
	excelFile += '; charset=UTF-8">';
	excelFile += "<head>"; 
	excelFile += "<!--[if gte mso 9]>";
	excelFile += "<xml>"; 
	excelFile += "<x:ExcelWorkbook>";
	excelFile += "<x:ExcelWorksheets>"; 
	excelFile += "<x:ExcelWorksheet>"; 
	excelFile += "<x:Name>"; 
	excelFile += "sheet";
	excelFile += "</x:Name>"; 
	excelFile += "<x:WorksheetOptions>"; 
	excelFile += "<x:DisplayGridlines/>"; 
	excelFile += "</x:WorksheetOptions>";
	excelFile += "</x:ExcelWorksheet>"; 
	excelFile += "</x:ExcelWorksheets>"; 
	excelFile += "</x:ExcelWorkbook>"; 
	excelFile += "</xml>"; 
	excelFile += "<![endif]-->";
	excelFile += "</head>"; 
	excelFile += "<body>"; 
	if(searchConfig.column && searchConfig.column.columnSearchValue) {
		excelFile += `<table><thead><th>到离港</th><th>排序方式</th><th>类型</th><th>状态</th><th>按列搜索</th><th>模糊搜索</th></thead><tbody><tr><td>${searchConfig.aord}</td><td>${searchConfig.sortRule}</td><td>${searchConfig.type}</td><td>${searchConfig.status}</td><td>${searchConfig.column.columnSearchTitle}:${searchConfig.column.columnSearchValue}</td><td>${searchConfig.searchValue}</td></tr></tbody></table>`
	} else {
		excelFile += `<table><thead><th>到离港</th><th>排序方式</th><th>类型</th><th>状态</th><th>模糊搜索</th></thead><tbody><tr><td>${searchConfig.aord}</td><td>${searchConfig.sortRule}</td><td>${searchConfig.type}</td><td>${searchConfig.status}</td><td>${searchConfig.searchValue}</td></tr></tbody></table>`
	}
	excelFile += excel; 
	excelFile += "</body>"; 
	excelFile += "</html>";
//	var uri = 'data:application/vnd.ms-excel;charset=utf-8,' + encodeURIComponent(excelFile);     
	var link = document.createElement("a"); 	
//	link.href = uri

	let blob = new Blob([excelFile], {type: "application/vnd.ms-excel"});
    link.href = URL.createObjectURL(blob);
    
	link.style = "visibility:hidden"; 

	link.download = FileName + ".xls"; 
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
	
}

/**
 * 判断这个key是否是obj对象的属性
 * @param {*} obj 
 * @param {*} key 
 */
function has(obj, key) {
    return Object.prototype.hasOwnProperty.call(obj, key)
}

// 处理两个数据的不同之处		穿梭框
/**
 * 
 * @param {Object} source
 * @param {Object} target
 */
function returnParam (source, target, str, service) {
		let a = source	// 源
		let b = deepClone(target)	// 目标
		let c = deepClone(target)
		let param = []
		let arr1 = []
		let arr2 = []
		let arr3 = []
		let intersection = []
		let difference = []
		let difference2 = []
		
		let result = {
			aord: {
				init: () => {
					intersection = b.filter(v => a.includes(v))		// 交集
					difference = b.filter(v => !a.includes(v))	// 目标中有,源数据中没有		// 新增
					difference2 = a.filter(v => !c.includes(v)) // 源数据有, 目标中没有		// 删除

				},
				getResult: () => {
					// 新增
						arr1 = difference.map((item) => {
							return {
								flag: 'I',
								code: reverseAord[item]
							}
						})
						// 删除
						arr2 = difference2.map((item) => {
							return {
								flag: 'D',
								code: reverseAord[item],
							}
						})
						
						// 没有变化
						arr3 = intersection.map((item) => {
							return {
								code: reverseAord[item],
								flag: 'I'
							}
						})
				}
			},
			dori: {
				
				init: () => {
					intersection = b.filter(v => a.includes(v))		// 交集
					difference = b.filter(v => !a.includes(v))	// 目标中有,源数据中没有		// 新增
					difference2 = a.filter(v => !c.includes(v)) // 源数据有, 目标中没有		// 删除
				},
				
				getResult: () => {
					// 新增
					arr1 = difference.map((item) => {
						return {
							flag: 'I',
							code: reverseDori[item],
		
						}
					})
					// 删除
					arr2 = difference2.map((item) => {
						return {
							flag: 'D',
							code: reverseDori[item],
						}
					})
					
					// 没有变化
					
					arr3 = intersection.map((item) => {
						return {
							code: reverseDori[item],
							flag: 'I'
						}
					})	
				}
			},
			/**
			 * 基础
			 */
			base: {
				init: () => {
					
					b.forEach((item, index) => {
						
						if(item.indexOf('_') > 0) {
							// 服务
							let arr = item.split('_')
							b[index] = {
								detailNo: arr[0],
								sortNo: index,
								showStartEnd: arr[1]
							}
						} else {
							// 基础
							b[index] = {
								id: item,
								sortNo: index
							}
						}
						
//						b[index] = {
//							id: item,
//							sortNo: index
//						}
					})
					
					intersection = b.filter(v => a.includes(v.id) || a.includes(v.detailNo))		// 交集
					difference = b.filter(v => !a.includes(v.id) || a.includes(v.detailNo))	// 目标中有,源数据中没有		// 新增
					difference2 = a.filter(v => !c.includes(v)) 	// 源数据有, 目标中没有		// 删除
					
				},
				getResult: () => {
					// 新增	删除隐藏的
					arr1 = difference.map((item) => {
						if(has(item, 'detailNo')) {
							// 服务
							let {detailNo, sortNo, showStartEnd} = item
							return {
								flag: 'I',
								detailNo,
								sortNo,
								showStartEnd,
								isShow: '0'
							}
						} else {
							let {id, sortNo} = item
							return {
								flag: 'I',
								id,
								sortNo,
								isShow: '0'
							}
						}
					})
					
					// 删除	新增隐藏
					arr2 = difference2.map((item) => {
						if(item.indexOf('_') > 0) {
							let arr = item.split('_')
							return {
								flag: 'I',
								detailNo: arr[0],
								showStartEnd: arr[1],
								isShow: '1'
							}
						} else {
							return {
								flag: 'I',
								id: item,
								isShow: '1'
							}
						}
						
					})
					
					// 没有左右移动
					
					arr3 = intersection.map((item) => {
						if(has(item, 'detailNo')) {
							return {
								detailNo: item.detailNo,
								sortNo: item.sortNo,
								flag: 'I',
								showStartEnd: item.showStartEnd,
								isShow: '0'
							}
						} else {
							return {
								id: item.id,
								sortNo: item.sortNo,
								flag: 'I',
								isShow: '0'
							}
						}
						
					})
					
				}
			},
			services: {
				
				init: () => {
					
					let detailNoArr = service.map((item) => {
						return item.detailNo
					})
					
					b.forEach((item, index) => {
						b[index] = {
							detailNo: item,
							sortNo: index,
							showStartEnd: service[detailNoArr.indexOf(item)].showStartEnd	
						}
					})
					
					intersection = b.filter(v => a.includes(v.detailNo))		// 交集
					difference = b.filter(v => !a.includes(v.detailNo))	// 目标中有,源数据中没有		// 新增
					difference2 = a.filter(v => !c.includes(v)) // 源数据有, 目标中没有		// 删除
					
					difference2.forEach((item, index, arr) => {
						arr[index] = {
							detailNo: item,
							showStartEnd: service[detailNoArr.indexOf(item)].showStartEnd
						}
					})

				},
				
				getResult: () => {
					// 新增	删除隐藏的
					arr1 = difference.map((item) => {
						return {
							flag: 'I',
							detailNo: item.detailNo.slice(0, -2),
							sortNo: item.sortNo,
							showStartEnd: item.showStartEnd,
							isShow: '0'
						}
					})
					// 删除	新增隐藏
					arr2 = difference2.map((item) => {
						return {
							flag: 'I',
							detailNo: item.detailNo.slice(0, -2),
							showStartEnd: item.showStartEnd,
							isShow: '1'
						}
					})
					// 没有左右移动
					arr3 = intersection.map((item) => {
						return {
							detailNo: item.detailNo.slice(0, -2),
							sortNo: item.sortNo,
							flag: 'I',
							showStartEnd: item.showStartEnd,
							isShow: '0'
						}
					})
					
				}
			}
		}
		result[str].init()
		result[str].getResult()
		param = param.concat(...arr1, ...arr2, ...arr3)
//		console.log(param)
		return param
}
/**
 * 将时间转化为时间戳
 * @param {Object} start
 * 
 */
		function splitTime (start) {
	        // 兼容火狐     new date("Year","Month","Day","Hour","Minutes","Seconds");(在Chrome 和 Firefox IE8中都兼容，其它未测试。)
	        var arr = start.split(' ')
	        arr = arr[0].split('-').concat(arr[1].split(':'))
	        var startTime = new Date(arr[0], arr[1]-1, arr[2], arr[3], arr[4], arr[5]).getTime()
	        return startTime
    	}