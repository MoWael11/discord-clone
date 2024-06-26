'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'
import { FileUpload } from '@/components/file-upload'
import axios from 'axios'
import { useRouter } from 'next/navigation'

export const InitialModal = () => {
  const [isMounted, setIsMounted] = useState<boolean>(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const { refresh } = useRouter()

  const formSchema = z.object({
    name: z.string().min(1, {
      message: 'Server name is required.',
    }),
    imageUrl: z.string().min(1, {
      message: 'Server image is required.',
    }),
  })

  type formType = z.infer<typeof formSchema>

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      imageUrl: '',
    },
  })

  const {
    handleSubmit,
    control,
    reset,
    formState: { isLoading, errors },
  } = form

  const onSubmit = async (values: formType) => {
    try {
      await axios.post('/api/servers', values)

      reset()
      refresh()

      window.location.reload()
    } catch (err) {
      console.log(err)
    }
  }

  if (!isMounted) return null

  return (
    <Dialog open>
      <DialogContent isAlwaysOpen className='bg-white text-black p-0 overflow-hidden'>
        <DialogHeader className='pt-8 px-6'>
          <DialogTitle className='text-2xl text-center font-bold'>Customize your server</DialogTitle>
          <DialogDescription className='text-center text-zinc-500'>
            Give your server a personality with a name and an image. You can always change it later.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
            <div className='space-y-8 px-6'>
              <div className='flex items-center justify-center text-center'>
                <FormField
                  control={control}
                  name='imageUrl'
                  render={({ field }) => (
                    <FormItem className='space-y-0 w-full'>
                      <FormControl>
                        <FileUpload endpoint='serverImage' value={field.value} onChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                ></FormField>
              </div>

              <FormField
                control={control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70'>
                      Server name
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className='bg-zinc-300/50 b-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0'
                        placeholder='Enter server name'
                        {...field}
                      />
                    </FormControl>
                    <FormDescription />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className='bg-gray-100 px-6 py-4'>
              <Button variant={'primary'} disabled={isLoading}>
                Create
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
