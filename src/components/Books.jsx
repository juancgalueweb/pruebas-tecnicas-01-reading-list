import { Badge, Card, message } from 'antd'
import { useEffect } from 'react'
import { shallow } from 'zustand/shallow'
import { ribbonColor } from '../services/ribbonColor'
import { useBooksStore } from '../stores/books'
import { useSearchBooks } from '../stores/searchBooks'
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
        {selectedCategory !== 'Todos' && copyBooks?.length === 0 && (
          <div className='empty-reading-list'>
            <p>{`No hay más libros de ${selectedCategory.toLowerCase()} disponibles`}</p>
          </div>
        )}
        {sliderValue <= minPage && (
          <div className='empty-reading-list'>
            <p>No existen libros para ese filtro de número de páginas </p>
          </div>
        )}
        <div className='books-cards'>
          {(search === '' ? copyBooks : searchedBooks)?.map((book) => {
            const { ISBN, genre, title, cover, synopsis, year } = book
            const { otherBooks, name } = book.author
            return (
              <Badge.Ribbon key={ISBN} text={genre} color={ribbonColor(genre)}>
                <Card
                  className='book-card'
                  title={<AddIcon />}
                  hoverable
                  cover={<img alt={`Imagel del libro ${title}`} src={cover} />}
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
            )
          })}
        </div>
      </div>
    </>
  )
}
