import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import { ThemeProvider } from './contexts/ThemeContext'
import { Layout } from './layouts/Layout'
import { Home } from './pages/Home'
import { JsonFormatter } from './tools/JsonFormatter'
import { Base64 } from './tools/Base64'
import { UrlEncoder } from './tools/UrlEncoder'
import { Timestamp } from './tools/Timestamp'
import { UUID } from './tools/UUID'
import { RegexTester } from './tools/RegexTester'
import { DiffChecker } from './tools/DiffChecker'
import { HashGenerator } from './tools/HashGenerator'
import { XmlFormatter } from './tools/XmlFormatter'
import { PasswordGenerator } from './tools/PasswordGenerator'
import { ColorConverter } from './tools/ColorConverter'
import { QrCodeGenerator } from './tools/QrCodeGenerator'
import { NumberConverter } from './tools/NumberConverter'
import { JwtDecoder } from './tools/JwtDecoder'
import { StringJoinAndSplit } from './tools/StringJoinAndSplit'
import { ImageLinkPreview } from './tools/ImageLinkPreview'
import { ChromeExtensions } from './tools/ChromeExtensions'
import { TableViewer } from './tools/TableViewer'
import { PhoneNumber } from './tools/PhoneNumber'
import { PostalCode } from './tools/PostalCode'
import { AreaCode } from './tools/AreaCode'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'json-formatter', element: <JsonFormatter /> },
      { path: 'xml-formatter', element: <XmlFormatter /> },
      { path: 'base64', element: <Base64 /> },
      { path: 'url-encoder', element: <UrlEncoder /> },
      { path: 'string-join-split', element: <StringJoinAndSplit /> },
      { path: 'image-link-preview', element: <ImageLinkPreview /> },
      { path: 'table-viewer', element: <TableViewer /> },
      { path: 'chrome-extensions', element: <ChromeExtensions /> },
      { path: 'timestamp', element: <Timestamp /> },
      { path: 'uuid', element: <UUID /> },
      { path: 'regex-tester', element: <RegexTester /> },
      { path: 'diff-checker', element: <DiffChecker /> },
      { path: 'hash-generator', element: <HashGenerator /> },
      { path: 'password-generator', element: <PasswordGenerator /> },
      { path: 'color-converter', element: <ColorConverter /> },
      { path: 'qr-generator', element: <QrCodeGenerator /> },
      { path: 'number-converter', element: <NumberConverter /> },
      { path: 'jwt-decoder', element: <JwtDecoder /> },
      { path: 'phone-number', element: <PhoneNumber /> },
      { path: 'postal-code', element: <PostalCode /> },
      { path: 'area-code', element: <AreaCode /> },
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
