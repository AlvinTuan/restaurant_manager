import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import { handleErrorApi } from '@/lib/utils'
import { useLoginMutation } from '@/pages/login/auth.service'
import { setRole } from '@/pages/login/auth.slice'
import { PasswordInput } from '@/pages/login/components/password-input'
import { useAppDispatch } from '@/redux/hook'
import { LoginBody, LoginBodyType } from '@/schemaValidations/auth.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router'

export default function LoginForm() {
  const { toast } = useToast()
  const [login, loginResult] = useLoginMutation()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const form = useForm<LoginBodyType>({
    resolver: zodResolver(LoginBody),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const onSubmit = async (values: LoginBodyType) => {
    try {
      const res = await login(values).unwrap()
      toast({
        description: res.message
      })
      dispatch(setRole(res.data.account.role))
      navigate('/manage/dashboard')
    } catch (error) {
      console.log(error)
      handleErrorApi({ error, setError: form.setError })
    }
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
        <Button className='w-full' type='submit' disabled={loginResult.isLoading}>
          {loginResult.isLoading && <Loader2 className='animate-spin' />}
          Đăng nhập
        </Button>
      </form>
    </Form>
  )
}
