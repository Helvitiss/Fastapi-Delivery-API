import Modal from './Modal'
import Button from './Button'

export default function ConfirmDialog({ open, onClose, onConfirm, title }: { open: boolean; onClose: () => void; onConfirm: () => void; title: string }) {
  return <Modal open={open} onClose={onClose}><h3 className='font-semibold mb-4'>{title}</h3><div className='flex gap-2 justify-end'><Button variant='ghost' onClick={onClose}>Cancel</Button><Button variant='danger' onClick={onConfirm}>Confirm</Button></div></Modal>
}
