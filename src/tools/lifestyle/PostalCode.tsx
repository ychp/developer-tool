import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { MapPin, Search, ArrowRightLeft, Loader2 } from 'lucide-react'
import axios from 'axios'

interface PostalCodeInfo {
  province: string
  city: string
  district: string
  code: string
}

export function PostalCode() {
  const [searchInput, setSearchInput] = useState('')
  const [searchMode, setSearchMode] = useState<'area' | 'code'>('area')
  const [postalInfo, setPostalInfo] = useState<PostalCodeInfo[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const validatePostalCode = (code: string): boolean => {
    return /^\d{6}$/.test(code)
  }

  const searchPostal = async () => {
    const input = searchInput.trim()
    
    if (!input) {
      setError('请输入地区名称或邮编')
      setPostalInfo([])
      return
    }

    if (searchMode === 'code' && !validatePostalCode(input)) {
      setError('请输入正确的6位邮编')
      setPostalInfo([])
      return
    }

    setIsLoading(true)
    setError('')
    setPostalInfo([])

    try {
      let results: PostalCodeInfo[] = []

      if (searchMode === 'code') {
        const response = await axios.get(`https://tools.mhtcms.com/Api/Postcode`, {
          params: { code: input },
          timeout: 5000
        })
        
        if (response.data && response.data.code === 200 && response.data.data) {
          const data = response.data.data
          if (typeof data === 'object' && data !== null) {
            results = [{
              province: (data as { province?: string }).province || '',
              city: (data as { city?: string }).city || '',
              district: (data as { area?: string }).area || '',
              code: input
            }]
          }
        }
      } else {
        const response = await axios.get(`https://tools.mhtcms.com/Api/Postcode`, {
          params: { area: input },
          timeout: 5000
        })
        
        if (response.data && response.data.code === 200 && response.data.data) {
          const data = response.data.data
          if (Array.isArray(data)) {
            results = data.map((item: { province?: string; city?: string; area?: string; code?: string }) => ({
              province: item.province || '',
              city: item.city || '',
              district: item.area || '',
              code: item.code || ''
            }))
          } else if (typeof data === 'object') {
            results = [{
              province: data.province || '',
              city: data.city || '',
              district: data.area || '',
              code: data.code || ''
            }]
          }
        }
      }

      if (results.length === 0) {
        setError('未查询到相关信息')
      } else {
        setPostalInfo(results)
      }
    } catch (err) {
      console.error('查询失败:', err)
      
      const fallbackResults = searchByLocalData(input, searchMode)
      if (fallbackResults.length > 0) {
        setPostalInfo(fallbackResults)
      } else {
        setError('查询失败，请稍后重试')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const searchByLocalData = (input: string, mode: 'area' | 'code'): PostalCodeInfo[] => {
    const postalCodeDatabase: PostalCodeInfo[] = [
      { province: '北京市', city: '北京市', district: '东城区', code: '100010' },
      { province: '北京市', city: '北京市', district: '西城区', code: '100032' },
      { province: '北京市', city: '北京市', district: '朝阳区', code: '100020' },
      { province: '北京市', city: '北京市', district: '海淀区', code: '100080' },
      { province: '北京市', city: '北京市', district: '丰台区', code: '100071' },
      { province: '北京市', city: '北京市', district: '石景山区', code: '100043' },
      { province: '北京市', city: '北京市', district: '通州区', code: '101100' },
      { province: '北京市', city: '北京市', district: '顺义区', code: '101300' },
      { province: '北京市', city: '北京市', district: '大兴区', code: '102600' },
      { province: '北京市', city: '北京市', district: '昌平区', code: '102200' },
      { province: '上海市', city: '上海市', district: '黄浦区', code: '200001' },
      { province: '上海市', city: '上海市', district: '徐汇区', code: '200030' },
      { province: '上海市', city: '上海市', district: '长宁区', code: '200050' },
      { province: '上海市', city: '上海市', district: '静安区', code: '200040' },
      { province: '上海市', city: '上海市', district: '普陀区', code: '200333' },
      { province: '上海市', city: '上海市', district: '虹口区', code: '200080' },
      { province: '上海市', city: '上海市', district: '杨浦区', code: '200082' },
      { province: '上海市', city: '上海市', district: '浦东新区', code: '200120' },
      { province: '上海市', city: '上海市', district: '闵行区', code: '201100' },
      { province: '上海市', city: '上海市', district: '宝山区', code: '201900' },
      { province: '上海市', city: '上海市', district: '嘉定区', code: '201800' },
      { province: '上海市', city: '上海市', district: '松江区', code: '201600' },
      { province: '上海市', city: '上海市', district: '青浦区', code: '201700' },
      { province: '上海市', city: '上海市', district: '奉贤区', code: '201400' },
      { province: '上海市', city: '上海市', district: '金山区', code: '201500' },
      { province: '上海市', city: '上海市', district: '崇明区', code: '202150' },
      { province: '浙江省', city: '杭州市', district: '上城区', code: '310002' },
      { province: '浙江省', city: '杭州市', district: '拱墅区', code: '310011' },
      { province: '浙江省', city: '杭州市', district: '西湖区', code: '310013' },
      { province: '浙江省', city: '杭州市', district: '滨江区', code: '310051' },
      { province: '浙江省', city: '杭州市', district: '萧山区', code: '311200' },
      { province: '浙江省', city: '杭州市', district: '余杭区', code: '311100' },
      { province: '浙江省', city: '杭州市', district: '临平区', code: '311100' },
      { province: '浙江省', city: '杭州市', district: '钱塘区', code: '310018' },
      { province: '浙江省', city: '杭州市', district: '富阳区', code: '311400' },
      { province: '浙江省', city: '杭州市', district: '临安区', code: '311300' },
      { province: '浙江省', city: '杭州市', district: '建德市', code: '311600' },
      { province: '浙江省', city: '杭州市', district: '淳安县', code: '311700' },
      { province: '浙江省', city: '杭州市', district: '桐庐县', code: '311500' },
      { province: '浙江省', city: '宁波市', district: '海曙区', code: '315000' },
      { province: '浙江省', city: '宁波市', district: '江北区', code: '315020' },
      { province: '浙江省', city: '宁波市', district: '北仑区', code: '315800' },
      { province: '浙江省', city: '宁波市', district: '镇海区', code: '315200' },
      { province: '浙江省', city: '宁波市', district: '鄞州区', code: '315100' },
      { province: '浙江省', city: '宁波市', district: '奉化区', code: '315500' },
      { province: '浙江省', city: '宁波市', district: '余姚市', code: '315400' },
      { province: '浙江省', city: '宁波市', district: '慈溪市', code: '315300' },
      { province: '浙江省', city: '宁波市', district: '象山县', code: '315700' },
      { province: '浙江省', city: '宁波市', district: '宁海县', code: '315600' },
      { province: '浙江省', city: '温州市', district: '鹿城区', code: '325000' },
      { province: '浙江省', city: '温州市', district: '龙湾区', code: '325013' },
      { province: '浙江省', city: '温州市', district: '瓯海区', code: '325005' },
      { province: '浙江省', city: '温州市', district: '洞头区', code: '325700' },
      { province: '浙江省', city: '温州市', district: '瑞安市', code: '325200' },
      { province: '浙江省', city: '温州市', district: '乐清市', code: '325600' },
      { province: '浙江省', city: '温州市', district: '永嘉县', code: '325100' },
      { province: '浙江省', city: '温州市', district: '平阳县', code: '325400' },
      { province: '浙江省', city: '温州市', district: '苍南县', code: '325800' },
      { province: '浙江省', city: '温州市', district: '文成县', code: '325300' },
      { province: '浙江省', city: '温州市', district: '泰顺县', code: '325500' },
      { province: '浙江省', city: '嘉兴市', district: '南湖区', code: '314000' },
      { province: '浙江省', city: '嘉兴市', district: '秀洲区', code: '314031' },
      { province: '浙江省', city: '嘉兴市', district: '嘉善县', code: '314100' },
      { province: '浙江省', city: '嘉兴市', district: '海盐县', code: '314300' },
      { province: '浙江省', city: '嘉兴市', district: '海宁市', code: '314400' },
      { province: '浙江省', city: '嘉兴市', district: '平湖市', code: '314200' },
      { province: '浙江省', city: '嘉兴市', district: '桐乡市', code: '314500' },
      { province: '浙江省', city: '湖州市', district: '吴兴区', code: '313000' },
      { province: '浙江省', city: '湖州市', district: '南浔区', code: '313009' },
      { province: '浙江省', city: '湖州市', district: '德清县', code: '313200' },
      { province: '浙江省', city: '湖州市', district: '长兴县', code: '313100' },
      { province: '浙江省', city: '湖州市', district: '安吉县', code: '313300' },
      { province: '浙江省', city: '绍兴市', district: '越城区', code: '312000' },
      { province: '浙江省', city: '绍兴市', district: '柯桥区', code: '312030' },
      { province: '浙江省', city: '绍兴市', district: '上虞区', code: '312300' },
      { province: '浙江省', city: '绍兴市', district: '诸暨市', code: '311800' },
      { province: '浙江省', city: '绍兴市', district: '嵊州市', code: '312400' },
      { province: '浙江省', city: '绍兴市', district: '新昌县', code: '312500' },
      { province: '浙江省', city: '金华市', district: '婺城区', code: '321000' },
      { province: '浙江省', city: '金华市', district: '金东区', code: '321015' },
      { province: '浙江省', city: '金华市', district: '兰溪市', code: '321100' },
      { province: '浙江省', city: '金华市', district: '义乌市', code: '322000' },
      { province: '浙江省', city: '金华市', district: '东阳市', code: '322100' },
      { province: '浙江省', city: '金华市', district: '永康市', code: '321300' },
      { province: '浙江省', city: '金华市', district: '武义县', code: '321200' },
      { province: '浙江省', city: '金华市', district: '浦江县', code: '322200' },
      { province: '浙江省', city: '金华市', district: '磐安县', code: '322300' },
      { province: '浙江省', city: '衢州市', district: '柯城区', code: '324000' },
      { province: '浙江省', city: '衢州市', district: '衢江区', code: '324022' },
      { province: '浙江省', city: '衢州市', district: '江山市', code: '324100' },
      { province: '浙江省', city: '衢州市', district: '常山县', code: '324200' },
      { province: '浙江省', city: '衢州市', district: '开化县', code: '324300' },
      { province: '浙江省', city: '衢州市', district: '龙游县', code: '324400' },
      { province: '浙江省', city: '舟山市', district: '定海区', code: '316000' },
      { province: '浙江省', city: '舟山市', district: '普陀区', code: '316100' },
      { province: '浙江省', city: '舟山市', district: '岱山县', code: '316200' },
      { province: '浙江省', city: '舟山市', district: '嵊泗县', code: '202450' },
      { province: '浙江省', city: '台州市', district: '椒江区', code: '318000' },
      { province: '浙江省', city: '台州市', district: '黄岩区', code: '318020' },
      { province: '浙江省', city: '台州市', district: '路桥区', code: '318050' },
      { province: '浙江省', city: '台州市', district: '临海市', code: '317000' },
      { province: '浙江省', city: '台州市', district: '温岭市', code: '317500' },
      { province: '浙江省', city: '台州市', district: '玉环市', code: '317600' },
      { province: '浙江省', city: '台州市', district: '天台县', code: '317200' },
      { province: '浙江省', city: '台州市', district: '仙居县', code: '317300' },
      { province: '浙江省', city: '台州市', district: '三门县', code: '317100' },
      { province: '浙江省', city: '丽水市', district: '莲都区', code: '323000' },
      { province: '浙江省', city: '丽水市', district: '龙泉市', code: '323700' },
      { province: '浙江省', city: '丽水市', district: '青田县', code: '323900' },
      { province: '浙江省', city: '丽水市', district: '缙云县', code: '321400' },
      { province: '浙江省', city: '丽水市', district: '遂昌县', code: '323300' },
      { province: '浙江省', city: '丽水市', district: '松阳县', code: '323400' },
      { province: '浙江省', city: '丽水市', district: '云和县', code: '323600' },
      { province: '浙江省', city: '丽水市', district: '庆元县', code: '323800' },
      { province: '浙江省', city: '丽水市', district: '景宁县', code: '323500' },
      { province: '江苏省', city: '南京市', district: '玄武区', code: '210018' },
      { province: '江苏省', city: '南京市', district: '秦淮区', code: '210002' },
      { province: '江苏省', city: '南京市', district: '建邺区', code: '210004' },
      { province: '江苏省', city: '南京市', district: '鼓楼区', code: '210008' },
      { province: '江苏省', city: '南京市', district: '浦口区', code: '211800' },
      { province: '江苏省', city: '南京市', district: '栖霞区', code: '210046' },
      { province: '江苏省', city: '南京市', district: '雨花台区', code: '210012' },
      { province: '江苏省', city: '南京市', district: '江宁区', code: '211100' },
      { province: '江苏省', city: '南京市', district: '六合区', code: '211500' },
      { province: '江苏省', city: '南京市', district: '溧水区', code: '211200' },
      { province: '江苏省', city: '南京市', district: '高淳区', code: '211300' },
      { province: '江苏省', city: '无锡市', district: '锡山区', code: '214101' },
      { province: '江苏省', city: '无锡市', district: '惠山区', code: '214174' },
      { province: '江苏省', city: '无锡市', district: '滨湖区', code: '214071' },
      { province: '江苏省', city: '无锡市', district: '梁溪区', code: '214000' },
      { province: '江苏省', city: '无锡市', district: '新吴区', code: '214028' },
      { province: '江苏省', city: '无锡市', district: '江阴市', code: '214400' },
      { province: '江苏省', city: '无锡市', district: '宜兴市', code: '214200' },
      { province: '江苏省', city: '徐州市', district: '云龙区', code: '221009' },
      { province: '江苏省', city: '徐州市', district: '鼓楼区', code: '221005' },
      { province: '江苏省', city: '徐州市', district: '泉山区', code: '221006' },
      { province: '江苏省', city: '徐州市', district: '贾汪区', code: '221011' },
      { province: '江苏省', city: '徐州市', district: '铜山区', code: '221106' },
      { province: '江苏省', city: '徐州市', district: '丰县', code: '221700' },
      { province: '江苏省', city: '徐州市', district: '沛县', code: '221600' },
      { province: '江苏省', city: '徐州市', district: '睢宁县', code: '221200' },
      { province: '江苏省', city: '徐州市', district: '新沂市', code: '221400' },
      { province: '江苏省', city: '徐州市', district: '邳州市', code: '221300' },
      { province: '江苏省', city: '常州市', district: '天宁区', code: '213000' },
      { province: '江苏省', city: '常州市', district: '钟楼区', code: '213002' },
      { province: '江苏省', city: '常州市', district: '新北区', code: '213022' },
      { province: '江苏省', city: '常州市', district: '武进区', code: '213159' },
      { province: '江苏省', city: '常州市', district: '金坛区', code: '213200' },
      { province: '江苏省', city: '常州市', district: '溧阳市', code: '213300' },
      { province: '江苏省', city: '苏州市', district: '虎丘区', code: '215004' },
      { province: '江苏省', city: '苏州市', district: '吴中区', code: '215128' },
      { province: '江苏省', city: '苏州市', district: '相城区', code: '215131' },
      { province: '江苏省', city: '苏州市', district: '姑苏区', code: '215031' },
      { province: '江苏省', city: '苏州市', district: '吴江区', code: '215200' },
      { province: '江苏省', city: '苏州市', district: '常熟市', code: '215500' },
      { province: '江苏省', city: '苏州市', district: '张家港市', code: '215600' },
      { province: '江苏省', city: '苏州市', district: '昆山市', code: '215300' },
      { province: '江苏省', city: '苏州市', district: '太仓市', code: '215400' },
      { province: '江苏省', city: '南通市', district: '崇川区', code: '226001' },
      { province: '江苏省', city: '南通市', district: '港闸区', code: '226005' },
      { province: '江苏省', city: '南通市', district: '通州区', code: '226300' },
      { province: '江苏省', city: '南通市', district: '海安市', code: '226600' },
      { province: '江苏省', city: '南通市', district: '如东县', code: '226400' },
      { province: '江苏省', city: '南通市', district: '启东市', code: '226200' },
      { province: '江苏省', city: '南通市', district: '如皋市', code: '226500' },
      { province: '江苏省', city: '南通市', district: '海门区', code: '226100' },
      { province: '江苏省', city: '连云港市', district: '连云区', code: '222042' },
      { province: '江苏省', city: '连云港市', district: '海州区', code: '222003' },
      { province: '江苏省', city: '连云港市', district: '赣榆区', code: '222100' },
      { province: '江苏省', city: '连云港市', district: '东海县', code: '222300' },
      { province: '江苏省', city: '连云港市', district: '灌云县', code: '222200' },
      { province: '江苏省', city: '连云港市', district: '灌南县', code: '222500' },
      { province: '江苏省', city: '淮安市', district: '淮安区', code: '223200' },
      { province: '江苏省', city: '淮安市', district: '淮阴区', code: '223300' },
      { province: '江苏省', city: '淮安市', district: '清江浦区', code: '223001' },
      { province: '江苏省', city: '淮安市', district: '洪泽区', code: '223100' },
      { province: '江苏省', city: '淮安市', district: '涟水县', code: '223400' },
      { province: '江苏省', city: '淮安市', district: '盱眙县', code: '211700' },
      { province: '江苏省', city: '淮安市', district: '金湖县', code: '211600' },
      { province: '江苏省', city: '盐城市', district: '亭湖区', code: '224005' },
      { province: '江苏省', city: '盐城市', district: '盐都区', code: '224055' },
      { province: '江苏省', city: '盐城市', district: '大丰区', code: '224100' },
      { province: '江苏省', city: '盐城市', district: '东台市', code: '224200' },
      { province: '江苏省', city: '盐城市', district: '建湖县', code: '224700' },
      { province: '江苏省', city: '盐城市', district: '射阳县', code: '224300' },
      { province: '江苏省', city: '盐城市', district: '阜宁县', code: '224400' },
      { province: '江苏省', city: '盐城市', district: '滨海县', code: '224500' },
      { province: '江苏省', city: '盐城市', district: '响水县', code: '224600' },
      { province: '江苏省', city: '扬州市', district: '广陵区', code: '225002' },
      { province: '江苏省', city: '扬州市', district: '邗江区', code: '225002' },
      { province: '江苏省', city: '扬州市', district: '江都区', code: '225200' },
      { province: '江苏省', city: '扬州市', district: '宝应县', code: '225800' },
      { province: '江苏省', city: '扬州市', district: '仪征市', code: '211400' },
      { province: '江苏省', city: '扬州市', district: '高邮市', code: '225600' },
      { province: '江苏省', city: '镇江市', district: '京口区', code: '212001' },
      { province: '江苏省', city: '镇江市', district: '润州区', code: '212004' },
      { province: '江苏省', city: '镇江市', district: '丹徒区', code: '212014' },
      { province: '江苏省', city: '镇江市', district: '丹阳市', code: '212300' },
      { province: '江苏省', city: '镇江市', district: '扬中市', code: '212200' },
      { province: '江苏省', city: '镇江市', district: '句容市', code: '212400' },
      { province: '江苏省', city: '泰州市', district: '海陵区', code: '225300' },
      { province: '江苏省', city: '泰州市', district: '高港区', code: '225321' },
      { province: '江苏省', city: '泰州市', district: '姜堰区', code: '225500' },
      { province: '江苏省', city: '泰州市', district: '兴化市', code: '225700' },
      { province: '江苏省', city: '泰州市', district: '靖江市', code: '214500' },
      { province: '江苏省', city: '泰州市', district: '泰兴市', code: '225400' },
      { province: '江苏省', city: '宿迁市', district: '宿城区', code: '223800' },
      { province: '江苏省', city: '宿迁市', district: '宿豫区', code: '223800' },
      { province: '江苏省', city: '宿迁市', district: '沭阳县', code: '223600' },
      { province: '江苏省', city: '宿迁市', district: '泗阳县', code: '223700' },
      { province: '江苏省', city: '宿迁市', district: '泗洪县', code: '223900' },
      { province: '广东省', city: '广州市', district: '荔湾区', code: '510145' },
      { province: '广东省', city: '广州市', district: '越秀区', code: '510030' },
      { province: '广东省', city: '广州市', district: '海珠区', code: '510220' },
      { province: '广东省', city: '广州市', district: '天河区', code: '510630' },
      { province: '广东省', city: '广州市', district: '白云区', code: '510080' },
      { province: '广东省', city: '广州市', district: '黄埔区', code: '510700' },
      { province: '广东省', city: '广州市', district: '番禺区', code: '511400' },
      { province: '广东省', city: '广州市', district: '花都区', code: '510800' },
      { province: '广东省', city: '广州市', district: '南沙区', code: '511458' },
      { province: '广东省', city: '广州市', district: '从化区', code: '510900' },
      { province: '广东省', city: '广州市', district: '增城区', code: '511300' },
      { province: '广东省', city: '深圳市', district: '罗湖区', code: '518001' },
      { province: '广东省', city: '深圳市', district: '福田区', code: '518000' },
      { province: '广东省', city: '深圳市', district: '南山区', code: '518057' },
      { province: '广东省', city: '深圳市', district: '宝安区', code: '518101' },
      { province: '广东省', city: '深圳市', district: '龙岗区', code: '518172' },
      { province: '广东省', city: '深圳市', district: '盐田区', code: '518083' },
      { province: '广东省', city: '深圳市', district: '龙华区', code: '518109' },
      { province: '广东省', city: '深圳市', district: '坪山区', code: '518118' },
      { province: '广东省', city: '深圳市', district: '光明区', code: '518106' },
      { province: '广东省', city: '深圳市', district: '大鹏新区', code: '518120' },
      { province: '广东省', city: '珠海市', district: '香洲区', code: '519000' },
      { province: '广东省', city: '珠海市', district: '斗门区', code: '519100' },
      { province: '广东省', city: '珠海市', district: '金湾区', code: '519040' },
      { province: '广东省', city: '汕头市', district: '龙湖区', code: '515041' },
      { province: '广东省', city: '汕头市', district: '金平区', code: '515041' },
      { province: '广东省', city: '汕头市', district: '濠江区', code: '515071' },
      { province: '广东省', city: '汕头市', district: '潮阳区', code: '515100' },
      { province: '广东省', city: '汕头市', district: '潮南区', code: '515144' },
      { province: '广东省', city: '汕头市', district: '澄海区', code: '515800' },
      { province: '广东省', city: '汕头市', district: '南澳县', code: '515900' },
      { province: '广东省', city: '佛山市', district: '禅城区', code: '528000' },
      { province: '广东省', city: '佛山市', district: '南海区', code: '528200' },
      { province: '广东省', city: '佛山市', district: '顺德区', code: '528300' },
      { province: '广东省', city: '佛山市', district: '三水区', code: '528100' },
      { province: '广东省', city: '佛山市', district: '高明区', code: '528500' },
      { province: '广东省', city: '韶关市', district: '武江区', code: '512026' },
      { province: '广东省', city: '韶关市', district: '浈江区', code: '512023' },
      { province: '广东省', city: '韶关市', district: '曲江区', code: '512100' },
      { province: '广东省', city: '韶关市', district: '始兴县', code: '512500' },
      { province: '广东省', city: '韶关市', district: '仁化县', code: '512300' },
      { province: '广东省', city: '韶关市', district: '翁源县', code: '512600' },
      { province: '广东省', city: '韶关市', district: '乳源县', code: '512700' },
      { province: '广东省', city: '韶关市', district: '新丰县', code: '511100' },
      { province: '广东省', city: '韶关市', district: '乐昌市', code: '512200' },
      { province: '广东省', city: '韶关市', district: '南雄市', code: '512400' },
      { province: '广东省', city: '湛江市', district: '赤坎区', code: '524033' },
      { province: '广东省', city: '湛江市', district: '霞山区', code: '524011' },
      { province: '广东省', city: '湛江市', district: '坡头区', code: '524059' },
      { province: '广东省', city: '湛江市', district: '麻章区', code: '524094' },
      { province: '广东省', city: '湛江市', district: '遂溪县', code: '524300' },
      { province: '广东省', city: '湛江市', district: '徐闻县', code: '524100' },
      { province: '广东省', city: '湛江市', district: '廉江市', code: '524400' },
      { province: '广东省', city: '湛江市', district: '雷州市', code: '524200' },
      { province: '广东省', city: '湛江市', district: '吴川市', code: '524500' },
      { province: '广东省', city: '茂名市', district: '茂南区', code: '525000' },
      { province: '广东省', city: '茂名市', district: '电白区', code: '525400' },
      { province: '广东省', city: '茂名市', district: '高州市', code: '525200' },
      { province: '广东省', city: '茂名市', district: '化州市', code: '525100' },
      { province: '广东省', city: '茂名市', district: '信宜市', code: '525300' },
      { province: '广东省', city: '肇庆市', district: '端州区', code: '526060' },
      { province: '广东省', city: '肇庆市', district: '鼎湖区', code: '526070' },
      { province: '广东省', city: '肇庆市', district: '高要区', code: '526100' },
      { province: '广东省', city: '肇庆市', district: '广宁县', code: '526300' },
      { province: '广东省', city: '肇庆市', district: '怀集县', code: '526400' },
      { province: '广东省', city: '肇庆市', district: '封开县', code: '526500' },
      { province: '广东省', city: '肇庆市', district: '德庆县', code: '526600' },
      { province: '广东省', city: '肇庆市', district: '四会市', code: '526200' },
      { province: '广东省', city: '惠州市', district: '惠城区', code: '516008' },
      { province: '广东省', city: '惠州市', district: '惠阳区', code: '516200' },
      { province: '广东省', city: '惠州市', district: '博罗县', code: '516100' },
      { province: '广东省', city: '惠州市', district: '惠东县', code: '516300' },
      { province: '广东省', city: '惠州市', district: '龙门县', code: '516800' },
      { province: '广东省', city: '梅州市', district: '梅江区', code: '514000' },
      { province: '广东省', city: '梅州市', district: '梅县区', code: '514700' },
      { province: '广东省', city: '梅州市', district: '大埔县', code: '514200' },
      { province: '广东省', city: '梅州市', district: '丰顺县', code: '514300' },
      { province: '广东省', city: '梅州市', district: '五华县', code: '514400' },
      { province: '广东省', city: '梅州市', district: '平远县', code: '514600' },
      { province: '广东省', city: '梅州市', district: '蕉岭县', code: '514100' },
      { province: '广东省', city: '梅州市', district: '兴宁市', code: '514500' },
      { province: '广东省', city: '汕尾市', district: '城区', code: '516600' },
      { province: '广东省', city: '汕尾市', district: '海丰县', code: '516400' },
      { province: '广东省', city: '汕尾市', district: '陆河县', code: '516700' },
      { province: '广东省', city: '汕尾市', district: '陆丰市', code: '516500' },
      { province: '广东省', city: '河源市', district: '源城区', code: '517000' },
      { province: '广东省', city: '河源市', district: '东源县', code: '517500' },
      { province: '广东省', city: '河源市', district: '和平县', code: '517200' },
      { province: '广东省', city: '河源市', district: '龙川县', code: '517300' },
      { province: '广东省', city: '河源市', district: '紫金县', code: '517400' },
      { province: '广东省', city: '河源市', district: '连平县', code: '517100' },
      { province: '广东省', city: '阳江市', district: '江城区', code: '529500' },
      { province: '广东省', city: '阳江市', district: '阳东区', code: '529900' },
      { province: '广东省', city: '阳江市', district: '阳西县', code: '529800' },
      { province: '广东省', city: '阳江市', district: '阳春市', code: '529600' },
      { province: '广东省', city: '清远市', district: '清城区', code: '511500' },
      { province: '广东省', city: '清远市', district: '清新区', code: '511800' },
      { province: '广东省', city: '清远市', district: '佛冈县', code: '511600' },
      { province: '广东省', city: '清远市', district: '阳山县', code: '513100' },
      { province: '广东省', city: '清远市', district: '连山县', code: '513200' },
      { province: '广东省', city: '清远市', district: '连南县', code: '513300' },
      { province: '广东省', city: '清远市', district: '英德市', code: '513000' },
      { province: '广东省', city: '清远市', district: '连州市', code: '513400' },
      { province: '广东省', city: '东莞市', district: '东莞市', code: '523000' },
      { province: '广东省', city: '中山市', district: '中山市', code: '528400' },
      { province: '广东省', city: '潮州市', district: '湘桥区', code: '521000' },
      { province: '广东省', city: '潮州市', district: '潮安区', code: '515600' },
      { province: '广东省', city: '潮州市', district: '饶平县', code: '515700' },
      { province: '广东省', city: '揭阳市', district: '榕城区', code: '522000' },
      { province: '广东省', city: '揭阳市', district: '揭东区', code: '515500' },
      { province: '广东省', city: '揭阳市', district: '揭西县', code: '515400' },
      { province: '广东省', city: '揭阳市', district: '惠来县', code: '515200' },
      { province: '广东省', city: '揭阳市', district: '普宁市', code: '515300' },
      { province: '广东省', city: '云浮市', district: '云城区', code: '527300' },
      { province: '广东省', city: '云浮市', district: '云安区', code: '527500' },
      { province: '广东省', city: '云浮市', district: '新兴县', code: '527400' },
      { province: '广东省', city: '云浮市', district: '郁南县', code: '527100' },
      { province: '广东省', city: '云浮市', district: '罗定市', code: '527200' },
      { province: '四川省', city: '成都市', district: '锦江区', code: '610011' },
      { province: '四川省', city: '成都市', district: '青羊区', code: '610031' },
      { province: '四川省', city: '成都市', district: '金牛区', code: '610036' },
      { province: '四川省', city: '成都市', district: '武侯区', code: '610041' },
      { province: '四川省', city: '成都市', district: '成华区', code: '610051' },
      { province: '四川省', city: '成都市', district: '龙泉驿区', code: '610100' },
      { province: '四川省', city: '成都市', district: '青白江区', code: '610300' },
      { province: '四川省', city: '成都市', district: '新都区', code: '610500' },
      { province: '四川省', city: '成都市', district: '温江区', code: '611130' },
      { province: '四川省', city: '成都市', district: '双流区', code: '610200' },
      { province: '四川省', city: '成都市', district: '郫都区', code: '611730' },
      { province: '四川省', city: '成都市', district: '新津区', code: '611430' },
      { province: '四川省', city: '成都市', district: '都江堰市', code: '611830' },
      { province: '四川省', city: '成都市', district: '彭州市', code: '611930' },
      { province: '四川省', city: '成都市', district: '邛崃市', code: '611530' },
      { province: '四川省', city: '成都市', district: '崇州市', code: '611230' },
      { province: '四川省', city: '成都市', district: '金堂县', code: '610400' },
      { province: '四川省', city: '成都市', district: '大邑县', code: '611330' },
      { province: '四川省', city: '成都市', district: '蒲江县', code: '611630' },
      { province: '四川省', city: '自贡市', district: '自流井区', code: '643000' },
      { province: '四川省', city: '自贡市', district: '贡井区', code: '643020' },
      { province: '四川省', city: '自贡市', district: '大安区', code: '643010' },
      { province: '四川省', city: '自贡市', district: '沿滩区', code: '643030' },
      { province: '四川省', city: '自贡市', district: '荣县', code: '643100' },
      { province: '四川省', city: '自贡市', district: '富顺县', code: '643200' },
      { province: '四川省', city: '攀枝花市', district: '东区', code: '617067' },
      { province: '四川省', city: '攀枝花市', district: '西区', code: '617068' },
      { province: '四川省', city: '攀枝花市', district: '仁和区', code: '617069' },
      { province: '四川省', city: '攀枝花市', district: '米易县', code: '617200' },
      { province: '四川省', city: '攀枝花市', district: '盐边县', code: '617100' },
      { province: '四川省', city: '泸州市', district: '江阳区', code: '646000' },
      { province: '四川省', city: '泸州市', district: '纳溪区', code: '646300' },
      { province: '四川省', city: '泸州市', district: '龙马潭区', code: '646000' },
      { province: '四川省', city: '泸州市', district: '泸县', code: '646100' },
      { province: '四川省', city: '泸州市', district: '合江县', code: '646200' },
      { province: '四川省', city: '泸州市', district: '叙永县', code: '646400' },
      { province: '四川省', city: '泸州市', district: '古蔺县', code: '646500' },
      { province: '四川省', city: '德阳市', district: '旌阳区', code: '618000' },
      { province: '四川省', city: '德阳市', district: '罗江区', code: '618500' },
      { province: '四川省', city: '德阳市', district: '中江县', code: '618100' },
      { province: '四川省', city: '德阳市', district: '广汉市', code: '618300' },
      { province: '四川省', city: '德阳市', district: '什邡市', code: '618400' },
      { province: '四川省', city: '德阳市', district: '绵竹市', code: '618200' },
      { province: '四川省', city: '绵阳市', district: '涪城区', code: '621000' },
      { province: '四川省', city: '绵阳市', district: '游仙区', code: '621022' },
      { province: '四川省', city: '绵阳市', district: '安州区', code: '622651' },
      { province: '四川省', city: '绵阳市', district: '三台县', code: '621100' },
      { province: '四川省', city: '绵阳市', district: '盐亭县', code: '621600' },
      { province: '四川省', city: '绵阳市', district: '梓潼县', code: '622150' },
      { province: '四川省', city: '绵阳市', district: '北川县', code: '622750' },
      { province: '四川省', city: '绵阳市', district: '平武县', code: '622550' },
      { province: '四川省', city: '绵阳市', district: '江油市', code: '621700' },
      { province: '四川省', city: '广元市', district: '利州区', code: '628017' },
      { province: '四川省', city: '广元市', district: '昭化区', code: '628021' },
      { province: '四川省', city: '广元市', district: '朝天区', code: '628012' },
      { province: '四川省', city: '广元市', district: '旺苍县', code: '628200' },
      { province: '四川省', city: '广元市', district: '青川县', code: '628100' },
      { province: '四川省', city: '广元市', district: '剑阁县', code: '628300' },
      { province: '四川省', city: '广元市', district: '苍溪县', code: '628400' },
      { province: '四川省', city: '遂宁市', district: '船山区', code: '629000' },
      { province: '四川省', city: '遂宁市', district: '安居区', code: '629000' },
      { province: '四川省', city: '遂宁市', district: '蓬溪县', code: '629100' },
      { province: '四川省', city: '遂宁市', district: '大英县', code: '629300' },
      { province: '四川省', city: '遂宁市', district: '射洪市', code: '629200' },
      { province: '四川省', city: '内江市', district: '市中区', code: '641000' },
      { province: '四川省', city: '内江市', district: '东兴区', code: '641100' },
      { province: '四川省', city: '内江市', district: '威远县', code: '642450' },
      { province: '四川省', city: '内江市', district: '资中县', code: '641200' },
      { province: '四川省', city: '内江市', district: '隆昌市', code: '642150' },
      { province: '四川省', city: '乐山市', district: '市中区', code: '614000' },
      { province: '四川省', city: '乐山市', district: '沙湾区', code: '614900' },
      { province: '四川省', city: '乐山市', district: '五通桥区', code: '614800' },
      { province: '四川省', city: '乐山市', district: '金口河区', code: '614700' },
      { province: '四川省', city: '乐山市', district: '犍为县', code: '614400' },
      { province: '四川省', city: '乐山市', district: '井研县', code: '613100' },
      { province: '四川省', city: '乐山市', district: '夹江县', code: '614100' },
      { province: '四川省', city: '乐山市', district: '沐川县', code: '614500' },
      { province: '四川省', city: '乐山市', district: '峨边县', code: '614200' },
      { province: '四川省', city: '乐山市', district: '马边县', code: '614600' },
      { province: '四川省', city: '乐山市', district: '峨眉山市', code: '614200' },
      { province: '四川省', city: '南充市', district: '顺庆区', code: '637000' },
      { province: '四川省', city: '南充市', district: '高坪区', code: '637100' },
      { province: '四川省', city: '南充市', district: '嘉陵区', code: '637005' },
      { province: '四川省', city: '南充市', district: '南部县', code: '637300' },
      { province: '四川省', city: '南充市', district: '营山县', code: '637700' },
      { province: '四川省', city: '南充市', district: '蓬安县', code: '637800' },
      { province: '四川省', city: '南充市', district: '仪陇县', code: '637600' },
      { province: '四川省', city: '南充市', district: '西充县', code: '637200' },
      { province: '四川省', city: '南充市', district: '阆中市', code: '637400' },
      { province: '四川省', city: '眉山市', district: '东坡区', code: '620010' },
      { province: '四川省', city: '眉山市', district: '彭山区', code: '620860' },
      { province: '四川省', city: '眉山市', district: '仁寿县', code: '620500' },
      { province: '四川省', city: '眉山市', district: '洪雅县', code: '620300' },
      { province: '四川省', city: '眉山市', district: '丹棱县', code: '620200' },
      { province: '四川省', city: '眉山市', district: '青神县', code: '620400' },
      { province: '四川省', city: '宜宾市', district: '翠屏区', code: '644000' },
      { province: '四川省', city: '宜宾市', district: '南溪区', code: '644100' },
      { province: '四川省', city: '宜宾市', district: '叙州区', code: '644000' },
      { province: '四川省', city: '宜宾市', district: '江安县', code: '644200' },
      { province: '四川省', city: '宜宾市', district: '长宁县', code: '644300' },
      { province: '四川省', city: '宜宾市', district: '高县', code: '645150' },
      { province: '四川省', city: '宜宾市', district: '珙县', code: '644500' },
      { province: '四川省', city: '宜宾市', district: '筠连县', code: '645250' },
      { province: '四川省', city: '宜宾市', district: '兴文县', code: '644400' },
      { province: '四川省', city: '宜宾市', district: '屏山县', code: '645350' },
      { province: '四川省', city: '广安市', district: '广安区', code: '638000' },
      { province: '四川省', city: '广安市', district: '前锋区', code: '638019' },
      { province: '四川省', city: '广安市', district: '岳池县', code: '638300' },
      { province: '四川省', city: '广安市', district: '武胜县', code: '638400' },
      { province: '四川省', city: '广安市', district: '邻水县', code: '638500' },
      { province: '四川省', city: '广安市', district: '华蓥市', code: '638600' },
      { province: '四川省', city: '达州市', district: '通川区', code: '635000' },
      { province: '四川省', city: '达州市', district: '达川区', code: '635000' },
      { province: '四川省', city: '达州市', district: '宣汉县', code: '636150' },
      { province: '四川省', city: '达州市', district: '开江县', code: '636250' },
      { province: '四川省', city: '达州市', district: '大竹县', code: '635100' },
      { province: '四川省', city: '达州市', district: '渠县', code: '635200' },
      { province: '四川省', city: '达州市', district: '万源市', code: '636350' },
      { province: '四川省', city: '雅安市', district: '雨城区', code: '625000' },
      { province: '四川省', city: '雅安市', district: '名山区', code: '625100' },
      { province: '四川省', city: '雅安市', district: '荥经县', code: '625200' },
      { province: '四川省', city: '雅安市', district: '汉源县', code: '625300' },
      { province: '四川省', city: '雅安市', district: '石棉县', code: '625400' },
      { province: '四川省', city: '雅安市', district: '天全县', code: '625500' },
      { province: '四川省', city: '雅安市', district: '芦山县', code: '625600' },
      { province: '四川省', city: '雅安市', district: '宝兴县', code: '625700' },
      { province: '四川省', city: '巴中市', district: '巴州区', code: '636000' },
      { province: '四川省', city: '巴中市', district: '恩阳区', code: '636064' },
      { province: '四川省', city: '巴中市', district: '通江县', code: '636700' },
      { province: '四川省', city: '巴中市', district: '南江县', code: '636600' },
      { province: '四川省', city: '巴中市', district: '平昌县', code: '636400' },
      { province: '四川省', city: '资阳市', district: '雁江区', code: '641300' },
      { province: '四川省', city: '资阳市', district: '安岳县', code: '642350' },
      { province: '四川省', city: '资阳市', district: '乐至县', code: '641500' },
      { province: '四川省', city: '资阳市', district: '简阳市', code: '641400' }
    ]

    if (mode === 'code') {
      return postalCodeDatabase.filter(p => p.code === input)
    } else {
      const lowerInput = input.toLowerCase()
      return postalCodeDatabase.filter(p =>
        p.province.includes(input) ||
        p.city.includes(input) ||
        p.district.includes(input) ||
        p.province.toLowerCase().includes(lowerInput) ||
        p.city.toLowerCase().includes(lowerInput) ||
        p.district.toLowerCase().includes(lowerInput)
      )
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      searchPostal()
    }
  }

  const toggleMode = () => {
    setSearchMode(prev => prev === 'area' ? 'code' : 'area')
    setSearchInput('')
    setPostalInfo([])
    setError('')
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2 text-slate-700 dark:text-slate-200">
          <MapPin className="h-6 w-6 text-slate-600 dark:text-slate-300" />
          邮编查询
        </h1>
        <p className="text-sm text-muted-foreground text-slate-600 dark:text-slate-400">
          查询中国地区的邮政编码，支持地区查邮编和邮编查地区
        </p>
      </div>

      <Card className="bg-white dark:bg-slate-950/60 backdrop-blur-xl border-slate-200 dark:border-slate-700/60 dark:shadow-2xl dark:shadow-black/40 relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/10 before:to-transparent before:opacity-0 dark:before:opacity-100 before:pointer-events-none">
        <CardHeader className="pb-3 relative">
          <CardTitle className="text-base text-slate-700 dark:text-slate-200">邮编查询</CardTitle>
          <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
            {searchMode === 'area' ? '输入地区名称查询邮编' : '输入邮编查询所属地区'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 relative">
          <div className="flex gap-2 items-center">
            <div className="flex-1">
              <Input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder={searchMode === 'area' ? '请输入地区名称（如：北京、上海）' : '请输入6位邮编'}
                className="text-sm h-10"
                maxLength={searchMode === 'code' ? 6 : 50}
              />
            </div>
            <Button
              onClick={toggleMode}
              variant="outline"
              size="icon"
              title="切换查询模式"
              className="h-10 w-10 border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <ArrowRightLeft className="h-4 w-4 text-slate-700 dark:text-slate-300" />
            </Button>
            <Button
              onClick={searchPostal}
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

          {postalInfo.length > 0 && !isLoading && (
            <div className="space-y-2">
              {postalInfo.map((info, index) => (
                <div
                  key={index}
                  className="p-4 rounded-lg bg-gradient-to-br from-sky-50 to-blue-50 dark:from-slate-800/50 dark:to-slate-900/50 border border-sky-200 dark:border-slate-700"
                >
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground text-slate-600 dark:text-slate-400">省份</p>
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{info.province}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground text-slate-600 dark:text-slate-400">城市</p>
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{info.city}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground text-slate-600 dark:text-slate-400">区县</p>
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{info.district}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground text-slate-600 dark:text-slate-400">邮编</p>
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-100 font-mono">{info.code}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-sky-50 to-blue-50 dark:from-slate-800/30 dark:to-slate-900/30 border border-sky-200 dark:border-slate-700/60">
        <CardContent className="py-3">
          <p className="text-xs text-slate-600 dark:text-slate-400">
            <strong className="text-slate-700 dark:text-slate-300">提示：</strong>
            支持按地区名称查询邮编，也支持按邮编查询所属地区。可输入省市名称或完整的行政区划名称
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
