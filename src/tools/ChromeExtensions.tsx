import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { Code, Github } from 'lucide-react'
import tabSorter from '@/assets/images/tab-sorter.png'
import favorites from '@/assets/images/favorites.png'
import timeConvertor from '@/assets/images/time-convertor.png'

interface Extension {
  icon: string
  title: string
  description: string
}

const extensions: Extension[] = [
  {
    icon: tabSorter,
    title: '标签排序 tab-sorter',
    description: `目前支持三种模式的排序(默认为1,切换排序方式,可以通过右键插件选项中切换):\n• 根据title按照字典正序排序\n• 根据title按照字典倒序排序\n• LUR`
  },
  {
    icon: favorites,
    title: 'ARC收藏夹导出',
    description: '按照chrome书签导出的格式导出Arc浏览器中pinned的收藏夹,目前支持MacOs系统'
  },
  {
    icon: timeConvertor,
    title: '时间戳转换',
    description: '选中页面的时间戳,可以转换为多种格式的时间'
  }
]

export function ChromeExtensions() {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Code className="h-6 w-6" />
          Chrome 扩展工具
        </h1>
        <p className="text-sm text-muted-foreground">
          实用的浏览器扩展，提升工作效率
        </p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">扩展列表</CardTitle>
              <CardDescription className="text-xs mt-1">
                高效实用的浏览器扩展
              </CardDescription>
            </div>
            <a
              href="https://github.com/ychp/chrome-extensions"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm text-primary hover:underline"
            >
              <Github className="h-4 w-4" />
              源代码
            </a>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {extensions.map((extension, index) => (
              <div
                key={index}
                className="flex gap-4 pb-6 last:pb-0 last:border-0 border-b"
              >
                <Avatar className="h-16 w-16 rounded-lg shrink-0">
                  <AvatarImage
                    src={extension.icon}
                    alt={extension.title}
                    className="rounded-lg object-cover"
                  />
                </Avatar>
                <div className="flex-1 space-y-2">
                  <h3 className="text-lg font-semibold">{extension.title}</h3>
                  <div className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
                    {extension.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
