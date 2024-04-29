import { ChatHeader } from '@/components/chat/chat-header'
import { ChatInput } from '@/components/chat/chat-input'
import { ChatMessages } from '@/components/chat/chat-messages'
import { MediaRoom } from '@/components/media-room'
import { currentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db'
import { signIn } from 'auth'
import { redirect } from 'next/navigation'

interface ChannelIdPageProps {
  params: {
    serverId: string
    channelId: string
  }
}

const ChannelIdPage = async ({ params: { channelId, serverId } }: ChannelIdPageProps) => {
  const profile = await currentProfile()

  if (!profile) {
    await signIn()
    return
  }

  const channel = await db.channel.findUnique({
    where: {
      id: channelId,
    },
  })

  const member = await db.member.findFirst({
    where: {
      serverId,
      profileId: profile.id,
    },
  })

  if (!channel || !member) return redirect('/')

  return (
    <div className='bg-white dark:bg-[#313338] flex flex-col h-full'>
      <ChatHeader name={channel.name} serverId={serverId} type='channel' />
      {channel.type === 'TEXT' && (
        <>
          <ChatMessages
            member={member}
            name={channel.name}
            chatId={channel.id}
            type='channel'
            apiUrl='/api/messages'
            socketUrl='/api/socket/messages'
            socketQuery={{
              channelId: channel.id,
              serverId: channel.serverId,
            }}
            paramKey='channelId'
            paramValue={channel.id}
          />
          <ChatInput
            name={channel.name}
            type='channel'
            apiUrl='/api/socket/messages'
            query={{ channelId: channel.id, serverId: channel.serverId }}
          />
        </>
      )}
      {channel.type === 'AUDIO' && <MediaRoom audio video={false} chatId={channelId} />}
      {channel.type === 'VIDEO' && <MediaRoom audio={false} video chatId={channelId} />}
    </div>
  )
}

export default ChannelIdPage
