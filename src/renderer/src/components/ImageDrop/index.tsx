import styles from './styles.module.scss'

function ImageDrop({ setSelectedFile }: TImageDrop): JSX.Element {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0] || null
    if (!fileValidation(file)) {
      return
    }
    const reader = new FileReader()
    reader.onload = (): void => {
      const img = new Image()
      img.onload = (): void => {
        setSelectedFile({
          file: file as File,
          previewUrl: reader.result as string,
          width: img.width,
          height: img.height
        })
      }
      img.src = reader.result as string
    }
    reader.readAsDataURL(file as File)
  }

  return (
    <div className={styles.wrapper}>
      <article className={styles.mainContainer}>
        <input type="file" onChange={handleFileChange} accept="image/jpeg, image/png, image/jpg" />
      </article>
      <code>
        This software changes the original image. If you want to keep the original image, make a
        copy of it before using this software.
      </code>
    </div>
  )
}

export default ImageDrop

const fileValidation = (file: File | null): boolean => {
  const validTypes = ['image/jpeg', 'image/png', 'image/jpg']
  if (!file) {
    alert('No file selected')
    return false
  }
  if (validTypes.indexOf(file.type) === -1) {
    alert('Invalid file type. Only JPEG, JPG and PNG are allowed.')
    return false
  }
  if (file.size > 1024 * 1024 * 10) {
    alert('File too large. Max size is 10MB.')
    return false
  }
  return true
}

type TImageDrop = {
  setSelectedFile: (
    file: {
      file: File
      previewUrl: string
      width: number
      height: number
    } | null
  ) => void
}
