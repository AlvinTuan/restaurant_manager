import GuestLoginForm from '@/pages/guest/guest-login-form'
import { Helmet } from 'react-helmet-async'

export default function TableOrder() {
  return (
    <>
      <Helmet>
        <title>Guest Login</title>
      </Helmet>
      <GuestLoginForm />
    </>
  )
}
