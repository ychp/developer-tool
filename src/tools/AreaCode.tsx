import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PhoneCall, Search, ArrowRightLeft, Loader2 } from 'lucide-react'

interface AreaCodeInfo {
  province: string
  city: string
  code: string
}

const chinaAreaCodes: AreaCodeInfo[] = [
  { province: '北京市', city: '北京', code: '010' },
  { province: '上海市', city: '上海', code: '021' },
  { province: '天津市', city: '天津', code: '022' },
  { province: '重庆市', city: '重庆', code: '023' },
  { province: '河北省', city: '石家庄', code: '0311' },
  { province: '河北省', city: '唐山', code: '0315' },
  { province: '河北省', city: '秦皇岛', code: '0335' },
  { province: '河北省', city: '邯郸', code: '0310' },
  { province: '河北省', city: '邢台', code: '0319' },
  { province: '河北省', city: '保定', code: '0312' },
  { province: '河北省', city: '张家口', code: '0313' },
  { province: '河北省', city: '承德', code: '0314' },
  { province: '河北省', city: '沧州', code: '0317' },
  { province: '河北省', city: '廊坊', code: '0316' },
  { province: '河北省', city: '衡水', code: '0318' },
  { province: '山西省', city: '太原', code: '0351' },
  { province: '山西省', city: '大同', code: '0352' },
  { province: '山西省', city: '阳泉', code: '0353' },
  { province: '山西省', city: '长治', code: '0355' },
  { province: '山西省', city: '晋城', code: '0356' },
  { province: '山西省', city: '朔州', code: '0349' },
  { province: '山西省', city: '晋中', code: '0354' },
  { province: '山西省', city: '运城', code: '0359' },
  { province: '山西省', city: '忻州', code: '0350' },
  { province: '山西省', city: '临汾', code: '0357' },
  { province: '山西省', city: '吕梁', code: '0358' },
  { province: '内蒙古自治区', city: '呼和浩特', code: '0471' },
  { province: '内蒙古自治区', city: '包头', code: '0472' },
  { province: '内蒙古自治区', city: '乌海', code: '0473' },
  { province: '内蒙古自治区', city: '赤峰', code: '0476' },
  { province: '内蒙古自治区', city: '通辽', code: '0475' },
  { province: '内蒙古自治区', city: '鄂尔多斯', code: '0477' },
  { province: '内蒙古自治区', city: '呼伦贝尔', code: '0470' },
  { province: '内蒙古自治区', city: '巴彦淖尔', code: '0478' },
  { province: '内蒙古自治区', city: '乌兰察布', code: '0474' },
  { province: '辽宁省', city: '沈阳', code: '024' },
  { province: '辽宁省', city: '大连', code: '0411' },
  { province: '辽宁省', city: '鞍山', code: '0412' },
  { province: '辽宁省', city: '抚顺', code: '024' },
  { province: '辽宁省', city: '本溪', code: '0414' },
  { province: '辽宁省', city: '丹东', code: '0415' },
  { province: '辽宁省', city: '锦州', code: '0416' },
  { province: '辽宁省', city: '营口', code: '0417' },
  { province: '辽宁省', city: '阜新', code: '0418' },
  { province: '辽宁省', city: '辽阳', code: '0419' },
  { province: '辽宁省', city: '盘锦', code: '0427' },
  { province: '辽宁省', city: '铁岭', code: '024' },
  { province: '辽宁省', city: '朝阳', code: '0421' },
  { province: '辽宁省', city: '葫芦岛', code: '0429' },
  { province: '吉林省', city: '长春', code: '0431' },
  { province: '吉林省', city: '吉林', code: '0432' },
  { province: '吉林省', city: '四平', code: '0434' },
  { province: '吉林省', city: '辽源', code: '0437' },
  { province: '吉林省', city: '通化', code: '0435' },
  { province: '吉林省', city: '白山', code: '0439' },
  { province: '吉林省', city: '松原', code: '0438' },
  { province: '吉林省', city: '白城', code: '0436' },
  { province: '黑龙江省', city: '哈尔滨', code: '0451' },
  { province: '黑龙江省', city: '齐齐哈尔', code: '0452' },
  { province: '黑龙江省', city: '鸡西', code: '0467' },
  { province: '黑龙江省', city: '鹤岗', code: '0468' },
  { province: '黑龙江省', city: '双鸭山', code: '0469' },
  { province: '黑龙江省', city: '大庆', code: '0459' },
  { province: '黑龙江省', city: '伊春', code: '0458' },
  { province: '黑龙江省', city: '佳木斯', code: '0454' },
  { province: '黑龙江省', city: '七台河', code: '0464' },
  { province: '黑龙江省', city: '牡丹江', code: '0453' },
  { province: '黑龙江省', city: '黑河', code: '0456' },
  { province: '黑龙江省', city: '绥化', code: '0455' },
  { province: '江苏省', city: '南京', code: '025' },
  { province: '江苏省', city: '无锡', code: '0510' },
  { province: '江苏省', city: '徐州', code: '0516' },
  { province: '江苏省', city: '常州', code: '0519' },
  { province: '江苏省', city: '苏州', code: '0512' },
  { province: '江苏省', city: '南通', code: '0513' },
  { province: '江苏省', city: '连云港', code: '0518' },
  { province: '江苏省', city: '淮安', code: '0517' },
  { province: '江苏省', city: '盐城', code: '0515' },
  { province: '江苏省', city: '扬州', code: '0514' },
  { province: '江苏省', city: '镇江', code: '0511' },
  { province: '江苏省', city: '泰州', code: '0523' },
  { province: '江苏省', city: '宿迁', code: '0527' },
  { province: '浙江省', city: '杭州', code: '0571' },
  { province: '浙江省', city: '宁波', code: '0574' },
  { province: '浙江省', city: '温州', code: '0577' },
  { province: '浙江省', city: '嘉兴', code: '0573' },
  { province: '浙江省', city: '湖州', code: '0572' },
  { province: '浙江省', city: '绍兴', code: '0575' },
  { province: '浙江省', city: '金华', code: '0579' },
  { province: '浙江省', city: '衢州', code: '0570' },
  { province: '浙江省', city: '舟山', code: '0580' },
  { province: '浙江省', city: '台州', code: '0576' },
  { province: '浙江省', city: '丽水', code: '0578' },
  { province: '安徽省', city: '合肥', code: '0551' },
  { province: '安徽省', city: '芜湖', code: '0553' },
  { province: '安徽省', city: '蚌埠', code: '0552' },
  { province: '安徽省', city: '淮南', code: '0554' },
  { province: '安徽省', city: '马鞍山', code: '0555' },
  { province: '安徽省', city: '淮北', code: '0561' },
  { province: '安徽省', city: '铜陵', code: '0562' },
  { province: '安徽省', city: '安庆', code: '0556' },
  { province: '安徽省', city: '黄山', code: '0559' },
  { province: '安徽省', city: '滁州', code: '0550' },
  { province: '安徽省', city: '阜阳', code: '0558' },
  { province: '安徽省', city: '宿州', code: '0557' },
  { province: '安徽省', city: '六安', code: '0564' },
  { province: '安徽省', city: '亳州', code: '0558' },
  { province: '安徽省', city: '池州', code: '0566' },
  { province: '安徽省', city: '宣城', code: '0563' },
  { province: '福建省', city: '福州', code: '0591' },
  { province: '福建省', city: '厦门', code: '0592' },
  { province: '福建省', city: '莆田', code: '0594' },
  { province: '福建省', city: '三明', code: '0598' },
  { province: '福建省', city: '泉州', code: '0595' },
  { province: '福建省', city: '漳州', code: '0596' },
  { province: '福建省', city: '南平', code: '0599' },
  { province: '福建省', city: '龙岩', code: '0597' },
  { province: '福建省', city: '宁德', code: '0593' },
  { province: '江西省', city: '南昌', code: '0791' },
  { province: '江西省', city: '景德镇', code: '0798' },
  { province: '江西省', city: '萍乡', code: '0799' },
  { province: '江西省', city: '九江', code: '0792' },
  { province: '江西省', city: '新余', code: '0790' },
  { province: '江西省', city: '鹰潭', code: '0701' },
  { province: '江西省', city: '赣州', code: '0797' },
  { province: '江西省', city: '吉安', code: '0796' },
  { province: '江西省', city: '宜春', code: '0795' },
  { province: '江西省', city: '抚州', code: '0794' },
  { province: '江西省', city: '上饶', code: '0793' },
  { province: '山东省', city: '济南', code: '0531' },
  { province: '山东省', city: '青岛', code: '0532' },
  { province: '山东省', city: '淄博', code: '0533' },
  { province: '山东省', city: '枣庄', code: '0632' },
  { province: '山东省', city: '东营', code: '0546' },
  { province: '山东省', city: '烟台', code: '0535' },
  { province: '山东省', city: '潍坊', code: '0536' },
  { province: '山东省', city: '济宁', code: '0537' },
  { province: '山东省', city: '泰安', code: '0538' },
  { province: '山东省', city: '威海', code: '0631' },
  { province: '山东省', city: '日照', code: '0633' },
  { province: '山东省', city: '临沂', code: '0539' },
  { province: '山东省', city: '德州', code: '0534' },
  { province: '山东省', city: '聊城', code: '0635' },
  { province: '山东省', city: '滨州', code: '0543' },
  { province: '山东省', city: '菏泽', code: '0530' },
  { province: '河南省', city: '郑州', code: '0371' },
  { province: '河南省', city: '开封', code: '0371' },
  { province: '河南省', city: '洛阳', code: '0379' },
  { province: '河南省', city: '平顶山', code: '0375' },
  { province: '河南省', city: '安阳', code: '0372' },
  { province: '河南省', city: '鹤壁', code: '0392' },
  { province: '河南省', city: '新乡', code: '0373' },
  { province: '河南省', city: '焦作', code: '0391' },
  { province: '河南省', city: '濮阳', code: '0393' },
  { province: '河南省', city: '许昌', code: '0374' },
  { province: '河南省', city: '漯河', code: '0395' },
  { province: '河南省', city: '三门峡', code: '0398' },
  { province: '河南省', city: '南阳', code: '0377' },
  { province: '河南省', city: '商丘', code: '0370' },
  { province: '河南省', city: '信阳', code: '0376' },
  { province: '河南省', city: '周口', code: '0394' },
  { province: '河南省', city: '驻马店', code: '0396' },
  { province: '河南省', city: '济源', code: '0391' },
  { province: '湖北省', city: '武汉', code: '027' },
  { province: '湖北省', city: '黄石', code: '0714' },
  { province: '湖北省', city: '十堰', code: '0719' },
  { province: '湖北省', city: '宜昌', code: '0717' },
  { province: '湖北省', city: '襄阳', code: '0710' },
  { province: '湖北省', city: '鄂州', code: '0711' },
  { province: '湖北省', city: '荆门', code: '0724' },
  { province: '湖北省', city: '孝感', code: '0712' },
  { province: '湖北省', city: '荆州', code: '0716' },
  { province: '湖北省', city: '黄冈', code: '0713' },
  { province: '湖北省', city: '咸宁', code: '0715' },
  { province: '湖北省', city: '随州', code: '0722' },
  { province: '湖南省', city: '长沙', code: '0731' },
  { province: '湖南省', city: '株洲', code: '0731' },
  { province: '湖南省', city: '湘潭', code: '0731' },
  { province: '湖南省', city: '衡阳', code: '0734' },
  { province: '湖南省', city: '邵阳', code: '0739' },
  { province: '湖南省', city: '岳阳', code: '0730' },
  { province: '湖南省', city: '常德', code: '0736' },
  { province: '湖南省', city: '张家界', code: '0744' },
  { province: '湖南省', city: '益阳', code: '0737' },
  { province: '湖南省', city: '郴州', code: '0735' },
  { province: '湖南省', city: '永州', code: '0746' },
  { province: '湖南省', city: '怀化', code: '0745' },
  { province: '湖南省', city: '娄底', code: '0738' },
  { province: '湖南省', city: '湘西', code: '0743' },
  { province: '广东省', city: '广州', code: '020' },
  { province: '广东省', city: '韶关', code: '0751' },
  { province: '广东省', city: '深圳', code: '0755' },
  { province: '广东省', city: '珠海', code: '0756' },
  { province: '广东省', city: '汕头', code: '0754' },
  { province: '广东省', city: '佛山', code: '0757' },
  { province: '广东省', city: '江门', code: '0750' },
  { province: '广东省', city: '湛江', code: '0759' },
  { province: '广东省', city: '茂名', code: '0668' },
  { province: '广东省', city: '肇庆', code: '0758' },
  { province: '广东省', city: '惠州', code: '0752' },
  { province: '广东省', city: '梅州', code: '0753' },
  { province: '广东省', city: '汕尾', code: '0660' },
  { province: '广东省', city: '河源', code: '0762' },
  { province: '广东省', city: '阳江', code: '0662' },
  { province: '广东省', city: '清远', code: '0763' },
  { province: '广东省', city: '东莞', code: '0769' },
  { province: '广东省', city: '中山', code: '0760' },
  { province: '广东省', city: '潮州', code: '0768' },
  { province: '广东省', city: '揭阳', code: '0663' },
  { province: '广东省', city: '云浮', code: '0766' },
  { province: '广西壮族自治区', city: '南宁', code: '0771' },
  { province: '广西壮族自治区', city: '柳州', code: '0772' },
  { province: '广西壮族自治区', city: '桂林', code: '0773' },
  { province: '广西壮族自治区', city: '梧州', code: '0774' },
  { province: '广西壮族自治区', city: '北海', code: '0779' },
  { province: '广西壮族自治区', city: '防城港', code: '0770' },
  { province: '广西壮族自治区', city: '钦州', code: '0777' },
  { province: '广西壮族自治区', city: '贵港', code: '0775' },
  { province: '广西壮族自治区', city: '玉林', code: '0775' },
  { province: '广西壮族自治区', city: '百色', code: '0776' },
  { province: '广西壮族自治区', city: '贺州', code: '0774' },
  { province: '广西壮族自治区', city: '河池', code: '0778' },
  { province: '广西壮族自治区', city: '来宾', code: '0772' },
  { province: '广西壮族自治区', city: '崇左', code: '0771' },
  { province: '海南省', city: '海口', code: '0898' },
  { province: '海南省', city: '三亚', code: '0898' },
  { province: '海南省', city: '三沙', code: '0898' },
  { province: '海南省', city: '儋州', code: '0898' },
  { province: '四川省', city: '成都', code: '028' },
  { province: '四川省', city: '自贡', code: '0813' },
  { province: '四川省', city: '攀枝花', code: '0812' },
  { province: '四川省', city: '泸州', code: '0830' },
  { province: '四川省', city: '德阳', code: '0838' },
  { province: '四川省', city: '绵阳', code: '0816' },
  { province: '四川省', city: '广元', code: '0839' },
  { province: '四川省', city: '遂宁', code: '0825' },
  { province: '四川省', city: '内江', code: '0832' },
  { province: '四川省', city: '乐山', code: '0833' },
  { province: '四川省', city: '南充', code: '0817' },
  { province: '四川省', city: '眉山', code: '028' },
  { province: '四川省', city: '宜宾', code: '0831' },
  { province: '四川省', city: '广安', code: '0826' },
  { province: '四川省', city: '达州', code: '0818' },
  { province: '四川省', city: '雅安', code: '0835' },
  { province: '四川省', city: '巴中', code: '0827' },
  { province: '四川省', city: '资阳', code: '028' },
  { province: '四川省', city: '阿坝', code: '0837' },
  { province: '四川省', city: '甘孜', code: '0836' },
  { province: '四川省', city: '凉山', code: '0834' },
  { province: '贵州省', city: '贵阳', code: '0851' },
  { province: '贵州省', city: '六盘水', code: '0858' },
  { province: '贵州省', city: '遵义', code: '0852' },
  { province: '贵州省', city: '安顺', code: '0851' },
  { province: '贵州省', city: '毕节', code: '0857' },
  { province: '贵州省', city: '铜仁', code: '0856' },
  { province: '贵州省', city: '黔西南', code: '0859' },
  { province: '贵州省', city: '黔东南', code: '0855' },
  { province: '贵州省', city: '黔南', code: '0854' },
  { province: '云南省', city: '昆明', code: '0871' },
  { province: '云南省', city: '曲靖', code: '0874' },
  { province: '云南省', city: '玉溪', code: '0877' },
  { province: '云南省', city: '保山', code: '0875' },
  { province: '云南省', city: '昭通', code: '0870' },
  { province: '云南省', city: '丽江', code: '0888' },
  { province: '云南省', city: '普洱', code: '0879' },
  { province: '云南省', city: '临沧', code: '0883' },
  { province: '云南省', city: '楚雄', code: '0878' },
  { province: '云南省', city: '红河', code: '0873' },
  { province: '云南省', city: '文山', code: '0876' },
  { province: '云南省', city: '西双版纳', code: '0691' },
  { province: '云南省', city: '大理', code: '0872' },
  { province: '云南省', city: '德宏', code: '0692' },
  { province: '云南省', city: '怒江', code: '0886' },
  { province: '云南省', city: '迪庆', code: '0887' },
  { province: '西藏自治区', city: '拉萨', code: '0891' },
  { province: '西藏自治区', city: '日喀则', code: '0892' },
  { province: '西藏自治区', city: '昌都', code: '0895' },
  { province: '西藏自治区', city: '林芝', code: '0894' },
  { province: '西藏自治区', city: '山南', code: '0893' },
  { province: '西藏自治区', city: '那曲', code: '0896' },
  { province: '西藏自治区', city: '阿里', code: '0897' },
  { province: '陕西省', city: '西安', code: '029' },
  { province: '陕西省', city: '铜川', code: '0919' },
  { province: '陕西省', city: '宝鸡', code: '0917' },
  { province: '陕西省', city: '咸阳', code: '029' },
  { province: '陕西省', city: '渭南', code: '0913' },
  { province: '陕西省', city: '延安', code: '0911' },
  { province: '陕西省', city: '汉中', code: '0916' },
  { province: '陕西省', city: '榆林', code: '0912' },
  { province: '陕西省', city: '安康', code: '0915' },
  { province: '陕西省', city: '商洛', code: '0914' },
  { province: '甘肃省', city: '兰州', code: '0931' },
  { province: '甘肃省', city: '嘉峪关', code: '0937' },
  { province: '甘肃省', city: '金昌', code: '0935' },
  { province: '甘肃省', city: '白银', code: '0943' },
  { province: '甘肃省', city: '天水', code: '0938' },
  { province: '甘肃省', city: '武威', code: '0935' },
  { province: '甘肃省', city: '张掖', code: '0936' },
  { province: '甘肃省', city: '平凉', code: '0933' },
  { province: '甘肃省', city: '酒泉', code: '0937' },
  { province: '甘肃省', city: '庆阳', code: '0934' },
  { province: '甘肃省', city: '定西', code: '0932' },
  { province: '甘肃省', city: '陇南', code: '0939' },
  { province: '甘肃省', city: '临夏', code: '0930' },
  { province: '甘肃省', city: '甘南', code: '0941' },
  { province: '青海省', city: '西宁', code: '0971' },
  { province: '青海省', city: '海东', code: '0972' },
  { province: '青海省', city: '海北', code: '0970' },
  { province: '青海省', city: '黄南', code: '0973' },
  { province: '青海省', city: '海南', code: '0974' },
  { province: '青海省', city: '果洛', code: '0975' },
  { province: '青海省', city: '玉树', code: '0976' },
  { province: '青海省', city: '海西', code: '0977' },
  { province: '宁夏回族自治区', city: '银川', code: '0951' },
  { province: '宁夏回族自治区', city: '石嘴山', code: '0952' },
  { province: '宁夏回族自治区', city: '吴忠', code: '0953' },
  { province: '宁夏回族自治区', city: '固原', code: '0954' },
  { province: '宁夏回族自治区', city: '中卫', code: '0955' },
  { province: '新疆维吾尔自治区', city: '乌鲁木齐', code: '0991' },
  { province: '新疆维吾尔自治区', city: '克拉玛依', code: '0990' },
  { province: '新疆维吾尔自治区', city: '吐鲁番', code: '0995' },
  { province: '新疆维吾尔自治区', city: '哈密', code: '0902' },
  { province: '新疆维吾尔自治区', city: '昌吉', code: '0994' },
  { province: '新疆维吾尔自治区', city: '博尔塔拉', code: '0909' },
  { province: '新疆维吾尔自治区', city: '巴音郭楞', code: '0996' },
  { province: '新疆维吾尔自治区', city: '阿克苏', code: '0997' },
  { province: '新疆维吾尔自治区', city: '克孜勒苏', code: '0908' },
  { province: '新疆维吾尔自治区', city: '喀什', code: '0998' },
  { province: '新疆维吾尔自治区', city: '和田', code: '0903' },
  { province: '新疆维吾尔自治区', city: '伊犁', code: '0999' },
  { province: '新疆维吾尔自治区', city: '塔城', code: '0901' },
  { province: '新疆维吾尔自治区', city: '阿勒泰', code: '0906' },
  { province: '新疆维吾尔自治区', city: '石河子', code: '0993' },
  { province: '新疆维吾尔自治区', city: '阿拉尔', code: '0997' },
  { province: '新疆维吾尔自治区', city: '图木舒克', code: '0998' },
  { province: '新疆维吾尔自治区', city: '五家渠', code: '0994' },
  { province: '新疆维吾尔自治区', city: '北屯', code: '0906' },
  { province: '新疆维吾尔自治区', city: '铁门关', code: '0996' },
  { province: '新疆维吾尔自治区', city: '双河', code: '0909' },
  { province: '新疆维吾尔自治区', city: '可克达拉', code: '0999' },
  { province: '新疆维吾尔自治区', city: '昆玉', code: '0903' },
  { province: '新疆维吾尔自治区', city: '胡杨河', code: '0992' }
]

