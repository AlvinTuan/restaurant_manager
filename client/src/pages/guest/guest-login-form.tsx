import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { handleErrorApi } from '@/lib/utils'
import { useLoginGuestMutation } from '@/pages/guest/guest.service'
import { setRole } from '@/pages/login/auth.slice'
import { useAppDispatch } from '@/redux/hook'
import { GuestLoginBody, GuestLoginBodyType } from '@/schemaValidations/guest.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams, useSearchParams } from 'react-router'

export default function GuestLoginForm() {
  const [loginGuestMutation] = useLoginGuestMutation()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const params = useParams()
  const tableNumber = Number(params.id)
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const form = useForm<GuestLoginBodyType>({
    resolver: zodResolver(GuestLoginBody),
    defaultValues: {
      name: '',
      token: token ?? '',
      tableNumber
    }
  })

  const onLoginGuest = async (values: GuestLoginBodyType) => {
    try {
      const res = await loginGuestMutation(values).unwrap()
      dispatch(setRole(res.data.guest.role))
      navigate('/guest/menu')
    } catch (error) {
      console.log(error)
      handleErrorApi({ error, setError: form.setError })
    }
  }

  return (
    <Card className='max-w-sm mx-auto h-[50%] mt-10'>
      <CardHeader>
        <CardTitle className='text-2xl'>Đăng nhập gọi món</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            className='space-y-2 max-w-[600px] flex-shrink-0 w-full'
            noValidate
            onSubmit={form.handleSubmit(onLoginGuest, console.log)}
          >
            <div className='grid gap-4'>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <div className='grid gap-2'>
                      <Label htmlFor='name'>Tên khách hàng</Label>
                      <Input id='name' type='text' required {...field} />
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              <Button type='submit' className='w-full'>
                Go!
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
