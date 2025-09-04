import React, { useState, useRef } from 'react'
import { Upload, X, Image } from 'lucide-react'

const ImageUploader = ({ onImageUpload }) => {
  const [dragActive, setDragActive] = useState(false)
  const [uploadedImage, setUploadedImage] = useState(null)
  const fileInputRef = useRef(null)

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleChange = (e) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = (file) => {
    if (file.type.startsWith('image/')) {
      const imageUrl = URL.createObjectURL(file)
      setUploadedImage(imageUrl)
      onImageUpload(file, imageUrl)
    } else {
      alert('Please upload an image file')
    }
  }

  const removeImage = () => {
    setUploadedImage(null)
    onImageUpload(null, null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="space-y-4">
      {!uploadedImage ? (
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 ${
            dragActive 
              ? 'border-accent bg-accent/10' 
              : 'border-white/30 hover:border-white/50'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <Upload className="w-12 h-12 text-white/50 mx-auto mb-4" />
          <h3 className="text-white font-medium mb-2">Upload Product Image</h3>
          <p className="text-white/60 text-sm mb-4">
            Drag and drop your image here, or click to browse
          </p>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="bg-white/10 text-white px-4 py-2 rounded-lg hover:bg-white/20 transition-colors"
          >
            Choose File
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleChange}
            className="hidden"
          />
        </div>
      ) : (
        <div className="relative">
          <div className="aspect-square rounded-lg overflow-hidden bg-white/5">
            <img 
              src={uploadedImage} 
              alt="Uploaded product" 
              className="w-full h-full object-cover"
            />
          </div>
          <button
            onClick={removeImage}
            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="flex items-center space-x-2 mt-3 text-white/70">
            <Image className="w-4 h-4" />
            <span className="text-sm">Image uploaded successfully</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default ImageUploader