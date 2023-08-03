import { HeartIcon } from './Icons/HeartIcon'

export const FooterApp = () => {
  return (
    <div>
      Hecho con <HeartIcon />
      por{' '}
      <a
        className='underline-magical'
        href='https://github.com/juancgalueweb/pruebas-tecnicas-01-reading-list'
        target='_blank'
        rel='noreferrer'
      >
        @juancgalue
      </a>
    </div>
  )
}
