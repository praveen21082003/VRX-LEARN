import React from 'react'
import ConfirmationDialog from './ConfirmationDialog'

function NotificationPrompt({setShowPrompt}) {
    return (
        <ConfirmationDialog
            message="🔔 Enable Learning Reminders"
            msg="We’ll remind you every day at 10:00 AM"
            buttonName="Enable"
            closeButtonName="Skip"
            loadingMsg="Enabling reminders..."
            endpoint=""
            onSuccess={() => setShowPrompt(false)}
            onClose={() => setShowPrompt(false)}
        />
    )
}

export default NotificationPrompt
