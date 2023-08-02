import { Button, Popover, Tag } from 'antd'
import { MESSAGES } from '../constants/messages'

export const MoreInfo = ({ synopsis, year, otherBooks }) => {
  const renderOtherBooks = () => {
    if (otherBooks?.length > 0) {
      return (
        <>
          {otherBooks.map((book, index) => (
            <Tag
              key={index}
              color='geekblue'
              style={{ margin: '4px', fontSize: '0.9rem' }}
              bordered={false}
            >
              {book}
            </Tag>
          ))}
        </>
      )
    }
    return MESSAGES.AUTHOR_HAS_NO_MORE_BOOKS
  }

  const content = (
    <div>
      <p>
        <span style={{ fontWeight: '600' }}>Año: </span>
        {year}
      </p>
      <p>
        <span style={{ fontWeight: '600' }}>Sinopsis: </span>
        {synopsis}
      </p>
      <p>
        <span style={{ fontWeight: '600' }}>Otros libros del autor: </span>
        {renderOtherBooks()}
      </p>
    </div>
  )
  return (
    <Popover content={content} overlayStyle={{ maxWidth: '400px' }}>
      <Button>Más info...</Button>
    </Popover>
  )
}
