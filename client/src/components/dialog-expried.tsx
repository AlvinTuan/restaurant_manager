import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'

interface DialogExpriedProps {
  isDialogVisible: boolean
  onClose: () => void
}

export default function DialogExpried({ isDialogVisible, onClose }: DialogExpriedProps) {
  return (
    <Dialog open={isDialogVisible} onOpenChange={(open) => !open && onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Phiên đăng nhập hết hạn</DialogTitle>
          <DialogDescription>Phiên đăng nhập của bạn đã hết hạn. Vui lòng đăng nhập lại.</DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
