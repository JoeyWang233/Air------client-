const HandleData = function (data) {
  this.data = data;
  this.err = false;
  this.mData = data.slice(4, -1);
};

/* 五个方法：1. header() 分析数据帧头
 *         2. length() 分析数据长度
 *         3. dataType() 分析数据类型
 *         4. mainData() 分析主要数据
 *         5. verify() 分析校验位
 * 属性: 1. data 传入的数据数组
 *       2. err 数据可靠值
 *       3  head 数据帧头
 *       4. serverHeader 服务器发送帧头
 *       5. mData 主要数据部分
 *       6. dataFrames 数据分析结果(object)
 *       7. eventCode 报警代码
 * 函数 handelTime(t) 生成时间字符串
 */
HandleData.prototype.dataDecode = function () {
  this.header();
  if (this.err) {
    this.iferr();
    return;
  }
  this.length();
  if (this.err) {
    this.iferr();
    return;
  }
  this.dataType();
  if (this.err) {
    this.iferr();
    return;
  }
  this.verify();
  if (this.err) {
    this.iferr();
    return;
  }
  switch (this.head) {
    case 'FA':
      this.mainData();
      break;
    case 'FB':
      this.coinData();
      break;
    case 'FC':
      this.cardData();
      break;
  }
  if (this.err) {
    this.iferr();
  }
};

// 数据帧头
HandleData.prototype.header = function () {
  this.head = this.data[0];
  switch (this.head) {
    case 'FA':
      this.serverHeader = 'F5';
      break;
    case 'FB':
      this.serverHeader = 'F6';
      break;
    case 'FC':
      this.serverHeader = 'F7';
      break;
    default:
      this.err = '01';
  }
};


// 长度

HandleData.prototype.length = function () {
  let len = `0x${this.data[1] }${this.data[2]}`;
  len = Number(len);

  if (len != (this.data.length - 3)) {
    this.err = '02';
  }
};

// 数据类型
HandleData.prototype.dataType = function () {
  const dtCode = this.data[3];
  switch (dtCode) {
    case '01':
      this.dt = '定时上传';
      break;
    case '02':
      this.dt = '签到';
      break;
    case '03':
      this.dt = '报警';
      break;
    case '04':
      this.dt = '汇总上传';
      break;
    case '06':
      this.dt = '刷卡账号上传';
      break;
    case '10':
      this.dt = '服务器应答';
      break;
    case '11':
      this.dt = '设备应答';
      break;
    case '31':
      this.dt = '定时上传呼叫';
      break;
    case '32':
      this.dt = '签到呼叫';
      break;
    case '22':
      this.dt = '设置本机号码';
      break;
    case 'FF':
      this.dt = '服务器应答出错报告';
      break;
    default:
      this.err = '00';

  }
  if (this.head == 'FB') {
    if (dtCode != '01') {
      this.err = '00';
    }
  }
};

// 校验位   和校验: 帧头+长度+数据类型+数据值
HandleData.prototype.verify = function () {
  const verifyNumber = this.data.slice(-1).toString();
  let sum = 0,
    sumNumber;
  for (let i = 0; i < (this.data.length - 1); i++) {
    sum += parseInt(`0x${this.data[i]}`);
  }
    // console.log(sum);
    // if(sum > 0xff){
    //     sum = ~sum;
    //     sum += 1;
    // }
    // console.log(sum);
  sumNumber = sum.toString(16).slice(-2).toUpperCase();
  if (verifyNumber != sumNumber) {
    this.err = '03';
  }
};

