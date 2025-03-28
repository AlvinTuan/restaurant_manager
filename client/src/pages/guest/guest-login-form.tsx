import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useAppContext } from '@/context/app-provider'
import { generateSocketInstance, handleErrorApi } from '@/lib/utils'
import { GuestLoginBody, GuestLoginBodyType } from '@/schemaValidations/guest.schema'
import { useLoginGuestMutation } from '@/services/guest.service'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams, useSearchParams } from 'react-router'

export default function GuestLoginForm() {
  const [loginGuestMutation] = useLoginGuestMutation()
  const navigate = useNavigate()
  const { setRole, setSocket } = useAppContext()
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
      setRole(res.data.guest.role)
      setSocket(generateSocketInstance(res.data.accessToken))
      navigate('/guest/menu')
    } catch (error) {
      handleErrorApi({ error, setError: form.setError })
    }
  }

  return (
    <Card className='max-w-sm mx-auto h-[50%] mt-10'>
      <CardHeader>
        <CardTitle className='text-2xl'>Bạn hãy nhập tên của bạn để tiến hành gọi món nhé !</CardTitle>
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
                      {/* <Label htmlFor='name'></Label> */}
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
