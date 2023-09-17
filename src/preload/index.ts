/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import fs from 'fs'

// Custom APIs for renderer
const api = {
  fs
}

const ipcChannel = {
  on: (channel: string, func: (...args: unknown[]) => void) =>
    ipcRenderer.on(channel, (_event, ...args) => func(...args)),
  send: (channel: string, data: unknown) => ipcRenderer.send(channel, data),
  invoke: (channel: string, data: unknown) => ipcRenderer.invoke(channel, data)
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
    contextBridge.exposeInMainWorld('ipcChannel', ipcChannel)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
  // @ts-ignore (define in dts)
  window.ipcChannel = ipcChannel
}
