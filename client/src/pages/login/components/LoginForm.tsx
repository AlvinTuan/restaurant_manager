import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import { login } from '@/pages/login/authSlice'
import { PasswordInput } from '@/pages/login/components/PasswordInput'
import { useAppDispatch } from '@/redux/hook'
import { LoginBody, LoginBodyType } from '@/schemaValidations/auth.schema'
import { handleErrorApi } from '@/utils/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

export default function LoginForm() {
  const { toast } = useToast()
  const dispatch = useAppDispatch()
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
        <Button type='submit'>Submit</Button>
      </form>
    </Form>
  )
}
