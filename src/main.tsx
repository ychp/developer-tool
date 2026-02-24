import { StrictMode, Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import { ThemeProvider } from './contexts/ThemeContext'
import { Layout } from './layouts/Layout'
import { Home } from './pages/Home'
import { NotFound } from './pages/NotFound'
import { ToolSkeleton } from './components/ui/tool-skeleton'
import { ErrorBoundary } from './components/ui/ErrorBoundary'
import './pwa'

const JsonFormatter = lazy(() => import('./tools/formatting/JsonFormatter').then(m => ({ default: m.JsonFormatter })))
const XmlFormatter = lazy(() => import('./tools/formatting/XmlFormatter').then(m => ({ default: m.XmlFormatter })))
const Base64 = lazy(() => import('./tools/convertor/Base64').then(m => ({ default: m.Base64 })))
const UrlEncoder = lazy(() => import('./tools/convertor/UrlEncoder').then(m => ({ default: m.UrlEncoder })))
const Timestamp = lazy(() => import('./tools/convertor/Timestamp').then(m => ({ default: m.Timestamp })))
const UUID = lazy(() => import('./tools/generator/UUID').then(m => ({ default: m.UUID })))
const RegexTester = lazy(() => import('./tools/text/RegexTester').then(m => ({ default: m.RegexTester })))
const DiffChecker = lazy(() => import('./tools/text/DiffChecker').then(m => ({ default: m.DiffChecker })))
const HashGenerator = lazy(() => import('./tools/security/HashGenerator').then(m => ({ default: m.HashGenerator })))
const PasswordGenerator = lazy(() => import('./tools/generator/PasswordGenerator').then(m => ({ default: m.PasswordGenerator })))
const ColorConverter = lazy(() => import('./tools/convertor/ColorConverter').then(m => ({ default: m.ColorConverter })))
const QrCodeGenerator = lazy(() => import('./tools/generator/QrCodeGenerator').then(m => ({ default: m.QrCodeGenerator })))
const NumberConverter = lazy(() => import('./tools/convertor/NumberConverter').then(m => ({ default: m.NumberConverter })))
const JwtDecoder = lazy(() => import('./tools/security/JwtDecoder').then(m => ({ default: m.JwtDecoder })))
const StringJoinAndSplit = lazy(() => import('./tools/text/StringJoinAndSplit').then(m => ({ default: m.StringJoinAndSplit })))
const ImageLinkPreview = lazy(() => import('./tools/media/ImageLinkPreview').then(m => ({ default: m.ImageLinkPreview })))
const ChromeExtensions = lazy(() => import('./tools/browser/ChromeExtensions').then(m => ({ default: m.ChromeExtensions })))
const TableViewer = lazy(() => import('./tools/utils/TableViewer').then(m => ({ default: m.TableViewer })))
const PhoneNumber = lazy(() => import('./tools/lifestyle/PhoneNumber').then(m => ({ default: m.PhoneNumber })))
const PostalCode = lazy(() => import('./tools/lifestyle/PostalCode').then(m => ({ default: m.PostalCode })))
const AreaCode = lazy(() => import('./tools/lifestyle/AreaCode').then(m => ({ default: m.AreaCode })))
const TokenCalculator = lazy(() => import('./tools/ai/TokenCalculator').then(m => ({ default: m.TokenCalculator })))
const CronGenerator = lazy(() => import('./tools/generator/CronGenerator').then(m => ({ default: m.CronGenerator })))
const JsonYamlConverter = lazy(() => import('./tools/convertor/JsonYamlConverter').then(m => ({ default: m.JsonYamlConverter })))
const ImageBase64 = lazy(() => import('./tools/media/ImageBase64').then(m => ({ default: m.ImageBase64 })))
const CodeFormatter = lazy(() => import('./tools/formatting/CodeFormatter').then(m => ({ default: m.CodeFormatter })))
const AIPriceCalculator = lazy(() => import('./tools/ai/AIPriceCalculator').then(m => ({ default: m.AIPriceCalculator })))
const FunctionCallingGenerator = lazy(() => import('./tools/ai/FunctionCallingGenerator').then(m => ({ default: m.FunctionCallingGenerator })))
const JsonToPrompt = lazy(() => import('./tools/ai/JsonToPrompt').then(m => ({ default: m.JsonToPrompt })))
const ImagePromptGenerator = lazy(() => import('./tools/ai/ImagePromptGenerator').then(m => ({ default: m.ImagePromptGenerator })))
const SystemPromptGenerator = lazy(() => import('./tools/ai/SystemPromptGenerator').then(m => ({ default: m.SystemPromptGenerator })))
const MarkdownToPrompt = lazy(() => import('./tools/ai/MarkdownToPrompt').then(m => ({ default: m.MarkdownToPrompt })))
const FewshotFormatter = lazy(() => import('./tools/ai/FewshotFormatter').then(m => ({ default: m.FewshotFormatter })))
const ImageSizeCalculator = lazy(() => import('./tools/ai/ImageSizeCalculator').then(m => ({ default: m.ImageSizeCalculator })))
const MortgageCalculator = lazy(() => import('./tools/lifestyle/MortgageCalculator').then(m => ({ default: m.MortgageCalculator })))

const lazyRoutes: Array<{ path: string; Component: React.LazyExoticComponent<React.ComponentType> }> = [
  { path: 'json-formatter', Component: JsonFormatter },
  { path: 'xml-formatter', Component: XmlFormatter },
  { path: 'base64', Component: Base64 },
  { path: 'url-encoder', Component: UrlEncoder },
  { path: 'timestamp', Component: Timestamp },
  { path: 'uuid', Component: UUID },
  { path: 'regex-tester', Component: RegexTester },
  { path: 'diff-checker', Component: DiffChecker },
  { path: 'hash-generator', Component: HashGenerator },
  { path: 'password-generator', Component: PasswordGenerator },
  { path: 'color-converter', Component: ColorConverter },
  { path: 'qr-generator', Component: QrCodeGenerator },
  { path: 'number-converter', Component: NumberConverter },
  { path: 'jwt-decoder', Component: JwtDecoder },
  { path: 'string-join-split', Component: StringJoinAndSplit },
  { path: 'image-link-preview', Component: ImageLinkPreview },
  { path: 'chrome-extensions', Component: ChromeExtensions },
  { path: 'table-viewer', Component: TableViewer },
  { path: 'phone-number', Component: PhoneNumber },
  { path: 'postal-code', Component: PostalCode },
  { path: 'area-code', Component: AreaCode },
  { path: 'token-calculator', Component: TokenCalculator },
  { path: 'cron-generator', Component: CronGenerator },
  { path: 'json-yaml-converter', Component: JsonYamlConverter },
  { path: 'image-base64', Component: ImageBase64 },
  { path: 'code-formatter', Component: CodeFormatter },
  { path: 'ai-price-calculator', Component: AIPriceCalculator },
  { path: 'function-calling-generator', Component: FunctionCallingGenerator },
  { path: 'json-to-prompt', Component: JsonToPrompt },
  { path: 'image-prompt-generator', Component: ImagePromptGenerator },
  { path: 'system-prompt-generator', Component: SystemPromptGenerator },
  { path: 'markdown-to-prompt', Component: MarkdownToPrompt },
  { path: 'fewshot-formatter', Component: FewshotFormatter },
  { path: 'image-size-calculator', Component: ImageSizeCalculator },
  { path: 'mortgage-calculator', Component: MortgageCalculator },
]

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      ...lazyRoutes.map(({ path, Component }) => ({
        path,
        element: (
          <ErrorBoundary>
            <Suspense fallback={<ToolSkeleton />}>
              <Component />
            </Suspense>
          </ErrorBoundary>
        ),
      })),
      { path: '*', element: <NotFound /> },
    ],
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  </StrictMode>,
)
