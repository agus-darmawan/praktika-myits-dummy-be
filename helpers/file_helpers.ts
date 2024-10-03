import fs from 'node:fs'
import path from 'node:path'

// Save file from base64 string
export async function saveFile(
  base64String: string,
  filePath: string,
  fileName: string
): Promise<void> {
  if (!base64String || !filePath || !fileName) {
    throw new Error('Invalid input')
  }

  const base64Data = base64String.split(',')[1];
  if (!base64Data) {
    throw new Error('Invalid base64 string')
  }

  const fileBuffer = Buffer.from(base64Data, 'base64')
  const newFilePath = path.join('uploads', filePath)
  const fullFilePath = path.join(newFilePath, fileName)

  if (!fs.existsSync(newFilePath)) {
    fs.mkdirSync(newFilePath, { recursive: true })
  }

  await fs.promises.writeFile(fullFilePath, new Uint8Array(fileBuffer))
}

export function checkBase64(base64String: string, validFormats: string[]): string | null {
  if (!base64String) {
    return null;
  }

  const match = base64String.match(/^data:image\/([a-z]+);base64,/)
  if (!match) {
    return null
  }

  const fileExtension = match[1]
  return validFormats.includes(fileExtension) ? fileExtension : null
}

export async function deleteFile(filePath: string): Promise<void> {
  if (!filePath) {
    throw new Error('File path is required');
  }

  const newFilePath = path.join('uploads', filePath)
  if (fs.existsSync(newFilePath)) {
    await fs.promises.unlink(newFilePath)
  }
}

export function getFileName(name: string, extension: string): string {
  if (!name || !extension) {
    throw new Error('Invalid input for file name')
  }

  const sanitizedName = name.replace(/\s+/g, '_')
  return `${sanitizedName}.${extension}`
}

export function getFilePath(userId: string | number | BigInt, folder: string): string {
  if (!userId || !folder) {
    throw new Error('Invalid input for file path')
  }

  return path.join(folder, String(userId))
}
