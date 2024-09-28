import { Pagination } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'

interface PaginateProps {
  pages: number
  page: number
  keyword?: string
}

const Paginate: React.FC<PaginateProps> = ({ pages, page, keyword = '' }) => {
  return (
    <>
      {pages > 1 && (
        <Pagination className='justify-content-center'>
          {[...Array(pages).keys()].map((x) => (
            // link for pages
            <LinkContainer
              key={x + 1}
              to={keyword ? `/search/${keyword}/page/${x + 1}` : `/page/${x + 1}`}
            >
              {/* current page */}
              <Pagination.Item active={x + 1 === page}>{x + 1}</Pagination.Item>
            </LinkContainer>
          ))}
        </Pagination>
      )}
    </>
  )
}

export default Paginate
