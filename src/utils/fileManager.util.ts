import * as fs from 'fs'

type IUseFileManager = {
  readFile(srcPath: string): string | undefined
  writeFile(srcPath: string, payload: string): Promise<void>
}

function useFileManager(): IUseFileManager {
  function readFile(srcPath: string): string | undefined {
    if (fs.existsSync(srcPath)) return fs.readFileSync(srcPath, { encoding: 'utf8' })
    else return undefined
  }

  async function writeFile(srcPath: string, payload: string): Promise<void> {
    await new Promise<void>((resolve, reject) => {
      fs.writeFile(srcPath, payload, (err) => {
        if (err) {
          reject(`Could not write to file ${srcPath}.`)
        } else resolve()
      })
    })
  }

  return { readFile, writeFile }
}

export { useFileManager }
