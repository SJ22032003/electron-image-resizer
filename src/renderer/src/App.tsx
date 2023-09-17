import { useState } from 'react'
import ResizeForm from './components/ResizeForm'
import ImageDrop from './components/ImageDrop'

console.log(window.api)
function App(): JSX.Element {
  const [selectedFile, setSelectedFile] = useState<TSelectedFile>(null)
  return (
    <main>
      {selectedFile ? (
        <ResizeForm selectedFile={selectedFile} setSelectedFile={setSelectedFile} />
      ) : (
        <ImageDrop setSelectedFile={setSelectedFile} />
      )}
    </main>
  )
}

export default App

type TSelectedFile = {
  file: File
  previewUrl: string
  width: number
  height: number
} | null
