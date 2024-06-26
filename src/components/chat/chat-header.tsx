import { Hash } from 'lucide-react'
import { MobileToggle } from '../mobile-toggle'
import { UserAvatar } from '../user-avatar'
import { SocketIndicator } from '../socket-indicator'
import { ChatVideoButton } from './chat-video-button'

interface ChatHeaderProps {
  serverId: string
  name: string
  type: 'channel' | 'conversation'
  imageUrl?: string
}

export const ChatHeader = ({ name, serverId, type, imageUrl }: ChatHeaderProps) => {
  return (
    <div className='text-md font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2'>
      <MobileToggle serverId={serverId} />
      {type === 'channel' && <Hash className='w-5 h-5 text-zinc-500 dark:text-zinc-400 mr-2' />}
      {type === 'conversation' && <UserAvatar className='h-8 w-8 mr-2' src={imageUrl} />}
      <p className='font-semibold text-md text-black dark:text-white'>{name}</p>
      <div className='ml-auto flex'>
        {type === 'conversation' && <ChatVideoButton />}
        <SocketIndicator />
      </div>
    </div>
  )
}
