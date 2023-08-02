import { Empty } from 'antd'

export const EmptyMsg = ({ message }) => {
  return (
    <div className='empty'>
      <Empty
        description={<span className='empty-description'>{message}</span>}
      ></Empty>
    </div>
  )
}
