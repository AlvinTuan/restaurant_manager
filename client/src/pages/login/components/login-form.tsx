import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import { handleErrorApi } from '@/lib/utils'
import { PasswordInput } from '@/pages/login/components/password-input'
import { useAppDispatch, useAppSelector } from '@/redux/hook'
import { login } from '@/redux/slice/authSlice'
import { LoginBody, LoginBodyType } from '@/schemaValidations/auth.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'

export default function LoginForm() {
  const { toast } = useToast()
  const dispatch = useAppDispatch()
  const auth = useAppSelector((state) => state.auth)
  const form = useForm<LoginBodyType>({
    resolver: zodResolver(LoginBody),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  function onSubmit(values: LoginBodyType) {
    dispatch(login(values))
      .unwrap()
      .then((res) => {
        console.log(res)
        toast({
          description: res.message,
          duration: 3000
        })
      })
      .catch((err) => {
        handleErrorApi({ error: err, setError: form.setError })
      })
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
        <FormField
          control={form.control}
          name='email'
          render={({ field, formState: { errors } }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder='Username' {...field} />
              </FormControl>
              {errors.email && <FormMessage>{errors.email.message}</FormMessage>}
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='password'
          render={({ field, formState: { errors } }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput placeholder='password' {...field} />
              </FormControl>
              {errors.password && <FormMessage>{errors.password.message}</FormMessage>}
            </FormItem>
          )}
        />
        <Button className='w-full' type='submit' disabled={auth.status === 'loading'}>
          {auth.status === 'loading' && <Loader2 className='animate-spin' />}
          Đăng nhập
        </Button>
      </form>
    </Form>
  )
}
