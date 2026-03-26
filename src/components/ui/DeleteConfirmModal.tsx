import { Trash2 } from 'lucide-react';
import { Modal, ModalFooter } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

interface Props {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    loading?: boolean;
    title?: string;
    description?: string;
}

export const DeleteConfirmModal = ({
    open,
    onClose,
    onConfirm,
    loading,
    title = 'Delete application',
    description = 'This will permanently delete the application and all its notes, contacts, and history. This cannot be undone.',
}: Props) => (
    <Modal open={open} onClose={onClose} title={title} size="sm">
        <p className="text-sm text-text-secondary">{description}</p>
        <ModalFooter>
            <Button variant="secondary" onClick={onClose}>Cancel</Button>
            <Button variant="danger" onClick={onConfirm} loading={loading} icon={<Trash2 />}>
                Delete
            </Button>
        </ModalFooter>
    </Modal>
);