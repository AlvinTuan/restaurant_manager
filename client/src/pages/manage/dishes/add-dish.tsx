import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { DishStatus, DishStatusValues } from '@/constants/type'
import { useToast } from '@/hooks/use-toast'
import { getVietnameseDishStatus, handleErrorApi } from '@/lib/utils'
import { CreateDishBody, CreateDishBodyType } from '@/schemaValidations/dish.schema'
import { useAddDishMutation } from '@/services/dishes.service'
import { useUploadImageMutation } from '@/services/media.service'
import { zodResolver } from '@hookform/resolvers/zod'
import { PlusCircle, Upload } from 'lucide-react'
import { useMemo, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'

export default function AddDish() {
  const [file, setFile] = useState<File | null>(null)
  const [open, setOpen] = useState(false) // open dialog
  const imageInputRef = useRef<HTMLInputElement | null>(null)
  const [uploadImageMutation] = useUploadImageMutation()
  const [addDishMutation] = useAddDishMutation()
  const { toast } = useToast()
  const form = useForm<CreateDishBodyType>({
    resolver: zodResolver(CreateDishBody),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      image: '',
      status: DishStatus.Unavailable
    }
  })
  const image = form.watch('image')
  const name = form.watch('name')
  const previewAvatarFromFile = useMemo(() => {
    if (file) {
      return URL.createObjectURL(file)
    }
    return image
  }, [file, image])

  const reset = () => {
    form.reset()
    setFile(null)
  }

  const onSubmit = async (values: CreateDishBodyType) => {
    try {
      let body = values
      if (file) {
        const formData = new FormData()
        formData.append('file', file)
        const uploadImageRes = await uploadImageMutation(formData).unwrap()
        const image = uploadImageRes.data
        body = {
          ...values,
          image
        }
      }
      addDishMutation(body)
        .unwrap()
        .then((res) => toast({ description: res.message }))
      reset()
      setOpen(false)
    } catch (error) {
      handleErrorApi({ error, setError: form.setError })
    }
  }

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button size='sm' className='gap-1 h-7'>
          <PlusCircle className='h-3.5 w-3.5' />
          <span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>Thêm món ăn</span>
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[600px] max-h-screen overflow-auto'>
        <DialogHeader>
          <DialogTitle>Thêm món ăn</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            noValidate
            className='grid items-start gap-4 auto-rows-max md:gap-8'
            id='add-dish-form'
            onSubmit={form.handleSubmit(onSubmit, (e) => console.log(e))}
          >
            <div className='grid gap-4 py-4'>
              <FormField
                control={form.control}
                name='image'
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
                        ref={imageInputRef}
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
                        onClick={() => imageInputRef.current?.click()}
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
                      <Label htmlFor='name'>Tên món ăn</Label>
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
                name='price'
                render={({ field }) => (
                  <FormItem>
                    <div className='grid items-center grid-cols-4 gap-4 justify-items-start'>
                      <Label htmlFor='price'>Giá</Label>
                      <div className='w-full col-span-3 space-y-2'>
                        <Input id='price' className='w-full' {...field} type='number' />
                        <FormMessage />
                      </div>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='description'
                render={({ field }) => (
                  <FormItem>
                    <div className='grid items-center grid-cols-4 gap-4 justify-items-start'>
                      <Label htmlFor='description'>Mô tả sản phẩm</Label>
                      <div className='w-full col-span-3 space-y-2'>
                        <Textarea id='description' className='w-full' {...field} />
                        <FormMessage />
                      </div>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='status'
                render={({ field }) => (
                  <FormItem>
                    <div className='grid items-center grid-cols-4 gap-4 justify-items-start'>
                      <Label htmlFor='description'>Trạng thái</Label>
                      <div className='w-full col-span-3 space-y-2'>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder='Chọn trạng thái' />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {DishStatusValues.map((status) => (
                              <SelectItem key={status} value={status}>
                                {getVietnameseDishStatus(status)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
        <DialogFooter>
          <Button type='submit' form='add-dish-form'>
            Thêm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