export function AreaCode() {
  const [searchInput, setSearchInput] = useState('')
  const [searchMode, setSearchMode] = useState<'city' | 'code'>('city')
  const [areaInfo, setAreaInfo] = useState<AreaCodeInfo[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const validateAreaCode = (code: string): boolean => {
    return /^0\d{2,3}$/.test(code)
  }

  const searchArea = () => {
    const input = searchInput.trim()
    
    if (!input) {
      setError('请输入城市名称或区号')
      setAreaInfo([])
      return
    }

    if (searchMode === 'code' && !validateAreaCode(input)) {
      setError('请输入正确的区号格式（如：010、021）')
      setAreaInfo([])
      return
    }

    setIsLoading(true)
    setError('')
    setAreaInfo([])

    setTimeout(() => {
      let results: AreaCodeInfo[] = []

      if (searchMode === 'code') {
        results = chinaAreaCodes.filter(area => area.code === input)
      } else {
        const lowerInput = input.toLowerCase()
        results = chinaAreaCodes.filter(area =>
          area.city.includes(input) ||
          area.city.toLowerCase().includes(lowerInput) ||
          area.province.includes(input)
        )
      }

      if (results.length === 0) {
        setError('未查询到相关信息')
      } else {
        setAreaInfo(results)
      }
      setIsLoading(false)
    }, 300)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      searchArea()
    }
  }

  const toggleMode = () => {
    setSearchMode(prev => prev === 'city' ? 'code' : 'city')
    setSearchInput('')
    setAreaInfo([])
    setError('')
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2 text-slate-700 dark:text-slate-200">
          <PhoneCall className="h-6 w-6 text-slate-600 dark:text-slate-300" />
          电话区号查询
        </h1>
        <p className="text-sm text-muted-foreground text-slate-600 dark:text-slate-400">
          查询中国城市的电话区号，支持城市查区号和区号查城市
        </p>
      </div>

      <Card className="bg-white dark:bg-slate-950/60 backdrop-blur-xl border-slate-200 dark:border-slate-700/60 dark:shadow-2xl dark:shadow-black/40 relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/10 before:to-transparent before:opacity-0 dark:before:opacity-100 before:pointer-events-none">
        <CardHeader className="pb-3 relative">
          <CardTitle className="text-base text-slate-700 dark:text-slate-200">区号查询</CardTitle>
          <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
            {searchMode === 'city' ? '输入城市名称查询区号' : '输入区号查询所属城市'}
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
                placeholder={searchMode === 'city' ? '请输入城市名称（如：北京、上海）' : '请输入区号（如：010、021）'}
                className="text-sm h-10"
                maxLength={searchMode === 'code' ? 4 : 20}
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
              onClick={searchArea}
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

          {areaInfo.length > 0 && !isLoading && (
            <div className="space-y-2">
              {areaInfo.map((info, index) => (
                <div
                  key={index}
                  className="p-4 rounded-lg bg-gradient-to-br from-sky-50 to-blue-50 dark:from-slate-800/50 dark:to-slate-900/50 border border-sky-200 dark:border-slate-700"
                >
                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground text-slate-600 dark:text-slate-400">省份</p>
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{info.province}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground text-slate-600 dark:text-slate-400">城市</p>
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{info.city}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground text-slate-600 dark:text-slate-400">区号</p>
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
            支持按城市名称查询电话区号，也支持按区号查询所属城市。区号格式为0开头，如北京010、上海021
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
