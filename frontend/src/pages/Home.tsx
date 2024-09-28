import Product from '../components/Layout/Product'

import React, { useEffect, useState } from 'react'
import { Row, Col, Button, Dropdown, DropdownButton } from 'react-bootstrap'

import { useDispatch, useSelector } from 'react-redux'
import { createProduct, fetchProducts } from '../features/product/productSlice'
import { RootState, AppDispatch } from '../app/store'

import Paginate from '../components/Layout/Paginate'
import { useParams, useNavigate } from 'react-router-dom'

const HomeScreen: React.FC = () => {
  const { pageNumber = '1', keyword = '' } = useParams<{
    pageNumber: string
    keyword: string
  }>()
  const dispatch: AppDispatch = useDispatch()

  const { products, page, pages, loading, error } = useSelector(
    (state: RootState) => state.product
  )

  useEffect(() => {
    dispatch(fetchProducts({ keyword, pageNumber }))
  }, [dispatch, keyword, pageNumber])

  const [sortOrder, setSortOrder] = useState<
    'default' | 'lowToHigh' | 'highToLow' | 'lastAdded'
  >('default')

  const createProductHandler = async () => {
    if (window.confirm('Are you sure you want to create a new product?')) {
      try {
        await dispatch(createProduct())
        dispatch(fetchProducts({ keyword: '', pageNumber: '' }))
      } catch (err: any) {
        console.error(err)
      }
    }
  }

  const handleSort = (
    order: 'default' | 'lowToHigh' | 'highToLow' | 'lastAdded'
  ) => {
    setSortOrder(order)
  }

  const sortedProducts = products
    ? [...products].sort((a, b) => {
        if (sortOrder === 'lowToHigh') {
          return a.price - b.price
        } else if (sortOrder === 'highToLow') {
          return b.price - a.price
        } else if (sortOrder === 'lastAdded') {
        }
        return 0
      })
    : []

  return (
    <>
      <Row className='align-items-center mb-4'>
        <Col>
          <h1>Products</h1>
        </Col>

        <Col className='d-flex justify-content-end'>
          <DropdownButton
            id='dropdown-basic-button'
            title={
              sortOrder === 'default'
                ? 'Default'
                : sortOrder === 'lastAdded'
                ? 'Last added'
                : `Price: ${
                    sortOrder === 'lowToHigh' ? 'low to high' : 'high to low'
                  }`
            }
            variant='outline-secondary'
            className='me-2'
          >
            <Dropdown.Item onClick={() => handleSort('default')}>
              Default
            </Dropdown.Item>
            <Dropdown.Item onClick={() => handleSort('lowToHigh')}>
              Price: low to high
            </Dropdown.Item>
            <Dropdown.Item onClick={() => handleSort('highToLow')}>
              Price: high to low
            </Dropdown.Item>
            <Dropdown.Item onClick={() => handleSort('lastAdded')}>
              Last added
            </Dropdown.Item>
          </DropdownButton>

          <Button variant='primary' onClick={createProductHandler}>
            Add Product
          </Button>
        </Col>
      </Row>

      <Row>
        {sortedProducts.map((product) => (
          <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
            <Product product={product} />
          </Col>
        ))}
      </Row>

      <br />
      <Paginate pages={pages} page={page} keyword={keyword ? keyword : ''} />
    </>
  )
}

export default HomeScreen
