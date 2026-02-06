import { useState } from 'react'
import { ChevronRight, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

type JsonNode = string | number | boolean | null | { [key: string]: JsonNode } | JsonNode[]

interface JsonTreeNodeProps {
  data: JsonNode
  keyName?: string
  isLast?: boolean
}

function JsonTreeNode({ data, keyName, isLast = false }: JsonTreeNodeProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const isObject = data !== null && typeof data === 'object'
  const isArray = Array.isArray(data)
  const isEmpty = isObject && Object.keys(data).length === 0
  const bracketOpen = isArray ? '[' : '{'
  const bracketClose = isArray ? ']' : '}'

  const getTypeColor = (value: JsonNode) => {
    if (value === null) return 'text-purple-600 dark:text-purple-400'
    if (typeof value === 'string') return 'text-green-600 dark:text-green-400'
    if (typeof value === 'number') return 'text-orange-600 dark:text-orange-400'
    if (typeof value === 'boolean') return 'text-blue-600 dark:text-blue-400'
    return ''
  }

  const renderValue = (value: JsonNode) => {
    if (value === null) return 'null'
    if (typeof value === 'string') return `"${value}"`
    return String(value)
  }

  if (!isObject) {
    return (
      <div className="ml-4">
        {keyName && <span className="text-blue-600 dark:text-blue-400 font-medium">"{keyName}"</span>}
        {keyName && <span className="text-gray-500 dark:text-gray-400">: </span>}
        <span className={getTypeColor(data)}>{renderValue(data)}</span>
        {!isLast && <span className="text-gray-500 dark:text-gray-400">,</span>}
      </div>
    )
  }

  if (isEmpty) {
    return (
      <div className="ml-4">
        {keyName && (
          <>
            <span className="text-blue-600 dark:text-blue-400 font-medium">"{keyName}"</span>
            <span className="text-gray-500 dark:text-gray-400">: </span>
          </>
        )}
        <span className="text-gray-500 dark:text-gray-400">
          {bracketOpen}{bracketClose}
        </span>
        {!isLast && <span className="text-gray-500 dark:text-gray-400">,</span>}
      </div>
    )
  }

  const entries = Object.entries(data as Record<string, JsonNode>)

  return (
    <div>
      <div 
        className="flex items-center gap-1 hover:bg-muted/50 rounded cursor-pointer py-0.5 px-1 -ml-1"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span className="flex items-center">
          {isExpanded ? (
            <ChevronDown className="h-4 w-4 text-gray-500" />
          ) : (
            <ChevronRight className="h-4 w-4 text-gray-500" />
          )}
        </span>
        {keyName && (
          <span className="text-blue-600 dark:text-blue-400 font-medium">"{keyName}"</span>
        )}
        {keyName && <span className="text-gray-500 dark:text-gray-400">: </span>}
        <span className="text-gray-500 dark:text-gray-400">
          {bracketOpen}
          {!isExpanded && (
            <span className="text-gray-600 dark:text-gray-300">
              {entries.length} {isArray ? 'items' : 'keys'}
            </span>
          )}
          {bracketClose}
        </span>
        {!isLast && <span className="text-gray-500 dark:text-gray-400">,</span>}
        <span className="text-gray-400 text-xs ml-1">
          {isArray ? `Array(${entries.length})` : `Object{...}`}
        </span>
      </div>
      {isExpanded && (
        <div className="ml-4 border-l border-gray-200 dark:border-gray-700 pl-4">
          {entries.map(([key, value], index) => (
            <JsonTreeNode
              key={key}
              data={value}
              keyName={isArray ? undefined : key}
              isLast={index === entries.length - 1}
            />
          ))}
        </div>
      )}
    </div>
  )
}

interface JsonTreeProps {
  data: JsonNode
  className?: string
}

export function JsonTree({ data, className }: JsonTreeProps) {
  return (
    <div className={cn('font-mono text-sm', className)}>
      <JsonTreeNode data={data} />
    </div>
  )
}