// 数据
HandleData.prototype.mainData = function () {
  const dataFrames = {};
    // 序列号 C_INDEX
  let C_INDEX = '';
  for (let i = 0; i < 4; i++) {
    C_INDEX += this.mData[i];
  }
  C_INDEX = parseInt(C_INDEX, 16);
  dataFrames.C_INDEX = (Array(8).join(0) + C_INDEX).slice(-8);
    // 设备时间 EventTime
    // 解析 8byte 时间序列，参数为首位的i值
  const handleTime = (function (t) {
    const Year = (Array(4).join('0') + parseInt(this.mData[t] + this.mData[++t], 16)).slice(-4);
    const Month = (Array(2).join('0') + parseInt(this.mData[++t], 16)).slice(-2);
    const Day = (Array(2).join('0') + parseInt(this.mData[++t], 16)).slice(-2);
    ++t;
    const Hour = (Array(2).join('0') + parseInt(this.mData[++t], 16)).slice(-2);
    const Minute = (Array(2).join('0') + parseInt(this.mData[++t], 16)).slice(-2);
    const Second = (Array(2).join('0') + parseInt(this.mData[++t], 16)).slice(-2);
    const time = `${Year}-${Month}-${Day} ${Hour}:${Minute}:${Second}`;
    return time;
  }).bind(this);

  dataFrames.EventTime = handleTime(4);

    // 设备序列号  DevSN
  let i = 12,
    DevSN = '';
  while (this.mData[i] != '00' && i < 28) {
    DevSN += String.fromCharCode(parseInt(this.mData[i], 16));
    i++;
  }
  dataFrames.DevSN = DevSN;
    // 设备标识 DevID
  i = 28;
  let DevID = '';
  while (this.mData[i] != '00' && i < 32) {
    DevID += String.fromCharCode(parseInt(this.mData[i], 16));
    i++;
  }
  dataFrames.DevID = DevID;
    // 设备名称 DevName
  i = 32;
  let DevName = '';
  while (this.mData[i] != '00' && i < 64) {
    DevName += String.fromCharCode(parseInt(this.mData[i], 16));
    i++;
  }
  dataFrames.DevName = DevName;
    // 机器位置号 SiteNo
  i = 64;
  let SiteNo = '';
  while (this.mData[i] != '00' && i < 72) {
    SiteNo += String.fromCharCode(parseInt(this.mData[i], 16));
    i++;
  }
  dataFrames.SiteNo = SiteNo;
    // 机器编号  MachineNo
  i = 72;
  let MachineNo = '';
  while (this.mData[i] != '00' && i < 80) {
    MachineNo += String.fromCharCode(parseInt(this.mData[i], 16));
    i++;
  }
  dataFrames.MachineNo = MachineNo;
    // 报警类型         ？？
  i = 80;
  dataFrames.alarmType = parseInt(this.mData[i], 16);

  if (dataFrames.alarmType >= 2 <= 18) {
    switch (dataFrames.alarmType) {
      case 2:
        this.eventCode = 'P01';
        break;
      case 3:
        this.eventCode = 'P02';
        break;
      case 4:
        this.eventCode = 'M01';
        break;
      case 5:
        this.eventCode = 'M02';
        break;
      case dataFrames.alarmType >= 6 <= 14:
        this.eventCode = `A0${dataFrames.alarmType - 5}`;
        break;
      case 15:
        this.eventCode = 'A10';
        break;
      case 16:
        this.eventCode = 'T01';
        break;
      case 17:
        this.eventCode = 'A11';
        break;
      case 18:
        this.eventCode = 'A12';
        break;
    }
  }

    // 设备GSM信号强度  GSMSignal
  i = 81;
  dataFrames.GSMSignal = parseInt(this.mData[i], 16);
    // GPS信号强度  GPSSignal
  i = 82;
  dataFrames.GPSSignal = parseInt(this.mData[i], 16);
    // 纬度 Longitude
  i = 83;
  let longitude = '';
  while (this.mData[i] != '00' && i < 96) {
    longitude += String.fromCharCode(parseInt(this.mData[i], 16));
    i++;
  }
  dataFrames.longitude = longitude;
    // 经度 Latitude
  i = 96;
  let latitude = '';
  while (this.mData[i] != '00' && i < 108) {
    latitude += String.fromCharCode(parseInt(this.mData[i], 16));
    i++;
  }
  dataFrames.latitude = latitude;
    // 移动速度 MoveSpeed
  i = 108;
  let moveSpeed = '';
  while (this.mData[i] != '00' && i < 111) {
    moveSpeed += String.fromCharCode(parseInt(this.mData[i], 16));
    i++;
  }
  dataFrames.moveSpeed = moveSpeed;
    // 液位状态 liquidLevel
  i = 111;
  const liquidLevel = [];
  while (i < 141) {
    liquidLevel.push(parseInt(this.mData[i] + this.mData[++i], 16));
    i++;
  }
  dataFrames.liquidLevel = liquidLevel;
    // 测温点1、2温度 temperature1、temperature2                          （待定）
  i = 141;
  dataFrames.temperature1 = ((parseInt(this.mData[i] + this.mData[++i], 16) - 5000) / 100);
  dataFrames.temperature2 = ((parseInt(this.mData[++i] + this.mData[++i], 16) - 5000) / 100);
    // 硬币信息类型       ？？？
  if (this.mData[++i] == 0) {
    dataFrames.coinType = '实时数据';
  } else {
    dataFrames.coinType = '汇总数据';
  }
    // 主机主固件版本号  MainVersion
  i = 150;
  dataFrames.MainVersion = `${parseInt(this.mData[i], 16)}.${parseInt(this.mData[++i], 16)}`;
    // 主机启动固件版本号 BootVersion
  dataFrames.BootVersion = `${parseInt(this.mData[++i], 16)}.${parseInt(this.mData[++i], 16)}`;
    // 从机主固件版本号 AuMainVersion
  dataFrames.AuMainVersion = `${parseInt(this.mData[++i], 16)}.${parseInt(this.mData[++i], 16)}`;
    // 从机启动固件版本号 AuBootVersion
  dataFrames.AuBootVersion = `${parseInt(this.mData[++i], 16)}.0`;
    // 从机状态       ？？？？
  switch (parseInt(this.mData[++i], 16)) {
    case 0:
      dataFrames.slavaState = '正常';
      break;
    case 1:
      dataFrames.slavaState = '通信错误';
      break;
    case 2:
      dataFrames.slavaState = 'GPS错误';
      break;
    case 3:
      dataFrames.slavaState = '按键错误';
      break;
  }
    // SIM卡IMSI号   IMSI
  i = 158;
  let IMSI = '';
  while (this.mData[i] != '00' && i < 174) {
    IMSI += String.fromCharCode(parseInt(this.mData[i], 16));
    i++;
  }
  dataFrames.IMSI = IMSI;
    // GPRS模块IMEI号  IMEI
  i = 174;
  let IMEI = '';
  while (this.mData[i] != '00' && i < 190) {
    IMEI += String.fromCharCode(parseInt(this.mData[i], 16));
    i++;
  }
  dataFrames.IMEI = IMEI;
    // GPRS模块类型  GPRSDevice
  i = 190;
  switch (parseInt(this.mData[i], 16)) {
    case 0:
      dataFrames.GPRSDevice = 'SIM900';
      break;
    case 1:
      dataFrames.GPRSDevice = 'ZTE';
      break;
    default:
      dataFrames.GPRSDevice = '出错';

  }

    // 远程升级标志   ？？？
  switch (parseInt(this.mData[++i], 16)) {
    case 0:
      dataFrames.updateSign = '无状态';
      break;
    case 1:
      dataFrames.updateSign = '设备返回升级程序失败';
      break;
    case 2:
      dataFrames.updateSign = '设备返回升级程序成功';
      break;
    default:
      dataFrames.updateSign = '出错';

  }
    // LAN MAC  LanMac
  let LanMac = '';
  for (++i; i < 198; i++) {
    LanMac += `${this.mData[i]}-`;
  }
  dataFrames.LanMac = LanMac;
    // Li battery vol  RTC battery vol   LiVol  RtcVol   ？？？？
  dataFrames.LiVol = (parseInt(this.mData[i] + this.mData[++i], 16) * 2.5 / 0.26 / 4096).toFixed(2);
  dataFrames.RtcVol = (parseInt(this.mData[++i] + this.mData[++i], 16) * 2.5 / 0.62 / 4096).toFixed(2);
    // SysVolStatus
  i = 202;
  dataFrames.SysVolStatus = parseInt(this.mData[i], 16);

    // 交流电断电时间 ExChangeOffTime
  dataFrames.ExChangeOffTime = handleTime(203);
    // 开盒时间 OnBoxTime
  dataFrames.OnBoxTime = handleTime(211);
    // 接近开关1打开时间  CloseOpenTime1
  dataFrames.CloseOpenTime1 = handleTime(219);
    // 接近开关2打开时间  CloseOpenTime2
  dataFrames.CloseOpenTime2 = handleTime(227);
    // 接近开关3打开时间  CloseOpenTime3
  dataFrames.CloseOpenTime3 = handleTime(235);
    // 总投币值(便士) TotalCoin
  let TotalCoin = '';
  for (i = 243; i < 247; i++) {
    TotalCoin += this.mData[i];
  }
  dataFrames.TotalCoin = parseInt(TotalCoin, 16);
  this.TotalCoin = parseInt(TotalCoin, 16);
    // 下次定时上传时间/磁卡校验和
  dataFrames.magcardChecksum = `${parseInt(this.mData[i], 16)}:${parseInt(this.mData[++i], 16)}`;
    // 下次汇总上传时间/读卡器板固件版本号/读卡器板状态
  const readCardVer = parseInt(this.mData[++i], 16);
  const a = parseInt(readCardVer / 10);
  const b = readCardVer % 10;
  dataFrames.readCardVer = `${a}:${b}`;
  dataFrames.readCardState = parseInt(this.mData[++i], 16);
  this.dataFrames = dataFrames;
};
// 解码投币数据帧
// 解码二进制
function Bdecode(codes, n) {
  const value = (Array(n).join('0') + parseInt(codes.join(''), 16)).slice(-n);
  return value;
}
// 解码ASCII
function ASCIIDecode(codes, n) {
  let i = 0,
    value = '';
  while (codes[i] != '00' && i < n) {
    value += String.fromCharCode(parseInt(codes[i], 16));
    i++;
  }
  return value;
}
// 解码ZYMDWHms
function dateDecode(codes) {
  let t = 0;
  const Year = (Array(4).join('0') + parseInt(codes[t] + codes[++t], 16)).slice(-4);
  const Month = (Array(2).join('0') + parseInt(codes[++t], 16)).slice(-2);
  const Day = (Array(2).join('0') + parseInt(codes[++t], 16)).slice(-2);
  ++t;
  const Hour = (Array(2).join('0') + parseInt(codes[++t], 16)).slice(-2);
  const Minute = (Array(2).join('0') + parseInt(codes[++t], 16)).slice(-2);
  const Second = (Array(2).join('0') + parseInt(codes[++t], 16)).slice(-2);
  const time = `${Year}-${Month}-${Day} ${Hour}:${Minute}:${Second}`;
  return time;
}
HandleData.prototype.coinData = function () {
  const dataFrames = {};

  dataFrames.serialNumber = Bdecode(this.mData.slice(0, 4), 8);
  dataFrames.DevTime = dateDecode(this.mData.slice(4, 12));
  dataFrames.DevSN = ASCIIDecode(this.mData.slice(12, 28), 16);
  dataFrames.DevID = ASCIIDecode(this.mData.slice(28, 32), 4);
  dataFrames.DevName = ASCIIDecode(this.mData.slice(32, 64), 32);
  const cData = this.mData.slice(64, -1);
  let n = 0;
  dataFrames.coinData = [];
  while (n < cData.length) {
    const coinInfo = {};
    coinInfo.index = Bdecode(cData.slice(n, n + 4), 8);
    coinInfo.EventCode = parseInt(cData.slice(n + 4, n + 5), 16).toString();
    coinInfo.EventTime = dateDecode(cData.slice(n + 5, n + 13));
    coinInfo.Account = ASCIIDecode(cData.slice(n + 13, n + 32), 19);
    dataFrames.coinData.push(coinInfo);
    n += 32;
  }
  dataFrames.iflast = parseInt(this.mData.slice(-1), 16);
  this.dataFrames = dataFrames;
};

