import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { Form, Button } from 'react-bootstrap'
import { RootState, AppDispatch } from '../app/store'
import {
  fetchProductDetails,
  updateProduct,
  uploadProductImage,
} from '../features/product/productSlice'

const ProductEditScreen = () => {
  const dispatch: AppDispatch = useDispatch()
  const navigate = useNavigate()
  const { id: productId } = useParams<{ id: string }>()

  // Local state for product fields
  const [name, setName] = useState<string>('')
  const [price, setPrice] = useState<number>(0)
  const [image, setImage] = useState<string>('')
  const [brand, setBrand] = useState<string>('')
  const [category, setCategory] = useState<string>('')
  const [stock, setStock] = useState<number>(0)
  const [description, setDescription] = useState<string>('')

  // Fetch product details from Redux state
  const { productDetails, loading, error } = useSelector(
    (state: RootState) => state.product
  )

  useEffect(() => {
    if (productId) {
      dispatch(fetchProductDetails(productId))
    }
  }, [dispatch, productId])

  useEffect(() => {
    if (productDetails) {
      setName(productDetails.name)
      setPrice(productDetails.price)
      setImage(productDetails.image)
      setBrand(productDetails.brand)
      setCategory(productDetails.category)
      setStock(productDetails.stock)
      setDescription(productDetails.description)
    }
  }, [productDetails])

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!productId) {
      console.error('Product ID is undefined')
      return
    }

    try {
      await dispatch(
        updateProduct({
          productId,
          productData: {
            name,
            price,
            image,
            brand,
            category,
            stock,
            description,
          },
        })
      ).unwrap()

      navigate('/')
    } catch (err: any) {
      console.error('Failed to update product:', err)
    }
  }

  const uploadFileHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const formData = new FormData()
      formData.append('image', file)

      try {
        const response = await dispatch(uploadProductImage(formData)).unwrap()
        setImage(response.image)
      } catch (err: any) {
        console.error('Image upload failed:', err)
      }
    }
  }

  return (
    <div>
      <h1>Edit Product</h1>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>{error}</div>
      ) : (
        <Form onSubmit={submitHandler}>
          <Form.Group controlId='name'>
            <Form.Label>Name</Form.Label>
            <Form.Control
              type='text'
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId='price'>
            <Form.Label>Price</Form.Label>
            <Form.Control
              type='number'
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
            />
          </Form.Group>

          <Form.Group controlId='image'>
            <Form.Label>Image</Form.Label>
            <Form.Control
              type='text'
              value={image}
              onChange={(e) => setImage(e.target.value)}
            />
            <Form.Control type='file' onChange={uploadFileHandler} />
          </Form.Group>

          <Form.Group controlId='brand'>
            <Form.Label>Brand</Form.Label>
            <Form.Control
              type='text'
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId='category'>
            <Form.Label>Category</Form.Label>
            <Form.Control
              type='text'
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId='stock'>
            <Form.Label>Count In Stock</Form.Label>
            <Form.Control
              type='number'
              value={stock}
              onChange={(e) => setStock(Number(e.target.value))}
            />
          </Form.Group>

          <Form.Group controlId='description'>
            <Form.Label>Description</Form.Label>
            <Form.Control
              type='text'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Form.Group>

          <Button type='submit' variant='primary'>
            Update
          </Button>
        </Form>
      )}
    </div>
  )
}

export default ProductEditScreen
