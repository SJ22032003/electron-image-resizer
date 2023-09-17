import { useState, useEffect, ChangeEvent, MouseEvent } from 'react'
import styles from './styles.module.scss'

function ResizeForm({ selectedFile, setSelectedFile }: TResizeForm): JSX.Element {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  useEffect(() => {
    setPreviewUrl(selectedFile.previewUrl)
    return () => {
      URL.revokeObjectURL(selectedFile.previewUrl)
    }
  }, [selectedFile])

  const handleRemoveImg = (): void => {
    setSelectedFile(null)
    setPreviewUrl(null)
  }

  const handleSubmit = async (event: MouseEvent<HTMLButtonElement, MouseEvent>): void => {
    event.preventDefault()
    const { file, width, height } = selectedFile
    console.log(typeof file.path)
    const done = await window.ipcChannel.invoke(
      'resize',
      JSON.stringify({ path: file.path, width, height })
    )
    console.log(done)
    alert('Done')
  }

  const handleSizeChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const { name, value }: { name: string; value: number } = event.target
    if (value < 1) {
      alert(`Invalid size for ${name}, you cant set it below 1`)
      return
    }
    setSelectedFile((prev: { width: number; height: number }) => {
      if (prev) {
        return {
          ...prev,
          [name]: value
        }
      }
      return prev
    })
  }

  return (
    <div className={styles.wrapper}>
      <article className={styles.mainContainer}>
        <section className={styles.topSection}>
          <h1>Resize</h1>
          {previewUrl && <img src={previewUrl} alt="Selected file" />}
          <div>
            <button type="button" onClick={handleRemoveImg}>
              Remove
            </button>
          </div>
        </section>
        <section className={styles.bottomSection}>
          <form>
            <div>
              <label htmlFor="width">Width</label>
              <input
                type="number"
                name="width"
                id="width"
                required
                value={selectedFile.width}
                onChange={(e): void => handleSizeChange(e)}
              />
            </div>
            <div>
              <label htmlFor="height">Height</label>
              <input
                type="number"
                name="height"
                id="height"
                required
                value={selectedFile.height}
                onChange={(e): void => handleSizeChange(e)}
              />
            </div>
            <div>
              <button type="submit" onClick={(e): void => handleSubmit(e)}>
                Resize
              </button>
            </div>
          </form>
        </section>
      </article>
    </div>
  )
}

export default ResizeForm

type TResizeForm = {
  selectedFile: {
    file: File
    previewUrl: string
    width: number
    height: number
  }
  setSelectedFile: (
    file: {
      file: File
      previewUrl: string
      width: number
      height: number
    } | null
  ) => void
}
