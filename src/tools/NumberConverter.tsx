import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Hash, Copy, Check } from 'lucide-react'

export function NumberConverter() {
  const [decimal, setDecimal] = useState('0')
  const [hexadecimal, setHexadecimal] = useState('0')
  const [octal, setOctal] = useState('0')
  const [binary, setBinary] = useState('0')
  const [copied, setCopied] = useState<string | null>(null)



  const updateFromDecimal = (value: string) => {
    setDecimal(value)
    const num = parseInt(value, 10)
    if (!isNaN(num)) {
      setHexadecimal(num.toString(16).toUpperCase())
      setOctal(num.toString(8))
      setBinary(num.toString(2))
    }
  }

  const updateFromHexadecimal = (value: string) => {
    setHexadecimal(value)
    const num = parseInt(value, 16)
    if (!isNaN(num)) {
      setDecimal(num.toString(10))
      setOctal(num.toString(8))
      setBinary(num.toString(2))
    }
  }

  const updateFromOctal = (value: string) => {
    setOctal(value)
    const num = parseInt(value, 8)
    if (!isNaN(num)) {
      setDecimal(num.toString(10))
      setHexadecimal(num.toString(16).toUpperCase())
      setBinary(num.toString(2))
    }
  }

  const updateFromBinary = (value: string) => {
    setBinary(value)
    const num = parseInt(value, 2)
    if (!isNaN(num)) {
      setDecimal(num.toString(10))
      setHexadecimal(num.toString(16).toUpperCase())
      setOctal(num.toString(8))
    }
  }

  const copyValue = async (value: string, key: string) => {
    await navigator.clipboard.writeText(value)
    setCopied(key)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Hash className="h-8 w-8" />
          进制转换
        </h1>
        <p className="text-muted-foreground">
          二进制、八进制、十进制、十六进制互转
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>十进制 (DEC)</CardTitle>
            <CardDescription>Base 10</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                value={decimal}
                onChange={(e) => updateFromDecimal(e.target.value)}
                placeholder="0"
                className="font-mono"
              />
              <Button
                onClick={() => copyValue(decimal, 'decimal')}
                variant="outline"
                size="icon"
              >
                {copied === 'decimal' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>十六进制 (HEX)</CardTitle>
            <CardDescription>Base 16</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                value={hexadecimal}
                onChange={(e) => updateFromHexadecimal(e.target.value.toUpperCase())}
                placeholder="0"
                className="font-mono uppercase"
              />
              <Button
                onClick={() => copyValue(hexadecimal, 'hex')}
                variant="outline"
                size="icon"
              >
                {copied === 'hex' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>八进制 (OCT)</CardTitle>
            <CardDescription>Base 8</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                value={octal}
                onChange={(e) => updateFromOctal(e.target.value)}
                placeholder="0"
                className="font-mono"
              />
              <Button
                onClick={() => copyValue(octal, 'octal')}
                variant="outline"
                size="icon"
              >
                {copied === 'octal' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>二进制 (BIN)</CardTitle>
            <CardDescription>Base 2</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                value={binary}
                onChange={(e) => updateFromBinary(e.target.value)}
                placeholder="0"
                className="font-mono"
              />
              <Button
                onClick={() => copyValue(binary, 'binary')}
                variant="outline"
                size="icon"
              >
                {copied === 'binary' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
