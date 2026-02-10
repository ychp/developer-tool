import { StrictMode, Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import { ThemeProvider } from './contexts/ThemeContext'
import { Layout } from './layouts/Layout'
import { Home } from './pages/Home'
import { PageLoading } from './components/ui/loading'

const JsonFormatter = lazy(() => import('./tools/JsonFormatter').then(m => ({ default: m.JsonFormatter })))
const XmlFormatter = lazy(() => import('./tools/XmlFormatter').then(m => ({ default: m.XmlFormatter })))
const Base64 = lazy(() => import('./tools/Base64').then(m => ({ default: m.Base64 })))
const UrlEncoder = lazy(() => import('./tools/UrlEncoder').then(m => ({ default: m.UrlEncoder })))
const Timestamp = lazy(() => import('./tools/Timestamp').then(m => ({ default: m.Timestamp })))
const UUID = lazy(() => import('./tools/UUID').then(m => ({ default: m.UUID })))
const RegexTester = lazy(() => import('./tools/RegexTester').then(m => ({ default: m.RegexTester })))
const DiffChecker = lazy(() => import('./tools/DiffChecker').then(m => ({ default: m.DiffChecker })))
const HashGenerator = lazy(() => import('./tools/HashGenerator').then(m => ({ default: m.HashGenerator })))
const PasswordGenerator = lazy(() => import('./tools/PasswordGenerator').then(m => ({ default: m.PasswordGenerator })))
const ColorConverter = lazy(() => import('./tools/ColorConverter').then(m => ({ default: m.ColorConverter })))
const QrCodeGenerator = lazy(() => import('./tools/QrCodeGenerator').then(m => ({ default: m.QrCodeGenerator })))
const NumberConverter = lazy(() => import('./tools/NumberConverter').then(m => ({ default: m.NumberConverter })))
const JwtDecoder = lazy(() => import('./tools/JwtDecoder').then(m => ({ default: m.JwtDecoder })))
const StringJoinAndSplit = lazy(() => import('./tools/StringJoinAndSplit').then(m => ({ default: m.StringJoinAndSplit })))
const ImageLinkPreview = lazy(() => import('./tools/ImageLinkPreview').then(m => ({ default: m.ImageLinkPreview })))
const ChromeExtensions = lazy(() => import('./tools/ChromeExtensions').then(m => ({ default: m.ChromeExtensions })))
const TableViewer = lazy(() => import('./tools/TableViewer').then(m => ({ default: m.TableViewer })))
const PhoneNumber = lazy(() => import('./tools/PhoneNumber').then(m => ({ default: m.PhoneNumber })))
const PostalCode = lazy(() => import('./tools/PostalCode').then(m => ({ default: m.PostalCode })))
const AreaCode = lazy(() => import('./tools/AreaCode').then(m => ({ default: m.AreaCode })))
const TokenCalculator = lazy(() => import('./tools/TokenCalculator').then(m => ({ default: m.TokenCalculator })))
const CronGenerator = lazy(() => import('./tools/CronGenerator').then(m => ({ default: m.CronGenerator })))
const JsonYamlConverter = lazy(() => import('./tools/JsonYamlConverter').then(m => ({ default: m.JsonYamlConverter })))
const ImageBase64 = lazy(() => import('./tools/ImageBase64').then(m => ({ default: m.ImageBase64 })))
const CodeFormatter = lazy(() => import('./tools/CodeFormatter').then(m => ({ default: m.CodeFormatter })))

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
          <Suspense fallback={<PageLoading />}>
            <Component />
          </Suspense>
        ),
      })),
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
