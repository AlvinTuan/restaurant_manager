import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { useToast } from '@/hooks/use-toast'
import { handleErrorApi } from '@/lib/utils'
import { ChangePasswordBody, ChangePasswordBodyType } from '@/schemaValidations/account.schema'
import { useChangePasswordMutation } from '@/services/account.service'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

export default function ChangePasswordForm() {
  const { toast } = useToast()
  const [changePasswordMutation] = useChangePasswordMutation()
  const form = useForm<ChangePasswordBodyType>({
    resolver: zodResolver(ChangePasswordBody),
    defaultValues: {
      oldPassword: '',
      password: '',
      confirmPassword: ''
    }
  })
  const reset = () => {
    form.reset()
  }

  const onSubmit = async (values: ChangePasswordBodyType) => {
    try {
      changePasswordMutation(values)
        .unwrap()
        .then((res) =>
          toast({
            description: res.message
          })
        )
      reset()
    } catch (error) {
      handleErrorApi({ error, setError: form.setError })
    }
  }

  return (
    <Form {...form}>
      <form
        noValidate
        className='grid items-start gap-4 auto-rows-max md:gap-8'
        onSubmit={form.handleSubmit(onSubmit)}
        onReset={reset}
      >
        <Card className='overflow-hidden' x-chunk='dashboard-07-chunk-4'>
          <CardHeader>
            <CardTitle>Đổi mật khẩu</CardTitle>
            {/* <CardDescription>Lipsum dolor sit amet, consectetur adipiscing elit</CardDescription> */}
          </CardHeader>
          <CardContent>
            <div className='grid gap-6'>
              <FormField
                control={form.control}
                name='oldPassword'
                render={({ field }) => (
                  <FormItem>
                    <div className='grid gap-3'>
                      <Label htmlFor='oldPassword'>Mật khẩu cũ</Label>
                      <Input id='oldPassword' type='password' className='w-full' {...field} />
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem>
                    <div className='grid gap-3'>
                      <Label htmlFor='password'>Mật khẩu mới</Label>
                      <Input id='password' type='password' className='w-full' {...field} />
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='confirmPassword'
                render={({ field }) => (
                  <FormItem>
                    <div className='grid gap-3'>
                      <Label htmlFor='confirmPassword'>Nhập lại mật khẩu mới</Label>
                      <Input id='confirmPassword' type='password' className='w-full' {...field} />
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <div className='flex items-center gap-2 md:ml-auto'>
                <Button variant='outline' size='sm'>
                  Hủy
                </Button>
                <Button size='sm'>Lưu thông tin</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  )
}
