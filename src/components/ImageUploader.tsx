import React, { useState } from 'react'
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd'

type Preview = {
  id: string
  file: File
  url: string
  visible?: boolean
  removing?: boolean
}

export default function ImageUploader({ onChange }: { onChange: (files: File[]) => void }) {
  const [previews, setPreviews] = useState<Preview[]>([])
  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const [liveMessage, setLiveMessage] = useState('')

  async function handleFiles(selected: FileList | null) {
    if (!selected) return
    const arr = Array.from(selected)
    const newPreviews: Preview[] = []

    for (const f of arr) {
      const compressed = await compressImage(f, 1200, 0.7)
      const url = URL.createObjectURL(compressed)
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
      newPreviews.push({ id, file: compressed, url })
    }

    setPreviews((prev) => {
      const next = [...prev, ...newPreviews]
      onChange(next.map((p) => p.file))
      return next
    })

    // trigger fade-in for newly added previews
    setTimeout(() => {
      setPreviews((prev) => prev.map((p) => ({ ...p, visible: true })))
      setLiveMessage(`${newPreviews.length} image(s) added.`)
    }, 50)
  }

  function remove(id: string) {
    // animate removal then delete
    setPreviews((s) => s.map((p) => (p.id === id ? { ...p, removing: true } : p)))
    setLiveMessage('Image removed')
    setTimeout(() => {
      setPreviews((s) => {
        const next = s.filter((p) => p.id !== id)
        onChange(next.map((p) => p.file))
        return next
      })
    }, 220)
  }

  function reorder(list: Preview[], startIndex: number, endIndex: number) {
    const result = Array.from(list)
    const [removed] = result.splice(startIndex, 1)
    result.splice(endIndex, 0, removed)
    return result
  }

  function handleDragEnd(result: DropResult) {
    if (!result.destination) return
    const next = reorder(previews, result.source.index, result.destination.index)
    setPreviews(next)
    onChange(next.map((p) => p.file))
    setLiveMessage(`Moved image from position ${result.source.index + 1} to ${result.destination.index + 1}`)
  }

  return (
    <div>
      <div className="sr-only" aria-live="polite">{liveMessage}</div>
      <label className="block mb-2">Photos (minimum 3)</label>
      <input type="file" accept="image/*" multiple onChange={(e) => handleFiles(e.target.files)} className="mb-3" />

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="image-previews">
          {(provided) => (
            <div className="grid grid-cols-3 gap-2" ref={provided.innerRef} {...provided.droppableProps}>
              {previews.map((p, idx) => (
                <Draggable key={p.id} draggableId={p.id} index={idx}>
                  {(prov, snapshot) => (
                    <div
                      ref={prov.innerRef}
                      {...prov.draggableProps}
                      {...prov.dragHandleProps}
                      className={`relative transition-transform duration-150 ease-in-out ${snapshot.isDragging ? 'scale-105 z-10' : ''} ${p.visible ? 'opacity-100' : 'opacity-0'} ${p.removing ? 'opacity-0' : 'opacity-100'}`}
                      style={{ transitionProperty: 'transform, opacity' }}
                    >
                      <img src={p.url} alt="preview" className="h-28 w-full object-cover rounded" />
                      <div className="flex gap-1 mt-1 items-center">
                        <div className="cursor-move text-gray-500 px-2" aria-hidden>
                          ≡
                        </div>
                        <button type="button" onClick={() => remove(p.id)} className="ml-auto px-2 py-1 bg-red-100 text-red-700 rounded text-sm">Delete</button>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  )
}

async function compressImage(file: File, maxSize: number, quality = 0.8) {
  // create image element
  const imageBitmap = await createImageBitmap(file)
  const canvas = document.createElement('canvas')
  const scale = Math.min(1, maxSize / Math.max(imageBitmap.width, imageBitmap.height))
  canvas.width = Math.round(imageBitmap.width * scale)
  canvas.height = Math.round(imageBitmap.height * scale)
  const ctx = canvas.getContext('2d')!
  ctx.drawImage(imageBitmap, 0, 0, canvas.width, canvas.height)

  return new Promise<File>((resolve) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) return resolve(file)
        const compressed = new File([blob], file.name, { type: blob.type })
        resolve(compressed)
      },
      'image/jpeg',
      quality
    )
  })
}
