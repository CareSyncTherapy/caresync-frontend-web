import React, { useState } from 'react'
import { Bold, Italic, Underline, Link, Image, Tag, X } from 'lucide-react'

interface TopicFormProps {
  onSubmit: (topic: { title: string; content: string; tags: string[] }) => void
  onCancel: () => void
}

const TopicForm: React.FC<TopicFormProps> = ({ onSubmit, onCancel }) => {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState('')
  const [isBold, setIsBold] = useState(false)
  const [isItalic, setIsItalic] = useState(false)
  const [isUnderline, setIsUnderline] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !content.trim()) return

    onSubmit({
      title: title.trim(),
      content: content,
      tags: tags
    })
  }

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()])
      setNewTag('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTag()
    }
  }

  const formatText = (format: 'bold' | 'italic' | 'underline') => {
    const textarea = document.getElementById('content-textarea') as HTMLTextAreaElement
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = content.substring(start, end)

    let formattedText = ''
    switch (format) {
      case 'bold':
        formattedText = `**${selectedText}**`
        break
      case 'italic':
        formattedText = `*${selectedText}*`
        break
      case 'underline':
        formattedText = `__${selectedText}__`
        break
    }

    const newContent = content.substring(0, start) + formattedText + content.substring(end)
    setContent(newContent)

    // Reset cursor position
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + formattedText.length, start + formattedText.length)
    }, 0)
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 font-hebrew-display">
        צור נושא חדש
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 font-hebrew-ui">
            כותרת הנושא *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={50}
            placeholder="כותרת קצרה ותמציתית..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-hebrew-ui"
            required
          />
          <div className="flex justify-between items-center mt-1">
            <span className="text-sm text-gray-500 font-hebrew-ui">
              עד 50 תווים
            </span>
            <span className="text-sm text-gray-500 font-hebrew-ui">
              {title.length}/50
            </span>
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 font-hebrew-ui">
            תגיות
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="הוסף תגית..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-hebrew-ui"
            />
            <button
              type="button"
              onClick={addTag}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-hebrew-ui"
            >
              הוסף
            </button>
          </div>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full font-hebrew-ui flex items-center"
                >
                  <Tag className="w-3 h-3 mr-1" />
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="mr-1 text-blue-600 hover:text-blue-800"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 font-hebrew-ui">
            תוכן הנושא *
          </label>
          
          {/* Rich Text Toolbar */}
          <div className="flex items-center gap-2 mb-2 p-2 bg-gray-50 rounded-lg">
            <button
              type="button"
              onClick={() => formatText('bold')}
              className={`p-2 rounded ${isBold ? 'bg-blue-200' : 'hover:bg-gray-200'}`}
              title="Bold"
            >
              <Bold className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => formatText('italic')}
              className={`p-2 rounded ${isItalic ? 'bg-blue-200' : 'hover:bg-gray-200'}`}
              title="Italic"
            >
              <Italic className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => formatText('underline')}
              className={`p-2 rounded ${isUnderline ? 'bg-blue-200' : 'hover:bg-gray-200'}`}
              title="Underline"
            >
              <Underline className="w-4 h-4" />
            </button>
            <div className="w-px h-6 bg-gray-300"></div>
            <button
              type="button"
              className="p-2 rounded hover:bg-gray-200"
              title="Add Link"
            >
              <Link className="w-4 h-4" />
            </button>
            <button
              type="button"
              className="p-2 rounded hover:bg-gray-200"
              title="Add Image"
            >
              <Image className="w-4 h-4" />
            </button>
          </div>

          <textarea
            id="content-textarea"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="כתוב את תוכן הנושא שלך כאן... תוכל להשתמש בסימון Markdown לעיצוב הטקסט."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-hebrew-ui"
            rows={8}
            maxLength={5000}
            required
          />
          <div className="flex justify-between items-center mt-1">
            <span className="text-sm text-gray-500 font-hebrew-ui">
              עד 5000 תווים
            </span>
            <span className="text-sm text-gray-500 font-hebrew-ui">
              {content.length}/5000
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={!title.trim() || !content.trim()}
            className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-hebrew-ui font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            צור נושא
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-300 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-400 transition-colors font-hebrew-ui font-medium"
          >
            ביטול
          </button>
        </div>
      </form>
    </div>
  )
}

export default TopicForm 