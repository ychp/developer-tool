import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Phone, Search, Loader2, Building2, Landmark, Smartphone } from 'lucide-react'
import axios from 'axios'

interface PhoneInfo {
  number: string
  type: string
  name: string
  description?: string
  category?: string
  province?: string
  city?: string
  isp?: string
  areaCode?: string
}

// 银行客服号码数据库
const bankServiceNumbers: PhoneInfo[] = [
  { number: '95588', type: '银行客服', name: '中国工商银行', category: '国有银行' },
  { number: '95599', type: '银行客服', name: '中国农业银行', category: '国有银行' },
  { number: '95566', type: '银行客服', name: '中国银行', category: '国有银行' },
  { number: '95533', type: '银行客服', name: '中国建设银行', category: '国有银行' },
  { number: '95559', type: '银行客服', name: '交通银行', category: '国有银行' },
  { number: '95580', type: '银行客服', name: '中国邮政储蓄银行', category: '国有银行' },
  { number: '95555', type: '银行客服', name: '招商银行', category: '股份制银行' },
  { number: '95561', type: '银行客服', name: '兴业银行', category: '股份制银行' },
  { number: '95558', type: '银行客服', name: '中信银行', category: '股份制银行' },
  { number: '95577', type: '银行客服', name: '华夏银行', category: '股份制银行' },
  { number: '95568', type: '银行客服', name: '民生银行', category: '股份制银行' },
  { number: '95528', type: '银行客服', name: '浦发银行', category: '股份制银行' },
  { number: '95595', type: '银行客服', name: '光大银行', category: '股份制银行' },
  { number: '95501', type: '银行客服', name: '平安银行', category: '股份制银行' },
  { number: '95574', type: '银行客服', name: '宁波银行', category: '城商行' },
  { number: '95526', type: '银行客服', name: '北京银行', category: '城商行' },
  { number: '95594', type: '银行客服', name: '上海银行', category: '城商行' },
  { number: '95527', type: '银行客服', name: '南京银行', category: '城商行' },
  { number: '95571', type: '银行客服', name: '徽商银行', category: '城商行' },
  { number: '4008895539', type: '银行客服', name: '微众银行', category: '互联网银行' },
  { number: '4008218888', type: '银行客服', name: '网商银行', category: '互联网银行' },
  { number: '4008308003', type: '银行客服', name: '新网银行', category: '互联网银行' },
  { number: '4008888811', type: '银行客服', name: '百信银行', category: '互联网银行' },
]

// 其他常用服务号码
const serviceNumbers: PhoneInfo[] = [
  { number: '10086', type: '运营商', name: '中国移动客服', category: '电信运营商' },
  { number: '10010', type: '运营商', name: '中国联通客服', category: '电信运营商' },
  { number: '10000', type: '运营商', name: '中国电信客服', category: '电信运营商' },
  { number: '10099', type: '运营商', name: '中国广电客服', category: '电信运营商' },
  { number: '12306', type: '交通出行', name: '铁路客服', category: '铁路服务' },
  { number: '95306', type: '交通出行', name: '中国铁路货运', category: '铁路服务' },
  { number: '95010', type: '旅行服务', name: '携程旅行', category: 'OTA平台' },
  { number: '10106666', type: '旅行服务', name: '飞猪旅行', category: 'OTA平台' },
  { number: '4008306666', type: '旅行服务', name: '去哪儿网', category: 'OTA平台' },
  { number: '95017', type: '支付服务', name: '微信支付客服', category: '支付平台' },
  { number: '95188', type: '支付服务', name: '支付宝客服', category: '支付平台' },
  { number: '4006700700', type: '支付服务', name: '京东支付', category: '支付平台' },
  { number: '4006065500', type: '电商服务', name: '京东商城', category: '电商平台' },
  { number: '4008888888', type: '电商服务', name: '淘宝/天猫', category: '电商平台' },
  { number: '02153395288', type: '电商服务', name: '拼多多', category: '电商平台' },
  { number: '4006668800', type: '外卖服务', name: '美团外卖', category: '外卖平台' },
  { number: '10105757', type: '外卖服务', name: '饿了么', category: '外卖平台' },
  { number: '950616', type: '快递服务', name: '京东物流', category: '物流快递' },
  { number: '95338', type: '快递服务', name: '顺丰速运', category: '物流快递' },
  { number: '95543', type: '快递服务', name: '申通快递', category: '物流快递' },
  { number: '95554', type: '快递服务', name: '圆通速递', category: '物流快递' },
  { number: '95311', type: '快递服务', name: '中通快递', category: '物流快递' },
  { number: '95546', type: '快递服务', name: '韵达快递', category: '物流快递' },
  { number: '11183', type: '快递服务', name: '中国邮政EMS', category: '物流快递' },
  { number: '12315', type: '政务服务', name: '消费者投诉举报', category: '政府热线' },
  { number: '12345', type: '政务服务', name: '政务服务便民热线', category: '政府热线' },
  { number: '110', type: '紧急服务', name: '报警电话', category: '紧急电话' },
  { number: '120', type: '紧急服务', name: '急救电话', category: '紧急电话' },
  { number: '119', type: '紧急服务', name: '火警电话', category: '紧急电话' },
  { number: '122', type: '紧急服务', name: '交通事故报警', category: '紧急电话' },
]

