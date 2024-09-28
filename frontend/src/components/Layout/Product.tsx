import { Card, Button, InputGroup, FormControl } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useState } from 'react'

interface ProductProps {
  product: {
    _id: string
    name: string
    price: number
    image: string
  }
}

const Product: React.FC<ProductProps> = ({ product }) => {
  const [quantity, setQuantity] = useState<number>(0)
  const [added, setAdded] = useState<boolean>(false)

  const increaseQuantity = () => setQuantity(quantity + 1)
  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1)
  }

  const handleAddClick = () => {
    setQuantity(1)
    setAdded(true)
  }

  return (
    <Card className='my-3 p-3 rounded'>
      <Link to={`/product/${product._id}`}>
        <Card.Img src={product.image} variant='top' />
      </Link>

      <Card.Body>
        <Link to={`/product/${product._id}`}>
          <Card.Title as='div' className='product-title'>
            <strong>{product.name}</strong>
          </Card.Title>
        </Link>

        <Card.Text as='h3'>${product.price}</Card.Text>

        <div className='d-flex'>
          {!added ? (
            <Button
              variant='primary'
              onClick={handleAddClick}
              style={{
                width: '48%',
                padding: '10px 0',
                marginRight: '4%',
              }}
            >
              Add
            </Button>
          ) : (
            <InputGroup style={{ width: '48%', marginRight: '4%' }}>
              <Button
                variant='outline-secondary'
                onClick={decreaseQuantity}
                style={{
                  padding: '8px 0',
                  minWidth: '30px',
                  textAlign: 'center',
                }}
              >
                -
              </Button>
              <FormControl
                value={quantity}
                className='text-center'
                readOnly
                style={{ maxWidth: '60px', padding: '8px 0' }}
              />
              <Button
                variant='outline-secondary'
                onClick={increaseQuantity}
                style={{
                  padding: '8px 0',
                  minWidth: '30px',
                  textAlign: 'center',
                }}
              >
                +
              </Button>
            </InputGroup>
          )}

          {/* Edit Button with Link for redirection */}
          <Button
            as={Link as any} // Use type casting to bypass the TypeScript error
            to={`/admin/product/${product._id}/edit`}
            variant='light'
            style={{ width: '48%', padding: '10px 0' }}
          >
            Edit
          </Button>
        </div>
      </Card.Body>
    </Card>
  )
}

export default Product
