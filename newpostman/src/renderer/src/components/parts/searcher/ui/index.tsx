import { useRef, useState } from 'react'
import styles from './styles.module.css'
import { Editor } from '@monaco-editor/react'

export const Search = () => {
  const [method, setMethod] = useState('GET')
  const [url, setUrl] = useState('')
  const [response, setResponse] = useState('Jndtn')
  const editorRef = useRef(null)
  const handleMethodChange = (e) => {
    setMethod(e.target.value)
  }

  const handleUrlChange = (e) => {
    setUrl(e.target.value)
  }

  const handleSend = async () => {
    const response = await window.api.fetchData(url, { method })
    const jsonString = JSON.stringify(response.data, null, 2)
    setResponse(jsonString)
    console.log(jsonString)
  }

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor
  }

  return (
    <div>
      <div className={styles.searchContainer}>
        <select className={styles.methodSelector} value={method} onChange={handleMethodChange}>
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="PUT">PUT</option>
          <option value="DELETE">DELETE</option>
          <option value="PATCH">PATCH</option>
        </select>
        <input
          type="text"
          className={styles.urlInput}
          placeholder="Введите URL..."
          value={url}
          onChange={handleUrlChange}
        />
        <button className={styles.sendButton} onClick={handleSend}>
          Отправить
        </button>
      </div>
      <div className={styles.editorContainer}>
        <Editor
          height="90vh"
          defaultLanguage="json"
          value={response}
          theme="vs-dark"
          options={{
            readOnly: true,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            fontSize: 14,
            wordWrap: 'on',
            automaticLayout: true,
            lineNumbers: 'off',
            folding: true,
            renderWhitespace: 'selection'
          }}
          onMount={handleEditorDidMount}
        />
      </div>
    </div>
  )
}
