import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation, useQueryClient } from 'react-query'
import { useNavigate } from 'react-router-dom'
import { Upload, X, Plus, Save, ArrowLeft } from 'lucide-react'
import { carsAPI } from '../../lib/api'
import toast from 'react-hot-toast'

interface CarFormData {
  make: string
  model: string
  year: number
  mileage: number
  price: number
  bodyType: string
  transmission: string
  condition: string
  fuelType: string
  engineSize: string
  doors: number
  cylinders: number
  description: string
  isFeatured: boolean
}

interface CarFormProps {
  carId?: string
  initialData?: Partial<CarFormData>
}

const CarForm: React.FC<CarFormProps> = ({ carId, initialData }) => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [images, setImages] = useState<File[]>([])
  const [previewImages, setPreviewImages] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm<CarFormData>({
    defaultValues: {
      make: '',
      model: '',
      year: new Date().getFullYear(),
      mileage: 0,
      price: 0,
      bodyType: '',
      transmission: '',
      condition: '',
      fuelType: '',
      engineSize: '',
      doors: 4,
      cylinders: 4,
      description: '',
      isFeatured: false,
      ...initialData
    }
  })

  const isFeatured = watch('isFeatured')

  // Create car mutation
  const createCarMutation = useMutation(carsAPI.create, {
    onSuccess: () => {
      queryClient.invalidateQueries('admin-cars')
      toast.success('Car created successfully!')
      navigate('/admin/cars')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create car')
    }
  })

  // Update car mutation
  const updateCarMutation = useMutation(
    (data: FormData) => carsAPI.update(carId!, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('admin-cars')
        toast.success('Car updated successfully!')
        navigate('/admin/cars')
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || 'Failed to update car')
      }
    }
  )

  const onSubmit = async (data: CarFormData) => {
    setIsSubmitting(true)
    
    try {
      const formData = new FormData()
      
      // Add all form fields
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value.toString())
      })

      // Add images
      images.forEach((image) => {
        formData.append('images', image)
      })

      if (carId) {
        await updateCarMutation.mutateAsync(formData)
      } else {
        await createCarMutation.mutateAsync(formData)
      }
    } catch (error) {
      console.error('Error submitting form:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const newImages = [...images, ...files]
    
    if (newImages.length > 10) {
      toast.error('Maximum 10 images allowed')
      return
    }

    setImages(newImages)
    
    // Create preview URLs
    const newPreviews = files.map(file => URL.createObjectURL(file))
    setPreviewImages([...previewImages, ...newPreviews])
  }

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index)
    const newPreviews = previewImages.filter((_, i) => i !== index)
    
    setImages(newImages)
    setPreviewImages(newPreviews)
  }

  const bodyTypes = ['Sedan', 'SUV', 'Hatchback', 'Coupe', 'Convertible', 'Wagon', 'Pickup', 'Van']
  const transmissions = ['Manual', 'Automatic', 'CVT', 'Semi-Automatic']
  const conditions = ['New', 'Used', 'Certified Pre-owned']
  const fuelTypes = ['Petrol', 'Diesel', 'Electric', 'Hybrid', 'Plug-in Hybrid']
  const doorOptions = [2, 3, 4, 5]
  const cylinderOptions = [2, 3, 4, 5, 6, 8, 10, 12]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/admin/cars')}
                className="btn btn-outline"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Cars
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {carId ? 'Edit Car' : 'Add New Car'}
                </h1>
                <p className="text-gray-600">
                  {carId ? 'Update car information' : 'Add a new vehicle to your inventory'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Basic Information */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
            </div>
            <div className="card-body">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="form-label">Make *</label>
                  <input
                    type="text"
                    {...register('make', { required: 'Make is required' })}
                    className="form-input"
                    placeholder="e.g., Toyota, Honda, BMW"
                  />
                  {errors.make && <p className="form-error">{errors.make.message}</p>}
                </div>

                <div>
                  <label className="form-label">Model *</label>
                  <input
                    type="text"
                    {...register('model', { required: 'Model is required' })}
                    className="form-input"
                    placeholder="e.g., Camry, CR-V, 3 Series"
                  />
                  {errors.model && <p className="form-error">{errors.model.message}</p>}
                </div>

                <div>
                  <label className="form-label">Year *</label>
                  <input
                    type="number"
                    {...register('year', { 
                      required: 'Year is required',
                      min: { value: 1900, message: 'Year must be after 1900' },
                      max: { value: new Date().getFullYear() + 1, message: 'Year cannot be in the future' }
                    })}
                    className="form-input"
                    min="1900"
                    max={new Date().getFullYear() + 1}
                  />
                  {errors.year && <p className="form-error">{errors.year.message}</p>}
                </div>

                <div>
                  <label className="form-label">Mileage *</label>
                  <input
                    type="number"
                    {...register('mileage', { 
                      required: 'Mileage is required',
                      min: { value: 0, message: 'Mileage cannot be negative' }
                    })}
                    className="form-input"
                    min="0"
                    placeholder="e.g., 15000"
                  />
                  {errors.mileage && <p className="form-error">{errors.mileage.message}</p>}
                </div>

                <div>
                  <label className="form-label">Price *</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      {...register('price', { 
                        required: 'Price is required',
                        min: { value: 0, message: 'Price cannot be negative' }
                      })}
                      className="form-input pl-8"
                      min="0"
                      step="0.01"
                      placeholder="e.g., 25000"
                    />
                  </div>
                  {errors.price && <p className="form-error">{errors.price.message}</p>}
                </div>

                <div>
                  <label className="form-label">Body Type *</label>
                  <select
                    {...register('bodyType', { required: 'Body type is required' })}
                    className="form-select"
                  >
                    <option value="">Select body type</option>
                    {bodyTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                  {errors.bodyType && <p className="form-error">{errors.bodyType.message}</p>}
                </div>
              </div>
            </div>
          </div>

          {/* Technical Specifications */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold text-gray-900">Technical Specifications</h3>
            </div>
            <div className="card-body">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="form-label">Transmission *</label>
                  <select
                    {...register('transmission', { required: 'Transmission is required' })}
                    className="form-select"
                  >
                    <option value="">Select transmission</option>
                    {transmissions.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                  {errors.transmission && <p className="form-error">{errors.transmission.message}</p>}
                </div>

                <div>
                  <label className="form-label">Condition *</label>
                  <select
                    {...register('condition', { required: 'Condition is required' })}
                    className="form-select"
                  >
                    <option value="">Select condition</option>
                    {conditions.map(condition => (
                      <option key={condition} value={condition}>{condition}</option>
                    ))}
                  </select>
                  {errors.condition && <p className="form-error">{errors.condition.message}</p>}
                </div>

                <div>
                  <label className="form-label">Fuel Type *</label>
                  <select
                    {...register('fuelType', { required: 'Fuel type is required' })}
                    className="form-select"
                  >
                    <option value="">Select fuel type</option>
                    {fuelTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                  {errors.fuelType && <p className="form-error">{errors.fuelType.message}</p>}
                </div>

                <div>
                  <label className="form-label">Engine Size *</label>
                  <input
                    type="text"
                    {...register('engineSize', { required: 'Engine size is required' })}
                    className="form-input"
                    placeholder="e.g., 2.0L, 3.5L V6, Electric Motor"
                  />
                  {errors.engineSize && <p className="form-error">{errors.engineSize.message}</p>}
                </div>

                <div>
                  <label className="form-label">Doors *</label>
                  <select
                    {...register('doors', { required: 'Number of doors is required' })}
                    className="form-select"
                  >
                    <option value="">Select doors</option>
                    {doorOptions.map(doors => (
                      <option key={doors} value={doors}>{doors} doors</option>
                    ))}
                  </select>
                  {errors.doors && <p className="form-error">{errors.doors.message}</p>}
                </div>

                <div>
                  <label className="form-label">Cylinders *</label>
                  <select
                    {...register('cylinders', { required: 'Number of cylinders is required' })}
                    className="form-select"
                  >
                    <option value="">Select cylinders</option>
                    {cylinderOptions.map(cylinders => (
                      <option key={cylinders} value={cylinders}>{cylinders} cylinders</option>
                    ))}
                  </select>
                  {errors.cylinders && <p className="form-error">{errors.cylinders.message}</p>}
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold text-gray-900">Description</h3>
            </div>
            <div className="card-body">
              <div>
                <label className="form-label">Description</label>
                <textarea
                  {...register('description')}
                  className="form-textarea"
                  rows={4}
                  placeholder="Describe the car's features, condition, and any special notes..."
                />
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold text-gray-900">Car Images</h3>
              <p className="text-sm text-gray-600">Upload up to 10 images (max 5MB each)</p>
            </div>
            <div className="card-body">
              <div className="space-y-4">
                {/* Upload Button */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    id="image-upload"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <label
                    htmlFor="image-upload"
                    className="cursor-pointer flex flex-col items-center space-y-2"
                  >
                    <Upload className="w-8 h-8 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      Click to upload images or drag and drop
                    </span>
                    <span className="text-xs text-gray-500">
                      PNG, JPG, GIF up to 5MB each
                    </span>
                  </label>
                </div>

                {/* Image Previews */}
                {previewImages.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {previewImages.map((preview, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Featured Car */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold text-gray-900">Featured Car</h3>
            </div>
            <div className="card-body">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="isFeatured"
                  {...register('isFeatured')}
                  className="form-checkbox"
                />
                <label htmlFor="isFeatured" className="text-sm text-gray-700">
                  Mark this car as featured (will appear on homepage)
                </label>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/admin/cars')}
              className="btn btn-outline"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {carId ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {carId ? 'Update Car' : 'Create Car'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CarForm
