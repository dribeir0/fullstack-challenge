import {
    Button,
    AlertDialog,
    AlertDialogOverlay,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogCloseButton,
    AlertDialogBody,
    AlertDialogFooter,
} from '@chakra-ui/react'
import React from 'react'
import { translate } from '../utils/language.utils'

interface Props {
    isOpen: boolean
    onClose: () => void
    onAction: () => void
    isDeleted: boolean
}

export default function ActionProjectConfirmation({
    isOpen,
    onClose,
    onAction,
    isDeleted,
}: Props) {
    const cancelRef = React.useRef(null)

    return (
        <>
            <AlertDialog
                motionPreset="slideInBottom"
                leastDestructiveRef={cancelRef}
                onClose={onClose}
                isOpen={isOpen}
                isCentered
            >
                <AlertDialogOverlay />

                <AlertDialogContent>
                    <AlertDialogHeader>
                        {isDeleted
                            ? translate('RESTORE_PROJECT')
                            : translate('DELETE_PROJECT')}
                    </AlertDialogHeader>
                    <AlertDialogCloseButton />
                    <AlertDialogBody>
                        {isDeleted
                            ? translate('RESTORE_PROJECT_DESCRIPTION')
                            : translate('DELETE_PROJECT_DESCRIPTION')}
                    </AlertDialogBody>
                    <AlertDialogFooter>
                        <Button ref={cancelRef} onClick={onClose}>
                            {translate('NO')}
                        </Button>
                        <Button colorScheme="red" ml={3} onClick={onAction}>
                            {translate('YES')}
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}