HandleData.prototype.cardData = function () {                   // 待调试
  const dataFrames = {};
  dataFrames.serialNumber = Bdecode(this.mData.slice(0, 4), 8);
  dataFrames.DevTime = dateDecode(this.mData.slice(4, 12));
  dataFrames.DevSN = ASCIIDecode(this.mData.slice(12, 28), 16);
  dataFrames.cardType = Bdecode(this.mData.slice(28, 29), 1);
  dataFrames.Account = ASCIIDecode(this.mData.slice(29, 61), 31);
  dataFrames.C_INDEX = Bdecode(dataFrames.Account.charAt(0), 8);
  dataFrames.Account = dataFrames.Account.slice(1);
  dataFrames.EventTime = dateDecode(this.mData.slice(61, 69));
  dataFrames.CoinValue = parseFloat(`${parseInt(this.mData[69], 16)}.${parseInt(this.mData[70], 16)}`) * 100;
  dataFrames.MileAge = parseInt(this.mData.slice(71, 79).join(''), 16);
  dataFrames.CarNo = ASCIIDecode(this.mData.slice(79, 87), 8);
  dataFrames.TouchScreen = parseInt(this.mData[87], 16);
  dataFrames.ServiceType = parseInt(this.mData[88], 16);
  dataFrames.OperationValue = parseFloat(`${parseInt(this.mData[89], 16)}.${parseInt(this.mData[90], 16)}`) * 10;
  dataFrames.ButtonID = parseInt(this.mData[91], 16);
  dataFrames.WorkMode = parseInt(this.mData[92], 16);
  this.dataFrames = dataFrames;
};
export default HandleData;