// 虚拟运营商号段
const virtualOperators = [
  { prefix: '170', name: '虚拟运营商', carriers: ['中国联通', '中国电信', '中国移动'] },
  { prefix: '171', name: '虚拟运营商', carriers: ['中国联通'] },
  { prefix: '165', name: '虚拟运营商', carriers: ['中国移动'] },
  { prefix: '167', name: '虚拟运营商', carriers: ['中国联通'] },
  { prefix: '162', name: '虚拟运营商', carriers: ['中国电信'] },
]

export function PhoneNumber() {
  const [phoneInput, setPhoneInput] = useState('')
  const [phoneInfo, setPhoneInfo] = useState<PhoneInfo | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const cleanNumber = (phone: string): string => {
    return phone.replace(/[^\d]/g, '')
  }

  const detectNumberType = (phone: string): string => {
    const cleaned = cleanNumber(phone)
    
    // 紧急电话
    if (/^(110|120|119|122)$/.test(cleaned)) {
      return 'emergency'
    }
    
    // 短号码（5位及以下）
    if (cleaned.length <= 5) {
      return 'short'
    }
    
    // 手机号码
    if (/^1[3-9]\d{9}$/.test(cleaned)) {
      return 'mobile'
    }
    
    // 座机号码（带区号）
    if (/^0\d{10,11}$/.test(cleaned)) {
      return 'landline'
    }
    
    // 400/800/95/96开头的服务号码
    if (/^(400|800|95|96)\d{6,8}$/.test(cleaned)) {
      return 'service'
    }
    
    // 国际号码
    if (/^00\d{10,}$/.test(cleaned)) {
      return 'international'
    }
    
    return 'unknown'
  }

  const searchServiceNumber = (phone: string): PhoneInfo | null => {
    const cleaned = cleanNumber(phone)

    // 搜索银行客服
    const bankMatch = bankServiceNumbers.find(b => b.number === cleaned)
    if (bankMatch) return bankMatch

    // 搜索其他服务号码
    const serviceMatch = serviceNumbers.find(s => s.number === cleaned)
    if (serviceMatch) return serviceMatch

    return null
  }

  // 在线号码查询API（支持CORS）
  const searchOnlinePhone = async (phone: string): Promise<PhoneInfo | null> => {
    const cleaned = cleanNumber(phone)

    // 只查询手机号码
    if (!/^1[3-9]\d{9}$/.test(cleaned)) {
      return null
    }

    try {
      // 使用ip138的号码查询API（支持CORS）
      const response = await axios.get(`https://api.vvhan.com/api/phone`, {
        params: {
          tel: cleaned
        },
        timeout: 5000
      })

      const data = response.data

      if (data.success && data.info) {
        const info = data.info
        const province = info.province || ''
        const city = info.city || ''
        const isp = info.sp || info.isp || ''

        return {
          number: cleaned,
          type: '手机号码',
          name: isp || '未知运营商',
          description: `${province} ${city} ${isp}`,
          category: '移动通信',
          province: province,
          city: city,
          isp: isp
        }
      }
    } catch (err) {
      console.error('vvhan号码查询失败:', err)
    }

    try {
      // 使用另一个支持CORS的API
      const response = await axios.get(`https://api.oick.cn/tel/api.php`, {
        params: {
          tel: cleaned
        },
        timeout: 5000
      })

      const data = response.data

      if (data.code === 200 && data.data) {
        const result = data.data
        const province = result.province || ''
        const city = result.city || ''
        const isp = result.sp || result.isp || ''

        return {
          number: cleaned,
          type: '手机号码',
          name: isp || '未知运营商',
          description: `${province} ${city} ${isp}`,
          category: '移动通信',
          province: province,
          city: city,
          isp: isp
        }
      }
    } catch (err) {
      console.error('oick号码查询失败:', err)
    }

    return null
  }

  const searchLandline = (phone: string): PhoneInfo | null => {
    const cleaned = cleanNumber(phone)
    
    // 提取区号（前3-4位）
    const areaCodeMatch = cleaned.match(/^0(\d{2,3})(\d{7,8})$/)
    if (!areaCodeMatch) return null
    
    const areaCode = areaCodeMatch[1]
    const localNumber = areaCodeMatch[2]
    
    // 常见区号对应城市
    const areaCodeMap: Record<string, { province: string; city: string }> = {
      '10': { province: '北京市', city: '北京' },
      '21': { province: '上海市', city: '上海' },
      '22': { province: '天津市', city: '天津' },
      '23': { province: '重庆市', city: '重庆' },
      '311': { province: '河北省', city: '石家庄' },
      '312': { province: '河北省', city: '保定' },
      '313': { province: '河北省', city: '张家口' },
      '314': { province: '河北省', city: '承德' },
      '315': { province: '河北省', city: '唐山' },
      '316': { province: '河北省', city: '廊坊' },
      '317': { province: '河北省', city: '沧州' },
      '318': { province: '河北省', city: '衡水' },
      '319': { province: '河北省', city: '邢台' },
      '310': { province: '河北省', city: '邯郸' },
      '335': { province: '河北省', city: '秦皇岛' },
      '351': { province: '山西省', city: '太原' },
      '352': { province: '山西省', city: '大同' },
      '353': { province: '山西省', city: '阳泉' },
      '354': { province: '山西省', city: '晋中' },
      '355': { province: '山西省', city: '长治' },
      '356': { province: '山西省', city: '晋城' },
      '357': { province: '山西省', city: '临汾' },
      '358': { province: '山西省', city: '吕梁' },
      '359': { province: '山西省', city: '运城' },
      '350': { province: '山西省', city: '忻州' },
      '349': { province: '山西省', city: '朔州' },
      '471': { province: '内蒙古自治区', city: '呼和浩特' },
      '472': { province: '内蒙古自治区', city: '包头' },
      '473': { province: '内蒙古自治区', city: '乌海' },
      '474': { province: '内蒙古自治区', city: '乌兰察布' },
      '475': { province: '内蒙古自治区', city: '通辽' },
      '476': { province: '内蒙古自治区', city: '赤峰' },
      '477': { province: '内蒙古自治区', city: '鄂尔多斯' },
      '478': { province: '内蒙古自治区', city: '巴彦淖尔' },
      '479': { province: '内蒙古自治区', city: '锡林郭勒' },
      '470': { province: '内蒙古自治区', city: '呼伦贝尔' },
      '482': { province: '内蒙古自治区', city: '兴安盟' },
      '483': { province: '内蒙古自治区', city: '阿拉善' },
      '24': { province: '辽宁省', city: '沈阳/抚顺/铁岭' },
      '411': { province: '辽宁省', city: '大连' },
      '412': { province: '辽宁省', city: '鞍山' },
      '413': { province: '辽宁省', city: '抚顺' },
      '414': { province: '辽宁省', city: '本溪' },
      '415': { province: '辽宁省', city: '丹东' },
      '416': { province: '辽宁省', city: '锦州' },
      '417': { province: '辽宁省', city: '营口' },
      '418': { province: '辽宁省', city: '阜新' },
      '419': { province: '辽宁省', city: '辽阳' },
      '421': { province: '辽宁省', city: '朝阳' },
      '427': { province: '辽宁省', city: '盘锦' },
      '429': { province: '辽宁省', city: '葫芦岛' },
      '431': { province: '吉林省', city: '长春' },
      '432': { province: '吉林省', city: '吉林' },
      '433': { province: '吉林省', city: '延边' },
      '434': { province: '吉林省', city: '四平' },
      '435': { province: '吉林省', city: '通化' },
      '436': { province: '吉林省', city: '白城' },
      '437': { province: '吉林省', city: '辽源' },
      '438': { province: '吉林省', city: '松原' },
      '439': { province: '吉林省', city: '白山' },
      '451': { province: '黑龙江省', city: '哈尔滨' },
      '452': { province: '黑龙江省', city: '齐齐哈尔' },
      '453': { province: '黑龙江省', city: '牡丹江' },
      '454': { province: '黑龙江省', city: '佳木斯' },
      '455': { province: '黑龙江省', city: '绥化' },
      '456': { province: '黑龙江省', city: '黑河' },
      '457': { province: '黑龙江省', city: '大兴安岭' },
      '458': { province: '黑龙江省', city: '伊春' },
      '459': { province: '黑龙江省', city: '大庆' },
      '464': { province: '黑龙江省', city: '七台河' },
      '467': { province: '黑龙江省', city: '鸡西' },
      '468': { province: '黑龙江省', city: '鹤岗' },
      '469': { province: '黑龙江省', city: '双鸭山' },
      '25': { province: '江苏省', city: '南京' },
      '510': { province: '江苏省', city: '无锡' },
      '511': { province: '江苏省', city: '镇江' },
      '512': { province: '江苏省', city: '苏州' },
      '513': { province: '江苏省', city: '南通' },
      '514': { province: '江苏省', city: '扬州' },
      '515': { province: '江苏省', city: '盐城' },
      '516': { province: '江苏省', city: '徐州' },
      '517': { province: '江苏省', city: '淮安' },
      '518': { province: '江苏省', city: '连云港' },
      '519': { province: '江苏省', city: '常州' },
      '523': { province: '江苏省', city: '泰州' },
      '527': { province: '江苏省', city: '宿迁' },
      '571': { province: '浙江省', city: '杭州' },
      '572': { province: '浙江省', city: '湖州' },
      '573': { province: '浙江省', city: '嘉兴' },
      '574': { province: '浙江省', city: '宁波' },
      '575': { province: '浙江省', city: '绍兴' },
      '576': { province: '浙江省', city: '台州' },
      '577': { province: '浙江省', city: '温州' },
      '578': { province: '浙江省', city: '丽水' },
      '579': { province: '浙江省', city: '金华' },
      '580': { province: '浙江省', city: '舟山' },
      '570': { province: '浙江省', city: '衢州' },
      '551': { province: '安徽省', city: '合肥' },
      '552': { province: '安徽省', city: '蚌埠' },
      '553': { province: '安徽省', city: '芜湖' },
      '554': { province: '安徽省', city: '淮南' },
      '555': { province: '安徽省', city: '马鞍山' },
      '556': { province: '安徽省', city: '安庆' },
      '557': { province: '安徽省', city: '宿州' },
      '558': { province: '安徽省', city: '阜阳' },
      '559': { province: '安徽省', city: '黄山' },
      '550': { province: '安徽省', city: '滁州' },
      '561': { province: '安徽省', city: '淮北' },
      '562': { province: '安徽省', city: '铜陵' },
      '563': { province: '安徽省', city: '宣城' },
      '564': { province: '安徽省', city: '六安' },
      '566': { province: '安徽省', city: '池州' },
      '591': { province: '福建省', city: '福州' },
      '592': { province: '福建省', city: '厦门' },
      '593': { province: '福建省', city: '宁德' },
      '594': { province: '福建省', city: '莆田' },
      '595': { province: '福建省', city: '泉州' },
      '596': { province: '福建省', city: '漳州' },
      '597': { province: '福建省', city: '龙岩' },
      '598': { province: '福建省', city: '三明' },
      '599': { province: '福建省', city: '南平' },
      '791': { province: '江西省', city: '南昌' },
      '792': { province: '江西省', city: '九江' },
      '793': { province: '江西省', city: '上饶' },
      '794': { province: '江西省', city: '抚州' },
      '795': { province: '江西省', city: '宜春' },
      '796': { province: '江西省', city: '吉安' },
      '797': { province: '江西省', city: '赣州' },
      '798': { province: '江西省', city: '景德镇' },
      '799': { province: '江西省', city: '萍乡' },
      '701': { province: '江西省', city: '鹰潭' },
      '790': { province: '江西省', city: '新余' },
      '531': { province: '山东省', city: '济南' },
      '532': { province: '山东省', city: '青岛' },
      '533': { province: '山东省', city: '淄博' },
      '534': { province: '山东省', city: '德州' },
      '535': { province: '山东省', city: '烟台' },
      '536': { province: '山东省', city: '潍坊' },
      '537': { province: '山东省', city: '济宁' },
      '538': { province: '山东省', city: '泰安' },
      '539': { province: '山东省', city: '临沂' },
      '530': { province: '山东省', city: '菏泽' },
      '543': { province: '山东省', city: '滨州' },
      '546': { province: '山东省', city: '东营' },
      '631': { province: '山东省', city: '威海' },
      '632': { province: '山东省', city: '枣庄' },
      '633': { province: '山东省', city: '日照' },
      '634': { province: '山东省', city: '莱芜' },
      '635': { province: '山东省', city: '聊城' },
      '371': { province: '河南省', city: '郑州' },
      '372': { province: '河南省', city: '安阳' },
      '373': { province: '河南省', city: '新乡' },
      '374': { province: '河南省', city: '许昌' },
      '375': { province: '河南省', city: '平顶山' },
      '376': { province: '河南省', city: '信阳' },
      '377': { province: '河南省', city: '南阳' },
      '378': { province: '河南省', city: '开封' },
      '379': { province: '河南省', city: '洛阳' },
      '370': { province: '河南省', city: '商丘' },
      '391': { province: '河南省', city: '焦作' },
      '392': { province: '河南省', city: '鹤壁' },
      '393': { province: '河南省', city: '濮阳' },
      '394': { province: '河南省', city: '周口' },
      '395': { province: '河南省', city: '漯河' },
      '396': { province: '河南省', city: '驻马店' },
      '398': { province: '河南省', city: '三门峡' },
      '27': { province: '湖北省', city: '武汉' },
      '710': { province: '湖北省', city: '襄阳' },
      '711': { province: '湖北省', city: '鄂州' },
      '712': { province: '湖北省', city: '孝感' },
      '713': { province: '湖北省', city: '黄冈' },
      '714': { province: '湖北省', city: '黄石' },
      '715': { province: '湖北省', city: '咸宁' },
      '716': { province: '湖北省', city: '荆州' },
      '717': { province: '湖北省', city: '宜昌' },
      '718': { province: '湖北省', city: '恩施' },
      '719': { province: '湖北省', city: '十堰' },
      '722': { province: '湖北省', city: '随州' },
      '724': { province: '湖北省', city: '荆门' },
      '728': { province: '湖北省', city: '仙桃/天门/潜江' },
      '731': { province: '湖南省', city: '长沙/株洲/湘潭' },
      '730': { province: '湖南省', city: '岳阳' },
      '734': { province: '湖南省', city: '衡阳' },
      '735': { province: '湖南省', city: '郴州' },
      '736': { province: '湖南省', city: '常德' },
      '737': { province: '湖南省', city: '益阳' },
      '738': { province: '湖南省', city: '娄底' },
      '739': { province: '湖南省', city: '邵阳' },
      '743': { province: '湖南省', city: '湘西' },
      '744': { province: '湖南省', city: '张家界' },
      '745': { province: '湖南省', city: '怀化' },
      '746': { province: '湖南省', city: '永州' },
      '20': { province: '广东省', city: '广州' },
      '751': { province: '广东省', city: '韶关' },
      '752': { province: '广东省', city: '惠州' },
      '753': { province: '广东省', city: '梅州' },
      '754': { province: '广东省', city: '汕头' },
      '755': { province: '广东省', city: '深圳' },
      '756': { province: '广东省', city: '珠海' },
      '757': { province: '广东省', city: '佛山' },
      '758': { province: '广东省', city: '肇庆' },
      '759': { province: '广东省', city: '湛江' },
      '760': { province: '广东省', city: '中山' },
      '762': { province: '广东省', city: '河源' },
      '763': { province: '广东省', city: '清远' },
      '768': { province: '广东省', city: '潮州' },
      '769': { province: '广东省', city: '东莞' },
      '750': { province: '广东省', city: '江门' },
      '662': { province: '广东省', city: '阳江' },
      '663': { province: '广东省', city: '揭阳' },
      '668': { province: '广东省', city: '茂名' },
      '660': { province: '广东省', city: '汕尾' },
      '771': { province: '广西壮族自治区', city: '南宁' },
      '772': { province: '广西壮族自治区', city: '柳州' },
      '773': { province: '广西壮族自治区', city: '桂林' },
      '774': { province: '广西壮族自治区', city: '梧州' },
      '775': { province: '广西壮族自治区', city: '贵港' },
      '776': { province: '广西壮族自治区', city: '百色' },
      '777': { province: '广西壮族自治区', city: '钦州' },
      '778': { province: '广西壮族自治区', city: '河池' },
      '779': { province: '广西壮族自治区', city: '北海' },
      '770': { province: '广西壮族自治区', city: '防城港' },
      '898': { province: '海南省', city: '海口/三亚/三沙' },
      '28': { province: '四川省', city: '成都/眉山/资阳' },
      '812': { province: '四川省', city: '攀枝花' },
      '813': { province: '四川省', city: '自贡' },
      '816': { province: '四川省', city: '绵阳' },
      '817': { province: '四川省', city: '南充' },
      '818': { province: '四川省', city: '达州' },
      '825': { province: '四川省', city: '遂宁' },
      '826': { province: '四川省', city: '广安' },
      '827': { province: '四川省', city: '巴中' },
      '830': { province: '四川省', city: '泸州' },
      '831': { province: '四川省', city: '宜宾' },
      '832': { province: '四川省', city: '内江' },
      '833': { province: '四川省', city: '乐山' },
      '834': { province: '四川省', city: '凉山' },
      '835': { province: '四川省', city: '雅安' },
      '836': { province: '四川省', city: '甘孜' },
      '837': { province: '四川省', city: '阿坝' },
      '838': { province: '四川省', city: '德阳' },
      '839': { province: '四川省', city: '广元' },
      '851': { province: '贵州省', city: '贵阳/安顺' },
      '852': { province: '贵州省', city: '遵义' },
      '853': { province: '贵州省', city: '安顺' },
      '854': { province: '贵州省', city: '黔南' },
      '855': { province: '贵州省', city: '黔东南' },
      '856': { province: '贵州省', city: '铜仁' },
      '857': { province: '贵州省', city: '毕节' },
      '858': { province: '贵州省', city: '六盘水' },
      '859': { province: '贵州省', city: '黔西南' },
      '871': { province: '云南省', city: '昆明' },
      '872': { province: '云南省', city: '大理' },
      '873': { province: '云南省', city: '红河' },
      '874': { province: '云南省', city: '曲靖' },
      '875': { province: '云南省', city: '保山' },
      '876': { province: '云南省', city: '文山' },
      '877': { province: '云南省', city: '玉溪' },
      '878': { province: '云南省', city: '楚雄' },
      '879': { province: '云南省', city: '普洱' },
      '870': { province: '云南省', city: '昭通' },
      '691': { province: '云南省', city: '西双版纳' },
      '692': { province: '云南省', city: '德宏' },
      '693': { province: '云南省', city: '临沧' },
      '694': { province: '云南省', city: '怒江' },
      '695': { province: '云南省', city: '迪庆' },
      '696': { province: '云南省', city: '丽江' },
      '891': { province: '西藏自治区', city: '拉萨' },
      '892': { province: '西藏自治区', city: '日喀则' },
      '893': { province: '西藏自治区', city: '山南' },
      '894': { province: '西藏自治区', city: '林芝' },
      '895': { province: '西藏自治区', city: '昌都' },
      '896': { province: '西藏自治区', city: '那曲' },
      '897': { province: '西藏自治区', city: '阿里' },
      '29': { province: '陕西省', city: '西安/咸阳' },
      '911': { province: '陕西省', city: '延安' },
      '912': { province: '陕西省', city: '榆林' },
      '913': { province: '陕西省', city: '渭南' },
      '914': { province: '陕西省', city: '商洛' },
      '915': { province: '陕西省', city: '安康' },
      '916': { province: '陕西省', city: '汉中' },
      '917': { province: '陕西省', city: '宝鸡' },
      '919': { province: '陕西省', city: '铜川' },
      '931': { province: '甘肃省', city: '兰州' },
      '932': { province: '甘肃省', city: '定西' },
      '933': { province: '甘肃省', city: '平凉' },
      '934': { province: '甘肃省', city: '庆阳' },
      '935': { province: '甘肃省', city: '武威/金昌' },
      '936': { province: '甘肃省', city: '张掖' },
      '937': { province: '甘肃省', city: '酒泉/嘉峪关' },
      '938': { province: '甘肃省', city: '天水' },
      '939': { province: '甘肃省', city: '陇南' },
      '930': { province: '甘肃省', city: '临夏' },
      '941': { province: '甘肃省', city: '甘南' },
      '943': { province: '甘肃省', city: '白银' },
      '971': { province: '青海省', city: '西宁/海东' },
      '972': { province: '青海省', city: '海东' },
      '973': { province: '青海省', city: '黄南' },
      '974': { province: '青海省', city: '海南' },
      '975': { province: '青海省', city: '果洛' },
      '976': { province: '青海省', city: '玉树' },
      '977': { province: '青海省', city: '海西' },
      '970': { province: '青海省', city: '海北' },
      '951': { province: '宁夏回族自治区', city: '银川' },
      '952': { province: '宁夏回族自治区', city: '石嘴山' },
      '953': { province: '宁夏回族自治区', city: '吴忠' },
      '954': { province: '宁夏回族自治区', city: '固原' },
      '955': { province: '宁夏回族自治区', city: '中卫' },
      '991': { province: '新疆维吾尔自治区', city: '乌鲁木齐' },
      '990': { province: '新疆维吾尔自治区', city: '克拉玛依' },
      '993': { province: '新疆维吾尔自治区', city: '石河子' },
      '994': { province: '新疆维吾尔自治区', city: '昌吉/五家渠' },
      '995': { province: '新疆维吾尔自治区', city: '吐鲁番' },
      '996': { province: '新疆维吾尔自治区', city: '巴音郭楞' },
      '997': { province: '新疆维吾尔自治区', city: '阿克苏' },
      '998': { province: '新疆维吾尔自治区', city: '喀什' },
      '999': { province: '新疆维吾尔自治区', city: '伊犁' },
      '901': { province: '新疆维吾尔自治区', city: '塔城' },
      '902': { province: '新疆维吾尔自治区', city: '哈密' },
      '903': { province: '新疆维吾尔自治区', city: '和田' },
      '906': { province: '新疆维吾尔自治区', city: '阿勒泰' },
      '908': { province: '新疆维吾尔自治区', city: '克孜勒苏' },
      '909': { province: '新疆维吾尔自治区', city: '博尔塔拉' },
    }
    
    const location = areaCodeMap[areaCode]
    if (location) {
      return {
        number: cleaned,
        type: '座机号码',
        name: location.city,
        description: `区号：0${areaCode}，号码：${localNumber}`,
        category: '固定电话',
        province: location.province,
        city: location.city,
        areaCode: `0${areaCode}`
      }
    }
    
    return null
  }

  const searchMobileNumber = async (phone: string): Promise<PhoneInfo | null> => {
    const cleaned = cleanNumber(phone)
    
    // 检查虚拟运营商
    const prefix3 = cleaned.substring(0, 3)
    const virtualOp = virtualOperators.find(v => v.prefix === prefix3)
    
    if (virtualOp) {
      return {
        number: cleaned,
        type: '虚拟运营商',
        name: virtualOp.name,
        description: `号段：${prefix3}，基础运营商：${virtualOp.carriers.join('/')}`,
        category: '移动通信'
      }
    }
    
    // 调用淘宝API查询
    try {
      const response = await axios.get(`https://tcc.taobao.com/cc/json/mobile_tel_segment.htm?tel=${cleaned}`, {
        timeout: 5000
      })
      
      const data = response.data
      const match = data.match(/__GetZoneResult_\s*=\s*({.*?})/)
      
      if (match) {
        const result = JSON.parse(match[1])
        return {
          number: cleaned,
          type: '手机号码',
          name: result.provider || '未知运营商',
          description: `${result.province} ${result.catName}`,
          category: '移动通信',
          province: result.province,
          city: result.catName,
          isp: result.provider,
          areaCode: result.areaCode
        }
      }
    } catch (err) {
      console.error('查询失败:', err)
    }
    
    return null
  }

  const searchPhoneNumber = async () => {
    const phone = phoneInput.trim()

    if (!phone) {
      setError('请输入电话号码')
      setPhoneInfo(null)
      return
    }

    const cleaned = cleanNumber(phone)
    if (cleaned.length < 3) {
      setError('请输入有效的电话号码')
      setPhoneInfo(null)
      return
    }

    setIsLoading(true)
    setError('')
    setPhoneInfo(null)

    const numberType = detectNumberType(cleaned)
    let result: PhoneInfo | null = null

    try {
      switch (numberType) {
        case 'emergency':
        case 'short':
          // 紧急电话或短号码，从服务号码库查询
          result = searchServiceNumber(cleaned)
          // 如果本地没有，尝试百度查询
          if (!result) {
            result = await searchOnlinePhone(cleaned)
          }
          if (!result) {
            result = {
              number: cleaned,
              type: '短号码',
              name: '未知服务号码',
              description: '未在数据库中找到该号码信息',
              category: '其他'
            }
          }
          break

        case 'service':
          // 400/800/95/96服务号码
          result = searchServiceNumber(cleaned)
          // 如果本地没有，尝试在线查询
          if (!result) {
            result = await searchOnlinePhone(cleaned)
          }
          if (!result) {
            result = {
              number: cleaned,
              type: cleaned.startsWith('400') ? '400服务号' :
                     cleaned.startsWith('800') ? '800服务号' :
                     cleaned.startsWith('95') ? '95服务号' : '96服务号',
              name: '企业服务号码',
              description: '企业客服或服务热线',
              category: '企业服务'
            }
          }
          break

        case 'landline':
          // 座机号码
          result = searchLandline(cleaned)
          // 如果本地没有，尝试在线查询
          if (!result) {
            result = await searchOnlinePhone(cleaned)
          }
          if (!result) {
            result = {
              number: cleaned,
              type: '座机号码',
              name: '未知归属地',
              description: '未能识别该座机号码的归属地',
              category: '固定电话'
            }
          }
          break

        case 'mobile':
          // 手机号码
          result = await searchMobileNumber(cleaned)
          // 如果淘宝API没有，尝试在线查询
          if (!result) {
            result = await searchOnlinePhone(cleaned)
          }
          if (!result) {
            result = {
              number: cleaned,
              type: '手机号码',
              name: '查询失败',
              description: '无法查询该号码信息，请检查号码是否正确',
              category: '移动通信'
            }
          }
          break

        case 'international':
          result = {
            number: cleaned,
            type: '国际号码',
            name: '国际电话',
            description: `国际冠码：00，国家代码：${cleaned.substring(2, 4) || cleaned.substring(2, 5)}`,
            category: '国际通信'
          }
          break

        default:
          // 未知类型，尝试在线查询
          result = await searchOnlinePhone(cleaned)
          if (!result) {
            setError('无法识别该号码类型，请检查输入')
            setIsLoading(false)
            return
          }
      }

      if (result) {
        setPhoneInfo(result)
      } else {
        setError('未能查询到该号码信息')
      }
    } catch (err) {
      console.error('查询失败:', err)
      setError('查询失败，请稍后重试')
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      searchPhoneNumber()
    }
  }

  const getTypeIcon = (type: string) => {
    if (type.includes('银行')) return <Landmark className="h-5 w-5" />
    if (type.includes('手机') || type.includes('虚拟')) return <Smartphone className="h-5 w-5" />
    return <Building2 className="h-5 w-5" />
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2 text-slate-700 dark:text-slate-200">
          <Phone className="h-6 w-6 text-slate-600 dark:text-slate-300" />
          电话号码查询
        </h1>
        <p className="text-sm text-muted-foreground text-slate-600 dark:text-slate-400">
          查询手机、座机、银行客服、企业热线等各类电话号码信息
        </p>
      </div>

      <Card className="bg-white dark:bg-slate-950/60 backdrop-blur-xl border-slate-200 dark:border-slate-700/60 dark:shadow-2xl dark:shadow-black/40 relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/10 before:to-transparent before:opacity-0 dark:before:opacity-100 before:pointer-events-none">
        <CardHeader className="pb-3 relative">
          <CardTitle className="text-base text-slate-700 dark:text-slate-200">号码查询</CardTitle>
          <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
            支持手机号、座机、银行客服（955xx）、400/800服务号等
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 relative">
          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                type="text"
                value={phoneInput}
                onChange={(e) => setPhoneInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="输入电话号码，如：13800138000、01012345678、95588"
                className="font-mono text-sm h-10"
              />
            </div>
            <Button
              onClick={searchPhoneNumber}
              disabled={isLoading}
              className="h-10 px-4 bg-gradient-to-br from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
              <span className="ml-2">查询</span>
            </Button>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {phoneInfo && !isLoading && (
            <div className="space-y-2">
              <div className="p-4 rounded-lg bg-gradient-to-br from-sky-50 to-blue-50 dark:from-slate-800/50 dark:to-slate-900/50 border border-sky-200 dark:border-slate-700">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-sky-500 to-blue-600 text-white">
                    {getTypeIcon(phoneInfo.type)}
                  </div>
                  <div>
                    <p className="text-lg font-bold text-slate-900 dark:text-slate-100">{phoneInfo.name}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{phoneInfo.type}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground text-slate-600 dark:text-slate-400">号码</p>
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100 font-mono">{phoneInfo.number}</p>
                  </div>
                  
                  {phoneInfo.category && (
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground text-slate-600 dark:text-slate-400">分类</p>
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{phoneInfo.category}</p>
                    </div>
                  )}
                  
                  {phoneInfo.province && (
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground text-slate-600 dark:text-slate-400">省份</p>
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{phoneInfo.province}</p>
                    </div>
                  )}
                  
                  {phoneInfo.city && (
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground text-slate-600 dark:text-slate-400">城市</p>
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{phoneInfo.city}</p>
                    </div>
                  )}
                  
                  {phoneInfo.isp && (
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground text-slate-600 dark:text-slate-400">运营商</p>
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{phoneInfo.isp}</p>
                    </div>
                  )}
                  
                  {phoneInfo.areaCode && (
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground text-slate-600 dark:text-slate-400">区号</p>
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{phoneInfo.areaCode}</p>
                    </div>
                  )}
                </div>
                
                {phoneInfo.description && (
                  <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700">
                    <p className="text-xs text-muted-foreground text-slate-600 dark:text-slate-400">详细信息</p>
                    <p className="text-sm text-slate-700 dark:text-slate-300 mt-1">{phoneInfo.description}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-sky-50 to-blue-50 dark:from-slate-800/30 dark:to-slate-900/30 border border-sky-200 dark:border-slate-700/60">
        <CardContent className="py-3">
          <p className="text-xs text-slate-600 dark:text-slate-400">
            <strong className="text-slate-700 dark:text-slate-300">支持查询：</strong>
            手机号码（11位）、座机（区号+号码）、银行客服（如95588）、400/800服务号、95/96短号、紧急电话等
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
