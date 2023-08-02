import { Badge, Card, Drawer, Rate, Switch } from 'antd'
import { shallow } from 'zustand/shallow'
import { MESSAGES } from '../constants/messages'
import { ribbonColor } from '../services/ribbonColor'
import { useBooksStore } from '../stores/books'
import { useSearchBooks } from '../stores/searchBooks'
import { FadeInSection } from './FadeInSection'
import { CloseIcon } from './Icons/CloseIcon'

export const ReadingList = ({ open, onClose }) => {
  const { Meta } = Card
  const addAgainBookToSearchedBooks = useSearchBooks(
    (state) => state.addAgainBookToSearchedBooks
  )
  const [
    readingList,
    removeFromReadingList,
    modifyReadingListWithPriorities,
    sortReadingListByPriority
  ] = useBooksStore(
    (state) => [
      state.readingList,
      state.removeFromReadingList,
      state.modifyReadingListWithPriorities,
      state.sortReadingListByPriority
    ],
    shallow
  )

  const onChange = (checked) => {
    sortReadingListByPriority(checked)
  }

  return (
    <Drawer
      className='reading-container'
      title={
        <div className='drawer-title'>
          <span>📖</span>
          {MESSAGES.READING_LIST_TITLE}
        </div>
      }
      placement='right'
      onClose={onClose}
      open={open}
      size='large'
    >
      {readingList.length === 0 && (
        <div className='empty-reading-list'>
          <p>{MESSAGES.EMPTY_READING_LIST}</p>
        </div>
      )}
      {readingList.length > 1 && (
        <div className='empty-reading-list'>
          <span style={{ marginRight: '10px' }}>
            {MESSAGES.ORDER_BY_PRIORITY}
          </span>
          <Switch onChange={onChange} />
        </div>
      )}
      <div className='books-cards'>
        {readingList?.map((book) => {
          const { ISBN, genre, title, cover, priority } = book
          const { name } = book.author
          return (
            <FadeInSection key={ISBN}>
              <div className='reading-card-rate'>
                <Badge.Ribbon text={genre} color={ribbonColor(genre)}>
                  <Card
                    title={<CloseIcon />}
                    className='book-card'
                    hoverable
                    cover={
                      <img alt={`Imagel del libro ${title}`} src={cover} />
                    }
                    onClick={() => {
                      removeFromReadingList(ISBN)
                      addAgainBookToSearchedBooks(ISBN)
                    }}
                  >
                    <Meta title={title} description={name} />
                  </Card>
                </Badge.Ribbon>
                <div className='rate'>
                  <span>Prioridad</span>
                  <Rate
                    value={priority !== null ? priority : 0}
                    onChange={(value) =>
                      modifyReadingListWithPriorities(value, ISBN)
                    }
                  />
                </div>
              </div>
            </FadeInSection>
          )
        })}
      </div>
    </Drawer>
  )
}
