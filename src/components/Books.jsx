import { Badge, Card, message } from 'antd'
import { useEffect } from 'react'
import { shallow } from 'zustand/shallow'
import { MESSAGES } from '../constants/messages'
import { ribbonColor } from '../services/ribbonColor'
import { useBooksStore } from '../stores/books'
import { useSearchBooks } from '../stores/searchBooks'
import { EmptyMsg } from './EmptyMsg'
import { FadeInSection } from './FadeInSection'
import { GenreSelect } from './GenreSelect'
import { AddIcon } from './Icons/AddIcon'
import { MoreInfo } from './MoreInfo'
import { PageFilter } from './PageFilter'
import { SearchInput } from './SearchInput'
import { Stats } from './Stats'

export const Books = () => {
  const [messageApi, contextHolder] = message.useMessage()
  const { Meta } = Card
  const search = useSearchBooks((state) => state.search)
  const searchedBooks = useSearchBooks((state) => state.searchedBooks)
  const removeBookFromSearchedBooks = useSearchBooks(
    (state) => state.removeBookFromSearchedBooks
  )
  const [
    setBooks,
    setReadingList,
    copyBooks,
    selectedCategory,
    minPage,
    sliderValue,
    booksFilter,
    readingList
  ] = useBooksStore(
    (state) => [
      state.setBooks,
      state.setReadingList,
      state.copyBooks,
      state.selectedCategory,
      state.minPage,
      state.sliderValue,
      state.booksFilter,
      state.readingList
    ],
    shallow
  )

  const dataFromLocalStorage = JSON.parse(
    localStorage.getItem('reading-list-midudev-test')
  )

  useEffect(() => {
    booksFilter(selectedCategory, sliderValue)
  }, [selectedCategory, sliderValue, readingList])

  useEffect(() => {
    const getBooks = async () => {
      await setBooks()
    }
    if (dataFromLocalStorage.state.books.length === 0) {
      getBooks()
    }
  }, [])

  return (
    <>
      {contextHolder}
      <div className='books-container'>
        <div className='books-heading'>
          <GenreSelect />
          <PageFilter />
          <SearchInput />
        </div>
        <Stats />
        <div className='books-cards'>
          {(search === '' ? copyBooks : searchedBooks)?.map((book) => {
            const { ISBN, genre, title, cover, synopsis, year } = book
            const { otherBooks, name } = book.author
            return (
              <FadeInSection key={ISBN}>
                <Badge.Ribbon text={genre} color={ribbonColor(genre)}>
                  <Card
                    className='book-card'
                    title={<AddIcon />}
                    hoverable
                    cover={
                      <img alt={`Imagel del libro ${title}`} src={cover} />
                    }
                    actions={[
                      <MoreInfo
                        synopsis={synopsis}
                        year={year}
                        key={ISBN}
                        otherBooks={otherBooks}
                      />
                    ]}
                    onClick={() => {
                      setReadingList(ISBN)
                      removeBookFromSearchedBooks(ISBN)
                      messageApi.open({
                        type: 'success',
                        content: `${title} fue agregado a la lista de lectura`
                      })
                    }}
                  >
                    <Meta title={title} description={name} />
                  </Card>
                </Badge.Ribbon>
              </FadeInSection>
            )
          })}
        </div>
        {searchedBooks.length === 0 &&
          copyBooks?.length !== 0 &&
          search !== '' && <EmptyMsg message={MESSAGES.SEARCH_NO_RESULTS} />}
        {sliderValue <= minPage ||
          (copyBooks?.length === 0 && <EmptyMsg message={MESSAGES.NO_BOOKS} />)}
        {sliderValue <= minPage && <EmptyMsg message={MESSAGES.NO_BOOKS} />}
      </div>
    </>
  )
}
