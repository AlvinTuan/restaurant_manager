import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { handleErrorApi } from '@/lib/utils'
import { useGetMeQuery, useUpdateMeMutation } from '@/pages/manage/accounts/account.service'
import { UpdateMeBody, UpdateMeBodyType } from '@/schemaValidations/account.schema'
import { useUploadImageMutation } from '@/services/media.service'
import { zodResolver } from '@hookform/resolvers/zod'
import { Upload } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'

export default function UpdateProfileForm() {
  const avatarInputRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const { toast } = useToast()
  const { data: meRes } = useGetMeQuery()
  const [uploadImageMutation] = useUploadImageMutation()
  const [updateMeMutation] = useUpdateMeMutation()
  const account = meRes?.data
  const form = useForm<UpdateMeBodyType>({
    resolver: zodResolver(UpdateMeBody),
    defaultValues: {
      name: '',
      avatar: undefined
    }
  })
  const avatar = form.watch('avatar')
  const name = form.watch('name')
  const previewAvatar = () => {
    if (file) {
      // console.log('file', file)
      // console.log('preview', URL.createObjectURL(file))
      return URL.createObjectURL(file)
    }
    return avatar
  }

  useEffect(() => {
    if (account) {
      form.reset({ name: account.name, avatar: account.avatar ?? undefined })
    }
  }, [account, form])

  const reset = () => {
    form.reset()
    setFile(null)
  }

  const onSubmit = async (values: UpdateMeBodyType) => {
    try {
      let body = values
      // upload image
      if (file) {
        const formData = new FormData()
        formData.append('file', file)
        const uploadImageRes = await uploadImageMutation(formData).unwrap()
        const imageUrl = uploadImageRes.data
        body = {
          ...values,
          avatar: imageUrl
        }
      }
      updateMeMutation(body)
        .unwrap()
        .then((res) => {
          toast({
            description: res.message
          })
        })
    } catch (error) {
      handleErrorApi({
        error,
        setError: form.setError
      })
    }
  }

  return (
    <Form {...form}>
      <form
        noValidate
        className='grid items-start gap-4 auto-rows-max md:gap-8'
        onReset={reset}
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <Card x-chunk='dashboard-07-chunk-0'>
          <CardHeader>
            <CardTitle>Thông tin cá nhân</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid gap-6'>
              <FormField
                control={form.control}
                name='avatar'
                render={({ field }) => (
                  <FormItem>
                    <div className='flex items-start justify-start gap-2'>
                      <Avatar className='aspect-square w-[100px] h-[100px] rounded-md object-cover'>
                        <AvatarImage src={previewAvatar()} />
                        <AvatarFallback className='rounded-none'>{name}</AvatarFallback>
                      </Avatar>
                      <input
                        type='file'
                        accept='image/*'
                        className='hidden'
                        // {...field}
                        ref={avatarInputRef}
                        onChange={(event) => {
                          const file = event.target.files?.[0]
                          // console.log(file)
                          if (file) {
                            setFile(file)
                            field.onChange('http://localhost:3000/' + field.name) // to pass zod
                          }
                        }}
                      />
                      <button
                        className='flex aspect-square w-[100px] items-center justify-center rounded-md border border-dashed'
                        type='button'
                        onClick={() => {
                          avatarInputRef.current?.click()
                        }}
                      >
                        <Upload className='w-4 h-4 text-muted-foreground' />
                        <span className='sr-only'>Upload</span>
                      </button>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <div className='grid gap-3'>
                      <Label htmlFor='name'>Tên</Label>
                      <Input id='name' type='text' className='w-full' {...field} />
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              <div className='flex items-center gap-2 md:ml-auto'>
                <Button variant='outline' size='sm' type='reset'>
                  Hủy
                </Button>
                <Button size='sm' type='submit'>
                  Lưu thông tin
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  )
}
