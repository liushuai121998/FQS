var config = {
	// 6.221:8680	1.22	192.168.7.241
	"serviceUrl": "http://192.168.6.11/fqs-admin-service",	// '后台管理的服务地址'
	"searchUrl": "http://192.168.6.11/fqs-query-service",		//'查询界面的服务地址',
	"syncDataUrl": "http://192.168.6.11/fqs-sync-etl",	//'数据同步的地址'
	"rabitMqUrl": "192.168.6.11",	//'数据推送rabitMq的地址',
	"compareUrl": 'http://192.168.6.221/fqs-query-service/API/flights/compare',		// 航班比对系统
	"heartTime": "600000",	//'心跳机制时长' 10min,
	"host": "/QUERY",		//rabitMq的host
	"flightStatus": {		//'航班状态的状态码对应的中文字符'
		"4135": "前起",
		"4133": "到达",
		"12307": "值机开始",
		"12308": "值机截止",
		"12309": "过站登机",
		"12310": "本站登机",
		"12311": "催促登机",
		"12312": "登机结束",
		"4134": "起飞 ",
		"49160": "延误",
		"49159": "取消",
		"49164": "返航",
		"49179": "滑回",
		"49165": "备降",
		"49180": "改降",
		"49161": "恢复"
	},
	"aord": {		//'到离港对应的中文字符',
		"A": "到港",
		"D": "离港"
	},
	"dori": {		//'类型对应的中文字符',
		"I": "国内",
		"D": "国际",
		"M": "混合",
		"R": "地区"
	},
	"reGetInitData": "endOperation",	//'凌晨4点请求初始化数据的命令'
	"resetInit": "modifyDict",			// 刷新获取初始化数据
	"refreshData": 'reload',			// 工程重启时获取初始化数据的命令
	"loadingTime": 72000,	// 如果服务停止，2分钟之后提示退出重新登录
	"showLen": 25,			// 一屏显示的数据量(建议25-50)
	"rabbitMQDebug": false, 	// 是否打印rabitMq 消息的日志，默认为true(不打印)
	"reConnectMQCount": 10		// MQ连接中断，尝试重连的次数， 暂未开通
}