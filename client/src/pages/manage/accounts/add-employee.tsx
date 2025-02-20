import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { useAppDispatch } from '@/redux/hook'
import { addEmployee, uploadImage } from '@/redux/slice/accountSlice'
import { CreateEmployeeAccountBody, CreateEmployeeAccountBodyType } from '@/schemaValidations/account.schema'
import { handleErrorApi } from '@/utils/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { PlusCircle, Upload } from 'lucide-react'
import { useMemo, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'

export default function AddEmployee() {
  const [file, setFile] = useState<File | null>(null)
  const [open, setOpen] = useState(false)
  const avatarInputRef = useRef<HTMLInputElement | null>(null)
  const dispatch = useAppDispatch()
  const { toast } = useToast()
  const form = useForm<CreateEmployeeAccountBodyType>({
    resolver: zodResolver(CreateEmployeeAccountBody),
    defaultValues: {
      name: '',
      email: '',
      avatar: undefined,
      password: '',
      confirmPassword: ''
    }
  })
  const avatar = form.watch('avatar')
  const name = form.watch('name')
  const previewAvatarFromFile = useMemo(() => {
    if (file) {
      return URL.createObjectURL(file)
    }
    return avatar
  }, [file, avatar])

  const reset = () => {
    form.reset()
    setFile(null)
  }

  const onSubmit = async (values: CreateEmployeeAccountBodyType) => {
    try {
      let body = values
      // handle avatar
      if (file) {
        const formData = new FormData()
        formData.append('file', file)
        const uploadImageRes = await dispatch(uploadImage(formData)).unwrap()
        const imageUrl = uploadImageRes.data
        body = {
          ...values,
          avatar: imageUrl
        }
      }
      dispatch(addEmployee(body))
        .unwrap()
        .then((res) => {
          toast({ description: res.message })
        })
      reset()
      setOpen(false)
      console.log(body)
    } catch (error) {
      handleErrorApi({ error, setError: form.setError })
    }
  }

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button size='sm' className='gap-1 h-7'>
          <PlusCircle className='h-3.5 w-3.5' />
          <span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>Tạo tài khoản</span>
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[600px] max-h-screen overflow-auto'>
        <DialogHeader>
          <DialogTitle>Tạo tài khoản</DialogTitle>
          <DialogDescription>Các trường tên, email, mật khẩu là bắt buộc</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            noValidate
            className='grid items-start gap-4 auto-rows-max md:gap-8'
            id='add-employee-form'
            onSubmit={form.handleSubmit(onSubmit, (e) => console.log(e))}
            onReset={reset}
          >
            <div className='grid gap-4 py-4'>
              <FormField
                control={form.control}
                name='avatar'
                render={({ field }) => (
                  <FormItem>
                    <div className='flex items-start justify-start gap-2'>
                      <Avatar className='aspect-square w-[100px] h-[100px] rounded-md object-cover'>
                        <AvatarImage src={previewAvatarFromFile} />
                        <AvatarFallback className='rounded-none'>{name || 'Avatar'}</AvatarFallback>
                      </Avatar>
                      <input
                        type='file'
                        accept='image/*'
                        ref={avatarInputRef}
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            setFile(file)
                            field.onChange('http://localhost:3000/' + file.name)
                          }
                        }}
                        className='hidden'
                      />
                      <button
                        className='flex aspect-square w-[100px] items-center justify-center rounded-md border border-dashed'
                        type='button'
                        onClick={() => avatarInputRef.current?.click()}
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
                    <div className='grid items-center grid-cols-4 gap-4 justify-items-start'>
                      <Label htmlFor='name'>Tên</Label>
                      <div className='w-full col-span-3 space-y-2'>
                        <Input id='name' className='w-full' {...field} />
                        <FormMessage />
                      </div>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <div className='grid items-center grid-cols-4 gap-4 justify-items-start'>
                      <Label htmlFor='email'>Email</Label>
                      <div className='w-full col-span-3 space-y-2'>
                        <Input id='email' className='w-full' {...field} />
                        <FormMessage />
                      </div>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem>
                    <div className='grid items-center grid-cols-4 gap-4 justify-items-start'>
                      <Label htmlFor='password'>Mật khẩu</Label>
                      <div className='w-full col-span-3 space-y-2'>
                        <Input id='password' className='w-full' type='password' {...field} />
                        <FormMessage />
                      </div>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='confirmPassword'
                render={({ field }) => (
                  <FormItem>
                    <div className='grid items-center grid-cols-4 gap-4 justify-items-start'>
                      <Label htmlFor='confirmPassword'>Xác nhận mật khẩu</Label>
                      <div className='w-full col-span-3 space-y-2'>
                        <Input id='confirmPassword' className='w-full' type='password' {...field} />
                        <FormMessage />
                      </div>
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
        <DialogFooter>
          <Button type='submit' form='add-employee-form'>
            Thêm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
